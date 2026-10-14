#!/usr/bin/env python3
"""Public asking-price snapshot and indicative valuation. Python 3.10+.
All application data lives in SQLite :memory:. No exports, caches or browser profiles.
Install dependencies and Chromium separately; see README.md.
"""
from __future__ import annotations
import argparse
import csv
import io
import json
import logging
import math
import random
import re
import sqlite3
import time
from datetime import datetime, timezone
from urllib.parse import urljoin, urlsplit, urlunsplit, urlencode, unquote

import numpy as np
import pandas as pd
import requests
from bs4 import BeautifulSoup
from lxml import etree
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

LOG = logging.getLogger('valuation')
BOT = 'SiggenthalValuation'
USER_AGENTS = [
    f'{BOT}/1.0 (+local research; requests)',
    f'{BOT}/1.0 (+local research; browser)',
]
TARGETS = {'Obersiggenthal': '5415', 'Untersiggenthal': '5417'}
# Postal locality names are explicitly mapped, not treated as municipality names.
LOCALITIES = {'obersiggenthal': 'Obersiggenthal', 'nussbaumen': 'Obersiggenthal',
              'kirchdorf': 'Obersiggenthal', 'rieden': 'Obersiggenthal',
              'untersiggenthal': 'Untersiggenthal'}
CONN = sqlite3.connect(':memory:')
CONN.row_factory = sqlite3.Row
CONN.executescript("""
CREATE TABLE listings (
 id INTEGER PRIMARY KEY, source TEXT, municipality TEXT, postal_code TEXT,
 property_type TEXT, rooms REAL, living_area REAL, plot_size REAL,
 price REAL, price_per_m2 REAL, address TEXT, listing_date TEXT, url TEXT,
 title TEXT, construction_year INTEGER, scraped_at TEXT, snapshot_id INTEGER
);
CREATE TABLE snapshots (id INTEGER PRIMARY KEY, started_at TEXT, completed_at TEXT);
CREATE TABLE provenance (listing_id INTEGER, source TEXT, url TEXT, scraped_at TEXT,
 UNIQUE(listing_id, source, url));
CREATE TABLE parcels (id INTEGER PRIMARY KEY, source_url TEXT, format TEXT,
 crs TEXT, geometry TEXT, properties TEXT, official_land_value REAL,
 scraped_at TEXT);
CREATE TABLE source_runs (source TEXT, url TEXT, status TEXT, parsed_count INTEGER,
 message TEXT, scraped_at TEXT);
""")
MODEL = None
METRICS = {}
FEATURES = ['living_area', 'rooms', 'plot_size', 'property_type', 'municipality']
LAND_RATE = 1000.0  # User assumption, NOT official or verified regional evidence.
SNAPSHOT_ID = None

def now():
    return datetime.now(timezone.utc).isoformat()

class Unavailable(RuntimeError):
    pass

class RobotsPolicy:
    """RFC-style wildcard / end-anchor matching, longest rule, Allow wins ties.
    Unknown robots policy fails closed. Uses our identifiable bot, not a spoofed UA.
    """
    def __init__(self, text):
        self.groups = []
        agents, rules = [], []
        seen_rule = False
        for raw in text.splitlines():
            line = raw.split('#', 1)[0].strip()
            if ':' not in line:
                continue
            key, value = [x.strip() for x in line.split(':', 1)]
            key = key.lower()
            if key == 'user-agent':
                if seen_rule:
                    self.groups.append((agents, rules))
                    agents, rules, seen_rule = [], [], False
                agents.append(value.lower())
            elif key in ('allow', 'disallow', 'crawl-delay') and agents:
                rules.append((key, value))
                seen_rule = True
        if agents:
            self.groups.append((agents, rules))
        exact = [(a, r) for a, r in self.groups
                 if any(x != '*' and x in BOT.lower() for x in a)]
        chosen = exact or [(a, r) for a, r in self.groups if '*' in a]
        if exact:
            longest = max(len(x) for a, _ in exact for x in a
                          if x != '*' and x in BOT.lower())
            chosen = [(a, r) for a, r in exact
                      if any(len(x) == longest and x in BOT.lower() for x in a)]
        self.rules = [rule for _, rules in chosen for rule in rules]
        self.delay = max([float(v) for k, v in self.rules
                          if k == 'crawl-delay' and re.fullmatch(r'\d+(\.\d+)?', v)] or [0])

    def allows(self, url):
        parts = urlsplit(url)
        target = parts.path or '/'
        if parts.query:
            target += '?' + parts.query
        matches = []
        for key, pattern in self.rules:
            if key not in ('allow', 'disallow') or not pattern:
                continue
            anchored = pattern.endswith('$')
            body = pattern[:-1] if anchored else pattern
            expr = '^' + '.*'.join(re.escape(p) for p in body.split('*'))
            if anchored:
                expr += '$'
            if re.search(expr, target):
                matches.append((len(body.replace('*', '')), key == 'allow'))
        return max(matches)[1] if matches else True

