# Siggenthal property asking-price valuation

A single Python 3.10+ application with public-page scrapers, SQLite `:memory:`,
a scikit-learn valuation pipeline, and an importable calculator. No paid APIs,
external database, listing exports, saved HTML, persisted model, or proxy service.

## Important status and scope

This is a runnable, conservative implementation, NOT a verified production scraper.
During preparation, the Comparis and ImmoScout24 robots files were retrieved, but
Homegate robots.txt and the attempted results pages could not be retrieved by the
research tools. Live extraction and real-market valuation were therefore not verified.
The parsers and valuation paths were tested offline with explicitly synthetic data.
No synthetic records are used in a normal run. An unavailable source or insufficient
local comparables is reported rather than replaced with fabricated listings.

The requested AGIS dataset is canton-owned property, not the full cadastral inventory
of private residential parcels. A verified direct geometry-resource URL must be supplied
for AGIS import. No official local land-value field or endpoint has been verified.
The normal run explicitly reports AGIS as not configured instead of inventing one.

## Installation

Save valuation.py, README.md and requirements.txt in the same directory.

```sh
python -m venv .venv
# Linux/macOS:
source .venv/bin/activate
# Windows PowerShell instead:
# .venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m playwright install chromium
# On Linux, if browser system libraries are missing:
# python -m playwright install --with-deps chromium
```

Dependencies are version-bounded, not a fully locked reproducible environment.
Installation writes packages and browser binaries to disk; application property data
is exclusively in memory. Browser engines can use OS-managed temporary files; the
application does not promise a diskless Chromium process. For strict no-browser disk
activity use `--no-browser`. No persistent browser context is used.

## Run and small-scale checks

```sh
python valuation.py --self-test
python valuation.py --max-pages 1
python valuation.py --max-pages 1 --no-browser
# Increase coverage only after inspecting first-page output:
python valuation.py --max-pages 3
```

Homegate and Comparis run first, then ImmoScout24. One page per search is the default.
Homegate uses the two postal-code region URLs in the request. Comparis uses public
municipality purchase routes rather than guessing an undocumented `requestobject`
JSON filter schema. ImmoScout24 uses the supplied Siggenthal region route, with
municipality and postcode checks on each extracted record. These routes themselves
may change or return an error. Pagination follows only actual next-page links;
no guessed page parameters are sent.

The report prints:
- Parsed count per source before cross-portal deduplication.
- Source failures, robots exclusions, empty/unsupported extraction and AGIS status.
- Cleaning counts and unique records by their retained primary source.
- Residential median asking CHF/m² and eligible listing counts by municipality/type.
- R², MAE, RMSE and holdout residual percentile when a model is trained.
- A 4.5-room, 120 m² Untersiggenthal apartment estimate, or an explicit no-data message.
- UTC snapshot start/end and record-level scrape timestamps.

A zero count is not proof that the market has no listings. It can indicate denied
access, an outdated route, changed markup or incomplete browser rendering.

## Calling the calculator

Initialize and call it in the SAME process. Data from a separately executed CLI
process cannot be reused because its in-memory database disappears on exit.

```python
from valuation import run_pipeline, estimate_property_value, CONN

run_pipeline(max_pages=1, use_browser=True)
try:
    result = estimate_property_value(
        municipality="Untersiggenthal",
        property_type="apartment",
        living_area=120,
        rooms=4.5,
    )
    print(result["estimated_price"])
    print(result["confidence_range"])
    print(result["method_used"])
    print(result["warnings"])
except ValueError as exc:
    print("No defensible valuation:", exc)

# Houses additionally accept plot_size:
# estimate_property_value("Obersiggenthal", "house", 160, 5.5, plot_size=600)

# Inspect the same local in-memory SQLite database:
rows = CONN.execute("SELECT * FROM listings").fetchall()
```

The mandatory return keys are estimated_price, confidence_range, method_used and
comparable_listings. Additional keys describe uncertainty, sample size, snapshot date,
model metrics and plot adjustment. Types other than house/apartment are not valued.

