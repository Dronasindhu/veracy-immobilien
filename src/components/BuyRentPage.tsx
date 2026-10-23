import React, { useState } from 'react';
import { Language, SearchProfileData } from '../types';
import { sendEmailInquiry } from '../services/emailService';
import {
  Home,
  Building2,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  Search,
  FileCheck,
  Check,
  Phone,
  Mail,
  Sliders,
  Sparkles,
  Compass,
  Car,
  Trees,
  Maximize2,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BuyRentPageProps {
  language: Language;
  onOpenConsultation: () => void;
  onOpenPropertyInquiry?: (context: { title: string; location?: string; type: 'viewing' | 'expose' }) => void;
}

export const BuyRentPage: React.FC<BuyRentPageProps> = ({
  language,
  onOpenConsultation,
}) => {
  // Form State
  const [transactionType, setTransactionType] = useState<'buy' | 'rent'>('buy');
  const [propertyTypes, setPropertyTypes] = useState<string[]>([
    'Einfamilienhaus / Villa',
    'Eigentumswohnung',
  ]);
  const [selectedCantons, setSelectedCantons] = useState<string[]>(['ZH', 'AG']);
  const [specificLocations, setSpecificLocations] = useState<string>('');
  const [commuteFlexibility, setCommuteFlexibility] = useState<string>('radius_10km');
  const [minRooms, setMinRooms] = useState<number>(4.5);
  const [minLivingArea, setMinLivingArea] = useState<number>(120);
  const [minPlotArea, setMinPlotArea] = useState<number>(400);
  const [minBathrooms, setMinBathrooms] = useState<number>(2);
  const [parkingPreferences, setParkingPreferences] = useState<string[]>([
    'Tiefgaragenplatz / Einstellplatz',
  ]);
  const [maxBudget, setMaxBudget] = useState<number>(1800000);
  const [financialReadiness, setFinancialReadiness] = useState<string>('equity_ready');
  const [timeframe, setTimeframe] = useState<string>('3_6_months');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Balkon oder Terrasse',
    'Ruhige Wohnlage',
    'Eigener Waschturm in Wohnung (WM/TU)',
    'Moderne Einbauküche',
  ]);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Contact Info
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [wantsOffMarket, setWantsOffMarket] = useState<boolean>(true);
  const [acceptPrivacy, setAcceptPrivacy] = useState<boolean>(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Toggles helper
  const toggleItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleTransactionChange = (type: 'buy' | 'rent') => {
    setTransactionType(type);
    if (type === 'rent') {
      setMaxBudget(3200);
    } else {
      setMaxBudget(1800000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage(
        language === 'de'
          ? 'Bitte geben Sie mindestens Ihren Namen und Ihre E-Mail-Adresse an.'
          : 'Please enter at least your name and email address.'
      );
      return;
    }
    if (!acceptPrivacy) {
      setErrorMessage(
        language === 'de'
          ? 'Bitte akzeptieren Sie die Schweizer Datenschutzbestimmungen.'
          : 'Please accept the data privacy terms.'
      );
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const generatedRef = `VERACY-SUCH-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(generatedRef);

    const profileData: SearchProfileData = {
      transactionType,
      propertyTypes,
      cantons: selectedCantons,
      specificLocations: specificLocations.trim() || 'Zürich & Aargau gesamt',
      commuteFlexibility,
      minRooms,
      minLivingArea,
      minPlotArea: propertyTypes.some((p) => p.includes('Haus') || p.includes('Villa')) ? minPlotArea : undefined,
      minBathrooms,
      parkingPreferences,
      maxBudget,
      financialReadiness,
      timeframe,
      features: selectedFeatures,
      specialNotes,
      name,
      email,
      phone,
      wantsOffMarket,
    };

    const formattedBudget =
      transactionType === 'buy'
        ? `Bis CHF ${maxBudget.toLocaleString('de-CH')}`
        : `Bis CHF ${maxBudget.toLocaleString('de-CH')} / Monat (inkl. NK)`;

    await sendEmailInquiry({
      formType: 'Suchauftrag Kaufen / Mieten',
      subject: `Neuer Suchauftrag: ${transactionType === 'buy' ? 'Kauf' : 'Miete'} ${name} (Ref: ${generatedRef})`,
      name,
      email,
      phone,
      location: selectedCantons.join(', ') + (specificLocations ? ` (${specificLocations})` : ''),
      interest: `Suchprofil: ${transactionType === 'buy' ? 'Immobilie Kaufen' : 'Immobilie Mieten'} (${propertyTypes.join(', ')})`,
      message: specialNotes || 'Keine zusätzlichen Freitext-Wünsche angegeben.',
      propertyDetails: {
        'Referenznummer': generatedRef,
        'Suchtyp': transactionType === 'buy' ? 'Kauf (Eigentum)' : 'Miete',
        'Gewünschte Objekttypen': propertyTypes.join(', ') || 'Alle',
        'Kantone': selectedCantons.join(', ') || 'ZH, AG',
        'Bevorzugte Orte / PLZ': specificLocations || 'Offen für Vorschläge',
        'Flexibilität / Umkreis': commuteFlexibility,
        'Mindest-Zimmerzahl': `${minRooms} Zimmer`,
        'Mindest-Wohnfläche': `${minLivingArea} m²`,
        'Mindest-Nasszellen': `${minBathrooms}`,
        'Parkierung': parkingPreferences.join(', ') || 'Keine Präferenz',
        'Maximales Budget': formattedBudget,
        'Finanzierungsstatus': financialReadiness,
        'Zeithorizont': timeframe,
        'Gewünschte Ausstattungen & Kriterien': selectedFeatures.join(', ') || 'Keine speziellen Kriterien',
        'Off-Market Zugang gewünscht': wantsOffMarket ? 'Ja (Vorvermarktung & diskrete Objekte)' : 'Nein',
      },
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setSpecialNotes('');
  };

  // Property type catalog
  const availablePropertyTypes = [
    { id: 'Einfamilienhaus / Villa', de: 'Freistehendes Einfamilienhaus / Villa', en: 'Detached Single-Family House / Villa' },
    { id: 'Eigentumswohnung', de: 'Eigentumswohnung / Etagenwohnung', en: 'Condo / Apartment' },
    { id: 'Attikawohnung / Penthouse', de: 'Attikawohnung / Penthouse mit Terrasse', en: 'Penthouse / Rooftop Apartment' },
    { id: 'Doppelhaushälfte / Reihenhaus', de: 'Doppelhaushälfte / Reihenhaus', en: 'Semi-detached / Terraced House' },
    { id: 'Mehrfamilienhaus / Anlageobjekt', de: 'Mehrfamilienhaus / Renditeobjekt', en: 'Multi-Family / Investment Property' },
    { id: 'Bauland / Grundstück', de: 'Bauland / Baugrundstück', en: 'Building Plot / Land' },
  ];

  // Cantons
  const cantonsList = [
    { id: 'ZH', label: 'Zürich (ZH)' },
    { id: 'AG', label: 'Aargau (AG)' },
    { id: 'ZG', label: 'Zug (ZG)' },
    { id: 'SZ', label: 'Schwyz (SZ)' },
    { id: 'LU', label: 'Luzern (LU)' },
    { id: 'ANDERE', label: language === 'de' ? 'Weitere Kantone' : 'Other Cantons' },
  ];

  // Quick Location Suggestions
  const popularLocations = [
    'Zürich Stadt',
    'Zürichsee (Goldküste)',
    'Zürichsee (Silberküste)',
    'Zürcher Unterland',
    'Winterthur & Umgebung',
    'Baden & Wettingen',
    'Limmattal (ZH / AG)',
    'Aarau & Lenzburg',
    'Freiamt & Bremgarten',
  ];

  // Detailed Amenities / House features grouped
  const featureCategories = [
    {
      title: { de: 'Aussenbereich & Aussicht', en: 'Outdoor Living & Views' },
      items: [
        { id: 'Balkon oder Terrasse', de: 'Balkon oder Terrasse', en: 'Balcony or Terrace' },
        { id: 'Grosszügige Attikaterrasse', de: 'Grosszügige Attikaterrasse', en: 'Spacious Rooftop Terrace' },
        { id: 'Eigener Garten / Umschwung', de: 'Eigener privater Garten / Umschwung', en: 'Private Garden / Lawn' },
        { id: 'Seesicht oder Panorama-Weitsicht', de: 'Seesicht oder Panorama-Weitsicht', en: 'Lake View or Panoramic Vista' },
        { id: 'Ruhige Wohnlage', de: 'Ruhige Wohnlage (kein Durchgangsverkehr)', en: 'Quiet Location (No through-traffic)' },
        { id: 'Sonnige Südausrichtung', de: 'Optimale Besonnung (Süd-/Westlage)', en: 'Optimal Sun Exposure (South/West)' },
        { id: 'Schwimmbad / Pool', de: 'Schwimmbad / Pool', en: 'Swimming Pool' },
      ],
    },
    {
      title: { de: 'Innenausbau & Wohnkomfort', en: 'Interior & Comfort' },
      items: [
        { id: 'Moderne Einbauküche', de: 'Moderne Einbauküche (Induktion, Steamer)', en: 'Modern Kitchen (Induction, Steamer)' },
        { id: 'Cheminée / Kamin', de: 'Cheminée / Schwedenofen / Kamin', en: 'Fireplace / Swedish Stove' },
        { id: 'Master-Bedroom mit En-Suite Bad', de: 'Master-Bedroom mit En-Suite Bad', en: 'Master Bedroom with En-Suite Bath' },
        { id: 'Ankleidezimmer / Walk-in Closet', de: 'Ankleidezimmer / Walk-in Closet', en: 'Dressing Room / Walk-in Closet' },
        { id: 'Eigener Waschturm in Wohnung (WM/TU)', de: 'Eigener Waschturm in der Wohnung (WM/TU)', en: 'In-unit Laundry Washer/Dryer' },
        { id: 'Reduit / Speisekammer', de: 'Reduit / Vorratskammer', en: 'Storage Pantry / Reduit' },
        { id: 'Keller / Hobbyraum / Werkstatt', de: 'Grosser Keller / Hobbyraum / Werkstatt', en: 'Large Cellar / Hobby Room / Studio' },
        { id: 'Separates Gäste-WC', de: 'Separates Gäste-WC', en: 'Separate Guest Toilet' },
      ],
    },
    {
      title: { de: 'Bauweise, Haustechnik & Barrierefreiheit', en: 'Architecture, Energy & Accessibility' },
      items: [
        { id: 'Neubau / Erstbezug', de: 'Neubau oder Erstbezug', en: 'New Construction / First Occupancy' },
        { id: 'Gepflegter, bezugsbereiter Zustand', de: 'Gepflegter, bezugsbereiter Zustand', en: 'Well-maintained / Move-in ready' },
        { id: 'Minergie / Zertifizierter Energiestandard', de: 'Minergie / Hoher Energiestandard', en: 'Minergie / High Energy Standard' },
        { id: 'Wärmepumpe / Erdsonde', de: 'Ökologische Heizung (Wärmepumpe/Erdsonde)', en: 'Heat Pump / Geothermal Probe' },
        { id: 'Photovoltaikanlage / Solar', de: 'Photovoltaikanlage (Solarstrom)', en: 'Photovoltaic Solar System' },
        { id: 'Fussbodenheizung', de: 'Fussbodenheizung', en: 'Underfloor Heating' },
        { id: 'Personenaufzug / Lift in Wohnung', de: 'Personenaufzug / Lift direkt in Wohnung', en: 'Elevator / Direct Lift Access' },
        { id: 'Barrierefrei / Rollstuhlgängig', de: 'Barrierefrei / Altersgerecht ausgebaut', en: 'Wheelchair Accessible / Barrier-free' },
        { id: 'Historischer Altbau-Charme', de: 'Historischer Altbau-Charme (hohe Decken)', en: 'Historic Period Charm (High ceilings)' },
      ],
    },
    {
      title: { de: 'Lagequalität & Infrastruktur', en: 'Neighborhood & Connectivity' },
      items: [
        { id: 'Gehdistanz zu Schulen / Kindergarten', de: 'Gehdistanz zu Schulen & Kindergarten', en: 'Walking distance to Schools & Kindergarten' },
        { id: 'Gute ÖV-Anbindung / S-Bahn zu Fuss', de: 'ÖV / S-Bahnhof bequem zu Fuss erreichbar', en: 'Public Transit / S-Bahn within walking distance' },
        { id: 'Schneller Autobahnanschluss', de: 'Guter Autobahnanschluss (Zürich/Basel/Bern)', en: 'Quick Highway Access' },
        { id: 'Steuergünstige Wohngemeinde', de: 'Steuergünstige Wohngemeinde', en: 'Low-tax Municipality' },
        { id: 'Nähe Naherholung (See, Wald, Fluss)', de: 'Nähe Naherholung (See, Wald, Spazierwege)', en: 'Close to Nature, Lake or Forests' },
        { id: 'Einkaufsmöglichkeiten zu Fuss erreichbar', de: 'Einkauf & Nahversorgung zu Fuss', en: 'Groceries & Daily Essentials on foot' },
      ],
    },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-neutral-900 text-white py-14 sm:py-20 border-b border-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.12),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E6CA85] font-semibold mb-3">
              <span>{language === 'de' ? 'Kaufen & Mieten' : 'Buy & Rent'}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{language === 'de' ? 'Persönlicher Schweizer Suchauftrag' : 'Tailored Swiss Property Search'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-display tracking-tight text-white">
              {language === 'de'
                ? 'Finden Sie Ihre Wunschimmobilie nach Mass'
                : 'Find Your Ideal Swiss Residence to Order'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-300 font-light max-w-2xl leading-relaxed">
              {language === 'de'
                ? 'Keine fiktiven Inserate: Definieren Sie Ihr persönliches Anforderungsprofil. Unsere lizenzierten Makler screenen laufend geprüfte Schweizer Marktangebote und vermitteln Ihnen exklusive Off-Market Liegenschaften in Zürich & Aargau.'
                : 'No placeholder listings: Define your exact criteria. Our certified Swiss brokers continuously screen verified real estate listings and match you with discreet off-market opportunities across Zurich and Aargau.'}
            </p>

            {/* Trust Highlights */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-neutral-800/80 pt-6">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-[#DFB76C] shrink-0" />
                <span>{language === 'de' ? '100% Kostenlos' : '100% Free Service'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-[#DFB76C] shrink-0" />
                <span>{language === 'de' ? 'Diskrete Off-Market Deals' : 'Discreet Off-Market Deals'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Clock className="w-4 h-4 text-[#DFB76C] shrink-0" />
                <span>{language === 'de' ? 'Antwort innert 24h' : 'Response within 24h'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Sparkles className="w-4 h-4 text-[#DFB76C] shrink-0" />
                <span>{language === 'de' ? 'Nur real geprüfte Objekte' : 'Verified Properties Only'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Section 1: Transaction & Property Type */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>{language === 'de' ? 'Suchabsicht & Objekttyp' : 'Intent & Property Type'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Möchten Sie kaufen oder mieten?' : 'Are you looking to buy or rent?'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {language === 'de'
                    ? 'Wählen Sie Ihre Transaktionsart und die in Frage kommenden Immobilientypen.'
                    : 'Choose your transaction preference and the types of properties you consider.'}
                </p>

                {/* Buy vs Rent Switcher */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => handleTransactionChange('buy')}
                    className={`py-3.5 px-4 rounded-lg border text-sm font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      transactionType === 'buy'
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-md ring-2 ring-neutral-950/10'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <Home className="w-4 h-4 text-[#DFB76C]" />
                    <span>{language === 'de' ? 'Immobilie kaufen (Eigentum)' : 'Buy Property (Ownership)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTransactionChange('rent')}
                    className={`py-3.5 px-4 rounded-lg border text-sm font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      transactionType === 'rent'
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-md ring-2 ring-neutral-950/10'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#DFB76C]" />
                    <span>{language === 'de' ? 'Immobilie mieten' : 'Rent Property'}</span>
                  </button>
                </div>

                {/* Property Types Multiple Selection */}
                <div className="mt-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2.5">
                    {language === 'de' ? 'Welche Objektarten interessieren Sie? (Mehrfachauswahl möglich)' : 'Which property types interest you? (Multiple selections allowed)'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availablePropertyTypes.map((pt) => {
                      const isSelected = propertyTypes.includes(pt.id);
                      return (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => toggleItem(propertyTypes, pt.id, setPropertyTypes)}
                          className={`p-3.5 rounded-lg border text-left text-xs font-medium flex items-start gap-3 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAF6EE] border-[#C5A059] text-neutral-950 shadow-sm'
                              : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                              isSelected
                                ? 'bg-neutral-950 border-neutral-950 text-white'
                                : 'border-neutral-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-[#DFB76C]" />}
                          </div>
                          <span className="leading-snug">{language === 'de' ? pt.de : pt.en}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 2: Preferred Location & Commute */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>{language === 'de' ? 'Region, Lage & Distanz' : 'Region & Location'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Wo soll sich Ihre Immobilie befinden?' : 'Where should your property be located?'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {language === 'de'
                    ? 'Wählen Sie Kantone und geben Sie gewünschte Gemeinden oder Stadtkreise an.'
                    : 'Select preferred cantons and specific towns, zip codes or districts.'}
                </p>

                {/* Canton Badges */}
                <div className="mt-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    {language === 'de' ? 'Bevorzugte Kantone:' : 'Preferred Cantons:'}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {cantonsList.map((c) => {
                      const isSelected = selectedCantons.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleItem(selectedCantons, c.id, setSelectedCantons)}
                          className={`px-4 py-2 rounded-lg text-xs font-medium border flex items-center gap-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-neutral-950 text-white border-neutral-950'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#DFB76C]' : 'text-neutral-400'}`} />
                          <span>{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Selection Tags */}
                <div className="mt-5">
                  <label className="block text-xs text-neutral-500 mb-2">
                    {language === 'de' ? 'Beliebte Suchregionen (Klicken zum Hinzufügen):' : 'Popular Search Regions (Click to add):'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {popularLocations.map((loc) => {
                      const isPresent = specificLocations.includes(loc);
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            if (isPresent) {
                              setSpecificLocations(
                                specificLocations
                                  .split(', ')
                                  .filter((x) => x !== loc)
                                  .join(', ')
                              );
                            } else {
                              setSpecificLocations(
                                specificLocations ? `${specificLocations}, ${loc}` : loc
                              );
                            }
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                            isPresent
                              ? 'bg-[#FAF6EE] text-[#8C6D1F] border-[#C5A059] font-medium'
                              : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200/80'
                          }`}
                        >
                          {isPresent ? `✓ ${loc}` : `+ ${loc}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Cities / Zip code text input */}
                <div className="mt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                    {language === 'de' ? 'Konkrete Gemeinden, Postleitzahlen oder Quartiere:' : 'Specific Towns, Postal Codes, or Districts:'}
                  </label>
                  <input
                    type="text"
                    value={specificLocations}
                    onChange={(e) => setSpecificLocations(e.target.value)}
                    placeholder={
                      language === 'de'
                        ? 'z.B. Zürich Kreis 7 & 8, Zollikon, Küsnacht, 5400 Baden, Aarau...'
                        : 'e.g. Zurich District 7 & 8, Zollikon, 5400 Baden, Aarau...'
                    }
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent bg-white text-neutral-900"
                  />
                </div>

                {/* Radius / Flexibility */}
                <div className="mt-5 pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    {language === 'de' ? 'Distanz-Flexibilität:' : 'Commute / Distance Flexibility:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { id: 'exact', de: 'Nur genannte Orte', en: 'Exact locations only' },
                      { id: 'radius_10km', de: 'Umkreis ca. 10 km', en: 'Within approx. 10 km' },
                      { id: 'radius_25km', de: 'Umkreis ca. 25 km', en: 'Within approx. 25 km' },
                      { id: 'flexible', de: 'Kantonweit flexibel', en: 'Canton-wide flexible' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCommuteFlexibility(opt.id)}
                        className={`py-2 px-3 rounded-md border text-center font-medium cursor-pointer transition-all ${
                          commuteFlexibility === opt.id
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {language === 'de' ? opt.de : opt.en}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Rooms, Spaces & Plot */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>{language === 'de' ? 'Raumbedarf & Dimensionen' : 'Rooms & Dimensions'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Wie viel Platz benötigen Sie?' : 'How much space do you need?'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {language === 'de'
                    ? 'Bestimmen Sie Mindestzimmerzahl, Wohnfläche und Parkierungswünsche.'
                    : 'Set minimum rooms, living space, and parking requirements.'}
                </p>

                {/* Minimum Rooms */}
                <div className="mt-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    {language === 'de' ? 'Mindestanzahl Zimmer:' : 'Minimum Number of Rooms:'}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[2.5, 3.5, 4.5, 5.5, 6.5, 7.5].map((roomsVal) => (
                      <button
                        key={roomsVal}
                        type="button"
                        onClick={() => setMinRooms(roomsVal)}
                        className={`py-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          minRooms === roomsVal
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {roomsVal === 7.5 ? '7.5+ Zi.' : `Ab ${roomsVal} Zi.`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Living Area Slider & Plot Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-4 border-t border-neutral-100">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                        {language === 'de' ? 'Mindest-Wohnfläche:' : 'Minimum Living Area:'}
                      </label>
                      <span className="text-sm font-bold font-mono text-[#8C6D1F]">
                        ab {minLivingArea} m²
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={350}
                      step={10}
                      value={minLivingArea}
                      onChange={(e) => setMinLivingArea(Number(e.target.value))}
                      className="w-full accent-[#C5A059] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                      <span>50 m²</span>
                      <span>150 m²</span>
                      <span>250 m²</span>
                      <span>350+ m²</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                        {language === 'de' ? 'Mindest-Nasszellen (Badezimmer):' : 'Minimum Bathrooms:'}
                      </label>
                      <span className="text-sm font-bold font-mono text-[#8C6D1F]">
                        {minBathrooms === 3 ? '3 oder mehr' : `Mind. ${minBathrooms}`}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((bVal) => (
                        <button
                          key={bVal}
                          type="button"
                          onClick={() => setMinBathrooms(bVal)}
                          className={`py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                            minBathrooms === bVal
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-white text-neutral-700 border-neutral-200'
                          }`}
                        >
                          {bVal === 3 ? '3+ Bäder' : `${bVal} ${bVal === 1 ? 'Bad' : 'Bäder'}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Parking Preferences */}
                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    {language === 'de' ? 'Gewünschte Parkmöglichkeiten:' : 'Parking Requirements:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {[
                      { id: 'Tiefgaragenplatz / Einstellplatz', de: 'Tiefgaragenplatz', en: 'Underground Parking' },
                      { id: 'Einzel- oder Doppelgarage', de: 'Einzel- / Doppelgarage', en: 'Private Garage Box' },
                      { id: 'Aussenabstellplatz', de: 'Aussenparkplatz', en: 'Outdoor Parking Space' },
                      { id: 'Elektro-Ladestation (EV)', de: 'E-Ladestation (Wallbox)', en: 'EV Charging Station' },
                    ].map((pk) => {
                      const isSelected = parkingPreferences.includes(pk.id);
                      return (
                        <button
                          key={pk.id}
                          type="button"
                          onClick={() => toggleItem(parkingPreferences, pk.id, setParkingPreferences)}
                          className={`py-2.5 px-3 rounded-lg border text-xs font-medium flex items-center gap-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#FAF6EE] text-neutral-950 border-[#C5A059]'
                              : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <Car className={`w-3.5 h-3.5 ${isSelected ? 'text-[#8C6D1F]' : 'text-neutral-400'}`} />
                          <span className="truncate">{language === 'de' ? pk.de : pk.en}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 4: Detailed House & Apartment Requirements ("what all they need in the house") */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">4</span>
                  <span>{language === 'de' ? 'Ausstattung & Kriterien nach Mass' : 'Detailed House & Apartment Features'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de'
                    ? 'Was muss Ihre Liegenschaft alles bieten?'
                    : 'What specific features does your property require?'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {language === 'de'
                    ? 'Wählen Sie alle Merkmale an, die für Sie unverzichtbar oder wünschenswert sind.'
                    : 'Select all features and amenities essential or desirable for your future home.'}
                </p>

                <div className="mt-8 space-y-6">
                  {featureCategories.map((cat, catIdx) => (
                    <div key={catIdx} className="border-b border-neutral-100 pb-5 last:border-b-0 last:pb-0">
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                        <span>{language === 'de' ? cat.title.de : cat.title.en}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {cat.items.map((item) => {
                          const isChecked = selectedFeatures.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleItem(selectedFeatures, item.id, setSelectedFeatures)}
                              className={`p-3 rounded-lg border text-left text-xs font-medium flex items-center gap-2.5 cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-[#FAF6EE] border-[#C5A059] text-neutral-950 shadow-xs'
                                  : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                                  isChecked
                                    ? 'bg-neutral-950 border-neutral-950 text-white'
                                    : 'border-neutral-300 bg-white'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 text-[#DFB76C]" />}
                              </div>
                              <span className="leading-snug">{language === 'de' ? item.de : item.en}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Budget, Financial Status & Timeline */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">5</span>
                  <span>{language === 'de' ? 'Budget & Zeitrahmen' : 'Budget & Timeline'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Finanzieller Rahmen & Einzug' : 'Financial Frame & Target Date'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {language === 'de'
                    ? 'Präzise Budgetangaben ermöglichen zielgerichtete Vermittlung passender Objekte.'
                    : 'Accurate budget framing ensures targeted match results.'}
                </p>

                {/* Budget setting */}
                <div className="mt-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                      {transactionType === 'buy'
                        ? language === 'de'
                          ? 'Maximaler Kaufpreis (CHF):'
                          : 'Maximum Purchase Price (CHF):'
                        : language === 'de'
                        ? 'Maximale Monatsmiete inkl. NK (CHF):'
                        : 'Maximum Monthly Rent incl. Utilities (CHF):'}
                    </label>
                    <span className="text-2xl font-bold font-mono text-[#8C6D1F] tabular-nums">
                      CHF {maxBudget.toLocaleString('de-CH')}
                      {transactionType === 'rent' && <span className="text-xs font-normal text-neutral-500"> / Mt.</span>}
                    </span>
                  </div>

                  {transactionType === 'buy' ? (
                    <>
                      <input
                        type="range"
                        min={500000}
                        max={5000000}
                        step={50000}
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(Number(e.target.value))}
                        className="w-full accent-[#C5A059] cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                        <span>CHF 500’000</span>
                        <span>CHF 1’500’000</span>
                        <span>CHF 2’500’000</span>
                        <span>CHF 5’000’000+</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {[1000000, 1500000, 2000000, 2500000, 3500000].map((quickB) => (
                          <button
                            key={quickB}
                            type="button"
                            onClick={() => setMaxBudget(quickB)}
                            className={`px-3 py-1 text-xs rounded border cursor-pointer transition-all ${
                              maxBudget === quickB
                                ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            bis CHF {(quickB / 1000000).toFixed(1)}M
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        type="range"
                        min={1500}
                        max={10000}
                        step={100}
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(Number(e.target.value))}
                        className="w-full accent-[#C5A059] cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                        <span>CHF 1’500</span>
                        <span>CHF 3’500</span>
                        <span>CHF 6’000</span>
                        <span>CHF 10’000+</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Financial Readiness & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-5 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                      {language === 'de' ? 'Finanzierungsstatus:' : 'Financing Status:'}
                    </label>
                    <div className="space-y-2 text-xs">
                      {[
                        { id: 'bank_approval', de: 'Finanzierungsbestätigung einer Bank liegt vor', en: 'Bank financing pre-approval ready' },
                        { id: 'equity_ready', de: 'Eigenkapital gesichert / Barzahler', en: 'Equity secured / Cash buyer' },
                        { id: 'in_progress', de: 'In Abklärung / Beratung erwünscht', en: 'In progress / Advice requested' },
                      ].map((st) => (
                        <label
                          key={st.id}
                          className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                            financialReadiness === st.id
                              ? 'bg-[#FAF6EE] border-[#C5A059] text-neutral-900'
                              : 'bg-white border-neutral-200 text-neutral-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="financialReadiness"
                            checked={financialReadiness === st.id}
                            onChange={() => setFinancialReadiness(st.id)}
                            className="accent-[#C5A059]"
                          />
                          <span>{language === 'de' ? st.de : st.en}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                      {language === 'de' ? 'Geplanter Zeithorizont / Einzug:' : 'Target Move-in Timeframe:'}
                    </label>
                    <div className="space-y-2 text-xs">
                      {[
                        { id: 'asap', de: 'Sofort / Schnellstmöglich', en: 'Immediate / ASAP' },
                        { id: '3_6_months', de: 'Innert 3 bis 6 Monaten', en: 'Within 3 to 6 months' },
                        { id: '6_12_months', de: 'Innert 6 bis 12 Monaten', en: 'Within 6 to 12 months' },
                        { id: 'flexible', de: 'Flexibel (bei idealem Objekt)', en: 'Flexible (for ideal property)' },
                      ].map((tf) => (
                        <label
                          key={tf.id}
                          className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                            timeframe === tf.id
                              ? 'bg-[#FAF6EE] border-[#C5A059] text-neutral-900'
                              : 'bg-white border-neutral-200 text-neutral-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="timeframe"
                            checked={timeframe === tf.id}
                            onChange={() => setTimeframe(tf.id)}
                            className="accent-[#C5A059]"
                          />
                          <span>{language === 'de' ? tf.de : tf.en}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Free Text / Special Notes */}
                <div className="mt-6 pt-5 border-t border-neutral-100">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                    {language === 'de'
                      ? 'Besondere Wünsche oder Anmerkungen (Optional):'
                      : 'Special Requests or Notes (Optional):'}
                  </label>
                  <textarea
                    rows={3}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder={
                      language === 'de'
                        ? 'z.B. Haustiere (Hund/Katze), ruhiges Musikzimmer erforderlich, Raumhöhe ab 2.80 m, Platz für Wohnmobil...'
                        : 'e.g. Pets allowed, sound-proof home studio, ceiling height > 2.8m, room for camper van...'
                    }
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent bg-white text-neutral-900"
                  />
                </div>
              </div>

              {/* Section 6: Contact Information & Submission */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">6</span>
                  <span>{language === 'de' ? 'Kontaktdaten & Aktivierung' : 'Contact Details & Activation'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Wohin dürfen wir passende Angebote senden?' : 'Where should we send matched properties?'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {language === 'de'
                    ? 'Ihr Suchprofil ist kostenlos und unverbindlich. Wir kontaktieren Sie bei passenden Übereinstimmungen.'
                    : 'Your search profile is free and non-binding. We notify you as soon as matching properties emerge.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      {language === 'de' ? 'Vor- & Nachname *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="z.B. Michael Keller"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      {language === 'de' ? 'E-Mail-Adresse *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="m.keller@beispiel.ch"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      {language === 'de' ? 'Telefonnummer' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+41 79 123 45 67"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                </div>

                {/* Consent checkboxes */}
                <div className="mt-5 space-y-2.5 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantsOffMarket}
                      onChange={(e) => setWantsOffMarket(e.target.checked)}
                      className="mt-0.5 accent-[#C5A059]"
                    />
                    <span>
                      {language === 'de'
                        ? 'Ja, informieren Sie mich auch exklusiv über diskrete Off-Market Liegenschaften, bevor diese öffentlich ausgeschrieben werden.'
                        : 'Yes, also inform me exclusively about discreet off-market properties before public listing.'}
                    </span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={acceptPrivacy}
                      onChange={(e) => setAcceptPrivacy(e.target.checked)}
                      className="mt-0.5 accent-[#C5A059]"
                    />
                    <span>
                      {language === 'de'
                        ? 'Ich stimme der vertraulichen Speicherung meiner Suchkriterien gemäss Schweizer Datenschutzgesetz (DSG) zu.'
                        : 'I agree to the confidential handling of my search criteria under Swiss Data Protection regulations.'}
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                    <span>{language === 'de' ? 'Antwort & Vorabgleich innert 24h garantiert' : 'Response & initial screening within 24h'}</span>
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
                          ? 'Wird übermittelt...'
                          : 'Submitting...'
                        : language === 'de'
                        ? 'Suchprofil kostenlos aktivieren'
                        : 'Activate Search Profile for Free'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
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
                {language === 'de' ? 'Suchauftrag erfolgreich aktiviert' : 'Search Profile Successfully Activated'}
              </span>

              <h2 className="text-2xl sm:text-3xl font-display font-normal text-neutral-950 mt-4">
                {language === 'de'
                  ? `Vielen Dank, ${name}!`
                  : `Thank You, ${name}!`}
              </h2>
              <p className="text-sm text-neutral-600 mt-2 max-w-xl mx-auto font-light leading-relaxed">
                {language === 'de'
                  ? `Ihr Suchprofil wurde mit der Referenznummer ${referenceId} in unserem System hinterlegt. Wir haben eine Bestätigung an ${email} gesendet.`
                  : `Your search profile was registered under reference ${referenceId}. A confirmation has been dispatched to ${email}.`}
              </p>

              {/* Summary of Registered Criteria */}
              <div className="mt-8 text-left bg-neutral-50 rounded-xl p-6 border border-neutral-200/80 space-y-3 text-xs">
                <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-800 border-b border-neutral-200 pb-2">
                  {language === 'de' ? 'Zusammenfassung Ihrer Kriterien:' : 'Summary of Your Criteria:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Transaktionsart:' : 'Intent:'}</span>{' '}
                    <span className="font-semibold text-neutral-900">{transactionType === 'buy' ? 'Kauf (Eigentum)' : 'Miete'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Maximales Budget:' : 'Max. Budget:'}</span>{' '}
                    <span className="font-semibold text-neutral-900 font-mono">
                      CHF {maxBudget.toLocaleString('de-CH')} {transactionType === 'rent' ? '/ Mt.' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Mindest-Zimmer:' : 'Min. Rooms:'}</span>{' '}
                    <span className="font-semibold text-neutral-900">Ab {minRooms} Zimmer</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Mindest-Wohnfläche:' : 'Min. Living Space:'}</span>{' '}
                    <span className="font-semibold text-neutral-900">Ab {minLivingArea} m²</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-neutral-500">{language === 'de' ? 'Objektarten:' : 'Property Types:'}</span>{' '}
                    <span className="font-semibold text-neutral-900">{propertyTypes.join(', ')}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-neutral-500">{language === 'de' ? 'Regionen & Kantone:' : 'Locations:'}</span>{' '}
                    <span className="font-semibold text-neutral-900">{selectedCantons.join(', ')} {specificLocations && `(${specificLocations})`}</span>
                  </div>
                  {selectedFeatures.length > 0 && (
                    <div className="sm:col-span-2">
                      <span className="text-neutral-500">{language === 'de' ? 'Gewünschte Ausstattung:' : 'Selected Amenities:'}</span>{' '}
                      <span className="text-neutral-900">{selectedFeatures.slice(0, 6).join(' · ')}{selectedFeatures.length > 6 ? ` (+ ${selectedFeatures.length - 6} weitere)` : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* What happens next */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs">
                <div className="p-4 rounded-lg bg-white border border-neutral-200">
                  <div className="font-semibold text-neutral-900 flex items-center gap-1.5 mb-1 text-sm">
                    <span className="text-[#8C6D1F]">01.</span>
                    <span>{language === 'de' ? 'Datenbank-Abgleich' : 'Database Match'}</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {language === 'de'
                      ? 'Unsere Makler vergleichen Ihr Profil mit aktuellen Angeboten in Zürich und Aargau.'
                      : 'Our brokers compare your profile with active properties across Zurich and Aargau.'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-neutral-200">
                  <div className="font-semibold text-neutral-900 flex items-center gap-1.5 mb-1 text-sm">
                    <span className="text-[#8C6D1F]">02.</span>
                    <span>{language === 'de' ? 'Off-Market Prüfung' : 'Off-Market Access'}</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {language === 'de'
                      ? 'Sie erhalten exklusiven Zugang zu diskreten Objekten vor dem offiziellen Vermarktungsstart.'
                      : 'You gain priority access to discreet residences before public listing.'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-neutral-200">
                  <div className="font-semibold text-neutral-900 flex items-center gap-1.5 mb-1 text-sm">
                    <span className="text-[#8C6D1F]">03.</span>
                    <span>{language === 'de' ? 'Persönlicher Kontakt' : 'Personal Contact'}</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {language === 'de'
                      ? 'Wir melden uns innert 24 Stunden bei Ihnen mit passenden Optionen oder Rückfragen.'
                      : 'We reach out within 24 hours with suitable options or clarifying details.'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'de' ? 'Neues Profil anlegen' : 'Create Another Profile'}</span>
                </button>
                <button
                  onClick={onOpenConsultation}
                  className="px-6 py-2.5 rounded-lg bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-[#DFB76C]" />
                  <span>{language === 'de' ? 'Direktberatung anfragen' : 'Request Consultation'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
