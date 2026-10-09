import React from 'react';
import { Language } from '../types';
import { TESTIMONIALS } from '../data/mockData';
import { ShieldCheck, Clock, Award, Star, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface TrustSectionProps {
  language: Language;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ language }) => {
  const pillars = [
    {
      icon: Clock,
      title: language === 'de' ? 'Reaktionsgarantie < 24 Stunden' : 'Guaranteed Response < 24 Hours',
      desc:
        language === 'de'
          ? 'Kein langes Warten auf Rückrufe oder Exposés. Sie und Ihre Kaufinteressenten erhalten an Werktagen innert maximal 24 Stunden eine fundierte Rückmeldung.'
          : 'Zero waiting days for callbacks or dossiers. Both you and potential buyers receive comprehensive responses within 24 hours on business days.',
      tag: language === 'de' ? 'Geprüfte Service-Garantie' : 'Verified Service Pledge',
    },
    {
      icon: ShieldCheck,
      title: language === 'de' ? '100% Diskretion & Vertrauen' : '100% Discretion & Trust',
      desc:
        language === 'de'
          ? 'Von der diskreten Off-Market Vermittlung bis zur sensiblen Erbengemeinschaft: Ihre persönlichen Vermögensdaten und Liegenschaftsunterlagen werden nach strengsten Schweizer Datenschutzrichtlinien verwaltet.'
          : 'From confidential off-market mandates to sensitive inheritance estates: your private financial assets and property documentation are handled under strict Swiss data security laws.',
      tag: language === 'de' ? 'Diskrete Off-Market Optionen' : 'Discreet Off-Market Option',
    },
    {
      icon: Award,
      title: language === 'de' ? 'Geprüfte Maklerkompetenz (ZH & AG)' : 'Certified Broker Competence (ZH & AG)',
      desc:
        language === 'de'
          ? 'Unsere Partner und Makler sind SVIT-/USVT-geschult und verfügen über tiefgreifende Marktkenntnisse im kantonalen Steuer-, Notariats- und Sachenrecht von Zürich und Aargau.'
          : 'Our brokers adhere to SVIT/USVT professional standards, bringing in-depth knowledge of Swiss property tax, land registry, and cantonal capital gains regulations in Zurich and Aargau.',
      tag: language === 'de' ? 'Notariats- & Steuerbegleitung' : 'Legal & Tax Support',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-neutral-50 border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold mb-2">
            {language === 'de' ? 'Schweizer Vertrauensstandards' : 'Swiss Trust Standards'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal font-display text-neutral-950 tracking-tight">
            {language === 'de'
              ? 'Präzision, Diskretion und garantierte Schnelligkeit.'
              : 'Precision, Discretion, and Verified Speed.'}
          </h2>
          <p className="mt-3 text-base text-neutral-600 font-light leading-relaxed">
            {language === 'de'
              ? 'In den Regionen Zürich und Aargau ist Vertrauen das höchste Gut. Wir schützen Ihre Privatsphäre, verhandeln mit geschultem Verhandlungsgeschick und garantieren maximale Erreichbarkeit.'
              : 'In the Zurich and Aargau regions, trust is paramount. We protect your confidentiality, negotiate with seasoned skill, and guarantee prompt responsiveness.'}
          </p>
        </motion.div>

        {/* 3 Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group bg-white p-8 rounded-lg border border-neutral-200 shadow-sm hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-neutral-900 rounded-md flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-colors duration-300">
                    <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-amber-900 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-neutral-600 font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{pillar.tag}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Client Testimonials */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h3 className="text-2xl font-semibold text-neutral-900">
              {language === 'de' ? 'Was Eigentümer in Zürich und Aargau sagen' : 'What Property Owners in Zurich & Aargau Say'}
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-lg border border-neutral-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-sm text-neutral-700 italic font-light leading-relaxed mb-6">
                    "{t.quote}"
                  </blockquote>
                </div>
                <div className="pt-4 border-t border-neutral-100">
                  <div className="text-sm font-semibold text-neutral-900">{t.author}</div>
                  <div className="text-xs text-neutral-500">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

