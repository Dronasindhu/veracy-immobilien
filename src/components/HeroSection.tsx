import React, { useState } from 'react';
import { Language, MainCategory } from '../types';
import { HERO_IMAGE } from '../data/mockData';
import { ArrowRight, ShieldCheck, Clock, Award, CheckCircle2, KeyRound } from 'lucide-react';
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
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E6CA85] font-medium"
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
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums group-hover:text-[#E6CA85] transition-colors">
                  &lt; 24h
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {language === 'de' ? 'Antwortgarantie' : 'Response Guarantee'}
                </div>
              </div>
              <div className="group">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums group-hover:text-[#E6CA85] transition-colors">
                  0 CHF
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {language === 'de' ? 'Vorab-Kostenrisiko' : 'Upfront Financial Risk'}
                </div>
              </div>
              <div className="group">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#E6CA85] tabular-nums group-hover:text-[#F0D59E] transition-colors">
                  ~ 70%
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {language === 'de' ? 'Kostenersparnis' : 'Commission Savings'}
                </div>
              </div>
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('sell')}
                className="px-6 py-3.5 text-xs font-semibold tracking-wide uppercase text-neutral-950 bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#B38E3E] hover:from-[#E8C785] hover:to-[#C5A059] rounded shadow-lg shadow-[#C5A059]/20 flex items-center gap-2 cursor-pointer transition-all border border-[#C5A059]/40"
              >
                <span>{language === 'de' ? 'Immobilie verkaufen' : 'Sell Property'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('buy-rent')}
                className="px-6 py-3.5 text-xs font-medium tracking-wide uppercase text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded border border-white/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>{language === 'de' ? 'Objekte entdecken' : 'Browse Properties'}</span>
                <ArrowRight className="w-4 h-4 text-[#DFB76C]" />
              </motion.button>
            </motion.div>

            {/* Secondary Trust Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-300"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#DFB76C]" />
                {language === 'de' ? 'SVIT / USVT Ausbildungsstandard' : 'Swiss Real Estate Standard'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#DFB76C]" />
                {language === 'de' ? 'Diskrete Off-Market Optionen' : 'Discreet Off-Market Network'}
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Veracy Core Services Hub (Sell, Rent Out & Buy/Rent) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="bg-white text-neutral-900 rounded-xl p-5 sm:p-7 shadow-2xl border border-neutral-100 relative hover:shadow-[#C5A059]/10 transition-shadow space-y-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#8C6D1F] font-semibold mb-1">
                  {language === 'de' ? 'Schweizer Maklerkompetenz' : 'Swiss Brokerage Excellence'}
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950 font-display">
                  {language === 'de'
                    ? 'Ihr Partner für Verkauf, Vermietung & Kauf'
                    : 'Your Partner for Selling, Renting & Buying'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  {language === 'de'
                    ? 'Professionelle Schweizer Maklerdienstleistung in den Kantonen Zürich und Aargau mit transparenter Kostenstruktur.'
                    : 'Professional Swiss brokerage service across Zurich and Aargau with transparent pricing.'}
                </p>
              </div>

              {/* Service Card 1: Sell Property */}
              <div
                onClick={() => onNavigate('sell')}
                className="group p-3.5 sm:p-4 rounded-lg border border-neutral-200 hover:border-[#C5A059] bg-neutral-50 hover:bg-[#FAF6EE] transition-all cursor-pointer flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded bg-white shadow-sm border border-neutral-200 group-hover:border-[#C5A059] shrink-0 text-[#8C6D1F]">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral-900 group-hover:text-[#8C6D1F] transition-colors">
                      {language === 'de' ? '01. Immobilie verkaufen' : '01. Sell Property'}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] px-2 py-0.5 rounded shrink-0">
                      {language === 'de' ? 'ab CHF 3’900' : 'from CHF 3,900'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 font-light leading-relaxed">
                    {language === 'de'
                      ? 'Festpreise statt überrissene 2–3% Provision. Bis zu CHF 35’000 sparen bei vollem Makler-Einsatz.'
                      : 'Flat fees instead of 2–3% broker fees. Save up to CHF 35,000 with full brokerage service.'}
                  </p>
                  <div className="mt-2 text-xs font-medium text-[#8C6D1F] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{language === 'de' ? 'Verkaufspakete ansehen' : 'View Selling Packages'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Service Card 2: Rent Out Property (Vermieten) */}
              <div
                onClick={() => {
                  if (onOpenConsultation) {
                    onOpenConsultation();
                  } else {
                    onNavigate('sell');
                  }
                }}
                className="group p-3.5 sm:p-4 rounded-lg border border-neutral-200 hover:border-[#C5A059] bg-neutral-50 hover:bg-[#FAF6EE] transition-all cursor-pointer flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded bg-white shadow-sm border border-neutral-200 group-hover:border-[#C5A059] shrink-0 text-[#8C6D1F]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral-900 group-hover:text-[#8C6D1F] transition-colors">
                      {language === 'de' ? '02. Immobilie vermieten' : '02. Rent out Property'}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#FAF6EE] text-[#8C6D1F] border border-[#EBDCB7] px-2 py-0.5 rounded shrink-0">
                      {language === 'de' ? 'Erst- & Wiedervermietung' : 'Tenant Placement'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 font-light leading-relaxed">
                    {language === 'de'
                      ? 'Professionelle Mietersuche, umfassende Bonitätsprüfung, rechtssichere Mietverträge & lückenlose Übergabe.'
                      : 'Professional tenant search, credit checks, Swiss lease contracts & seamless handover protocols.'}
                  </p>
                  <div className="mt-2 text-xs font-medium text-[#8C6D1F] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{language === 'de' ? 'Vermietung anfragen' : 'Request Rental Service'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Service Card 3: Buy & Rent */}
              <div
                onClick={() => onNavigate('buy-rent')}
                className="group p-3.5 sm:p-4 rounded-lg border border-neutral-200 hover:border-[#C5A059] bg-neutral-50 hover:bg-[#FAF6EE] transition-all cursor-pointer flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded bg-white shadow-sm border border-neutral-200 group-hover:border-[#C5A059] shrink-0 text-[#8C6D1F]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral-900 group-hover:text-[#8C6D1F] transition-colors">
                      {language === 'de' ? '03. Kaufen & Mieten' : '03. Buy & Rent'}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider bg-neutral-200/60 text-neutral-700 px-2 py-0.5 rounded shrink-0">
                      {language === 'de' ? 'Kuriert' : 'Curated'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 font-light leading-relaxed">
                    {language === 'de'
                      ? 'Geprüfte Wohn- und Anlageobjekte in Zürich & Aargau sowie diskrete Off-Market Gelegenheiten.'
                      : 'Verified prime residences in Zurich & Aargau plus discreet off-market opportunities.'}
                  </p>
                  <div className="mt-2 text-xs font-medium text-[#8C6D1F] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{language === 'de' ? 'Objekte durchsuchen' : 'Browse Properties'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Consultation Action */}
              {onOpenConsultation && (
                <div className="pt-2 border-t border-neutral-100">
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={onOpenConsultation}
                    className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <span>{language === 'de' ? 'Kostenlose Erstberatung vereinbaren' : 'Request Free Consultation'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#DFB76C]" />
                  </motion.button>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#C5A059]" />
                  {language === 'de' ? 'Antwort innert 24h' : 'Response within 24h'}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#C5A059]" />
                  {language === 'de' ? '100% Unverbindlich' : '100% No obligation'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