class PublicClient:
    def __init__(self, use_browser=True):
        self.session = requests.Session()
        self.session.trust_env = False  # No accidental ambient proxy/credential use.
        self.policies = {}
        self.last_request = {}
        self.use_browser = use_browser
        self.stopped = set()
        self.max_bytes = 25_000_000

    def pause(self, origin, delay=0):
        wait = max(random.uniform(1, 3), delay)
        elapsed = time.monotonic() - self.last_request.get(origin, 0)
        if elapsed < wait:
            time.sleep(wait - elapsed)
        self.last_request[origin] = time.monotonic()

    def origin(self, url):
        p = urlsplit(url)
        if p.scheme != 'https' or not p.hostname or p.username or p.password:
            raise Unavailable('Only credential-free HTTPS public URLs are accepted')
        return f'{p.scheme}://{p.netloc}'

    def raw(self, url, delay=0):
        origin = self.origin(url)
        if origin in self.stopped:
            raise Unavailable('Host stopped after access denial/rate limit')
        for attempt in range(3):
            self.pause(origin, delay)
            try:
                response = self.session.get(url, timeout=(15, 40), stream=True,
                    allow_redirects=False, headers={'User-Agent': random.choice(USER_AGENTS),
                    'Accept-Language': 'de-CH,de;q=0.9,en;q=0.7'})
                with response:
                    if response.status_code in (401, 403, 429):
                        self.stopped.add(origin)
                        raise Unavailable(f'HTTP {response.status_code}; no bypass or proxy rotation')
                    if response.status_code >= 500:
                        raise requests.HTTPError(f'HTTP {response.status_code}')
                    chunks, size = [], 0
                    for chunk in response.iter_content(65536):
                        size += len(chunk)
                        if size > self.max_bytes:
                            raise Unavailable('Response exceeds 25 MB cap')
                        chunks.append(chunk)
                    response._content = b''.join(chunks)
                    return response
            except requests.RequestException as exc:
                LOG.warning('Request attempt %s/3 %s: %s', attempt + 1, url, exc)
                if attempt == 2:
                    raise Unavailable(str(exc)) from exc
                time.sleep(2 ** attempt)

    def policy(self, url):
        origin = self.origin(url)
        if origin not in self.policies:
            robots_url = origin + '/robots.txt'
            try:
                for _ in range(5):
                    resp = self.raw(robots_url)
                    if resp.is_redirect:
                        nxt = urljoin(robots_url, resp.headers.get('Location', ''))
                        if self.origin(nxt) != origin:
                            raise Unavailable('Cross-origin robots redirect; manual review required')
                        robots_url = nxt
                        continue
                    if resp.status_code in (404, 410):
                        self.policies[origin] = RobotsPolicy('')
                    elif resp.status_code == 200 and '<html' not in resp.text.lower():
                        self.policies[origin] = RobotsPolicy(resp.text)
                    else:
                        raise Unavailable(f'Cannot establish robots policy: HTTP {resp.status_code}')
                    break
                else:
                    raise Unavailable('Too many robots redirects')
            except Unavailable:
                self.policies[origin] = None
        policy = self.policies[origin]
        if policy is None:
            raise Unavailable('robots.txt unavailable: skipped conservatively')
        return policy

    def permitted(self, url):
        policy = self.policy(url)
        if not policy.allows(url):
            raise Unavailable(f'robots.txt disallows {url}')
        return policy

    def get(self, url):
        for _ in range(6):
            policy = self.permitted(url)
            response = self.raw(url, policy.delay)
            if response.is_redirect:
                url = urljoin(url, response.headers.get('Location', ''))
                continue  # Policy checked BEFORE every redirected request.
            if response.status_code != 200:
                raise Unavailable(f'HTTP {response.status_code} at {url}')
            return response
        raise Unavailable('Too many redirects')

    def render(self, url):
        """Browser reads only approved page/script assets. No private XHR/API calls.
        Abort all fetch/XHR, workers, media and images; some apps consequently fail.
        """
        if not self.use_browser:
            raise Unavailable('JavaScript rendering disabled')
        self.permitted(url)
        try:
            from playwright.sync_api import sync_playwright
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(user_agent=USER_AGENTS[1],
                    locale='de-CH', service_workers='block', accept_downloads=False)
                def route_handler(route):
                    request = route.request
                    if request.resource_type not in ('document', 'script', 'stylesheet'):
                        route.abort()
                        return
                    try:
                        policy = self.permitted(request.url)
                        self.pause(self.origin(request.url), policy.delay)
                        route.continue_()
                    except Exception:
                        route.abort()
                context.route('**/*', route_handler)
                page = context.new_page()
                def observe(response):
                    if response.status in (401, 403, 429):
                        self.stopped.add(self.origin(response.url))
                page.on('response', observe)
                response = page.goto(url, wait_until='domcontentloaded', timeout=60000)
                if response is None or response.status != 200:
                    raise Unavailable('Browser navigation failed or was blocked')
                page.wait_for_timeout(2500)
                html, final_url = page.content(), page.url
                context.close()
                browser.close()
                if self.origin(url) in self.stopped:
                    raise Unavailable('Access-denied response during rendering')
                return html, final_url
        except Unavailable:
            raise
        except Exception as exc:
            raise Unavailable(f'Browser unavailable/failed: {exc}') from exc


