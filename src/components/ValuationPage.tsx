import React, { useState } from 'react';
import { Language } from '../types';
import { sendEmailInquiry } from '../services/emailService';
import { Check, ArrowRight, ArrowLeft, ShieldCheck, Clock, Calculator, Home, Building2, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ValuationPageProps {
  language: Language;
  initialQuery?: string;
  onOpenConsultation: () => void;
}

export const ValuationPage: React.FC<ValuationPageProps> = ({
  language,
  initialQuery,
  onOpenConsultation,
}) => {
  // Step state (1: Type, 2: Specs, 3: Quality/Extras, 4: Contact, 5: Result)
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form values
  const [propertyType, setPropertyType] = useState<string>(
    initialQuery && initialQuery.includes('house') ? 'house' : 'apartment'
  );
  const [zipCity, setZipCity] = useState<string>(
    initialQuery && initialQuery.includes(':') ? initialQuery.split(':')[1] : ''
  );
  const [livingArea, setLivingArea] = useState<number>(140);
  const [rooms, setRooms] = useState<number>(4.5);
  const [buildYear, setBuildYear] = useState<number>(2015);
  const [condition, setCondition] = useState<string>('modern');
  const [features, setFeatures] = useState<string[]>(['Terrasse / Balkon', 'Tiefgaragenplatz']);
  
  // Contact
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [intent, setIntent] = useState<string>('soon');

  const toggleFeature = (f: string) => {
    if (features.includes(f)) {
      setFeatures(features.filter((item) => item !== f));
    } else {
      setFeatures([...features, f]);
    }
  };

  // Swiss hedonic calculation model with real-world Swiss market calibration
  const calculateValuation = () => {
    // Baseline price per m² for average Swiss suburban / agglomeration housing
    let baseM2 = 7400;
    const lowerZip = zipCity.toLowerCase().trim();

    // Regional calibration based on Swiss cantonal benchmarks
    if (
      lowerZip.includes('800') ||
      lowerZip.includes('zürich') ||
      lowerZip.includes('zurich') ||
      lowerZip.includes('zh')
    ) {
      if (
        lowerZip.includes('8001') ||
        lowerZip.includes('8002') ||
        lowerZip.includes('8008') ||
        lowerZip.includes('seefeld') ||
        lowerZip.includes('küsnacht') ||
        lowerZip.includes('zollikon') ||
        lowerZip.includes('erlenbach') ||
        lowerZip.includes('8700')
      ) {
        baseM2 = 10800; // Prime Lake Zurich / City center
      } else if (
        lowerZip.includes('800') ||
        lowerZip.includes('803') ||
        lowerZip.includes('804') ||
        lowerZip.includes('805')
      ) {
        baseM2 = 9200; // Zurich City general
      } else {
        baseM2 = 8200; // Canton Zurich suburban (Winterthur, Uster, Dietikon, Bülach)
      }
    } else if (
      lowerZip.includes('540') ||
      lowerZip.includes('baden') ||
      lowerZip.includes('wettingen') ||
      lowerZip.includes('ennetbaden')
    ) {
      baseM2 = 7600; // Baden & Wettingen area
    } else if (
      lowerZip.includes('500') ||
      lowerZip.includes('aarau') ||
      lowerZip.includes('lenzburg') ||
      lowerZip.includes('wohlen') ||
      lowerZip.includes('aargau') ||
      lowerZip.includes('ag')
    ) {
      baseM2 = 7200; // Canton Aargau general
    } else if (lowerZip.includes('600') || lowerZip.includes('luzern')) {
      baseM2 = 7800;
    } else if (lowerZip.includes('300') || lowerZip.includes('bern')) {
      baseM2 = 7200;
    } else if (lowerZip.includes('400') || lowerZip.includes('basel')) {
      baseM2 = 7600;
    } else if (lowerZip.includes('630') || lowerZip.includes('zug')) {
      baseM2 = 10500;
    }

    // Property type adjustment (Single-family house includes valuable land plot share)
    if (propertyType === 'apartment') {
      baseM2 *= 1.0;
    } else if (propertyType === 'house') {
      baseM2 *= 1.08;
    } else if (propertyType === 'penthouse') {
      baseM2 *= 1.15;
    } else if (propertyType === 'villa') {
      baseM2 *= 1.25;
    } else if (propertyType === 'multi-family') {
      baseM2 *= 0.85;
    } else if (propertyType === 'land') {
      baseM2 = Math.min(baseM2 * 0.18, 1200);
    }

    // Building age & technical lifecycle depreciation (Swiss hedonic & land-retaining model)
    let ageFactor = 1.0;
    if (buildYear >= 2022) {
      ageFactor = 1.04;
    } else if (buildYear >= 2012) {
      ageFactor = 1.00;
    } else if (buildYear >= 2000) {
      ageFactor = 0.95;
    } else if (buildYear >= 1990) {
      ageFactor = 0.90;
    } else if (buildYear >= 1980) {
      ageFactor = 0.86;
    } else if (buildYear >= 1965) {
      // 1967 house is right here: building depreciated but plot retains prime Swiss value
      ageFactor = 0.83;
    } else if (buildYear >= 1950) {
      ageFactor = 0.79;
    } else {
      ageFactor = 0.76;
    }

    // Condition adjustment
    let conditionFactor = 1.0;
    if (condition === 'renovation') {
      conditionFactor = 0.82; // -18% for required renovation
    } else if (condition === 'modern') {
      conditionFactor = 1.00; // Well-maintained
    } else if (condition === 'luxury') {
      conditionFactor = 1.12; // Prime luxury finishes
    }

    // Features
    let featureMultiplier = 1.0;
    if (features.includes('Seesicht / Bergblick')) featureMultiplier += 0.05;
    if (features.includes('Minergie-Standard')) featureMultiplier += 0.03;
    if (features.includes('Terrasse / Balkon')) featureMultiplier += 0.02;
    if (features.includes('Tiefgaragenplatz')) featureMultiplier += 0.02;
    if (features.includes('Lift im Gebäude')) featureMultiplier += 0.02;
    if (features.includes('Cheminée / Kamin')) featureMultiplier += 0.01;

    const finalM2 = baseM2 * ageFactor * conditionFactor * featureMultiplier;

    // Plausible living space correlation for room count
    let calcArea = livingArea;
    if (rooms >= 6.5 && calcArea < 180) {
      calcArea = 200;
    } else if (rooms >= 5.5 && calcArea < 150) {
      calcArea = 160;
    }

    const baseTotal = calcArea * finalM2;

    const lowerEstimate = Math.round((baseTotal * 0.94) / 10000) * 10000;
    const upperEstimate = Math.round((baseTotal * 1.06) / 10000) * 10000;
    const avgEstimate = Math.round(baseTotal / 10000) * 10000;

    return {
      lower: lowerEstimate,
      upper: upperEstimate,
      avg: avgEstimate,
      pricePerM2: Math.round(finalM2),
    };
  };

  const valuationResult = calculateValuation();

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSubmitStep4 = async () => {
    if (!fullName || !email) {
      alert(language === 'de' ? 'Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse an.' : 'Please enter your name and email address.');
      return;
    }

    setIsSubmitting(true);
    await sendEmailInquiry({
      formType: 'Immobilienschätzung',
      subject: `Schätzungsanfrage: ${fullName} (${zipCity || 'ZH/AG'})`,
      name: fullName,
      email,
      phone,
      location: zipCity,
      interest: intent,
      message: `Objektart: ${propertyType}, ${livingArea}m², ${rooms} Zimmer, Baujahr: ${buildYear}, Zustand: ${condition}, Extras: ${features.join(', ')}`,
      propertyDetails: {
        'Objektart': propertyType,
        'Wohnfläche': `${livingArea} m²`,
        'Zimmer': rooms,
        'Baujahr': buildYear,
        'Zustand': condition,
        'Ausstattung': features.join(', '),
        'Geschätzter Richtwert': `CHF ${valuationResult.avg.toLocaleString('de-CH')}`,
        'Berechnete Preisspanne': `CHF ${valuationResult.lower.toLocaleString('de-CH')} – CHF ${valuationResult.upper.toLocaleString('de-CH')}`,
        'Verkaufsabsicht': intent,
      },
    });

    setIsSubmitting(false);
    setStep(5);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const formatChf = (val: number) => `CHF ${val.toLocaleString('de-CH')}`;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-neutral-900 text-white py-16 sm:py-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E6CA85] font-medium mb-2">
              <span>{language === 'de' ? 'Professionelle Schätzung' : 'Property Valuation'}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{language === 'de' ? 'Hedonische Marktwerte' : 'Hedonic Market Values'}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{language === 'de' ? 'Garantie < 24h' : 'Response < 24h'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-display tracking-tight text-white leading-tight">
              {language === 'de'
                ? 'Kostenlose Immobilienbewertung in 2 Minuten.'
                : 'Complimentary Swiss Property Valuation in 2 Minutes.'}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-neutral-300 font-light max-w-2xl">
              {language === 'de'
                ? 'Präzise, datenbasiert und diskret. Erhalten Sie sofort einen fundierten Richtwert für Ihre Liegenschaft und auf Wunsch ein 12-seitiges Maklerdossier innert 24 Stunden.'
                : 'Accurate, data-grounded, and discreet. Gain an instant market benchmark for your Swiss residence and an in-depth 12-page valuation dossier within 24 hours.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress tracker */}
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
            <span className={step >= 1 ? 'text-neutral-900 font-semibold' : ''}>
              1. {language === 'de' ? 'Objektart' : 'Type'}
            </span>
            <span className="text-neutral-300">→</span>
            <span className={step >= 2 ? 'text-neutral-900 font-semibold' : ''}>
              2. {language === 'de' ? 'Eckdaten' : 'Specs'}
            </span>
            <span className="text-neutral-300">→</span>
            <span className={step >= 3 ? 'text-neutral-900 font-semibold' : ''}>
              3. {language === 'de' ? 'Zustand & Extras' : 'Condition'}
            </span>
            <span className="text-neutral-300">→</span>
            <span className={step >= 4 ? 'text-neutral-900 font-semibold' : ''}>
              4. {language === 'de' ? 'Kontakt' : 'Contact'}
            </span>
            <span className="text-neutral-300">→</span>
            <span className={step >= 5 ? 'text-[#8C6D1F] font-semibold' : ''}>
              5. {language === 'de' ? 'Ergebnis' : 'Result'}
            </span>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="bg-neutral-900 h-full"
              initial={false}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </div>

      {/* Form Steps Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-10 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {/* STEP 1: Property Type */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    {language === 'de' ? 'Welche Objektart möchten Sie bewerten?' : 'What type of property are you evaluating?'}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {language === 'de' ? 'Wählen Sie die zutreffende Kategorie aus.' : 'Select the matching property category.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'apartment', labelDe: 'Eigentumswohnung / Etagenwohnung', labelEn: 'Condominium / Apartment', icon: Building2 },
                    { id: 'house', labelDe: 'Einfamilienhaus / Doppeleinfamilienhaus', labelEn: 'Single-Family / Semi-Detached House', icon: Home },
                    { id: 'penthouse', labelDe: 'Attikawohnung / Penthouse', labelEn: 'Attic Apartment / Penthouse', icon: Building2 },
                    { id: 'villa', labelDe: 'Villa / Repräsentatives Anwesen', labelEn: 'Villa / Luxury Estate', icon: Home },
                    { id: 'multi-family', labelDe: 'Mehrfamilienhaus / Renditeliegenschaft', labelEn: 'Multi-Family / Investment Property', icon: Building2 },
                    { id: 'land', labelDe: 'Bauland / Parzelle', labelEn: 'Building Land / Plot', icon: Home },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = propertyType === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => setPropertyType(item.id)}
                        className={`p-4 rounded-lg border text-left transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-[#8C6D1F]' : 'text-neutral-400'}`} />
                        <div>
                          <div className="text-sm font-semibold text-neutral-900">
                            {language === 'de' ? item.labelDe : item.labelEn}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-neutral-100 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{language === 'de' ? 'Weiter zu Eckdaten' : 'Next to Specifications'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Location and Key Dimensions */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    {language === 'de' ? 'Standort und Flächenangaben' : 'Location & Dimensions'}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {language === 'de'
                      ? 'Diese Angaben sind entscheidend für den hedonischen Lage- und Flächenfaktor.'
                      : 'These indicators determine the Swiss hedonic price algorithm.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      {language === 'de' ? 'PLZ und Ortschaft' : 'Postal Code & Municipality'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="z.B. 8008 Zürich, 5400 Baden, 5000 Aarau"
                      value={zipCity}
                      onChange={(e) => setZipCity(e.target.value)}
                      className="w-full text-sm rounded border border-neutral-300 p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        {language === 'de' ? 'Wohnfläche (m²)' : 'Living Area (m²)'}
                      </label>
                      <input
                        type="number"
                        min={30}
                        max={1200}
                        value={livingArea}
                        onChange={(e) => setLivingArea(Number(e.target.value))}
                        className="w-full text-sm rounded border border-neutral-300 p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        {language === 'de' ? 'Zimmeranzahl' : 'Number of Rooms'}
                      </label>
                      <select
                        value={rooms}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setRooms(val);
                          const roomToAreaMap: Record<number, number> = {
                            1.5: 45,
                            2.5: 70,
                            3.5: 95,
                            4.5: 130,
                            5.5: 165,
                            6.5: 200,
                          };
                          if (roomToAreaMap[val]) {
                            setLivingArea(roomToAreaMap[val]);
                          }
                        }}
                        className="w-full text-sm rounded border border-neutral-300 p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      >
                        <option value={1.5}>1.5 Zimmer</option>
                        <option value={2.5}>2.5 Zimmer</option>
                        <option value={3.5}>3.5 Zimmer</option>
                        <option value={4.5}>4.5 Zimmer</option>
                        <option value={5.5}>5.5 Zimmer</option>
                        <option value={6.5}>6.5+ Zimmer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        {language === 'de' ? 'Baujahr (ca.)' : 'Approx. Year Built'}
                      </label>
                      <input
                        type="number"
                        min={1900}
                        max={2027}
                        value={buildYear}
                        onChange={(e) => setBuildYear(Number(e.target.value))}
                        className="w-full text-sm rounded border border-neutral-300 p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{language === 'de' ? 'Zurück' : 'Back'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{language === 'de' ? 'Weiter zu Extras' : 'Next to Features'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Quality Standard & Extras */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    {language === 'de' ? 'Zustand & Ausstattungsmerkmale' : 'Condition & Premium Features'}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {language === 'de' ? 'Wählen Sie den Ausbaustandard Ihrer Liegenschaft.' : 'Select the finishing standard of your property.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-2">
                    {language === 'de' ? 'Allgemeiner Zustand' : 'General Condition'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'renovation', labelDe: 'Renovationsbedarf', labelEn: 'Needs Renovation' },
                      { id: 'modern', labelDe: 'Gepflegt / Zeitgemäss', labelEn: 'Well-Maintained / Modern' },
                      { id: 'luxury', labelDe: 'Neubau / Gehobener Luxus', labelEn: 'New Build / Prime Luxury' },
                    ].map((c) => (
                      <motion.button
                        key={c.id}
                        type="button"
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => setCondition(c.id)}
                        className={`p-3 rounded border text-xs font-medium transition-all cursor-pointer ${
                          condition === c.id
                            ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 font-semibold'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {language === 'de' ? c.labelDe : c.labelEn}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-2">
                    {language === 'de' ? 'Besondere Merkmale (Mehrfachauswahl)' : 'Distinctive Features'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      'Terrasse / Balkon',
                      'Seesicht / Bergblick',
                      'Tiefgaragenplatz',
                      'Lift im Gebäude',
                      'Minergie-Standard',
                      'Cheminée / Kamin',
                    ].map((feat) => {
                      const isChecked = features.includes(feat);
                      return (
                        <motion.button
                          key={feat}
                          type="button"
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.985 }}
                          onClick={() => toggleFeature(feat)}
                          className={`p-2.5 rounded border text-xs text-left flex items-center justify-between transition-all cursor-pointer ${
                            isChecked
                              ? 'border-neutral-900 bg-neutral-900 text-white'
                              : 'border-neutral-200 hover:border-neutral-300 text-neutral-800'
                          }`}
                        >
                          <span>{feat}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-[#DFB76C]" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{language === 'de' ? 'Zurück' : 'Back'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{language === 'de' ? 'Weiter zum Schätzungsbericht' : 'Next to Dossier Contact'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Contact details to receive the report */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    {language === 'de' ? 'Wohin dürfen wir den Schätzungsbericht senden?' : 'Where should we send your valuation report?'}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {language === 'de'
                      ? 'Sie erhalten sofort die Richtwertberechnung und innerhalb von 24h den detaillierten 12-seitigen Marktreport.'
                      : 'You will receive the instant benchmark calculation immediately and the comprehensive report in 24 hours.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      {language === 'de' ? 'Vollständiger Name' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="z.B. Martin Keller"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-sm rounded border border-neutral-300 p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        {language === 'de' ? 'E-Mail Adresse' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@beispiel.ch"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-sm rounded border border-neutral-300 p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        {language === 'de' ? 'Telefonnummer (für Rückfragen)' : 'Phone Number'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+41 79 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-sm rounded border border-neutral-300 p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      {language === 'de' ? 'Hintergrund der Schätzung' : 'Valuation Intent'}
                    </label>
                    <select
                      value={intent}
                      onChange={(e) => setIntent(e.target.value)}
                      className="w-full text-sm rounded border border-neutral-300 p-2.5 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
                    >
                      <option value="soon">{language === 'de' ? 'Verkauf in den nächsten 1–6 Monaten' : 'Selling within 1–6 months'}</option>
                      <option value="later">{language === 'de' ? 'Verkauf später / Orientierung' : 'Selling later / General benchmark'}</option>
                      <option value="refinance">{language === 'de' ? 'Hypothekenverlängerung / Erbschaft' : 'Refinancing / Estate planning'}</option>
                      <option value="curious">{language === 'de' ? 'Reines Marktinteresse' : 'Curiosity about market value'}</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{language === 'de' ? 'Zurück' : 'Back'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitStep4}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-60 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#DFB76C]" />
                        <span>{language === 'de' ? 'Wird berechnet...' : 'Calculating...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#DFB76C]" />
                        <span>{language === 'de' ? 'Marktwert jetzt berechnen' : 'Calculate Valuation Now'}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Calculated Result & Dossier Order */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="text-center pb-6 border-b border-neutral-100">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'de' ? 'Berechnung erfolgreich abgeschlossen' : 'Calculation complete'}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-medium text-neutral-950">
                    {language === 'de' ? 'Geschätzter Marktwert Ihrer Liegenschaft' : 'Estimated Fair Market Value'}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {propertyType} · {livingArea} m² · {rooms} {language === 'de' ? 'Zimmer' : 'Rooms'} · {zipCity || 'Schweiz'}
                  </p>
                </div>

                {/* Big Result Box */}
                <div className="bg-neutral-900 text-white rounded-xl p-6 sm:p-8 text-center space-y-4 shadow-xl border border-[#C5A059]/30">
                  <div className="text-xs uppercase tracking-widest text-[#E6CA85] font-semibold">
                    {language === 'de' ? 'Hedonische Preisspanne (Schweizer Markt)' : 'Hedonic Price Range (Swiss Market)'}
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold text-white tracking-tight tabular-nums">
                    {formatChf(valuationResult.lower)} – {formatChf(valuationResult.upper)}
                  </div>
                  <div className="text-sm text-neutral-300 font-light">
                    {language === 'de' ? 'Mittlerer Richtwert:' : 'Median Market Benchmark:'}{' '}
                    <span className="font-semibold text-white font-mono">{formatChf(valuationResult.avg)}</span>
                    {' '}(ca. {formatChf(valuationResult.pricePerM2)} / m²)
                  </div>

                  <div className="pt-4 border-t border-neutral-800 grid grid-cols-2 gap-4 text-xs text-neutral-400">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#DFB76C]" />
                      <span>{language === 'de' ? 'Erstantwort innert 24h' : 'Response within 24h'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
                      <span>{language === 'de' ? '100% Unverbindlich' : '100% Confidential'}</span>
                    </div>
                  </div>
                </div>

                {/* Next Steps: Detailed Broker Review */}
                <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200 space-y-3">
                  <h4 className="text-sm font-semibold text-neutral-900">
                    {language === 'de'
                      ? 'Ihr nächster Schritt: Das detaillierte 12-seitige Veracy-Maklerdossier'
                      : 'Next step: Comprehensive 12-page Veracy valuation dossier'}
                  </h4>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    {language === 'de'
                      ? `Vielen Dank, ${fullName || 'Eigentümer/in'}. Unser zuständiger Senior Makler für Ihre Region prüft die spezifischen Mikrolage-Faktoren und sendet Ihnen den vollständigen Bericht an ${email || 'Ihre E-Mail'}. Zudem kontaktieren wir Sie für eine kurze Abstimmung.`
                      : `Thank you, ${fullName || 'property owner'}. Our senior regional broker is reviewing the specific micro-location metrics and will dispatch the comprehensive dossier to ${email || 'your email'}.`}
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onOpenConsultation}
                      className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      {language === 'de' ? 'Persönlichen Besichtigungstermin vereinbaren' : 'Book In-Person Valuation Appointment'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(1)}
                      className="py-2.5 px-4 bg-white border border-neutral-300 text-neutral-800 rounded text-xs font-medium hover:bg-neutral-100 transition-all cursor-pointer text-center"
                    >
                      {language === 'de' ? 'Neue Schätzung durchführen' : 'Start Another Valuation'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
