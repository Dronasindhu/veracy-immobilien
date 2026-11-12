import React from 'react';
import { Language, MainCategory } from '../types';
import { HERO_IMAGE } from '../data/mockData';
import { ArrowRight, Tag, KeyRound, Calendar, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  language: Language;
  onNavigate: (category: MainCategory) => void;
  onOpenConsultation?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onNavigate,
  onOpenConsultation,
}) => {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {/* Background Image with Calibrated Luxury Dark Gradient Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.05, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 0.85 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          src={HERO_IMAGE}
          alt="Veracy Immobilien – Schweizer Luxusimmobilien"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/95 via-neutral-950/85 to-neutral-950" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
        {/* Trust Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.18em] text-[#E6CA85] font-semibold mb-4"
        >
          <span>Schweizer Maklerstandard</span>
          <span aria-hidden="true" className="text-neutral-500">·</span>
          <span>Zürich & Aargau</span>
          <span aria-hidden="true" className="text-neutral-500">·</span>
          <span>100% Erfolgsbasiert</span>
        </motion.div>

        {/* Main Clean Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight font-display text-white leading-[1.12] max-w-4xl mx-auto"
        >
          {language === 'de' ? (
            <>
              Ihre Immobilie verkaufen oder vermieten.{' '}
              <span className="italic text-[#E6CA85] font-light block sm:inline">
                Zu Schweizer Top-Konditionen.
              </span>
            </>
          ) : (
            <>
              Sell or Rent Your Swiss Property.{' '}
              <span className="italic text-[#E6CA85] font-light block sm:inline">
                With Switzerland’s Lowest Commission.
              </span>
            </>
          )}
        </motion.h1>

        {/* Clear, Crisp Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-base sm:text-lg lg:text-xl text-neutral-200 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          {language === 'de'
            ? 'Veracy steht für erstklassigen Schweizer Maklerservice für Eigentümer in Zürich & Aargau: Nur 0.7% Verkaufsprovision und nur 15 Tage Miete bei erfolgreicher Vermietung. Keine Vorabkosten, kein Risiko.'
            : 'Veracy provides elite Swiss brokerage for property owners across Zurich & Aargau: Only 0.7% sales commission and only 15 days of rent upon successful tenancy placement. Zero upfront fees, zero risk.'}
        </motion.p>

        {/* Standalone Primary Action: Free Consultation (Purely Advisory / Consultation) */}
        {onOpenConsultation && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 max-w-lg mx-auto"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenConsultation}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#B38E3E] hover:from-[#E8C785] hover:to-[#C5A059] text-neutral-950 rounded-xl font-bold text-sm sm:text-base tracking-wide flex items-center justify-between gap-4 transition-all cursor-pointer shadow-xl shadow-[#C5A059]/20 border border-[#C5A059]/50 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-neutral-950/10 flex items-center justify-center shrink-0 text-neutral-950">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-bold tracking-wide truncate">
                    {language === 'de' ? 'Kostenlose Eigentümer-Beratung vereinbaren' : 'Request Free Owner Consultation'}
                  </div>
                  <div className="text-xs text-neutral-900/90 font-medium normal-case truncate">
                    {language === 'de' ? 'Unverbindliche Erstberatung & Markteinschätzung · Antwort < 24h' : 'No-obligation consultation & market valuation · Response < 24h'}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-950 shrink-0 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        )}

        {/* The 2 Core Options: Sell & Rent Out (Both Include Photos, 3D Tour & Walkthrough) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left"
        >
          {/* Card 1: Sell Property - 0.7% Commission */}
          <div
            onClick={() => onNavigate('sell')}
            className="group p-7 rounded-2xl border border-neutral-800 bg-neutral-900/90 hover:bg-neutral-900 hover:border-[#C5A059] transition-all cursor-pointer flex flex-col justify-between shadow-xl relative"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-lg bg-neutral-800 text-[#DFB76C] group-hover:bg-[#C5A059] group-hover:text-neutral-950 transition-colors">
                    <Tag className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-300">
                    {language === 'de' ? 'Verkaufen' : 'Sell'}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-[#FAF6EE] text-[#8C6D1F] border border-[#C5A059] px-3 py-1 rounded shadow-xs">
                  {language === 'de' ? 'Nur 0.7% Provision' : 'Only 0.7% Commission'}
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-white group-hover:text-[#DFB76C] transition-colors font-display">
                {language === 'de' ? 'Immobilie verkaufen' : 'Sell Property'}
              </h2>

              {/* Bullet Points */}
              <ul className="mt-4 space-y-3 text-sm sm:text-[15px] text-neutral-200 font-normal leading-snug">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#DFB76C] shrink-0 mt-0.5" />
                  <span>{language === 'de' ? 'Schweizer Makler-Vollservice vor Ort' : 'Full Swiss on-site brokerage'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#DFB76C] shrink-0 mt-0.5" />
                  <span>{language === 'de' ? 'Profi-Fotos, 3D Tour & Video-Walkthrough' : 'Pro photos, 3D tour & video walkthrough'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#DFB76C] shrink-0 mt-0.5" />
                  <span>{language === 'de' ? 'Top-Listing auf Homegate & ImmoScout24' : 'Top listing on Homegate & ImmoScout24'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#DFB76C] shrink-0 mt-0.5" />
                  <span>{language === 'de' ? 'Bonitätsprüfung & Notariatskoordination' : 'Solvency vetting & notary coordination'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#DFB76C] shrink-0 mt-0.5" />
                  <span className="text-[#E6CA85] font-semibold">{language === 'de' ? 'Erfolgshonorar (0.7%) erst bei Beurkundung' : 'Success fee (0.7%) only upon notarization'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-sm sm:text-base font-semibold text-[#DFB76C] group-hover:text-white transition-colors">
              <span>{language === 'de' ? 'Verkauf anfragen (0.7%)' : 'Inquire Sale (0.7%)'}</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Rent Out Property - 15 Days of Rent Commission */}
          <div
            onClick={() => onNavigate('rent-out')}
            className="group p-7 rounded-2xl border border-neutral-800 bg-neutral-900/90 hover:bg-neutral-900 hover:border-[#C5A059] transition-all cursor-pointer flex flex-col justify-between shadow-xl relative"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-lg bg-neutral-800 text-[#DFB76C] group-hover:bg-[#C5A059] group-hover:text-neutral-950 transition-colors">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-300">
                    {language === 'de' ? 'Vermieten' : 'Rent Out'}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-[#FAF6EE] text-[#8C6D1F] border border-[#C5A059] px-3 py-1 rounded shadow-xs">
                  {language === 'de' ? 'Nur 15 Tage Miete Provision' : 'Only 15 Days Rent Commission'}
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-white group-hover:text-[#DFB76C] transition-colors font-display">
                {language === 'de' ? 'Immobilie vermieten' : 'Rent Out Property'}
              </h2>

              {/* Bullet Points */}
              <ul className="mt-4 space-y-3 text-sm sm:text-[15px] text-neutral-200 font-normal leading-snug">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#DFB76C] shrink-0 mt-0.5" />
                  <span>{language === 'de' ? 'Kompletter Vermieter-Rundumservice vor Ort' : 'Full turnkey landlord service on-site'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#DFB76C] shrink-0 mt-0.5" />
                  <span>{language === 'de' ? 'Profi-Fotos, 3D Tour & Video-Walkthrough' : 'Pro photos, 3D tour & video walkthrough'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#DFB76C] shrink-0 mt-0.5" />
                  <span>{language === 'de' ? 'Strenge Bonitätsprüfung & Mieterselektion' : 'Strict solvency screening & tenant vetting'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#DFB76C] shrink-0 mt-0.5" />
                  <span>{language === 'de' ? 'Rechtssicherer Schweizer Mietvertrag nach OR' : 'Legally compliant Swiss lease contract (OR)'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#DFB76C] shrink-0 mt-0.5" />
                  <span className="text-[#E6CA85] font-semibold">{language === 'de' ? 'Provision nur 15 Tage Miete bei Abschluss' : 'Fee strictly 15 days rent upon signing'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-sm sm:text-base font-semibold text-[#DFB76C] group-hover:text-white transition-colors">
              <span>{language === 'de' ? 'Vermietung anfragen (15 Tage Miete)' : 'Inquire Rental Placement (15 Days Rent)'}</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </motion.div>

        {/* Minimalist Trust & Proof Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14 pt-8 border-t border-neutral-800/80 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-5 text-center"
        >
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#E6CA85] tabular-nums font-mono">0.7%</div>
            <div className="text-xs sm:text-sm text-neutral-300 mt-1 font-medium">
              {language === 'de' ? 'Verkaufsprovision' : 'Sales Commission'}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums font-mono">15 Tage</div>
            <div className="text-xs sm:text-sm text-neutral-300 mt-1 font-medium">
              {language === 'de' ? 'Miete bei Vermietung' : 'Rent as Commission'}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums font-mono">0 CHF</div>
            <div className="text-xs sm:text-sm text-neutral-300 mt-1 font-medium">
              {language === 'de' ? 'Vorabkosten / Risiko' : 'Upfront Fee / Risk'}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#E6CA85] tabular-nums font-mono">&lt; 24h</div>
            <div className="text-xs sm:text-sm text-neutral-300 mt-1 font-medium">
              {language === 'de' ? 'Antwortgarantie' : 'Response Guarantee'}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