def number(value):
    if isinstance(value, dict):
        value = value.get('value', value.get('amount'))
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, (float, int)):
        return float(value) if math.isfinite(value) else None
    text = str(value).replace('’', "'").replace('\u202f', '').replace('\xa0', '')
    match = re.search(r'\d[\d\s\'.,]*', text)
    if not match:
        return None
    token = re.sub(r"[\s']", '', match.group()).strip('.,')
    if ',' in token and '.' not in token:
        token = token.replace(',', '' if re.fullmatch(r'\d{1,3}(,\d{3})+', token) else '.')
    elif ',' in token:
        token = token.replace(',', '')
    try:
        return float(token)
    except ValueError:
        return None


def first(mapping, *keys):
    return next((mapping[k] for k in keys if mapping.get(k) is not None), None)


def property_kind(value):
    value = str(value or '').lower()
    if any(x in value for x in ('mehrfamilien', 'commercial', 'gewerbe', 'parking', 'garage')):
        return None
    if any(x in value for x in ('plot', 'land', 'bauland', 'grundstück')):
        return 'plot'
    if any(x in value for x in ('apartment', 'wohnung', 'flat', 'condominium', 'penthouse', 'maisonette')):
        return 'apartment'
    if any(x in value for x in ('house', 'haus', 'villa', 'chalet')):
        return 'house'
    return None


def canonical(url):
    p = urlsplit(url)
    return urlunsplit((p.scheme, p.netloc.lower(), p.path.rstrip('/'), '', ''))


def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def municipality_for(postal, locality):
    if str(postal) not in TARGETS.values():
        return None
    norm = str(locality or '').casefold().strip()
    found = [m for alias, m in LOCALITIES.items()
             if re.search(r'\b' + re.escape(alias) + r'\b', norm)]
    if len(set(found)) == 1 and TARGETS[found[0]] == str(postal):
        return found[0]
    # A postcode alone is not a reliable municipality identifier.
    return None


def normalise(node, source, base_url):
    """Conservative embedded JSON adapter. Reject rental, multi-unit and vague price objects."""
    obj = node.get('realEstate', node.get('property', node))
    if not isinstance(obj, dict):
        return None
    address = obj.get('address') or node.get('address') or {}
    if not isinstance(address, dict):
        address = {}
    postal = str(first(address, 'postalCode', 'zipCode', 'zip') or
                 first(obj, 'postalCode', 'zipCode') or '').strip()
    locality = first(address, 'addressLocality', 'locality', 'city', 'municipality') or first(obj, 'municipality', 'city')
    municipality = municipality_for(postal, locality)
    if not municipality:
        return None
    transaction = str(first(node, 'offerType', 'dealType', 'transactionType') or
                      first(obj, 'offerType', 'dealType', 'transactionType') or '').lower()
    if any(x in transaction for x in ('rent', 'miet')):
        return None
    title = first(node, 'title', 'name') or first(obj, 'title', 'name') or ''
    if isinstance(title, dict):
        title = first(title, 'de', 'en') or ''
    kind = property_kind(first(obj, 'propertyType', 'category', 'objectType', '@type') or title)
    if not kind:
        return None
    prices = obj.get('prices') or node.get('prices') or {}
    if not isinstance(prices, dict):
        prices = {}
    offers = obj.get('offers') or node.get('offers') or {}
    if isinstance(offers, list):
        offers = offers[0] if offers else {}
    if not isinstance(offers, dict):
        offers = {}
    buy = prices.get('buy') or {}
    if isinstance(buy, dict):
        price = first(buy, 'price', 'amount')
    else:
        price = buy
    if price is None:
        price = first(offers, 'price') or first(node, 'sellingPrice', 'price') or first(obj, 'sellingPrice', 'price')
    currency = first(offers, 'priceCurrency') or first(prices, 'currency') or 'CHF'
    if currency != 'CHF' or (prices.get('rent') and not prices.get('buy')):
        return None
    characteristics = obj.get('characteristics') or {}
    if not isinstance(characteristics, dict):
        characteristics = {}
    area = first(obj, 'livingArea', 'livingSpace', 'floorSize', 'surfaceLiving')
    if area is None:
        area = first(characteristics, 'livingSpace', 'livingArea')
    rooms = first(obj, 'numberOfRooms', 'rooms')
    if rooms is None:
        rooms = first(characteristics, 'numberOfRooms', 'rooms')
    plot = first(obj, 'plotSize', 'landArea', 'landSurface', 'lotSize')
    if plot is None:
        plot = first(characteristics, 'landSurface', 'plotSize')
    url = first(node, 'url', 'detailUrl', 'listingUrl') or first(obj, 'url', 'detailUrl')
    if not isinstance(url, str):
        return None  # Never invent a detail route from an opaque ID.
    full_url = urljoin(base_url, url)
    if urlsplit(full_url).scheme != 'https':
        return None
    return dict(source=source, municipality=municipality, postal_code=postal,
        property_type=kind, rooms=number(rooms), living_area=number(area),
        plot_size=number(plot), price=number(price),
        address=first(address, 'streetAddress', 'street'),
        listing_date=first(node, 'datePosted', 'datePublished', 'listingDate'),
        url=canonical(full_url), title=str(title),
        construction_year=number(first(obj, 'yearBuilt', 'constructionYear') or
            first(characteristics, 'yearBuilt', 'constructionYear')),
        scraped_at=now())


