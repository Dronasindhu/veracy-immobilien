import React from 'react';
import { Language } from '../types';
import { TESTIMONIALS } from '../data/mockData';
import { ShieldCheck, Clock, Award, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface TrustSectionProps {
  language: Language;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ language }) => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-[#8C6D1F] font-semibold mb-2">
            {language === 'de' ? 'Erfahrungsberichte' : 'Verified Reviews'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal font-display text-neutral-950 tracking-tight">
            {language === 'de'
              ? 'Was Eigentümer über Veracy sagen'
              : 'What Property Owners Say About Us'}
          </h2>
          <p className="mt-3 text-sm text-neutral-600 font-light leading-relaxed">
            {language === 'de'
              ? 'Erfolgreich vermittelt in den Kantonen Zürich und Aargau: Höchste Kundenzufriedenheit und messbare Einsparungen.'
              : 'Successfully brokered across Zurich and Aargau: High client satisfaction and substantial fee savings.'}
          </p>
        </div>

        {/* 3 Client Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.2, ease: 'easeOut' } }}
              className="group bg-neutral-50 hover:bg-white p-6 sm:p-7 rounded-xl border border-neutral-200/90 hover:border-[#C5A059] shadow-xs hover:shadow-[0_16px_36px_rgba(197,160,89,0.12)] transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top subtle gold accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DFB76C] to-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div>
                <div className="flex items-center gap-1 text-[#C5A059] mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059] group-hover:scale-110 transition-transform" />
                  ))}
                </div>
                <blockquote className="text-xs sm:text-sm text-neutral-700 italic font-light leading-relaxed mb-6">
                  "{t.quote}"
                </blockquote>
              </div>
              <div className="pt-4 border-t border-neutral-200/80">
                <div className="text-xs font-semibold text-neutral-900 group-hover:text-[#8C6D1F] transition-colors">{t.author}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Slim Trust Bar */}
        <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-center justify-around gap-4 text-xs text-neutral-700">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#8C6D1F] shrink-0" />
            <span className="font-medium">
              {language === 'de' ? 'Reaktionsgarantie < 24 Stunden' : 'Guaranteed Response < 24 Hours'}
            </span>
          </div>
          <div className="hidden sm:block text-neutral-300">·</div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8C6D1F] shrink-0" />
            <span className="font-medium">
              {language === 'de' ? '100% Diskretion & Schweizer Datenschutz' : '100% Discretion & Swiss Privacy'}
            </span>
          </div>
          <div className="hidden sm:block text-neutral-300">·</div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#8C6D1F] shrink-0" />
            <span className="font-medium">
              {language === 'de' ? 'SVIT / USVT Maklerstandard (ZH & AG)' : 'SVIT / USVT Standards (ZH & AG)'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
