import React, { useState } from 'react';
import { Language, RentOutFormData } from '../types';
import { sendEmailInquiry } from '../services/emailService';
import { trackEvent } from '../services/analytics';
import {
  KeyRound,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  Camera,
  ArrowRight,
  FileText,
  Users,
  Award,
  Phone,
  Building,
  Home,
  Check,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RentOutPageProps {
  language: Language;
  onOpenConsultation: () => void;
}

export const RentOutPage: React.FC<RentOutPageProps> = ({
  language,
  onOpenConsultation,
}) => {
  // Form State
  const [propertyType, setPropertyType] = useState<string>('Wohnung');
  const [location, setLocation] = useState<string>('');
  const [rooms, setRooms] = useState<number>(3.5);
  const [livingArea, setLivingArea] = useState<number>(85);
  const [expectedRent, setExpectedRent] = useState<number>(2450);
  const [availableDate, setAvailableDate] = useState<string>('ab sofort');
  const [rentalServiceType, setRentalServiceType] = useState<'first_letting' | 're_letting' | 'all_inclusive'>('all_inclusive');
  const [tenantPreferences, setTenantPreferences] = useState<string>('Solvente Einzelperson, Paar oder Familie; Nichtraucher');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('morning');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Contact
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !location.trim()) {
      setErrorMessage(
        language === 'de'
          ? 'Bitte geben Sie Ihren Namen, Ihre E-Mail und den Ort der Immobilie an.'
          : 'Please enter your name, email, and property location.'
      );
      return;
    }
    if (!acceptTerms) {
      setErrorMessage(
        language === 'de'
          ? 'Bitte akzeptieren Sie die Schweizer Datenschutzbestimmungen.'
          : 'Please accept the data privacy terms.'
      );
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const generatedRef = `VERACY-MIETE-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(generatedRef);

    const timeLabel =
      appointmentTime === 'morning'
        ? (language === 'de' ? 'Vormittag (09:00 – 12:00)' : 'Morning (09:00 – 12:00)')
        : appointmentTime === 'afternoon'
        ? (language === 'de' ? 'Nachmittag (13:00 – 16:00)' : 'Afternoon (13:00 – 16:00)')
        : appointmentTime === 'late'
        ? (language === 'de' ? 'Spätnachmittag (16:00 – 19:00)' : 'Late Afternoon (16:00 – 19:00)')
        : (language === 'de' ? 'Ganztags flexibel' : 'Flexible all day');

    await sendEmailInquiry({
      formType: 'Immobilie vermieten / Vermieterservice',
      subject: `Vermieter-Anfrage: ${propertyType} in ${location} – ${name} (Ref: ${generatedRef})`,
      name,
      email,
      phone,
      location,
      interest: `Immobilie vermieten (${rentalServiceType === 'first_letting' ? 'Erstvermietung' : 'Wiedervermietung'})`,
      appointmentDate,
      appointmentTime: timeLabel,
      message: specialNotes || 'Keine zusätzlichen Anmerkungen angegeben.',
      propertyDetails: {
        'Referenznummer': generatedRef,
        'Objektart': propertyType,
        'Liegenschaft / Ort': location,
        'Zimmeranzahl': `${rooms} Zimmer`,
        'Wohnfläche': `${livingArea} m²`,
        'Gewünschter Mietzins': `CHF ${expectedRent.toLocaleString('de-CH')} / Mt.`,
        'Bezugsbereit': availableDate,
        'Vermietungspaket':
          rentalServiceType === 'all_inclusive'
            ? 'Rundum-Sorglos-Paket (Provision: Nur 15 Tage Miete bei Vertragsabschluss)'
            : rentalServiceType === 'first_letting'
            ? 'Erstvermietung (Provision: Nur 15 Tage Miete)'
            : 'Klassische Wiedervermietung (Provision: Nur 15 Tage Miete)',
        'Gewünschte Mieterkriterien': tenantPreferences,
        'Vor-Ort-Fototermin': appointmentDate ? `${appointmentDate} (${timeLabel})` : 'Nach telefonischer Absprache',
      },
    });

    trackEvent('rent_out_inquiry_submitted', {
      property_type: propertyType,
      expected_rent: expectedRent,
      location,
      reference_id: generatedRef,
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
    setLocation('');
    setAppointmentDate('');
    setSpecialNotes('');
  };

  const rentalSteps = [
    {
      step: '01',
      title: { de: 'Markt- & Mietzinsanalyse', en: 'Market & Rent Analysis' },
      desc: {
        de: 'Wir analysieren den optimalen, marktgerechten Mietzins für Ihre Liegenschaft in Zürich oder Aargau zur Vermeidung von Leerstand.',
        en: 'We analyze the optimal, competitive market rent for your property in Zurich or Aargau to eliminate vacancy risk.',
      },
    },
    {
      step: '02',
      title: { de: 'Profi-Fotos, 3D Tour & Walkthrough', en: 'Pro Photos, 3D Tour & Walkthrough' },
      desc: {
        de: 'Professionelle HDR-Fotografie vor Ort, interaktive 3D Tour und Video-Walkthrough für maximale Aufmerksamkeit auf Homegate, ImmoScout24 & Flatfox.',
        en: 'Professional on-site HDR photography, interactive 3D tour, and video walkthrough for peak visibility across Swiss property portals.',
      },
    },
    {
      step: '03',
      title: { de: 'Geprüfte Bonität & Auswahl', en: 'Credit Check & Screening' },
      desc: {
        de: 'Lückenlose Prüfung aller Mietinteressenten: Betreibungsauszug, Lohnausweis, Arbeitgeber- und Vorvermieter-Referenzen.',
        en: 'Comprehensive screening: Swiss debt-enforcement extract, salary proof, employer and previous landlord references.',
      },
    },
    {
      step: '04',
      title: { de: 'Mietvertrag & Übergabe', en: 'Lease Contract & Handover' },
      desc: {
        de: 'Erstellung rechtssicherer Mietverträge nach Schweizer Recht (OR), Kautionsdepot-Eröffnung und protokolliertes Übergabeprotokoll.',
        en: 'Preparation of legally bulletproof Swiss lease contracts, rental deposit escrow setup, and formal handover protocols.',
      },
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
              <span>{language === 'de' ? 'Vermieter-Service' : 'Landlord Service'}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{language === 'de' ? 'Zürich & Aargau' : 'Zurich & Aargau'}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{language === 'de' ? 'Nur 15 Tage Miete Provision' : 'Only 15 Days Rent Commission'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-display tracking-tight text-white leading-tight">
              {language === 'de'
                ? 'Immobilie stressfrei vermieten. Zu fairen Konditionen.'
                : 'Rent Out Your Property Hassle-Free. On Fair Terms.'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-300 font-light max-w-2xl leading-relaxed">
              {language === 'de'
                ? 'Veracy übernimmt für Eigentümer den kompletten Vermietungsprozess: von der Mietzinsoptimierung und professionellen Fotografie über die strenge Bonitätsprüfung bis zum rechtssicheren Mietvertrag. Unsere Provision: Lediglich 15 Tage des vereinbarten Nettomietzinses bei erfolgreicher Vermietung.'
                : 'Veracy handles the complete tenant placement process for Swiss landlords: from rent pricing and photography to rigorous credit checks and legally compliant lease contracts. Our commission: Strictly 15 days of rent upon successful tenancy.'}
            </p>

            {/* Value Proposition Badges */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-neutral-800/80 pt-6">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Clock className="w-4 h-4 text-[#DFB76C] shrink-0" />
                <span>{language === 'de' ? 'Nur 15 Tage Miete Provision' : 'Only 15 Days Rent Fee'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Camera className="w-4 h-4 text-[#DFB76C] shrink-0" />
                <span>{language === 'de' ? 'Fotos, 3D Tour & Walkthrough' : 'Photos, 3D Tour & Walkthrough'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-[#DFB76C] shrink-0" />
                <span>{language === 'de' ? '100% Bonitätsgeprüft' : '100% Solvency Checked'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Award className="w-4 h-4 text-[#DFB76C] shrink-0" />
                <span>{language === 'de' ? '0 CHF bei Nichterfolg' : '0 CHF If Not Rented'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
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
              {/* Section 1: Property Details */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>{language === 'de' ? 'Angaben zur Mietliegenschaft' : 'Rental Property Details'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Welche Liegenschaft möchten Sie vermieten?' : 'Which property are you looking to rent out?'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {language === 'de'
                    ? 'Geben Sie Eckdaten zu Ihrer Liegenschaft ein, damit wir den optimalen Marktmietzins ermitteln können.'
                    : 'Provide property details so we can calculate the optimal market rent benchmark.'}
                </p>

                {/* Property Type Grid */}
                <div className="mt-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    {language === 'de' ? 'Objektart:' : 'Property Type:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'Wohnung', de: 'Wohnung / Etage', en: 'Apartment' },
                      { id: 'Attikawohnung', de: 'Attika / Penthouse', en: 'Penthouse' },
                      { id: 'Einfamilienhaus', de: 'Einfamilienhaus / Villa', en: 'Single-Family House' },
                      { id: 'Mehrfamilienhaus', de: 'Ganzes Mehrfamilienhaus', en: 'Multi-Family House' },
                    ].map((pt) => (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => setPropertyType(pt.id)}
                        className={`py-3 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          propertyType === pt.id
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        {language === 'de' ? pt.de : pt.en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location / Address */}
                <div className="mt-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                    {language === 'de' ? 'Adresse oder PLZ & Ort der Liegenschaft *' : 'Property Address or Zip & City *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={language === 'de' ? 'z.B. Seestrasse 14, 8700 Küsnacht oder 5400 Baden' : 'e.g. Seestrasse 14, 8700 Kuesnacht or 5400 Baden'}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                  />
                </div>

                {/* Rooms, Area, Rent */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Anzahl Zimmer:' : 'Number of Rooms:'}
                    </label>
                    <select
                      value={rooms}
                      onChange={(e) => setRooms(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
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
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Wohnfläche (ca. m²):' : 'Living Area (approx. m²):'}
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={1000}
                      value={livingArea}
                      onChange={(e) => setLivingArea(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Wunsch-Mietzins (CHF / Mt.):' : 'Target Rent (CHF / mo.):'}
                    </label>
                    <input
                      type="number"
                      step={50}
                      value={expectedRent}
                      onChange={(e) => setExpectedRent(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Service Model & Move-In Date */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>{language === 'de' ? 'Vermietungspaket & Zeitplan' : 'Placement Model & Timeline'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Gewünschter Serviceumfang' : 'Requested Service Scope'}
                </h2>

                {/* Service Types */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  {[
                    {
                      id: 'all_inclusive' as const,
                      title: { de: 'Rundum-Sorglos-Paket', en: 'All-Inclusive Placement' },
                      desc: {
                        de: 'Provision: Nur 15 Tage Miete bei Vertragsabschluss. Inkl. Profi-Fotos, interaktiver 3D Tour, Video-Walkthrough, Bonitätsprüfung & Mietvertrag.',
                        en: 'Commission: Only 15 days rent upon contract signing. Incl. pro photos, interactive 3D tour, video walkthrough, solvency checks & lease contract.',
                      },
                      tag: { de: 'Meistgewählt', en: 'Most Popular' },
                    },
                    {
                      id: 'first_letting' as const,
                      title: { de: 'Erstvermietung (Neubau)', en: 'First-Time Letting' },
                      desc: {
                        de: 'Für Neubauprojekte oder Totalsanierungen mit gestaffelter Mieterakquise.',
                        en: 'For new developments and major renovations with phased placement.',
                      },
                      tag: { de: 'Neubau', en: 'New Build' },
                    },
                    {
                      id: 're_letting' as const,
                      title: { de: 'Klassischer Mieterwechsel', en: 'Standard Re-Letting' },
                      desc: {
                        de: 'Schnelle Nachmietersuche bei Kündigung zur Vermeidung von Doppelbelastung.',
                        en: 'Fast replacement tenant search to ensure seamless transition.',
                      },
                      tag: { de: 'Schnellservice', en: 'Fast Track' },
                    },
                  ].map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setRentalServiceType(pkg.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        rentalServiceType === pkg.id
                          ? 'border-[#C5A059] bg-[#FAF6EE] shadow-sm'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-[#8C6D1F] border border-[#EBDCB7] px-2 py-0.5 rounded">
                            {pkg.tag[language]}
                          </span>
                          {rentalServiceType === pkg.id && (
                            <Check className="w-4 h-4 text-[#C5A059]" />
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900">{pkg.title[language]}</h3>
                        <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{pkg.desc[language]}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Move-in Date & Preferences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6 pt-5 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Bezugsbereit ab:' : 'Available for Occupancy from:'}
                    </label>
                    <input
                      type="text"
                      value={availableDate}
                      onChange={(e) => setAvailableDate(e.target.value)}
                      placeholder={language === 'de' ? 'z.B. Ab sofort oder per 1. Mai 2026' : 'e.g. Immediately or from May 1st'}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                      {language === 'de' ? 'Kriterien an die zukünftigen Mieter:' : 'Tenant Preferences:'}
                    </label>
                    <input
                      type="text"
                      value={tenantPreferences}
                      onChange={(e) => setTenantPreferences(e.target.value)}
                      placeholder={language === 'de' ? 'z.B. Solvente Einzelperson/Paar, keine Haustiere' : 'e.g. Solvent single/couple, no pets'}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Owner Details & On-site Photography Appointment */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>{language === 'de' ? 'Eigentümer-Kontaktdaten & Vor-Ort-Termin' : 'Owner Contact & On-Site Visit'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-950 font-display">
                  {language === 'de' ? 'Wann dürfen wir Ihre Liegenschaft besichtigen?' : 'When can we visit your property?'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {language === 'de'
                    ? 'Unser Team kommt zu Ihrer Liegenschaft für eine fundierte Mietzinsanalyse sowie professionelle Fotoaufnahmen, 3D Tour & Video-Walkthrough.'
                    : 'Our team visits your property for exact rent valuation as well as professional photography, 3D tour & video walkthrough.'}
                </p>

                {/* Owner Contacts */}
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
                      placeholder="z.B. Beat Meier"
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
                      placeholder="b.meier@beispiel.ch"
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
                      placeholder="+41 79 345 67 89"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>
                </div>

                {/* Appointment Date & Window */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 p-4 rounded-lg bg-[#FAF6EE] border border-[#EBDCB7]">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{language === 'de' ? 'Wunschtermin für Vor-Ort-Besuch:' : 'Preferred Date for On-Site Visit:'}</span>
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#8C6D1F] mb-1.5 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{language === 'de' ? 'Bevorzugtes Zeitfenster:' : 'Preferred Time Window:'}</span>
                    </label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] bg-white text-neutral-900"
                    >
                      <option value="morning">{language === 'de' ? 'Vormittag (09:00 – 12:00)' : 'Morning (09:00 – 12:00)'}</option>
                      <option value="afternoon">{language === 'de' ? 'Nachmittag (13:00 – 16:00)' : 'Afternoon (13:00 – 16:00)'}</option>
                      <option value="late">{language === 'de' ? 'Spätnachmittag (16:00 – 19:00)' : 'Late Afternoon (16:00 – 19:00)'}</option>
                      <option value="flexible">{language === 'de' ? 'Ganztags flexibel' : 'Flexible all day'}</option>
                    </select>
                  </div>
                </div>

                {/* Consent */}
                <div className="mt-5 space-y-2.5 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 accent-[#C5A059]"
                    />
                    <span>
                      {language === 'de'
                        ? 'Ich stimme der Kontaktaufnahme und vertraulichen Behandlung meiner Liegenschaftsdaten gemäss Schweizer Datenschutzgesetz zu.'
                        : 'I agree to contact and confidential handling of my property data under Swiss data privacy law.'}
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Action */}
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                    <span>{language === 'de' ? 'Schriftliche Bestätigung per E-Mail innert 24h' : 'Written confirmation by email within 24h'}</span>
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
                        ? 'Vermietung anfragen & Mieter finden'
                        : 'Request Rental Placement & Find Tenants'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.form>
          ) : (
            /* Confirmation Card */
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
                {language === 'de' ? 'Vermieter-Anfrage erfolgreich erfasst' : 'Landlord Inquiry Successfully Received'}
              </span>

              <h2 className="text-2xl sm:text-3xl font-display font-normal text-neutral-950 mt-4">
                {language === 'de'
                  ? `Vielen Dank, ${name}!`
                  : `Thank You, ${name}!`}
              </h2>
              <p className="text-sm text-neutral-600 mt-2 max-w-xl mx-auto font-light leading-relaxed">
                {language === 'de'
                  ? `Ihr Vermietungsauftrag wurde unter der Referenznummer ${referenceId} registriert. Eine schriftliche Bestätigung wurde an ${email} versandt.`
                  : `Your rental placement inquiry has been registered under reference ${referenceId}. A confirmation email has been dispatched to ${email}.`}
              </p>

              {/* Summary */}
              <div className="mt-8 text-left bg-neutral-50 rounded-xl p-6 border border-neutral-200/80 space-y-3 text-xs">
                <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-800 border-b border-neutral-200 pb-2">
                  {language === 'de' ? 'Zusammenfassung Ihrer Liegenschaft:' : 'Summary of Your Property:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Objektart:' : 'Property Type:'}</span>{' '}
                    <span className="font-semibold text-neutral-900">{propertyType} ({rooms} Zi., {livingArea} m²)</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Liegenschaft:' : 'Location:'}</span>{' '}
                    <span className="font-semibold text-neutral-900">{location}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Mietzinsziel:' : 'Target Rent:'}</span>{' '}
                    <span className="font-semibold text-neutral-900 font-mono">CHF {expectedRent.toLocaleString('de-CH')} / Mt.</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{language === 'de' ? 'Vor-Ort-Besuch:' : 'On-Site Visit:'}</span>{' '}
                    <span className="font-semibold text-neutral-900">{appointmentDate ? `${appointmentDate} (${appointmentTime})` : 'Wird telefonisch abgestimmt'}</span>
                  </div>
                </div>
              </div>

              {/* What happens now */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs">
                <div className="p-4 rounded-lg bg-white border border-neutral-200">
                  <div className="font-semibold text-neutral-900 flex items-center gap-1.5 mb-1 text-sm">
                    <span className="text-[#8C6D1F]">01.</span>
                    <span>{language === 'de' ? 'Kontaktaufnahme < 24h' : 'Contact < 24h'}</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {language === 'de'
                      ? 'Ein lizenzierter Veracy Vermietungsmakler meldet sich zur Vorbereitung des Fototermins.'
                      : 'A licensed Veracy broker contacts you to prepare the on-site photo appointment.'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-neutral-200">
                  <div className="font-semibold text-neutral-900 flex items-center gap-1.5 mb-1 text-sm">
                    <span className="text-[#8C6D1F]">02.</span>
                    <span>{language === 'de' ? 'Multichannel-Reichweite' : 'Multichannel Reach'}</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {language === 'de'
                      ? 'Sofortige Ausschreibung auf Homegate, ImmoScout24 & in unserer solventen Mieterkartei.'
                      : 'Immediate advertising across Homegate, ImmoScout24, and our pre-screened tenant network.'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-white border border-neutral-200">
                  <div className="font-semibold text-neutral-900 flex items-center gap-1.5 mb-1 text-sm">
                    <span className="text-[#8C6D1F]">03.</span>
                    <span>{language === 'de' ? 'Geprüfter Mietvertrag' : 'Vetted Lease'}</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {language === 'de'
                      ? 'Vollständige Bonitätsprüfung und Schweizer Mietvertrag nach OR für maximale Sicherheit.'
                      : 'Full credit checks and legally verified Swiss lease contracts for complete security.'}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'de' ? 'Weitere Liegenschaft erfassen' : 'Add Another Property'}</span>
                </button>
                <button
                  onClick={onOpenConsultation}
                  className="px-6 py-2.5 rounded-lg bg-neutral-950 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-[#DFB76C]" />
                  <span>{language === 'de' ? 'Direktberatung anfragen' : 'Direct Call'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 Steps Journey for Landlords */}
        <section className="mt-20 pt-16 border-t border-neutral-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C6D1F] font-semibold">
              {language === 'de' ? 'Der Veracy Vermieterprozess' : 'The Landlord Journey'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal font-display text-neutral-950 mt-2">
              {language === 'de'
                ? 'In vier Schritten zum solventen Wunschmieter'
                : 'Four Clear Steps to Qualified Tenants'}
            </h2>
            <p className="mt-2 text-sm text-neutral-600 font-light">
              {language === 'de'
                ? 'Strukturiert, transparent und fair: Provision nur 15 Tage Miete bei erfolgreichem Abschluss.'
                : 'Structured, transparent, and fair: Commission only 15 days of rent upon success.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rentalSteps.map((step, idx) => (
              <div
                key={step.step}
                className="p-6 rounded-lg bg-white border border-neutral-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-mono font-bold text-[#C5A059] mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-2">
                    {step.title[language]}
                  </h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    {step.desc[language]}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#C5A059]" />
                  <span>{language === 'de' ? 'Provision: Nur 15 Tage Miete' : 'Fee: Only 15 days rent'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