def parse_card(card, anchor, source, base_url):
    text = card.get_text(' ', strip=True)
    if re.search(r'pro Monat|/\s*Monat|monthly|Mietpreis|Nettomiete', text, re.I):
        return None
    loc = re.search(r'\b(5415|5417)\s+([A-Za-zÄÖÜäöüß-]+)', text)
    if not loc:
        return None
    municipality = municipality_for(*loc.groups())
    kind = property_kind(text)
    if not municipality or not kind:
        return None
    price_match = re.search(r"CHF\s*([\d][\d'’\s.,]*\d)", text)
    if not price_match or re.search(r'Preis auf Anfrage|price on request', text, re.I):
        return None
    # Ambiguous multi-listing containers are rejected rather than conflated.
    if len(re.findall(r'\bCHF\b', text)) != 1:
        return None
    rooms_match = re.search(r'(\d+(?:[.,]\d+)?)\s*(?:Zimmer|rooms|pièces)', text, re.I)
    living_match = re.search(r'(?:Wohnfläche|living area|living space)\s*[:\s]*(\d+(?:[.,]\d+)?)\s*m[²2]', text, re.I)
    if not living_match:
        living_match = re.search(r'(\d+(?:[.,]\d+)?)\s*m[²2]\s*(?:Wohnfläche|living area|living space)', text, re.I)
    # An unlabelled area is accepted only for apartments with exactly one m² value.
    areas = re.findall(r'(\d+(?:[.,]\d+)?)\s*m[²2]', text)
    area = number(living_match.group(1)) if living_match else (number(areas[0]) if kind == 'apartment' and len(areas) == 1 else None)
    plot_match = re.search(r'(?:Grundstück(?:sfläche)?|Parzellenfläche|plot size|land area)\s*[:\s]*(\d+(?:[.,]\d+)?)\s*m[²2]', text, re.I)
    heading = card.find(['h1', 'h2', 'h3'])
    return dict(source=source, municipality=municipality, postal_code=loc.group(1),
        property_type=kind, rooms=number(rooms_match.group(1)) if rooms_match else None,
        living_area=area, plot_size=number(plot_match.group(1)) if plot_match else None,
        price=number(price_match.group(1)), address=None, listing_date=None,
        url=canonical(urljoin(base_url, anchor['href'])),
        title=heading.get_text(' ', strip=True) if heading else anchor.get_text(' ', strip=True),
        construction_year=None, scraped_at=now())


def parse_listings(html, source, base_url):
    soup = BeautifulSoup(html, 'lxml')
    found = []
    for script in soup.find_all('script'):
        if script.get('type') not in ('application/ld+json', 'application/json') and script.get('id') != '__NEXT_DATA__':
            continue
        try:
            payload = json.loads(script.string or script.get_text())
        except (ValueError, TypeError):
            continue
        for node in walk(payload):
            row = normalise(node, source, base_url)
            if row:
                found.append(row)
    patterns = {'homegate': r'/buy/\d+', 'comparis': r'/immobilien/(?:details|marktplatz/details)/',
                'immoscout24': r'/(?:en/)?(?:d|real-estate)/\d+'}
    for anchor in soup.find_all('a', href=True):
        if not re.search(patterns[source], anchor['href']):
            continue
        # Smallest ancestor that looks like a single listing card.
        for card in [anchor, *list(anchor.parents)[:5]]:
            if getattr(card, 'name', '') in ('body', 'html'):
                break
            row = parse_card(card, anchor, source, base_url)
            if row:
                found.append(row)
                break
    unique = {}
    for row in found:
        key = row['url']
        score = sum(value is not None for value in row.values())
        if key not in unique or score > sum(v is not None for v in unique[key].values()):
            unique[key] = row
    return list(unique.values()), soup


def record_run(source, url, status, count=0, message=''):
    CONN.execute('INSERT INTO source_runs VALUES (?,?,?,?,?,?)',
                 (source, url, status, count, message, now()))
    CONN.commit()
    LOG.info('%s %s: %s (%s listings) %s', source, url, status, count, message)