## Data extraction and cleaning

Extraction uses published JSON-LD, application/json and __NEXT_DATA__ objects,
then conservative German/English card parsing. Fields cover title, type, rooms,
living area, plot size, price, municipality, postal code, address, publication date,
URL, construction year where available and scraped_at. Unknown publication dates
remain NULL: scrape time is never misrepresented as the listing publication date.

German mappings include Wohnung/Eigentumswohnung, Einfamilienhaus/Haus, Grundstück/
Bauland, Wohnfläche, Zimmer and CHF pricing. Multi-family buildings, commercial
property and garages are excluded. Address and area extraction are deliberately
conservative; plot area is not substituted for living area. Unknown locality,
non-CHF price, rental indicators and unsupported types are rejected. Postal code
alone does not establish a municipality. Recognized 5415 locality names are explicitly
mapped to Obersiggenthal; Untersiggenthal must match 5417.

Missing positive living area does not prevent a valid listing from being stored,
but excludes it from CHF/m² calculations and residential model training. Invalid
or nonpositive numeric sizes become NULL. Other eligible missing numeric features
are imputed from training medians; apartment plot size is zero. Age is omitted
because the requested calculator has no age input; construction year is retained
for inspection but not used as an unobservable prediction feature.

Exact canonical URLs are deduplicated. Cross-portal records are merged only when
street/house number, municipality, property type, living area, rooms and plot size
match. provenance retains their sources/URLs. Identical units in the same building
may still be merged; addressless cross-portal duplicates may remain. This imperfect
entity resolution can inflate counts or underestimate statistical uncertainty.

## Valuation and deliberate corrections to the requested formulas

These are ASKING-price estimates, not comparable completed-sale evidence, bank
valuations, tax valuations, guaranteed selling prices or a formal appraisal.
`method_used="comparable_sales"` is retained solely for compatibility with the
requested interface; the comparables are advertised offers, not observed sales.

At least 50 eligible unique residential listings are needed for GradientBoostingRegressor.
The model uses living_area, rooms, plot_size, property_type and municipality. An
80/20 random split with seed 42 reports R², MAE and RMSE. Preprocessing fits on the
training split only. The reported holdout model is retained, not silently refit on
all observations. Even when the overall threshold is met, local/type support,
observed house plots and an area-domain check can trigger the fallback.

The model band has half-width:

    max(15% of estimated_price, test RMSE, 90th percentile absolute test residual)

Thus it is at least ±15% but not falsely described as both a fixed ±15% band and
an RMSE-derived interval. It is a heuristic error band, not a calibrated confidence
interval or conformal coverage guarantee. The small holdout cannot establish coverage.

The fallback uses median CHF/m² within the exact municipality/type. If at least
three size/room matches exist, it uses those; otherwise it uses the entire local/type
group and warns. If there are no local/type comparables, it raises ValueError.
It never silently pools another municipality or manufactures a regional median.

For apartments:

    estimate = living_area * median(comparable_price / comparable_living_area)

For houses, whole-property asking CHF/m² ALREADY includes land. Adding the full
plot_size * CHF 1,000 on top would double-count it. If at least three comparable
plot sizes are observed, the implementation instead adds:

    (subject_plot_size - median_comparable_plot_size) * assumed_land_rate

Without sufficient plots it applies no plot adjustment and warns. CHF 1,000/m² is
only a user assumption, configurable with --land-rate; it is NOT a verified regional
rate or official AGIS valuation. Zoning, building rights, slope, access, easements
and marginal land utility can make this simple adjustment inappropriate.

The fallback lower/upper endpoints envelope BOTH ±20% of the estimate and the
subject-area-scaled min/max comparable CHF/m², with the same plot adjustment.
Min/max may widen the band substantially. A minimum ±20% band and a data-dependent
min/max band cannot be identical in general. Lower endpoints are clipped at zero.
Rooms select comparable similarity but do not independently change a median model.

