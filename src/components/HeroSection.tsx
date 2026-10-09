import React, { useState } from 'react';
import { Language, MainCategory } from '../types';
import { HERO_IMAGE } from '../data/mockData';
import { ArrowRight, ShieldCheck, Clock, Award, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  language: Language;
  onNavigate: (category: MainCategory) => void;
  onStartValuation: (zipOrDetails: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onNavigate,
  onStartValuation,
}) => {
  const [zipInput, setZipInput] = useState('');
  const [propertyTypeInput, setPropertyTypeInput] = useState('apartment');

  const handleQuickValuationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartValuation(`${propertyTypeInput}:${zipInput.trim()}`);
  };

  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.08, opacity: 0.8 }}
          animate={{ scale: 1.02, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          src={HERO_IMAGE}
          alt="Veracy Immobilien – Schweizer Luxusimmobilien"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Measured dark luxury scrim for 4.5:1+ text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/92 via-neutral-950/80 to-neutral-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Headline & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Trust Kicker - Clean unboxed text (anti-pill) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-400 font-medium"
            >
              <span>Schweizer Maklerstandard</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>Zürich & Aargau</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>Reaktion &lt; 24h</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight font-display text-white leading-[1.12] text-balance"
            >
              {language === 'de' ? (
                <>
                  Immobilien mit Vertrauen verkaufen. <br />
                  <span className="italic text-neutral-300 font-light">
                    Schweizer Qualität zum fairen Festpreis.
                  </span>
                </>
              ) : (
                <>
                  Sell Swiss Property with Trust. <br />
                  <span className="italic text-neutral-300 font-light">
                    Premium Quality at Transparent Flat Rates.
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg text-neutral-300 max-w-2xl font-light leading-relaxed"
            >
              {language === 'de'
                ? 'Veracy Immobilien verbindet kompromisslose Schweizer Maklerexpertise mit transparenter Festpreisführung. Sparen Sie bis zu 70% der üblichen Maklerprovision bei garantierter Reaktionsschnelligkeit innert 24 Stunden.'
                : 'Veracy Immobilien pairs uncompromising Swiss brokerage excellence with transparent flat-rate pricing. Save up to 70% in conventional broker commissions with a verified response time under 24 hours.'}
            </motion.p>

            {/* Quick Proof Metrics adjacent to claim */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="pt-2 grid grid-cols-3 gap-6 border-t border-neutral-800/80 max-w-xl"
            >
              <div className="group">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums group-hover:text-amber-300 transition-colors">
                  &lt; 24h
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {language === 'de' ? 'Antwortgarantie' : 'Response Guarantee'}
                </div>
              </div>
              <div className="group">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums group-hover:text-amber-300 transition-colors">
                  0 CHF
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {language === 'de' ? 'Vorab-Kostenrisiko' : 'Upfront Financial Risk'}
                </div>
              </div>
              <div className="group">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-amber-400 tabular-nums group-hover:text-amber-300 transition-colors">
                  ~ 70%
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {language === 'de' ? 'Kostenersparnis' : 'Commission Savings'}
                </div>
              </div>
            </motion.div>

            {/* Secondary Link Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-300"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                {language === 'de' ? 'SVIT / USVT Ausbildungsstandard' : 'Swiss Real Estate Standard'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                {language === 'de' ? 'Diskrete Off-Market Optionen' : 'Discreet Off-Market Network'}
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Quick Property Valuation Lead-Capture Widget */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="bg-white text-neutral-900 rounded-lg p-6 sm:p-8 shadow-2xl border border-neutral-100 relative hover:shadow-amber-950/20 transition-shadow">
              <div className="mb-5">
                <div className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold mb-1">
                  {language === 'de' ? 'Kostenlose Schnell-Schätzung' : 'Complimentary Quick Valuation'}
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950">
                  {language === 'de'
                    ? 'Was ist Ihre Immobilie heute wert?'
                    : 'What is your property worth today?'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1.5">
                  {language === 'de'
                    ? 'Erhalten Sie eine fundierte Ersteinschätzung für alle Schweizer Regionen in 2 Minuten.'
                    : 'Receive an accurate preliminary estimation for any Swiss canton within 2 minutes.'}
                </p>
              </div>

              <form onSubmit={handleQuickValuationSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    {language === 'de' ? 'Objektart' : 'Property Type'}
                  </label>
                  <select
                    value={propertyTypeInput}
                    onChange={(e) => setPropertyTypeInput(e.target.value)}
                    className="w-full text-sm rounded border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="apartment">
                      {language === 'de' ? 'Eigentumswohnung' : 'Condominium / Apartment'}
                    </option>
                    <option value="house">
                      {language === 'de' ? 'Einfamilienhaus / Villa' : 'Single-Family Home / Villa'}
                    </option>
                    <option value="penthouse">
                      {language === 'de' ? 'Attika / Penthouse' : 'Attic / Penthouse'}
                    </option>
                    <option value="multi-family">
                      {language === 'de' ? 'Mehrfamilienhaus / Renditeobjekt' : 'Multi-Family / Investment Property'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    {language === 'de' ? 'Postleitzahl oder Ortschaft (Schweiz)' : 'Postal Code or City (Switzerland)'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'de' ? 'z.B. 8008 Zürich oder 5400 Baden' : 'e.g. 8008 Zurich or 5400 Baden'}
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value)}
                    className="w-full text-sm rounded border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  />
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    className="w-full group py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <span>{language === 'de' ? 'Jetzt Schätzung starten' : 'Start Instant Valuation'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 text-amber-400" />
                  </motion.button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    {language === 'de' ? 'Dauer: ca. 60 Sek.' : 'Takes ~60 seconds'}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-neutral-400" />
                    {language === 'de' ? '100% Kostenlos & Unverbindlich' : '100% Free & No obligation'}
                  </span>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