def scrape_pages(client, source, seeds, max_pages):
    result, visited = [], set()
    for seed in seeds:
        url = seed
        for _ in range(max_pages):
            if not url or url in visited:
                break
            visited.add(url)
            try:
                response = client.get(url)
                html, final_url = response.text, response.url
                if re.search(r'captcha|verify you are human|access denied|cf-chl-', html, re.I):
                    raise Unavailable('Challenge page; not bypassed')
                rows, soup = parse_listings(html, source, final_url)
                if not rows and client.use_browser:
                    html, final_url = client.render(final_url)
                    rows, soup = parse_listings(html, source, final_url)
                result.extend(rows)
                record_run(source, url, 'ok' if rows else 'no_extractable_data', len(rows),
                           '' if rows else 'No valid listings: empty results, changed markup, or incomplete rendering')
                nxt = soup.find('a', rel=lambda v: v and 'next' in v)
                if not nxt:
                    nxt = soup.select_one('a[aria-label="Next page"], a[aria-label="Nächste Seite"]')
                url = urljoin(final_url, nxt['href']) if nxt and nxt.get('href') else None
                if url and urlsplit(url).netloc != urlsplit(seed).netloc:
                    url = None
            except Exception as exc:
                record_run(source, url, 'skipped_or_failed', message=str(exc))
                break
    return result


def scrape_homegate(client, max_pages=1):
    return scrape_pages(client, 'homegate',
        [f'https://www.homegate.ch/buy/real-estate/region/{zip_code}' for zip_code in TARGETS.values()], max_pages)


def scrape_comparis(client, max_pages=1):
    # Human-readable public routes avoid inventing an undocumented requestobject schema.
    seeds = [f'https://www.comparis.ch/immobilien/marktplatz/{name.lower()}/kaufen'
             for name in TARGETS]
    return scrape_pages(client, 'comparis', seeds, max_pages)


def scrape_immoscout24(client, max_pages=1):
    # Region route covers both municipalities; every extracted record is filtered locally.
    return scrape_pages(client, 'immoscout24',
        ['https://www.immoscout24.ch/en/real-estate/buy/region/siggenthal'], max_pages)


def import_parcels(client, url, land_value_field=None):
    """Import an explicitly selected PUBLIC AGIS GeoJSON/CSV/WFS GetFeature URL.
    WMS images are not parcel geometry. No invented official valuation field.
    CSV coordinates/geometry and XML CRS remain in their native representation.
    """
    try:
        response = client.get(url)
        text = response.text
        records = []
        if text.lstrip().startswith('{'):
            payload = response.json()
            if payload.get('type') != 'FeatureCollection':
                raise Unavailable('Expected GeoJSON FeatureCollection')
            crs = json.dumps(payload.get('crs') or {'name': 'OGC:CRS84'})
            for feature in payload.get('features', []):
                props = feature.get('properties') or {}
                records.append(('GeoJSON', crs, json.dumps(feature.get('geometry')), props))
        elif text.lstrip().startswith('<'):
            root = etree.fromstring(response.content,
                parser=etree.XMLParser(resolve_entities=False, no_network=True))
            if 'FeatureCollection' not in etree.QName(root).localname:
                raise Unavailable('Expected WFS FeatureCollection; not WMS capabilities/image')
            for member in root.xpath('//*[local-name()="member" or local-name()="featureMember"]'):
                geom = member.xpath('.//*[@srsName]')
                geometry = etree.tostring(geom[0], encoding='unicode') if geom else None
                props = {etree.QName(el).localname: el.text for el in member.iter()
                         if len(el) == 0 and el.text}
                records.append(('GML', geom[0].get('srsName') if geom else None, geometry, props))
        else:
            dialect = csv.Sniffer().sniff(text[:8192], delimiters=',;\t')
            for row in csv.DictReader(io.StringIO(text), dialect=dialect):
                records.append(('CSV', row.get('crs') or row.get('srsName'),
                    row.get('geometry') or row.get('wkt'), row))
        for fmt, crs, geometry, props in records:
            CONN.execute('INSERT INTO parcels(source_url,format,crs,geometry,properties,official_land_value,scraped_at) VALUES (?,?,?,?,?,?,?)',
                (response.url, fmt, crs, geometry, json.dumps(props),
                 number(props.get(land_value_field)) if land_value_field else None, now()))
        CONN.commit()
        record_run('agis', url, 'ok', len(records), 'Native geometry retained; no automated spatial join')
    except Exception as exc:
        record_run('agis', url, 'skipped_or_failed', message=str(exc))


