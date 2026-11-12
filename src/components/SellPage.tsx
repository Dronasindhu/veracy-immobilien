import React, { useState } from 'react';
import { Language, SellingPackage } from '../types';
import { Check, ArrowRight, ShieldCheck, Clock, HelpCircle, FileText, Sparkles, Calendar, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface SellPageProps {
  language: Language;
  onSelectPackage?: (pkg: SellingPackage) => void;
  onOpenConsultation: () => void;
}

export const SellPage: React.FC<SellPageProps> = ({
  language,
  onSelectPackage,
  onOpenConsultation,
}) => {
  const [salesPrice, setSalesPrice] = useState<number>(1250000);

  const traditionalCommission = Math.round(salesPrice * 0.025);
  const veracyCommission = Math.round(salesPrice * 0.007);
  const netSavings = Math.max(0, traditionalCommission - veracyCommission);

  const formatChf = (val: number) => `CHF ${val.toLocaleString('de-CH')}`;

  const sellingSteps = [
    {
      step: '01',
      title: {
        de: 'Kostenlose Marktwertanalyse & Strategie',
        en: 'Complimentary Valuation & Strategy',
      },
      desc: {
        de: 'Wir analysieren den aktuellen Marktwert Ihrer Liegenschaft mit hedonischen Vergleichsdaten und besprechen die optimale Preisstrategie vor Ort.',
        en: 'We analyze your property’s fair market value using Swiss hedonic databases and define the ideal pricing strategy on-site.',
      },
    },
    {
      step: '02',
      title: {
        de: 'Profi-Fotos, 3D Tour & Video-Walkthrough',
        en: 'Pro Photos, 3D Tour & Video Walkthrough',
      },
      desc: {
        de: 'Professionelle HDR-Fotografie vor Ort, interaktive Matterport 3D Tour, cinematischer Video-Walkthrough sowie Top-Listing auf Homegate & ImmoScout24 für maximale Käuferresonanz.',
        en: 'Professional on-site HDR photography, interactive Matterport 3D tour, cinematic video walkthrough, and priority placement on Homegate & ImmoScout24 for peak buyer interest.',
      },
    },
    {
      step: '03',
      title: {
        de: 'Besichtigungen & Geprüfte Bonitätsprüfung',
        en: 'Viewings & Solvency Verification',
      },
      desc: {
        de: 'Unsere lizenzierten Makler führen die Besichtigungen durch und prüfen verbindliche Finanzierungszusagen Schweizer Banken vor Abschluss.',
        en: 'Our licensed brokers conduct viewings, qualify buyers, and verify formal mortgage confirmations from Swiss financial institutions.',
      },
    },
    {
      step: '04',
      title: {
        de: 'Notarielle Beurkundung & Schlüsselübergabe',
        en: 'Notarization & Official Handover',
      },
      desc: {
        de: 'Wir koordinieren den Notartermin, begleiten Sie zum Grundbuchamt, unterstützen bei der Grundstückgewinnsteuer und leiten die offizielle Übergabe.',
        en: 'We coordinate the notary appointment, accompany you to the land registry, assist with capital gains tax, and manage official handover.',
      },
    },
  ];

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-neutral-900 text-white py-16 sm:py-24 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E6CA85] font-medium mb-3">
              <span>{language === 'de' ? 'Immobilie verkaufen' : 'Sell Property'}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{language === 'de' ? 'Nur 0.7% Provision' : 'Only 0.7% Commission'}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{language === 'de' ? 'Fotos, 3D Tour & Walkthrough inkl.' : 'Photos, 3D Tour & Walkthrough incl.'}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-normal font-display tracking-tight text-white leading-tight">
              {language === 'de' ? (
                <>
                  Ihre Immobilie erfolgreich verkaufen.{' '}
                  <span className="text-[#E6CA85] italic font-light block sm:inline">
                    Zu nur 0.7% Provision.
                  </span>
                </>
              ) : (
                <>
                  Sell Your Property Successfully.{' '}
                  <span className="text-[#E6CA85] italic font-light block sm:inline">
                    At Only 0.7% Commission.
                  </span>
                </>
              )}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
              {language === 'de'
                ? 'Schweizer Makler-Vollservice zu unschlagbaren Konditionen: Bei Veracy ist die komplette multimediale Vermarktung (Profi-Fotos, 3D Matterport Tour, Video-Walkthrough) bereits im Standard-Mandat zu nur 0.7% Erfolgshonorar inbegriffen.'
                : 'Swiss full-service brokerage at unbeatable terms: Veracy includes comprehensive multimedia marketing (pro HDR photos, 3D Matterport tour, video walkthrough) in our standard 0.7% success-fee mandate.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-neutral-300">
              <span className="px-3 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#E6CA85] font-medium">
                ✓ {language === 'de' ? 'Profi-Fotos inklusive' : 'Pro photos included'}
              </span>
              <span className="px-3 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#E6CA85] font-medium">
                ✓ {language === 'de' ? 'Interaktive 3D Tour' : 'Interactive 3D tour'}
              </span>
              <span className="px-3 py-1 rounded bg-neutral-800 border border-neutral-700 text-[#E6CA85] font-medium">
                ✓ {language === 'de' ? 'Video-Walkthrough' : 'Video walkthrough'}
              </span>
              <span className="px-3 py-1 rounded bg-neutral-800 border border-neutral-700 text-white font-medium">
                ✓ {language === 'de' ? '0 CHF Vorabkosten' : '0 CHF upfront'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Schweizer Makler-Vollservice – Nur 0.7% Provision */}
      <section className="py-16 sm:py-24 bg-neutral-50 border-b border-neutral-200 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <div className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#8C6D1F] font-bold mb-2">
              {language === 'de' ? 'Unser klares Schweizer Modell' : 'Our Transparent Swiss Model'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal font-display text-neutral-950 tracking-tight">
              {language === 'de'
                ? 'Schweizer Makler-Vollservice: Nur 0.7% Provision'
                : 'Full Swiss Brokerage: Only 0.7% Commission'}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 font-normal">
              {language === 'de'
                ? 'Keine Pakete, keine versteckten Kosten und 0 CHF Vorabkosten: Bei Veracy zahlen Sie ausschliesslich 0.7% Erfolgshonorar bei erfolgreicher Beurkundung.'
                : 'No packages, no hidden fees, and 0 CHF upfront: With Veracy, you strictly pay 0.7% success fee upon notarization.'}
            </p>
          </motion.div>

          {/* Unified 0.7% Full Service Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border-2 border-neutral-900 p-8 sm:p-12 shadow-xl relative"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-neutral-200">
              <div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#FAF6EE] text-[#8C6D1F] border border-[#C5A059] px-3.5 py-1 rounded-full shadow-xs">
                  {language === 'de' ? '100% Makler-Vollservice vor Ort' : '100% Full On-Site Brokerage'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-semibold text-neutral-950 mt-3">
                  {language === 'de' ? 'Rundum-Sorglos-Verkaufsmandat' : 'Turnkey Sales Mandate'}
                </h3>
                <p className="text-neutral-600 text-sm sm:text-base mt-1.5 font-normal">
                  {language === 'de'
                    ? 'Persönliche Betreuung von A bis Z für Einfamilienhäuser, Eigentumswohnungen und Mehrfamilienhäuser in Zürich & Aargau.'
                    : 'Personal guidance from start to finish for houses, apartments, and residential buildings in Zurich & Aargau.'}
                </p>
              </div>

              <div className="text-left lg:text-right shrink-0">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-neutral-950 tracking-tight">
                  0.7%
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 font-medium mt-1">
                  {language === 'de' ? 'Erfolgshonorar erst bei Notariatsvertrag' : 'Success fee only upon notarization'}
                </div>
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2.5 py-1 inline-block mt-2">
                  {language === 'de' ? '0 CHF Vorabkosten / Kein Risiko' : '0 CHF upfront / Zero risk'}
                </div>
              </div>
            </div>

            {/* Everything Included 2-column checklist */}
            <div className="mt-8">
              <div className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">
                {language === 'de' ? 'In der 0.7% Provision lückenlos inbegriffen:' : 'Fully included in the 0.7% commission:'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { de: 'Schweizer Makler-Vollservice & persönliche Vertretung vor Ort', en: 'Full Swiss on-site brokerage & personal representation' },
                  { de: 'Professionelle HDR-Fotografie vor Ort & 2D/3D Grundrisse', en: 'Professional HDR photography & 2D/3D floor plans' },
                  { de: 'Interaktive Matterport 3D Tour (Virtueller Rundgang)', en: 'Interactive Matterport 3D virtual tour' },
                  { de: 'Cinematischer Video-Walkthrough für Web & Social Media', en: 'Cinematic video walkthrough for portals & social media' },
                  { de: 'Prioritäts-Listing auf Homegate, ImmoScout24 & Flatfox', en: 'Priority listing on Homegate, ImmoScout24 & Flatfox' },
                  { de: 'Erstellung eines hochwertigen Verkaufsdossiers', en: 'Creation of a premium sales dossier' },
                  { de: 'Durchführung sämtlicher Besichtigungen durch Veracy Makler', en: 'Conducting all viewings by licensed Veracy brokers' },
                  { de: 'Professionelle Preisverhandlung & strukturiertes Bieterverfahren', en: 'Professional price negotiation & structured bidding' },
                  { de: 'Bank- & Bonitätsprüfung der Käufer vor Reservation', en: 'Bank mortgage & solvency vetting before reservation' },
                  { de: 'Koordination des Notartermins & Begleitung zum Grundbuchamt', en: 'Coordination of notary & accompaniment to land registry' },
                  { de: 'Steuerliche Ersteinschätzung der Grundstückgewinnsteuer', en: 'Initial tax calculation for Swiss capital gains tax' },
                  { de: 'Rechtssichere Kaufvertragsprüfung & protokollierte Übergabe', en: 'Contract legal verification & documented handover' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-neutral-700 font-normal leading-snug">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item[language]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA in the 0.7% card */}
            <div className="mt-10 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 font-medium">
                <Clock className="w-4.5 h-4.5 text-[#C5A059]" />
                <span>{language === 'de' ? 'Antwort innert 24h garantiert · 100% unverbindlich' : 'Guaranteed response < 24h · 100% non-binding'}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenConsultation}
                className="px-8 py-4 bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#B38E3E] hover:from-[#E8C785] hover:to-[#C5A059] text-neutral-950 font-bold rounded-xl text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 cursor-pointer shadow-md border border-[#C5A059]/40"
              >
                <span>{language === 'de' ? 'Verkauf anfragen (0.7% Provision)' : 'Inquire Sale (0.7% Commission)'}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Real Estate Savings Calculator in Switzerland */}
      <section className="py-20 bg-white border-t border-b border-neutral-200 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-neutral-900 text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-[#C5A059]/30"
          >
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-widest text-[#E6CA85] font-semibold">
                {language === 'de' ? 'Transparenz im Schweizer Vergleich' : 'Transparent Swiss Comparison'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-normal text-white mt-2">
                {language === 'de'
                  ? 'Wie viel sparen Sie mit Veracy?'
                  : 'How Much Do You Save with Veracy?'}
              </h2>
              <p className="text-sm text-neutral-300 mt-2 font-light">
                {language === 'de'
                  ? 'Vergleichen Sie unsere Schweizer Rekord-Provision von nur 0.7% mit der marktüblichen Maklerprovision von 2.5% in der Schweiz.'
                  : 'Compare our Switzerland-lowest 0.7% broker commission with typical 2.5% Swiss broker commissions.'}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm text-neutral-300">
                    {language === 'de' ? 'Verkaufspreis Liegenschaft:' : 'Property Sale Price:'}
                  </span>
                  <span className="text-2xl font-bold font-mono text-[#E6CA85] tabular-nums">
                    {formatChf(salesPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={3500000}
                  step={50000}
                  value={salesPrice}
                  onChange={(e) => setSalesPrice(Number(e.target.value))}
                  className="w-full h-2.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-1 font-mono">
                  <span>CHF 500'000</span>
                  <span>CHF 1'800'000</span>
                  <span>CHF 3'500'000</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
                <div className="bg-neutral-800/80 p-4 rounded-lg">
                  <div className="text-xs text-neutral-400 mb-1">
                    {language === 'de' ? 'Klassische Provision (2.5%)' : 'Classic Broker (2.5%)'}
                  </div>
                  <div className="text-xl font-bold text-neutral-300 font-mono tabular-nums line-through decoration-red-400">
                    {formatChf(traditionalCommission)}
                  </div>
                </div>

                <div className="bg-neutral-800/80 p-4 rounded-lg">
                  <div className="text-xs text-[#E6CA85] mb-1 font-medium">
                    {language === 'de' ? 'Veracy Makler (Nur 0.7%)' : 'Veracy Broker (Only 0.7%)'}
                  </div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums">
                    {formatChf(veracyCommission)}
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#B38E3E] text-neutral-950 p-4 rounded-lg flex flex-col justify-between shadow border border-[#C5A059]/40"
                >
                  <div className="text-xs uppercase tracking-wider font-bold text-neutral-950">
                    {language === 'de' ? 'Ihre Netto-Ersparnis' : 'Your Net Savings'}
                  </div>
                  <div className="text-2xl font-extrabold font-mono tabular-nums">
                    +{formatChf(netSavings)}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Selling Journey in 4 Steps */}
      <section className="py-20 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold mb-2">
              {language === 'de' ? 'Der Verkaufsprozess' : 'The Selling Journey'}
            </div>
            <h2 className="text-3xl font-normal font-display text-neutral-950 tracking-tight">
              {language === 'de' ? 'In vier Schritten zum beurkundeten Verkauf' : 'Four Clear Steps from Valuation to Notary'}
            </h2>
            <p className="mt-2 text-sm text-neutral-600 font-light">
              {language === 'de'
                ? 'Strukturiert, transparent und mit persönlicher Begleitung in jeder Phase.'
                : 'Structured, transparent, and personally guided through every phase.'}
            </p>

            {/* Standalone Primary Action Button moved to Top */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenConsultation}
                className="px-8 py-3.5 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-md hover:shadow-xl cursor-pointer inline-flex items-center gap-2.5 border border-neutral-900 group"
              >
                <Calendar className="w-4 h-4 text-[#DFB76C]" />
                <span>{language === 'de' ? 'Kostenlose Verkaufsberatung vereinbaren' : 'Schedule Free Selling Consultation'}</span>
                <ArrowRight className="w-4 h-4 text-[#DFB76C] transition-transform group-hover:translate-x-1" />
              </motion.button>
              <div className="flex items-center gap-5 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                  {language === 'de' ? 'Reaktion innert 24h garantiert' : 'Response guaranteed < 24h'}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  {language === 'de' ? '100% Unverbindlich' : '100% Non-binding'}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sellingSteps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group p-6 sm:p-7 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl font-mono font-bold text-[#C5A059] mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-2 group-hover:text-[#8C6D1F] transition-colors leading-snug">
                    {step.title[language]}
                  </h3>
                  <p className="text-sm text-neutral-700 font-normal leading-relaxed">
                    {step.desc[language]}
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-neutral-200 text-xs text-neutral-600 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{language === 'de' ? 'Reaktion innert 24h' : 'Response in 24h'}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