## Optional AGIS parcel import

Official metadata to examine:
https://opendata.swiss/en/dataset/26-ag-liegenschaften-des-kantons
https://www.ag.ch/geoportal/geodatenshop/Datendokumentation.aspx?Datensatzelement=4962

Inspect the dataset license, geography, service capabilities and resource fields,
then pass an actual verified public GeoJSON/CSV download URL or WFS GetFeature URL:

```sh
python valuation.py --agis-url 'VERIFIED_HTTPS_PUBLIC_GEOMETRY_RESOURCE_URL'
```

The placeholder above is intentionally not a working endpoint. Supply an actual URL.
For WFS, include the required service/version/request/typeNames/outputFormat and
bounded feature filters/count in that URL according to the service capabilities.
Large responses are limited to 25 MB; automatic WFS paging is not implemented.

GeoJSON geometry, CSV geometry/WKT and WFS GML are stored as text in the in-memory
parcels table with their original CRS and properties. WMS renders map images, not
usable parcel polygons; WMS images/capabilities are rejected. CSV without geometry
can retain attributes but cannot support spatial joins. INTERLIS is not parsed.

If you have verified a field's meaning and units, --land-value-field FIELD_NAME
copies that attribute into official_land_value. Merely naming a field does not
verify it or its units. Imported parcel values are NOT automatically used by the
calculator. No verified address coordinates, complete private parcel layer or
spatial join is available, so automatic plot matching would be misleading.
The claimed three-month refresh interval was not verified and is not asserted.

## Robots, access controls and browser behavior

Every host's robots.txt is checked at runtime using the same identifiable bot token
in both clients. Wildcard and end-anchor rules use longest-path matching and Allow
wins ties. Unknown robots policy fails closed; 404/410 robots files allow crawling.
Fetch redirects are checked before the redirected request. A robots redirect to a
different host is conservatively refused. Applicable Crawl-delay is respected.

Requests use rotating identifiable User-Agent variants, random 1–3-second per-host
delays, timeouts and up to three attempts for transient network/server failures.
HTTP 401/403/429 stops that host. There is no captcha solving, identity spoofing,
residential proxy or free proxy rotation, login, reverse-engineered private API,
or bypass of robots-disallowed paths. Public accessibility and robots permission
are not a substitute for permission under the site's terms; review those terms
before operating the application or distributing extracted data.

Browser rendering is attempted only after an allowed static HTTP 200 page yields
no extractable target listings. A persistent context is not used. Routes allow only
robots-approved document/script/stylesheet requests; XHR/fetch, service workers,
images and media are blocked. This intentionally avoids silently calling disallowed
Comparis API/dataProvider paths, but limits JS applications that require XHR.
A denied navigation is never retried through a browser as an access-control bypass.

## Testing performed and limitations

`--self-test` tests Homegate/Comparis JSON fixtures, Swiss numeric parsing, robots
wildcards/precedence, cross-portal deduplication, fallback valuation and missing-data
behavior. Its data is synthetic and is cleared before returning. During delivery,
a separate 80-record synthetic test also exercised the 64/16 hedonic split and
calculator model path. Those metrics are not real-market performance claims.

The research/execution environment could not run a live Chromium scraping test;
no claim of successful first-page live extraction is made. Local first-page runs
are required to confirm source routes and markup. The application executes end to
end and reports unavailable data, but cannot guarantee obtaining 50 listings or
any listings under portal restrictions. Portal-specific JSON field names, card
selectors and pagination may need maintenance. No hidden API schema is assumed.

Other limitations: asking-price selection bias, listing staleness, imperfect
entity resolution, uncalibrated uncertainty, small local samples, lack of verified
transaction prices, missing condition/renovation/floor/view/energy-standard features,
nonlinear land effects, and no complete private parcel coverage. No automatic
geocoding or spatial joins are implemented. A single local SQLite connection is
used; this is a command-line/module application, not a concurrent web server.