def clean_store(rows):
    """Keep asking prices with validated locality/type; missing living area stays NULL.
    Exact URLs and conservative address/size fingerprints de-duplicate cross portals.
    Ambiguous addressless cross-portal duplicates are flagged in README, not guessed.
    """
    fields = ['source', 'municipality', 'postal_code', 'property_type', 'rooms',
              'living_area', 'plot_size', 'price', 'price_per_m2', 'address',
              'listing_date', 'url', 'title', 'construction_year', 'scraped_at', 'snapshot_id']
    seen_url, seen_fingerprint = {}, {}
    counts = {'accepted_unique': 0, 'duplicate': 0, 'rejected': 0}
    for raw in sorted(rows, key=lambda x: -sum(v is not None for v in x.values())):
        row = dict(raw)
        if (row.get('municipality') not in TARGETS or
            row.get('postal_code') != TARGETS[row['municipality']] or
            row.get('property_type') not in ('house', 'apartment', 'plot') or
            not row.get('price') or row['price'] <= 0):
            counts['rejected'] += 1
            continue
        for field in ('living_area', 'plot_size', 'rooms'):
            if row.get(field) is not None and row[field] <= 0:
                row[field] = None
        year = row.get('construction_year')
        row['construction_year'] = int(year) if year and 1000 <= year <= datetime.now().year + 5 else None
        row['price_per_m2'] = row['price'] / row['living_area'] if row.get('living_area') else None
        row['snapshot_id'] = SNAPSHOT_ID
        fingerprint = None
        # Require full street address including a house number and known size/rooms.
        if row.get('address') and re.search(r'\d', row['address']) and row.get('living_area') and row.get('rooms'):
            fingerprint = (row['municipality'], row['property_type'],
                re.sub(r'\W', '', row['address'].lower()), round(row['living_area'], 1),
                round(row['rooms'], 1), row.get('plot_size'))
        listing_id = seen_url.get(row['url']) or (seen_fingerprint.get(fingerprint) if fingerprint else None)
        if listing_id:
            counts['duplicate'] += 1
        else:
            cursor = CONN.execute(f'INSERT INTO listings ({",".join(fields)}) VALUES ({",".join("?" for _ in fields)})',
                                  [row.get(f) for f in fields])
            listing_id = cursor.lastrowid
            counts['accepted_unique'] += 1
        seen_url[row['url']] = listing_id
        if fingerprint:
            seen_fingerprint[fingerprint] = listing_id
        CONN.execute('INSERT OR IGNORE INTO provenance VALUES (?,?,?,?)',
                     (listing_id, row['source'], row['url'], row['scraped_at']))
    CONN.commit()
    return counts


def training_data():
    return pd.read_sql_query("SELECT * FROM listings WHERE property_type IN ('house','apartment') AND living_area > 0 AND price > 0", CONN)


def train_model():
    global MODEL, METRICS
    MODEL, METRICS = None, {}
    df = training_data()
    if len(df) < 50:
        METRICS = {'training_listings': len(df), 'reason': 'Fewer than 50 eligible unique listings'}
        return
    numeric = ['living_area', 'rooms', 'plot_size']
    X = df[FEATURES].copy()
    X.loc[X.property_type == 'apartment', 'plot_size'] = 0.0
    # All-missing numeric columns are set to zero consistently in training/inference.
    for col in numeric:
        if X[col].isna().all():
            X[col] = 0.0
    encoder = OneHotEncoder(handle_unknown='ignore')
    preprocessing = ColumnTransformer([
        ('numeric', SimpleImputer(strategy='median', add_indicator=True), numeric),
        ('category', encoder, ['property_type', 'municipality'])], sparse_threshold=0)
    pipeline = Pipeline([('preprocess', preprocessing),
                         ('regressor', GradientBoostingRegressor(random_state=42,
                             n_estimators=150, max_depth=2, min_samples_leaf=5))])
    train_idx, test_idx = train_test_split(np.arange(len(df)), test_size=0.2, random_state=42)
    pipeline.fit(X.iloc[train_idx], df.price.iloc[train_idx])
    predicted = pipeline.predict(X.iloc[test_idx])
    residuals = np.abs(df.price.iloc[test_idx].to_numpy() - predicted)
    METRICS = {'training_listings': len(df), 'train_count': len(train_idx), 'test_count': len(test_idx),
        'r2': float(r2_score(df.price.iloc[test_idx], predicted)),
        'mae_chf': float(mean_absolute_error(df.price.iloc[test_idx], predicted)),
        'rmse_chf': float(np.sqrt(mean_squared_error(df.price.iloc[test_idx], predicted))),
        'absolute_residual_p90_chf': float(np.quantile(residuals, 0.90))}
    MODEL = pipeline  # Keep holdout model; do not silently refit after reporting holdout error.


