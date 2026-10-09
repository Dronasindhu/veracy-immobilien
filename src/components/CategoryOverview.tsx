import React from 'react';
import { Language, MainCategory } from '../types';
import { ArrowRight, Tag, KeyRound, Calculator } from 'lucide-react';
import { ZURICH_PENTHOUSE_IMG, LUZERN_VILLA_IMG, ZUG_APARTMENT_IMG } from '../data/mockData';
import { motion } from 'motion/react';

interface CategoryOverviewProps {
  language: Language;
  onNavigate: (category: MainCategory) => void;
}

export const CategoryOverview: React.FC<CategoryOverviewProps> = ({
  language,
  onNavigate,
}) => {
  const categories = [
    {
      id: 'sell' as MainCategory,
      title: {
        de: '01. Immobilie verkaufen',
        en: '01. Sell Property',
      },
      subtitle: {
        de: 'Transparente Festpreise statt überrissene Provisionen',
        en: 'Transparent flat fees instead of inflated commissions',
      },
      description: {
        de: 'Verkaufen Sie Ihre Eigentumswohnung oder Ihr Haus mit Schweizer Full-Service-Maklern. Klare Pakete ab CHF 3’900 Festpreis, professionelle Vermarktung und Null Risiko.',
        en: 'Sell your apartment or home with dedicated Swiss full-service brokers. Clear fixed packages from CHF 3,900, premium presentation, and zero financial risk.',
      },
      actionText: {
        de: 'Verkaufspakete entdecken',
        en: 'Explore Selling Packages',
      },
      highlight: {
        de: 'Ersparnis: Bis zu CHF 35’000',
        en: 'Savings: Up to CHF 35,000',
      },
      icon: Tag,
      image: ZURICH_PENTHOUSE_IMG,
    },
    {
      id: 'buy-rent' as MainCategory,
      title: {
        de: '02. Kaufen & Mieten',
        en: '02. Buy & Rent',
      },
      subtitle: {
        de: 'Kuratierte Schweizer Premium-Objekte & Off-Market',
        en: 'Curated Swiss prime properties & off-market deals',
      },
      description: {
        de: 'Entdecken Sie handverlesene Wohn- und Anlageimmobilien in begehrten Lagen von Zürich und Aargau mit transparenten Objektdossiers.',
        en: 'Discover hand-picked residential and investment properties across top locations in Zurich and Aargau with comprehensive dossiers.',
      },
      actionText: {
        de: 'Aktuelle Objekte durchsuchen',
        en: 'Browse Current Listings',
      },
      highlight: {
        de: 'Geprüfte Qualität & Dossiers',
        en: 'Verified Quality & Dossiers',
      },
      icon: KeyRound,
      image: LUZERN_VILLA_IMG,
    },
    {
      id: 'valuation' as MainCategory,
      title: {
        de: '03. Professionelle Schätzung',
        en: '03. Property Valuation',
      },
      subtitle: {
        de: 'Hedonische Marktwertanalyse mit 24h-Garantie',
        en: 'Hedonic market analysis with 24h response guarantee',
      },
      description: {
        de: 'Ermitteln Sie den realistischen Marktwert Ihrer Liegenschaft. Fundierte hedonische Daten kombiniert mit lokaler Maklerexpertise für Ihren optimalen Verkaufspreis.',
        en: 'Determine the accurate market value of your property. Robust hedonic data paired with local broker intelligence for optimal pricing strategy.',
      },
      actionText: {
        de: 'Kostenlose Schätzung anfordern',
        en: 'Request Free Valuation',
      },
      highlight: {
        de: 'Reaktionszeit < 24 Stunden',
        en: 'Response time < 24 hours',
      },
      icon: Calculator,
      image: ZUG_APARTMENT_IMG,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-neutral-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold mb-2">
            {language === 'de' ? 'Das Veracy Leistungsspektrum' : 'The Veracy Core Portfolio'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal font-display text-neutral-950 tracking-tight text-balance">
            {language === 'de'
              ? 'Drei klare Säulen für Ihren Immobilienerfolg in der Schweiz.'
              : 'Three Focused Pillars for Your Swiss Real Estate Success.'}
          </h2>
          <p className="mt-3 text-base text-neutral-600 font-light leading-relaxed">
            {language === 'de'
              ? 'Kein unübersichtlicher Dienstleistungsdschungel. Wir fokussieren uns präzise auf die drei entscheidenden Kernbereiche: Verkauf, Erwerb/Miete und fundierte Bewertung.'
              : 'No convoluted service catalog. We focus strictly on the three vital pillars: selling, acquiring/renting, and accurate valuation.'}
          </p>
        </motion.div>

        {/* 3 Main Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group flex flex-col justify-between bg-neutral-50/60 rounded-lg border border-neutral-200/90 overflow-hidden hover:border-neutral-400/80 transition-colors duration-200 hover:shadow-xl"
              >
                {/* Visual Image Header */}
                <div className="relative h-48 overflow-hidden bg-neutral-200">
                  <img
                    src={cat.image}
                    alt={cat.title[language]}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/20 to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded text-neutral-900 shadow-sm group-hover:bg-amber-400 transition-colors">
                    <Icon className="w-4 h-4 text-neutral-900" />
                  </div>
                  <div className="absolute bottom-3 left-4 text-xs font-medium text-amber-300">
                    {cat.highlight[language]}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-neutral-900 mb-1 group-hover:text-amber-900 transition-colors">
                      {cat.title[language]}
                    </h3>
                    <div className="text-xs font-medium text-neutral-500 mb-3">
                      {cat.subtitle[language]}
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed font-light mb-6">
                      {cat.description[language]}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-200/80">
                    <button
                      onClick={() => {
                        onNavigate(cat.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 px-4 bg-white hover:bg-neutral-900 hover:text-white border border-neutral-300 text-neutral-900 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer group-hover:border-neutral-900 shadow-xs"
                    >
                      <span>{cat.actionText[language]}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
