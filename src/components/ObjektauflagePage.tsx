import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { sendEmailInquiry } from '../services/emailService';
import { trackEvent } from '../services/analytics';
import {
  FileText,
  CheckCircle2,
  Building,
  User,
  MapPin,
  Home,
  Check,
  ShieldCheck,
  Calendar,
  Key,
  Car,
  Coins,
  Copy,
  CheckCheck,
  Printer,
  RotateCcw,
  ArrowRight,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ObjektauflagePageProps {
  language: Language;
  onNavigateHome: () => void;
}

export const ObjektauflagePage: React.FC<ObjektauflagePageProps> = ({
  language,
  onNavigateHome,
}) => {
  // Share link feedback
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. Stammdaten Eigentümer
  const [ownerName, setOwnerName] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerIban, setOwnerIban] = useState('');
  const [contactPersonType, setContactPersonType] = useState<'owner' | 'representative'>('owner');
  const [representativeDetails, setRepresentativeDetails] = useState('');

  // 2. Objektadresse & Lage
  const [propertyStreet, setPropertyStreet] = useState('');
  const [propertyZipCity, setPropertyZipCity] = useState('');
  const [floorLevel, setFloorLevel] = useState<string>('1. OG');
  const [floorPosition, setFloorPosition] = useState<string>('Links');
  const [customFloor, setCustomFloor] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [yearRenovated, setYearRenovated] = useState('');
  const [renovationDetails, setRenovationDetails] = useState('');

  // 3. Eckdaten zur Wohnung
  const [livingArea, setLivingArea] = useState<number | ''>(85);
  const [roomCount, setRoomCount] = useState<string>('3.5');
  const [bathrooms, setBathrooms] = useState<string[]>(['Bad/WC']);
  const [outdoorSpaces, setOutdoorSpaces] = useState<string[]>(['Balkon']);
  const [balconyArea, setBalconyArea] = useState('');
  const [terraceArea, setTerraceArea] = useState('');
  const [basementNr, setBasementNr] = useState('');
  const [atticNr, setAtticNr] = useState('');
  const [laundrySetup, setLaundrySetup] = useState<string>('in_unit');

  // 4. Ausstattung & Zustand
  const [kitchenAppliances, setKitchenAppliances] = useState<string[]>([
    'Glaskeramik',
    'Geschirrspüler',
    'Backofen',
  ]);
  const [flooring, setFlooring] = useState<string[]>(['Parkett', 'Platten/Fliesen']);
  const [heatingSystem, setHeatingSystem] = useState<string>('Wärmepumpe');
  const [heatDistribution, setHeatDistribution] = useState<string>('Fussbodenheizung');
  const [hasElevator, setHasElevator] = useState<boolean>(true);
  const [isWheelchairAccessible, setIsWheelchairAccessible] = useState<boolean>(false);

  // 5. Parkmöglichkeiten
  const [hasGarageUnderground, setHasGarageUnderground] = useState<boolean>(false);
  const [garageUndergroundCount, setGarageUndergroundCount] = useState<number>(1);
  const [garageUndergroundNumber, setGarageUndergroundNumber] = useState<string>('');
  const [garageUndergroundPrice, setGarageUndergroundPrice] = useState<number | ''>(150);

  const [hasOutdoorParking, setHasOutdoorParking] = useState<boolean>(false);
  const [outdoorParkingCount, setOutdoorParkingCount] = useState<number>(1);
  const [outdoorParkingNumber, setOutdoorParkingNumber] = useState<string>('');
  const [outdoorParkingPrice, setOutdoorParkingPrice] = useState<number | ''>(80);

  const [hasSingleGarage, setHasSingleGarage] = useState<boolean>(false);
  const [singleGarageCount, setSingleGarageCount] = useState<number>(1);
  const [singleGarageNumber, setSingleGarageNumber] = useState<string>('');
  const [singleGaragePrice, setSingleGaragePrice] = useState<number | ''>(200);

  // 6. Finanzielles & Konditionen
  const [netRent, setNetRent] = useState<number | ''>(2200);
  const [serviceCharges, setServiceCharges] = useState<number | ''>(250);
  const [depositMonths, setDepositMonths] = useState<'2' | '3'>('3');
  const [depositType, setDepositType] = useState<string>('both'); // sparkonto, versicherung, both

  // 7. Verfügbarkeit & Mieterprofil
  const [availableFrom, setAvailableFrom] = useState<string>('Nach Absprache');
  const [minLeaseDuration, setMinLeaseDuration] = useState<string>('1 Jahr');
  const [petsAllowed, setPetsAllowed] = useState<string>('nach_absprache');
  const [smokingPolicy, setSmokingPolicy] = useState<string>('non_smoker_preferred');
  const [targetTenants, setTargetTenants] = useState<string[]>(['Einzelperson', 'Paar']);
  const [flatshareAllowed, setFlatshareAllowed] = useState<string>('nein');

  // 8. Besichtigung & Schlüssel
  const [isOccupied, setIsOccupied] = useState<boolean>(false);
  const [occupiedBy, setOccupiedBy] = useState<string>('');
  const [keyHandoverMode, setKeyHandoverMode] = useState<string>('present');
  const [keyCount, setKeyCount] = useState<number | ''>(2);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Total parking rent calculation
  const totalParkingRent = useMemo(() => {
    let sum = 0;
    if (hasGarageUnderground && typeof garageUndergroundPrice === 'number') {
      sum += garageUndergroundPrice * (garageUndergroundCount || 1);
    }
    if (hasOutdoorParking && typeof outdoorParkingPrice === 'number') {
      sum += outdoorParkingPrice * (outdoorParkingCount || 1);
    }
    if (hasSingleGarage && typeof singleGaragePrice === 'number') {
      sum += singleGaragePrice * (singleGarageCount || 1);
    }
    return sum;
  }, [
    hasGarageUnderground,
    garageUndergroundPrice,
    garageUndergroundCount,
    hasOutdoorParking,
    outdoorParkingPrice,
    outdoorParkingCount,
    hasSingleGarage,
    singleGaragePrice,
    singleGarageCount,
  ]);

  // Live total gross rent calculation
  const totalGrossRent = useMemo(() => {
    const net = typeof netRent === 'number' ? netRent : 0;
    const nk = typeof serviceCharges === 'number' ? serviceCharges : 0;
    return net + nk + totalParkingRent;
  }, [netRent, serviceCharges, totalParkingRent]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?page=objektauflage`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !ownerEmail.trim()) {
      setErrorMessage(
        language === 'de'
          ? 'Bitte geben Sie Name und E-Mail-Adresse des Eigentümers an.'
          : 'Please enter the owner name and email address.'
      );
      return;
    }
    if (!propertyStreet.trim() || !propertyZipCity.trim()) {
      setErrorMessage(
        language === 'de'
          ? 'Bitte geben Sie Strasse, Hausnummer sowie PLZ und Ort der Liegenschaft an.'
          : 'Please enter street, house number, and postal code/city of the property.'
      );
      return;
    }
    if (!acceptTerms) {
      setErrorMessage(
        language === 'de'
          ? 'Bitte bestätigen Sie die Richtigkeit der Angaben und den Datenschutz.'
          : 'Please confirm that the data is accurate and accept data privacy terms.'
      );
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const generatedRef = `VERACY-AUFLAGE-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(generatedRef);

    // Build structured property details map for the email
    const propertyDetails: Record<string, string | number | undefined> = {
      'Referenznummer': generatedRef,
      // 1. Stammdaten
      '1. Eigentümer: Name / Vorname': ownerName,
      '1. Eigentümer: Adresse': ownerAddress || 'Nicht angegeben',
      '1. Eigentümer: Telefon': ownerPhone || 'Nicht angegeben',
      '1. Eigentümer: E-Mail': ownerEmail,
      '1. Eigentümer: Bankverbindung (IBAN)': ownerIban || 'Wird nachgereicht',
      '1. Eigentümer: Auskunftsperson':
        contactPersonType === 'owner'
          ? 'Eigentümer direkt'
          : `Vertretung: ${representativeDetails || 'Ja'}`,

      // 2. Objektadresse
      '2. Objekt: Strasse, Hausnummer': propertyStreet,
      '2. Objekt: PLZ, Ort': propertyZipCity,
      '2. Objekt: Stockwerk / Lage': `${floorLevel} (${floorPosition})${customFloor ? ` / ${customFloor}` : ''}`,
      '2. Objekt: Baujahr / Letzte Sanierung': `Baujahr: ${yearBuilt || 'unbekannt'} | Letzte Sanierung: ${yearRenovated || 'keine'} (${renovationDetails || 'k.A.'})`,

      // 3. Eckdaten
      '3. Eckdaten: Wohnfläche': `${livingArea} m²`,
      '3. Eckdaten: Anzahl Zimmer': `${roomCount} Zimmer`,
      '3. Eckdaten: Nasszellen': bathrooms.length > 0 ? bathrooms.join(', ') : 'Keine Angabe',
      '3. Eckdaten: Balkon / Terrasse / Garten':
        outdoorSpaces.length > 0
          ? `${outdoorSpaces.join(', ')} (Balkon: ${balconyArea || '-'} m², Terrasse: ${terraceArea || '-'} m²)`
          : 'Kein Aussenbereich',
      '3. Eckdaten: Keller / Estrich': `Keller-Nr: ${basementNr || '-'} | Estrich-Nr: ${atticNr || '-'}`,
      '3. Eckdaten: Waschmöglichkeiten':
        laundrySetup === 'in_unit'
          ? 'Eigene Waschmaschine / Tumbler in Wohnung'
          : laundrySetup === 'shared'
          ? 'Gemeinsame Waschküche mit Dienstplan / Secomat'
          : 'Anschlüsse in Wohnung (Geräte Mietersache)',

      // 4. Ausstattung
      '4. Ausstattung: Küche': kitchenAppliances.length > 0 ? kitchenAppliances.join(', ') : 'Standard',
      '4. Ausstattung: Bodenbeläge': flooring.length > 0 ? flooring.join(', ') : 'Standard',
      '4. Ausstattung: Heizsystem': `${heatingSystem} (${heatDistribution})`,
      '4. Ausstattung: Lift': hasElevator ? 'Ja' : 'Nein',
      '4. Ausstattung: Rollstuhlgängig': isWheelchairAccessible ? 'Ja' : 'Nein',

      // 5. Parkieren
      '5. Parkieren: Einstellplatz / Tiefgarage': hasGarageUnderground
        ? `${garageUndergroundCount}x (Platz-Nr: ${garageUndergroundNumber || '-'}) zu CHF ${garageUndergroundPrice || 0}.-/Mt.`
        : 'Nein',
      '5. Parkieren: Aussenabstellplatz': hasOutdoorParking
        ? `${outdoorParkingCount}x (Platz-Nr: ${outdoorParkingNumber || '-'}) zu CHF ${outdoorParkingPrice || 0}.-/Mt.`
        : 'Nein',
      '5. Parkieren: Einzelgarage': hasSingleGarage
        ? `${singleGarageCount}x (Platz-Nr: ${singleGarageNumber || '-'}) zu CHF ${singleGaragePrice || 0}.-/Mt.`
        : 'Nein',
      '5. Parkieren: Total Parkplatzmiete': `CHF ${totalParkingRent}.- / Mt.`,

      // 6. Finanzielles
      '6. Finanzen: Nettomietzins / Monat': `CHF ${typeof netRent === 'number' ? netRent.toLocaleString('de-CH') : 0}.-`,
      '6. Finanzen: Heiz- & Nebenkosten (Akconto)': `CHF ${typeof serviceCharges === 'number' ? serviceCharges.toLocaleString('de-CH') : 0}.-`,
      '6. Finanzen: BRUTTOMIETZINS GESAMT': `CHF ${totalGrossRent.toLocaleString('de-CH')}.- / Monat`,
      '6. Finanzen: Mietkaution': `${depositMonths} Monatsmieten`,
      '6. Finanzen: Kautionsform':
        depositType === 'sparkonto'
          ? 'Kautionssparkonto'
          : depositType === 'versicherung'
          ? 'Kautionsversicherung (SwissCaution etc.)'
          : 'Sparkonto oder Kautionsversicherung zulässig',

      // 7. Verfügbarkeit
      '7. Konditionen: Bezugsbereit ab': availableFrom,
      '7. Konditionen: Mindestmietdauer': minLeaseDuration,
      '7. Konditionen: Haustiere':
        petsAllowed === 'ja' ? 'Ja' : petsAllowed === 'nein' ? 'Nein' : 'Nach Absprache (Hund/Katze)',
      '7. Konditionen: Rauchen':
        smokingPolicy === 'non_smoker_preferred' ? 'Nichtraucher bevorzugt' : 'Egal',
      '7. Konditionen: Zielgruppe / Mieterprofil': `${targetTenants.join(', ')} | WG erlaubt: ${flatshareAllowed}`,

      // 8. Besichtigung
      '8. Besichtigung: Aktuell bewohnt': isOccupied
        ? `Ja (durch: ${occupiedBy || 'Mieter'})`
        : 'Nein (Liegenschaft ist leerstehend)',
      '8. Besichtigung: Schlüsselübergabe für Makler':
        keyHandoverMode === 'present'
          ? 'Eigentümer/Vertretung ist bei Besichtigungen anwesend'
          : keyHandoverMode === 'keys_given'
          ? `Schlüssel an Veracy übergeben (${keyCount || 2} Stück)`
          : 'Schlüsseltresor / Schlüsselkasten vor Ort',
      'Zusätzliche Bemerkungen': additionalNotes || 'Keine zusätzlichen Anmerkungen angegeben.',
    };

    await sendEmailInquiry({
      formType: 'Objektauflage Vermietungsmandat',
      subject: `Objektauflage Vermietung: ${propertyStreet}, ${propertyZipCity} – ${ownerName} (Ref: ${generatedRef})`,
      name: ownerName,
      email: ownerEmail,
      phone: ownerPhone,
      location: `${propertyStreet}, ${propertyZipCity}`,
      interest: `Objektauflage Vermietung (${roomCount} Zi., ${livingArea} m² – Brutto CHF ${totalGrossRent}.-)`,
      message: additionalNotes,
      propertyDetails,
    });

    trackEvent('objektauflage_submitted', {
      reference_id: generatedRef,
      property_location: `${propertyStreet}, ${propertyZipCity}`,
      gross_rent: totalGrossRent,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setOwnerName('');
    setOwnerAddress('');
    setOwnerPhone('');
    setOwnerEmail('');
    setOwnerIban('');
    setPropertyStreet('');
    setPropertyZipCity('');
    setAdditionalNotes('');
  };

  return (
    <div className="bg-neutral-50 min-h-screen text-neutral-900 pb-20">
      {/* Discreet Link Sharing Bar for the agent / owner */}
      <div className="bg-neutral-900 text-neutral-300 border-b border-neutral-800 text-xs py-2.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-neutral-400">
            <Info className="w-3.5 h-3.5 text-[#DFB76C] shrink-0" />
            <span>
              {language === 'de'
                ? 'Direktlink für Eigentümer: Dieser Erfassungsbogen ist diskret und nicht in der Hauptnavigation verlinkt.'
                : 'Direct link for property owners: This mandate sheet is not advertised in main public navigation.'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-[#E6CA85] hover:text-white rounded text-[11px] font-semibold transition-colors cursor-pointer shrink-0 border border-neutral-700"
          >
            {copiedLink ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{language === 'de' ? 'Link kopiert!' : 'Link copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{language === 'de' ? 'Direktlink kopieren' : 'Copy Direct Link'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <header className="bg-neutral-950 text-white py-12 sm:py-16 border-b border-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E6CA85] font-semibold mb-3">
            <span>VERACY IMMOBILIEN GMBH</span>
            <span aria-hidden="true" className="text-neutral-500">·</span>
            <span>{language === 'de' ? 'VERMIETUNGSMANDAT' : 'RENTAL MANDATE'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-normal font-display tracking-tight text-white leading-tight">
            {language === 'de'
              ? 'Objektauflage – Liegenschaftserfassung'
              : 'Property Specification Sheet – Rental Mandate'}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-300 font-light max-w-2xl leading-relaxed">
            {language === 'de'
              ? 'Vollständige Objektaufnahme zur Erstellung eines professionellen Exposés, zielgerichteter Vermarktung auf allen Schweizer Portalen und rechtssicherer Mietvertragsabwicklung nach OR.'
              : 'Complete property data capture for professional marketing across top Swiss portals and legally compliant tenancy agreements under Swiss Code of Obligations.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-neutral-400 border-t border-neutral-800/80 pt-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#DFB76C]" />
              <span>{language === 'de' ? 'Vertraulich & geschützt' : 'Confidential & Secure'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#DFB76C]" />
              <span>{language === 'de' ? 'Dauer: ca. 4–6 Minuten' : 'Time: approx. 4–6 mins'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#DFB76C]" />
              <span>{language === 'de' ? 'Automatische E-Mail-Bestätigung' : 'Instant Email Notification'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="objektauflage-form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* SECTION 1: STAMMDATEN EIGENTÜMER */}
              <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>{language === 'de' ? 'Stammdaten Eigentümer' : 'Owner Details'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Wer ist Auftraggeber & Eigentümer?' : 'Owner & Client Information'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {language === 'de'
                    ? 'Angaben zur Person für das Mandatsverhältnis und die Mietvertragserstellung.'
                    : 'Personal details for the brokerage mandate and future lease agreement.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Name / Vorname *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="z.B. Beat Meier"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Wohnadresse (Strasse, PLZ, Ort)' : 'Owner Address (Street, ZIP, City)'}
                    </label>
                    <input
                      type="text"
                      value={ownerAddress}
                      onChange={(e) => setOwnerAddress(e.target.value)}
                      placeholder="z.B. Seestrasse 14, 8700 Küsnacht"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Telefon / Mobil *' : 'Phone / Mobile *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="+41 76 588 69 89"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'E-Mail-Adresse *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="b.meier@beispiel.ch"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Bankverbindung (IBAN für Mietzinsüberweisung)' : 'Bank Account (IBAN for Rental Payments)'}
                    </label>
                    <input
                      type="text"
                      value={ownerIban}
                      onChange={(e) => setOwnerIban(e.target.value)}
                      placeholder="CH93 0076 2011 6238 5295 7"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900 font-mono"
                    />
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      {language === 'de' ? 'Kann auch später vor Mietvertragsabschluss nachgereicht werden.' : 'Can also be provided prior to lease signing.'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Auskunftsperson' : 'Contact Person'}
                    </label>
                    <div className="flex gap-4 mb-2">
                      <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                        <input
                          type="radio"
                          name="contactPersonType"
                          checked={contactPersonType === 'owner'}
                          onChange={() => setContactPersonType('owner')}
                          className="accent-[#C5A059]"
                        />
                        <span>{language === 'de' ? 'Eigentümer direkt' : 'Owner directly'}</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                        <input
                          type="radio"
                          name="contactPersonType"
                          checked={contactPersonType === 'representative'}
                          onChange={() => setContactPersonType('representative')}
                          className="accent-[#C5A059]"
                        />
                        <span>{language === 'de' ? 'Vertretung / Verwalter' : 'Representative / Manager'}</span>
                      </label>
                    </div>
                    {contactPersonType === 'representative' && (
                      <input
                        type="text"
                        value={representativeDetails}
                        onChange={(e) => setRepresentativeDetails(e.target.value)}
                        placeholder={language === 'de' ? 'Name & Telefon der Vertretung' : 'Name & phone of representative'}
                        className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900 mt-1"
                      />
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 2: OBJEKTADRESSE & LAGE */}
              <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>{language === 'de' ? 'Objektadresse & Lage' : 'Property Location'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Wo befindet sich die Liegenschaft?' : 'Where is the property situated?'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Strasse, Hausnummer *' : 'Street, House Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={propertyStreet}
                      onChange={(e) => setPropertyStreet(e.target.value)}
                      placeholder="z.B. Rainstrasse 35"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'PLZ, Ort *' : 'Postal Code, City *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={propertyZipCity}
                      onChange={(e) => setPropertyZipCity(e.target.value)}
                      placeholder="z.B. 5415 Nussbaumen oder 8001 Zürich"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                </div>

                {/* Stockwerk & Lage */}
                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    {language === 'de' ? 'Stockwerk & Ausrichtung' : 'Floor Level & Position'}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['EG / Erdgeschoss', '1. OG', '2. OG', '3. OG', '4. OG', 'Attika / Dachwohnung', 'Souterrain / UG'].map((floor) => (
                      <button
                        type="button"
                        key={floor}
                        onClick={() => setFloorLevel(floor)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          floorLevel === floor
                            ? 'bg-[#C5A059] text-neutral-950 font-semibold border-[#C5A059]'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {floor}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-neutral-500">{language === 'de' ? 'Lage im Gebäude:' : 'Position:'}</span>
                    {['Links', 'Rechts', 'Mitte', 'Ganzes Geschoss'].map((pos) => (
                      <button
                        type="button"
                        key={pos}
                        onClick={() => setFloorPosition(pos)}
                        className={`px-2.5 py-1 rounded text-xs border transition-colors cursor-pointer ${
                          floorPosition === pos
                            ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                    <input
                      type="text"
                      value={customFloor}
                      onChange={(e) => setCustomFloor(e.target.value)}
                      placeholder={language === 'de' ? 'Zusatz (z.B. Lift direkt in Wohnung)' : 'Additional note'}
                      className="px-3 py-1 text-xs rounded border border-neutral-300 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#C5A059] flex-1 min-w-[200px]"
                    />
                  </div>
                </div>

                {/* Baujahr & Renovation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Baujahr Liegenschaft' : 'Year Built'}
                    </label>
                    <input
                      type="text"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      placeholder="z.B. 2012"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Letzte Sanierung (Jahr)' : 'Last Renovation (Year)'}
                    </label>
                    <input
                      type="text"
                      value={yearRenovated}
                      onChange={(e) => setYearRenovated(e.target.value)}
                      placeholder="z.B. 2023"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Was wurde saniert?' : 'Scope of Renovation'}
                    </label>
                    <input
                      type="text"
                      value={renovationDetails}
                      onChange={(e) => setRenovationDetails(e.target.value)}
                      placeholder="z.B. Neue Küche, Parkett, Bäder"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 3: ECKDATEN ZUR WOHNUNG */}
              <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>{language === 'de' ? 'Eckdaten zur Wohnung' : 'Apartment Specifications'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Dimensionen & Raumeinteilung' : 'Dimensions & Room Layout'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Wohnfläche (Nettowohnfläche in m²) *' : 'Living Area (Net m²) *'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        value={livingArea}
                        onChange={(e) => setLivingArea(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="85"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900 font-mono"
                      />
                      <span className="absolute right-3.5 top-2.5 text-xs text-neutral-400 font-semibold pointer-events-none">
                        m²
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Anzahl Zimmer *' : 'Number of Rooms *'}
                    </label>
                    <select
                      value={roomCount}
                      onChange={(e) => setRoomCount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    >
                      <option value="1.0">1.0 Zimmer (Studio)</option>
                      <option value="1.5">1.5 Zimmer</option>
                      <option value="2.0">2.0 Zimmer</option>
                      <option value="2.5">2.5 Zimmer</option>
                      <option value="3.0">3.0 Zimmer</option>
                      <option value="3.5">3.5 Zimmer</option>
                      <option value="4.0">4.0 Zimmer</option>
                      <option value="4.5">4.5 Zimmer</option>
                      <option value="5.0">5.0 Zimmer</option>
                      <option value="5.5">5.5 Zimmer</option>
                      <option value="6.5+">6.5+ Zimmer</option>
                    </select>
                  </div>
                </div>

                {/* Nasszellen & Bäder */}
                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    {language === 'de' ? 'Nasszellen (Bäder / WC)' : 'Bathrooms & Toilets'}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {['Bad/WC (Badewanne)', 'Dusche/WC', 'Separates Gäste-WC', 'Doppellavabo', 'En-Suite Badezimmer'].map((bath) => (
                      <button
                        type="button"
                        key={bath}
                        onClick={() => toggleArrayItem(bathrooms, setBathrooms, bath)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          bathrooms.includes(bath)
                            ? 'bg-[#FAF6EE] text-[#8C6D1F] border-[#C5A059]'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {bathrooms.includes(bath) && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                        <span>{bath}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Balkon / Terrasse / Garten */}
                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    {language === 'de' ? 'Aussenbereiche' : 'Outdoor Spaces'}
                  </label>
                  <div className="flex flex-wrap gap-2.5 mb-3">
                    {['Balkon', 'Terrasse', 'Gartenanteil (privat)', 'Wintergarten / Verglast', 'Kein Aussenbereich'].map((space) => (
                      <button
                        type="button"
                        key={space}
                        onClick={() => toggleArrayItem(outdoorSpaces, setOutdoorSpaces, space)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          outdoorSpaces.includes(space)
                            ? 'bg-[#FAF6EE] text-[#8C6D1F] border-[#C5A059]'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {outdoorSpaces.includes(space) && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                        <span>{space}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {outdoorSpaces.includes('Balkon') && (
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                          {language === 'de' ? 'Balkonfläche (ca. m²):' : 'Balcony Size (m²):'}
                        </label>
                        <input
                          type="text"
                          value={balconyArea}
                          onChange={(e) => setBalconyArea(e.target.value)}
                          placeholder="z.B. 12 m²"
                          className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white"
                        />
                      </div>
                    )}
                    {outdoorSpaces.includes('Terrasse') && (
                      <div>
                        <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                          {language === 'de' ? 'Terrassenfläche (ca. m²):' : 'Terrace Size (m²):'}
                        </label>
                        <input
                          type="text"
                          value={terraceArea}
                          onChange={(e) => setTerraceArea(e.target.value)}
                          placeholder="z.B. 25 m²"
                          className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Keller, Estrich & Waschen */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Keller-Nummer' : 'Basement Unit #'}
                    </label>
                    <input
                      type="text"
                      value={basementNr}
                      onChange={(e) => setBasementNr(e.target.value)}
                      placeholder="z.B. K04"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Estrich / Dachboden' : 'Attic Storage #'}
                    </label>
                    <input
                      type="text"
                      value={atticNr}
                      onChange={(e) => setAtticNr(e.target.value)}
                      placeholder="z.B. E02 oder keines"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Waschmöglichkeiten' : 'Laundry Facilities'}
                    </label>
                    <select
                      value={laundrySetup}
                      onChange={(e) => setLaundrySetup(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white text-neutral-800"
                    >
                      <option value="in_unit">Eigener Waschturm in der Wohnung</option>
                      <option value="shared">Gem. Waschküche mit Plan / Secomat</option>
                      <option value="hookup_only">Anschlüsse in Whg. vorhanden</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* SECTION 4: AUSSTATTUNG & ZUSTAND */}
              <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">4</span>
                  <span>{language === 'de' ? 'Ausstattung & Zustand' : 'Fixtures & Condition'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Geräte, Böden & Haustechnik' : 'Appliances, Flooring & Heating'}
                </h2>

                {/* Küche */}
                <div className="mt-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    {language === 'de' ? 'Küche & Geräte' : 'Kitchen Appliances'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Glaskeramik',
                      'Induktion',
                      'Geschirrspüler',
                      'Backofen',
                      'Steamer / Dampfgarer',
                      'Grosser Kühlschrank / Tiefkühler',
                      'Granitabdeckung',
                      'Kochinsel',
                    ].map((app) => (
                      <button
                        type="button"
                        key={app}
                        onClick={() => toggleArrayItem(kitchenAppliances, setKitchenAppliances, app)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          kitchenAppliances.includes(app)
                            ? 'bg-[#FAF6EE] text-[#8C6D1F] border-[#C5A059]'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {kitchenAppliances.includes(app) && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                        <span>{app}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bodenbeläge */}
                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    {language === 'de' ? 'Bodenbeläge' : 'Flooring'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Parkett', 'Laminat', 'Platten/Fliesen', 'Vinyl / Designbelag', 'Teppich', 'Sichtbeton'].map((fl) => (
                      <button
                        type="button"
                        key={fl}
                        onClick={() => toggleArrayItem(flooring, setFlooring, fl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          flooring.includes(fl)
                            ? 'bg-[#FAF6EE] text-[#8C6D1F] border-[#C5A059]'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {flooring.includes(fl) && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                        <span>{fl}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Heizsystem & Bauphysik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Heizsystem' : 'Heating System'}
                    </label>
                    <select
                      value={heatingSystem}
                      onChange={(e) => setHeatingSystem(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    >
                      <option value="Wärmepumpe">Wärmepumpe (Erdsonde / Luft-Wasser)</option>
                      <option value="Fernwärme">Fernwärme</option>
                      <option value="Gasheizung">Gas</option>
                      <option value="Ölheizung">Öl</option>
                      <option value="Pellet / Holz">Pellet / Holz</option>
                      <option value="Andere">Andere / Nicht sicher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Wärmeabgabe' : 'Heat Distribution'}
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {['Fussbodenheizung', 'Radiatoren'].map((dist) => (
                        <button
                          type="button"
                          key={dist}
                          onClick={() => setHeatDistribution(dist)}
                          className={`py-2 px-3 text-xs rounded-lg border font-medium cursor-pointer transition-colors ${
                            heatDistribution === dist
                              ? 'bg-[#FAF6EE] text-[#8C6D1F] border-[#C5A059] font-bold'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          {dist}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lift & Barrierefreiheit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-neutral-100">
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-neutral-900">
                        {language === 'de' ? 'Personenlift vorhanden' : 'Elevator Available'}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {language === 'de' ? 'Direkter Zugang zur Wohnetage' : 'Direct elevator access'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setHasElevator(true)}
                        className={`px-3 py-1 rounded text-xs font-medium border cursor-pointer ${
                          hasElevator ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200'
                        }`}
                      >
                        Ja
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasElevator(false)}
                        className={`px-3 py-1 rounded text-xs font-medium border cursor-pointer ${
                          !hasElevator ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200'
                        }`}
                      >
                        Nein
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-neutral-900">
                        {language === 'de' ? 'Behindertengerecht / Rollstuhlgängig' : 'Wheelchair Accessible'}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {language === 'de' ? 'Stufenloser Zugang zur Wohnung' : 'Stepless access into apartment'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsWheelchairAccessible(true)}
                        className={`px-3 py-1 rounded text-xs font-medium border cursor-pointer ${
                          isWheelchairAccessible ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200'
                        }`}
                      >
                        Ja
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsWheelchairAccessible(false)}
                        className={`px-3 py-1 rounded text-xs font-medium border cursor-pointer ${
                          !isWheelchairAccessible ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-600 border-neutral-200'
                        }`}
                      >
                        Nein
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 5: PARKMÖGLICHKEITEN */}
              <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">5</span>
                  <span>{language === 'de' ? 'Parkmöglichkeiten' : 'Parking'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Garagen & Aussenparkplätze' : 'Garage & Outdoor Parking Spaces'}
                </h2>

                <div className="space-y-4 mt-6">
                  {/* Tiefgarage */}
                  <div className={`p-4 rounded-lg border transition-all ${hasGarageUnderground ? 'bg-[#FAF6EE] border-[#C5A059]' : 'bg-neutral-50 border-neutral-200'}`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasGarageUnderground}
                        onChange={(e) => setHasGarageUnderground(e.target.checked)}
                        className="accent-[#C5A059] w-4 h-4"
                      />
                      <span className="font-semibold text-sm text-neutral-900">
                        {language === 'de' ? 'Einstellhallenplatz / Tiefgarage' : 'Underground Parking Space'}
                      </span>
                    </label>

                    {hasGarageUnderground && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#EBDCB7]">
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-700 mb-1">Anzahl:</label>
                          <input
                            type="number"
                            min={1}
                            value={garageUndergroundCount}
                            onChange={(e) => setGarageUndergroundCount(Number(e.target.value))}
                            className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-700 mb-1">Platz-Nr.:</label>
                          <input
                            type="text"
                            value={garageUndergroundNumber}
                            onChange={(e) => setGarageUndergroundNumber(e.target.value)}
                            placeholder="z.B. Nr. 12"
                            className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-700 mb-1">Mietpreis / Mt. (CHF):</label>
                          <input
                            type="number"
                            value={garageUndergroundPrice}
                            onChange={(e) => setGarageUndergroundPrice(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="150"
                            className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Aussenparkplatz */}
                  <div className={`p-4 rounded-lg border transition-all ${hasOutdoorParking ? 'bg-[#FAF6EE] border-[#C5A059]' : 'bg-neutral-50 border-neutral-200'}`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasOutdoorParking}
                        onChange={(e) => setHasOutdoorParking(e.target.checked)}
                        className="accent-[#C5A059] w-4 h-4"
                      />
                      <span className="font-semibold text-sm text-neutral-900">
                        {language === 'de' ? 'Aussenabstellplatz' : 'Outdoor Parking Space'}
                      </span>
                    </label>

                    {hasOutdoorParking && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#EBDCB7]">
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-700 mb-1">Anzahl:</label>
                          <input
                            type="number"
                            min={1}
                            value={outdoorParkingCount}
                            onChange={(e) => setOutdoorParkingCount(Number(e.target.value))}
                            className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-700 mb-1">Platz-Nr.:</label>
                          <input
                            type="text"
                            value={outdoorParkingNumber}
                            onChange={(e) => setOutdoorParkingNumber(e.target.value)}
                            placeholder="z.B. AP 03"
                            className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-700 mb-1">Mietpreis / Mt. (CHF):</label>
                          <input
                            type="number"
                            value={outdoorParkingPrice}
                            onChange={(e) => setOutdoorParkingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="80"
                            className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Einzelgarage */}
                  <div className={`p-4 rounded-lg border transition-all ${hasSingleGarage ? 'bg-[#FAF6EE] border-[#C5A059]' : 'bg-neutral-50 border-neutral-200'}`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasSingleGarage}
                        onChange={(e) => setHasSingleGarage(e.target.checked)}
                        className="accent-[#C5A059] w-4 h-4"
                      />
                      <span className="font-semibold text-sm text-neutral-900">
                        {language === 'de' ? 'Garage (Einzelgarage)' : 'Lock-up Single Garage'}
                      </span>
                    </label>

                    {hasSingleGarage && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#EBDCB7]">
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-700 mb-1">Anzahl:</label>
                          <input
                            type="number"
                            min={1}
                            value={singleGarageCount}
                            onChange={(e) => setSingleGarageCount(Number(e.target.value))}
                            className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-700 mb-1">Platz- / Box-Nr.:</label>
                          <input
                            type="text"
                            value={singleGarageNumber}
                            onChange={(e) => setSingleGarageNumber(e.target.value)}
                            placeholder="z.B. Box 2"
                            className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-700 mb-1">Mietpreis / Mt. (CHF):</label>
                          <input
                            type="number"
                            value={singleGaragePrice}
                            onChange={(e) => setSingleGaragePrice(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="200"
                            className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 6: FINANZIELLES & CONDICIONES */}
              <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">6</span>
                  <span>{language === 'de' ? 'Finanzielles & Condiciones' : 'Financial Parameters'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Mietzinsaufstellung & Kaution' : 'Rent Structure & Deposit'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Nettomietzins / Monat (CHF) *' : 'Net Rent / Month (CHF) *'}
                    </label>
                    <input
                      type="number"
                      required
                      step={10}
                      value={netRent}
                      onChange={(e) => setNetRent(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="2200"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Heiz- und Nebenkosten (Akconto) *' : 'Service Charges / Utilities (CHF) *'}
                    </label>
                    <input
                      type="number"
                      required
                      step={10}
                      value={serviceCharges}
                      onChange={(e) => setServiceCharges(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="250"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Parkplatzmiete / Monat (CHF)' : 'Parking Fee / Month (CHF)'}
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={`CHF ${totalParkingRent}.-`}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-200 text-sm bg-neutral-100 text-neutral-700 font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Gross rent total card */}
                <div className="mt-5 p-5 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#C5A059]/40">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E6CA85]">
                      {language === 'de' ? 'Berechneter Gesamtmietzins' : 'Total Gross Rent'}
                    </span>
                    <div className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
                      BRUTTOMIETZINS GESAMT
                    </div>
                    <p className="text-xs text-neutral-400 font-light mt-0.5">
                      {language === 'de' ? 'Inklusive Nebenkostenakconto & Parkplatzmiete' : 'Inclusive of service charges and parking'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-[#E6CA85]">
                      CHF {totalGrossRent.toLocaleString('de-CH')}.-
                    </span>
                    <span className="block text-[11px] text-neutral-400">/ Monat</span>
                  </div>
                </div>

                {/* Mietkaution */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                      {language === 'de' ? 'Mietkaution (Sicherheitsleistung)' : 'Security Deposit'}
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setDepositMonths('2')}
                        className={`flex-1 py-2 px-3 text-xs rounded-lg border font-medium cursor-pointer transition-colors ${
                          depositMonths === '2'
                            ? 'bg-[#FAF6EE] text-[#8C6D1F] border-[#C5A059] font-bold'
                            : 'bg-white text-neutral-700 border-neutral-200'
                        }`}
                      >
                        2 Monatsmieten
                      </button>
                      <button
                        type="button"
                        onClick={() => setDepositMonths('3')}
                        className={`flex-1 py-2 px-3 text-xs rounded-lg border font-medium cursor-pointer transition-colors ${
                          depositMonths === '3'
                            ? 'bg-[#FAF6EE] text-[#8C6D1F] border-[#C5A059] font-bold'
                            : 'bg-white text-neutral-700 border-neutral-200'
                        }`}
                      >
                        3 Monatsmieten (üblich)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                      {language === 'de' ? 'Akzeptierte Kautionsform' : 'Accepted Deposit Type'}
                    </label>
                    <select
                      value={depositType}
                      onChange={(e) => setDepositType(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-neutral-300 bg-white text-neutral-900"
                    >
                      <option value="both">Kautionssparkonto oder Kautionsversicherung (SwissCaution etc.)</option>
                      <option value="sparkonto">Nur klassisches Bankkautionskonto</option>
                      <option value="versicherung">Nur Kautionsversicherung</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* SECTION 7: VERFÜGBARKEIT & MIETERPROFIL */}
              <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">7</span>
                  <span>{language === 'de' ? 'Verfügbarkeit & Mieterprofil' : 'Availability & Tenant Profile'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Bezugstermin & Kriterien' : 'Timeline & Tenant Criteria'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Bezugsbereit ab (Verfügbarkeit) *' : 'Available From *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                      placeholder="z.B. per sofort, 1. Mai 2026 oder nach Vereinbarung"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Mindestmietdauer' : 'Minimum Lease Duration'}
                    </label>
                    <div className="flex gap-2">
                      {['1 Jahr', '2 Jahre', 'Unbefristet'].map((dur) => (
                        <button
                          type="button"
                          key={dur}
                          onClick={() => setMinLeaseDuration(dur)}
                          className={`flex-1 py-2 px-2 text-xs rounded-lg border font-medium cursor-pointer transition-colors ${
                            minLeaseDuration === dur
                              ? 'bg-[#FAF6EE] text-[#8C6D1F] border-[#C5A059] font-bold'
                              : 'bg-white text-neutral-700 border-neutral-200'
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Haustiere erlaubt?' : 'Pets Allowed?'}
                    </label>
                    <select
                      value={petsAllowed}
                      onChange={(e) => setPetsAllowed(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                    >
                      <option value="nach_absprache">Nach Absprache (z.B. Katze/kleiner Hund)</option>
                      <option value="ja">Ja, Haustiere grundsätzlich erlaubt</option>
                      <option value="nein">Nein, keine Haustiere</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Rauchen in der Wohnung' : 'Smoking Policy'}
                    </label>
                    <select
                      value={smokingPolicy}
                      onChange={(e) => setSmokingPolicy(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                    >
                      <option value="non_smoker_preferred">Nichtraucher bevorzugt</option>
                      <option value="egal">Egal / Nur auf Balkon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Wohngemeinschaft (WG) erlaubt?' : 'Flatshare / WG Allowed?'}
                    </label>
                    <select
                      value={flatshareAllowed}
                      onChange={(e) => setFlatshareAllowed(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                    >
                      <option value="nein">Nein (nur Einzel/Paar/Familie)</option>
                      <option value="ja">Ja, ruhige 2er-WG denkbar</option>
                    </select>
                  </div>
                </div>

                {/* Zielgruppe */}
                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    {language === 'de' ? 'Gewünschte Zielgruppe' : 'Target Tenant Profile'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Einzelperson', 'Paar', 'Familie mit Kind(ern)', 'Wochenaufenthalter / Expats', 'Senioren'].map((tgt) => (
                      <button
                        type="button"
                        key={tgt}
                        onClick={() => toggleArrayItem(targetTenants, setTargetTenants, tgt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          targetTenants.includes(tgt)
                            ? 'bg-[#FAF6EE] text-[#8C6D1F] border-[#C5A059]'
                            : 'bg-white text-neutral-600 border-neutral-200'
                        }`}
                      >
                        {targetTenants.includes(tgt) && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                        <span>{tgt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 8: BESICHTIGUNG & SCHLÜSSEL */}
              <section className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">8</span>
                  <span>{language === 'de' ? 'Besichtigung & Schlüssel' : 'Viewing & Access'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Zugang & Schlüsselübergabe' : 'Property Access & Key Handover'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {/* Aktuell bewohnt */}
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                      {language === 'de' ? 'Objekt aktuell bewohnt?' : 'Is Property Currently Occupied?'}
                    </label>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setIsOccupied(false)}
                        className={`flex-1 py-1.5 px-3 text-xs rounded border font-medium cursor-pointer ${
                          !isOccupied ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'
                        }`}
                      >
                        Nein (Leerstehend)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsOccupied(true)}
                        className={`flex-1 py-1.5 px-3 text-xs rounded border font-medium cursor-pointer ${
                          isOccupied ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200'
                        }`}
                      >
                        Ja (Bewohnt)
                      </button>
                    </div>
                    {isOccupied && (
                      <input
                        type="text"
                        value={occupiedBy}
                        onChange={(e) => setOccupiedBy(e.target.value)}
                        placeholder="z.B. Vormieter Fam. Keller, Tel. 079 ..."
                        className="w-full px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white"
                      />
                    )}
                  </div>

                  {/* Schlüsselübergabe */}
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                      {language === 'de' ? 'Schlüssel für Makler' : 'Keys for Broker'}
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                        <input
                          type="radio"
                          name="keyMode"
                          checked={keyHandoverMode === 'keys_given'}
                          onChange={() => setKeyHandoverMode('keys_given')}
                          className="accent-[#C5A059]"
                        />
                        <span>Schlüssel werden an Veracy übergeben</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                        <input
                          type="radio"
                          name="keyMode"
                          checked={keyHandoverMode === 'present'}
                          onChange={() => setKeyHandoverMode('present')}
                          className="accent-[#C5A059]"
                        />
                        <span>Eigentümer/Vertretung öffnet bei Besichtigungen</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                        <input
                          type="radio"
                          name="keyMode"
                          checked={keyHandoverMode === 'keybox'}
                          onChange={() => setKeyHandoverMode('keybox')}
                          className="accent-[#C5A059]"
                        />
                        <span>Schlüsseltresor / Schlüsselkasten vorhanden</span>
                      </label>
                    </div>

                    {keyHandoverMode === 'keys_given' && (
                      <div className="mt-2.5 pt-2 border-t border-neutral-200 flex items-center gap-2">
                        <span className="text-[11px] text-neutral-600">Anzahl Schlüssel:</span>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={keyCount}
                          onChange={(e) => setKeyCount(Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs rounded border border-neutral-300 bg-white font-mono"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional notes */}
                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                    {language === 'de' ? 'Ergänzende Notizen & Besonderheiten zur Liegenschaft' : 'Additional Notes & Remarks'}
                  </label>
                  <textarea
                    rows={3}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder={language === 'de' ? 'z.B. Grundrissplan liegt vor, Wände wurden frisch gestrichen, Kellerabteil befindet sich im 1. UG rechts, Glasfaseranschluss vorhanden...' : 'e.g. Floor plans available, freshly painted walls, fiber optic internet, etc.'}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                  />
                </div>

                {/* Consent */}
                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-600">
                    <input
                      type="checkbox"
                      required
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 accent-[#C5A059]"
                    />
                    <span>
                      {language === 'de'
                        ? 'Ich bestätige die Richtigkeit der vorstehenden Liegenschaftsdaten und ermächtige die Veracy Immobilien GmbH, diese Angaben für die Erstellung der Verkaufs-/Vermietungsunterlagen sowie den rechtssicheren Schweizer Mietvertrag zu verwenden.'
                        : 'I confirm that the property information provided above is accurate and authorize Veracy Immobilien GmbH to use this data for marketing materials and Swiss lease contracts.'}
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Submission CTA */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                  <div className="text-xs text-neutral-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>{language === 'de' ? 'Sichere Übermittlung direkt an veracy.immobilien@gmail.com' : 'Secure transmission directly to veracy.immobilien@gmail.com'}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#B38E3E] hover:from-[#E8C785] hover:to-[#C5A059] shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#C5A059]/40 disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting
                        ? language === 'de'
                          ? 'Wird verschickt...'
                          : 'Submitting...'
                        : language === 'de'
                        ? 'Objektauflage verbindlich übermitteln'
                        : 'Submit Specification Sheet'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </section>
            </motion.form>
          ) : (
            /* Confirmation Screen */
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-neutral-200 text-center max-w-3xl mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="text-xs font-semibold uppercase tracking-widest text-[#8C6D1F] bg-[#FAF6EE] border border-[#EBDCB7] px-3 py-1 rounded-full">
                {language === 'de' ? 'Objektauflage erfolgreich übermittelt' : 'Mandate Sheet Successfully Received'}
              </span>

              <h2 className="text-2xl sm:text-3xl font-display font-normal text-neutral-950 mt-4">
                {language === 'de' ? `Vielen Dank, ${ownerName}!` : `Thank You, ${ownerName}!`}
              </h2>
              <p className="text-sm text-neutral-600 mt-2 max-w-xl mx-auto font-light leading-relaxed">
                {language === 'de'
                  ? `Die Objektauflage für die Liegenschaft ${propertyStreet}, ${propertyZipCity} wurde erfolgreich unter der Referenz ${referenceId} erfasst. Alle Angaben wurden strukturiert an das Maklerteam gesendet.`
                  : `The specification sheet for ${propertyStreet}, ${propertyZipCity} has been successfully recorded under reference ${referenceId}. All parameters were cleanly dispatched to our brokerage team.`}
              </p>

              {/* Summary Card */}
              <div className="mt-8 text-left bg-neutral-50 rounded-xl p-6 border border-neutral-200/80 space-y-3 text-xs">
                <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-800 border-b border-neutral-200 pb-2 flex items-center justify-between">
                  <span>{language === 'de' ? 'Zusammenfassung der Liegenschaft:' : 'Property Summary:'}</span>
                  <span className="font-mono text-[#8C6D1F] font-bold">{referenceId}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Liegenschaft:' : 'Location:'}</span>{' '}
                    <span className="font-semibold text-neutral-900">{propertyStreet}, {propertyZipCity}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Fläche & Zimmer:' : 'Area & Rooms:'}</span>{' '}
                    <span className="font-semibold text-neutral-900">{roomCount} Zimmer ({livingArea} m²)</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Bruttomietzins:' : 'Gross Rent:'}</span>{' '}
                    <span className="font-semibold text-neutral-900 font-mono text-sm text-[#8C6D1F]">
                      CHF {totalGrossRent.toLocaleString('de-CH')}.- / Mt.
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Verfügbarkeit:' : 'Available:'}</span>{' '}
                    <span className="font-semibold text-neutral-900">{availableFrom}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{language === 'de' ? 'Als PDF / Drucken' : 'Print / Save PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'de' ? 'Weiteres Objekt erfassen' : 'Add Another Property'}</span>
                </button>
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-6 py-2.5 rounded-lg bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Home className="w-3.5 h-3.5 text-[#DFB76C]" />
                  <span>{language === 'de' ? 'Zur Startseite' : 'Home'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