def estimate_property_value(municipality: str, property_type: str,
                            living_area: float, rooms: float, plot_size: float = 0) -> dict:
    """Indicative ASKING-price estimate, never a bank/tax or transaction valuation.
    confidence_range is a heuristic uncertainty band, not a calibrated CI.
    Calls require run_pipeline() first within the SAME Python process.
    """
    if municipality not in TARGETS or property_type not in ('house', 'apartment'):
        raise ValueError('Use a target municipality and house/apartment')
    for label, value in [('living_area', living_area), ('rooms', rooms), ('plot_size', plot_size)]:
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
            raise ValueError(f'{label} must be a finite number')
    if living_area <= 0 or rooms <= 0 or plot_size < 0:
        raise ValueError('Area and rooms must be positive; plot must be nonnegative')
    if property_type == 'apartment' and plot_size:
        raise ValueError('Apartment plot_size must be 0')
    df = training_data()
    group = df[(df.municipality == municipality) & (df.property_type == property_type)]
    if group.empty:
        raise ValueError('No eligible local/type comparables; cannot estimate without inventing data')
    warnings = ['Asking prices, not completed sales; uncertainty band is not a calibrated confidence interval.']
    supported = len(group) >= 5 and group.rooms.notna().sum() >= 3
    if property_type == 'house' and plot_size and group.plot_size.notna().sum() < 5:
        supported = False
        warnings.append('Insufficient observed house plots for hedonic plot-size adjustment.')
    in_domain = group.living_area.min() * 0.75 <= living_area <= group.living_area.max() * 1.25
    if MODEL is not None and supported and in_domain:
        X = pd.DataFrame([dict(living_area=living_area, rooms=rooms, plot_size=plot_size,
                               property_type=property_type, municipality=municipality)])
        estimate = float(MODEL.predict(X)[0])
        if estimate <= 0:
            raise ValueError('Nonpositive model prediction; unsupported property')
        # A fixed ±15% and RMSE-based range are different requirements: conservatively combine.
        margin = max(0.15 * estimate, METRICS['rmse_chf'], METRICS['absolute_residual_p90_chf'])
        return {'estimated_price': estimate, 'confidence_range': (max(0.0, estimate-margin), estimate+margin),
            'method_used': 'hedonic_model', 'comparable_listings': [],
            'metrics': METRICS.copy(), 'warnings': warnings, 'snapshot_as_of': df.scraped_at.max()}
    # Favor similar area and room count, but never borrow another municipality/type silently.
    near = group[(group.living_area.between(living_area*0.7, living_area*1.3)) &
                 ((group.rooms - rooms).abs() <= 1.5)]
    comps = near.copy() if len(near) >= 3 else group.copy()
    if len(near) < 3:
        warnings.append('Too few size/room matches; using all local/type comparables.')
    if len(comps) < 5:
        warnings.append('Very small comparable sample; high uncertainty.')
    base = living_area * float(comps.price_per_m2.median())
    adjustment = 0.0
    if property_type == 'house' and plot_size:
        plots = comps.plot_size.dropna()
        if len(plots) >= 3:
            # House CHF/m² already includes its typical plot: adjust only difference.
            adjustment = (plot_size - float(plots.median())) * LAND_RATE
            warnings.append(f'Plot DIFFERENCE adjustment uses assumed CHF {LAND_RATE:g}/m², not official data.')
        else:
            warnings.append('No plot adjustment: insufficient observed comparable plots. Land is already in house prices.')
    estimate = base + adjustment
    if estimate <= 0:
        raise ValueError('Plot adjustment yields nonpositive estimate; no defensible estimate')
    low_comp = living_area * float(comps.price_per_m2.min()) + adjustment
    high_comp = living_area * float(comps.price_per_m2.max()) + adjustment
    lower = max(0.0, min(0.8*estimate, low_comp))
    upper = max(1.2*estimate, high_comp)
    records = json.loads(comps.to_json(orient='records'))
    return {'estimated_price': estimate, 'confidence_range': (lower, upper),
        'method_used': 'comparable_sales', 'comparable_listings': records,
        'comparable_count': len(comps), 'plot_adjustment_chf': adjustment,
        'warnings': warnings + ['method_used name is API compatibility only: comparable ASKING prices.'],
        'snapshot_as_of': comps.scraped_at.max()}


def run_pipeline(max_pages=1, use_browser=True, agis_url=None,
                 land_value_field=None, land_rate=1000.0):
    global SNAPSHOT_ID, LAND_RATE, MODEL, METRICS
    if max_pages < 1 or not math.isfinite(land_rate) or land_rate < 0:
        raise ValueError('max_pages >= 1 and finite nonnegative land_rate required')
    for table in ('listings', 'provenance', 'parcels', 'source_runs', 'snapshots'):
        CONN.execute(f'DELETE FROM {table}')
    MODEL, METRICS = None, {}
    LAND_RATE = land_rate
    SNAPSHOT_ID = CONN.execute('INSERT INTO snapshots(started_at) VALUES (?)', (now(),)).lastrowid
    client = PublicClient(use_browser)
    rows = []
    try:
        # Homegate and Comparis first; default is one page per search.
        for scraper in (scrape_homegate, scrape_comparis, scrape_immoscout24):
            try:
                rows.extend(scraper(client, max_pages))
            except Exception as exc:
                LOG.exception('Source failed; continuing: %s', exc)
        counts = clean_store(rows)
        if agis_url:
            import_parcels(client, agis_url, land_value_field)
        else:
            record_run('agis', 'https://opendata.swiss/en/dataset/26-ag-liegenschaften-des-kantons',
                       'not_configured', message='Canton-owned parcels only; select a verified public geometry resource with --agis-url')
        train_model()
        CONN.execute('UPDATE snapshots SET completed_at=? WHERE id=?', (now(), SNAPSHOT_ID))
        CONN.commit()
        return counts
    finally:
        client.session.close()


def print_report(counts):
    print('\nASKING-PRICE SNAPSHOT (UTC)')
    print(dict(CONN.execute('SELECT * FROM snapshots ORDER BY id DESC LIMIT 1').fetchone()))
    print('Cleaning:', counts)
    print('\nParsed listings per source (before cross-portal deduplication):')
    runs = pd.read_sql_query('SELECT * FROM source_runs', CONN)
    print(runs.groupby('source').parsed_count.sum().to_string())
    print('\nSource status:')
    print(runs[['source', 'status', 'message']].to_string(index=False))
    print('\nUnique listings by retained primary source:')
    print(pd.read_sql_query('SELECT source, COUNT(*) AS count FROM listings GROUP BY source', CONN).to_string(index=False))
    df = training_data()
    print('\nMedian CHF/m² (eligible residential asking prices only):')
    if not df.empty:
        print(df.groupby(['municipality', 'property_type']).price_per_m2.agg(['count', 'median']).to_string())
    else:
        print('No eligible data. No fabricated or demo valuation will be reported.')
    print('\nModel:', json.dumps(METRICS, indent=2))
    print('\nExample: 4.5-room, 120 m² apartment in Untersiggenthal')
    try:
        result = estimate_property_value('Untersiggenthal', 'apartment', 120, 4.5)
        display = {k: v for k, v in result.items() if k != 'comparable_listings'}
        print(json.dumps(display, indent=2))
    except ValueError as exc:
        print('Unavailable:', exc)


def self_test():
    """Offline assertions only; synthetic data is NOT market evidence."""
    global SNAPSHOT_ID
    assert number("CHF 1’250’000.–") == 1250000
    assert number('4,5') == 4.5
    assert number('1,250,000') == 1250000
    policy = RobotsPolicy('User-agent: *\nDisallow: /private/*\nAllow: /private/public$\n')
    assert not policy.allows('https://example.org/private/data')
    assert policy.allows('https://example.org/private/public')
    assert not policy.allows('https://example.org/private/public/more')
    fixture = {'@type': 'Apartment', 'name': '4.5 Zimmer Eigentumswohnung',
        'address': {'postalCode': '5417', 'addressLocality': 'Untersiggenthal',
                    'streetAddress': 'Teststrasse 1'},
        'numberOfRooms': 4.5, 'floorSize': {'value': 120},
        'offers': {'price': '1200000', 'priceCurrency': 'CHF'},
        'url': '/buy/123456'}
    html = '<script type="application/ld+json">' + json.dumps(fixture) + '</script>'
    home_rows, _ = parse_listings(html, 'homegate', 'https://www.homegate.ch/')
    assert len(home_rows) == 1 and home_rows[0]['living_area'] == 120
    fixture['url'] = '/immobilien/details/show/123456'
    comparis_rows, _ = parse_listings('<script type="application/ld+json">'+json.dumps(fixture)+'</script>',
                                    'comparis', 'https://www.comparis.ch/')
    assert len(comparis_rows) == 1
    for table in ('listings', 'provenance', 'snapshots', 'source_runs', 'parcels'):
        CONN.execute(f'DELETE FROM {table}')
    SNAPSHOT_ID = CONN.execute('INSERT INTO snapshots(started_at) VALUES (?)', (now(),)).lastrowid
    counts = clean_store(home_rows + comparis_rows)
    assert counts['accepted_unique'] == 1 and counts['duplicate'] == 1
    train_model()
    result = estimate_property_value('Untersiggenthal', 'apartment', 120, 4.5)
    assert result['estimated_price'] == 1200000
    assert result['confidence_range'] == (960000, 1440000)
    assert MODEL is None
    try:
        estimate_property_value('Obersiggenthal', 'house', 120, 4.5)
        raise AssertionError('Missing local comparables must not invent a valuation')
    except ValueError:
        pass
    for table in ('listings', 'provenance', 'snapshots', 'source_runs', 'parcels'):
        CONN.execute(f'DELETE FROM {table}')
    print('Offline tests passed: numeric parsing, robots precedence, Homegate/Comparis fixtures, deduplication, fallback, no-data handling.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--max-pages', type=int, default=1, help='Per search, follow actual next-page links only')
    parser.add_argument('--no-browser', action='store_true')
    parser.add_argument('--agis-url', help='Verified public GeoJSON, CSV or WFS GetFeature URL')
    parser.add_argument('--land-value-field', help='Explicit verified field in parcel data; not automatically used by valuation')
    parser.add_argument('--land-rate', type=float, default=1000, help='Assumed marginal plot rate CHF/m², not official data')
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
    if args.self_test:
        self_test()
        return
    counts = run_pipeline(args.max_pages, not args.no_browser, args.agis_url,
                          args.land_value_field, args.land_rate)
    print_report(counts)

if __name__ == '__main__':
    main()
