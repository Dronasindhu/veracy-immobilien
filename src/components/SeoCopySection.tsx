import React, { useState } from 'react';
import { Language } from '../types';
import { ChevronDown, Sparkles, Shield, Clock, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SeoCopySectionProps {
  language: Language;
}

export const SeoCopySection: React.FC<SeoCopySectionProps> = ({ language }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: {
        de: 'Wie kann Veracy höchste Maklerqualität zu so tiefen Festpreisen anbieten?',
        en: 'How can Veracy offer top Swiss broker quality at such low flat fees?',
      },
      a: {
        de: 'Klassische Schweizer Immobilienagenturen tragen riesige Büromieten und ineffiziente manuelle Prozesse mit sich, die über 2.5% bis 3.0% Provision auf Sie als Eigentümer abgewälzt werden. Veracy setzt auf modernste Technologie bei Inseraten, Grundrissen und digitaler Vorqualifizierung. Vor Ort betreut Sie ein erfahrener Schweizer Makler mit SVIT-Hintergrund – Sie zahlen aber nur für echte Leistung.',
        en: 'Traditional Swiss brokerages carry heavy administrative overhead and physical office branches, passed onto owners via 2.5% to 3.0% commissions. Veracy automates listing distribution, floor plans, and digital pre-qualification while assigning a seasoned Swiss broker on-site. You only pay for real value.',
      },
    },
    {
      q: {
        de: 'Was bedeutet die garantierte Reaktionszeit von unter 24 Stunden?',
        en: 'What does the verified response time under 24 hours entail?',
      },
      a: {
        de: 'Verzögerte Antworten kosten Käufer. Im Schweizer Markt verliert eine Immobilie an Schwung, wenn Anfragen tagein tagaus unbeantwortet bleiben. Wir garantieren Ihnen und jedem verifizierten Interessenten an Werktagen eine fundierte Rückmeldung innert 24 Stunden.',
        en: 'Delayed replies cost buyers. In the competitive Swiss market, interest drops rapidly when buyer inquiries linger. We guarantee that both you and every verified prospect receive a response within 24 hours on business days.',
      },
    },
    {
      q: {
        de: 'Entstehen mir als Verkäufer Kosten, wenn meine Liegenschaft nicht verkauft wird?',
        en: 'Do I incur any costs if my property is not successfully sold?',
      },
      a: {
        de: 'Nein. Bei Veracy gilt das Null-Risiko-Prinzip: Unsere Festpreis-Honorare werden ausschließlich bei erfolgreicher notarieller Eigentumsübertragung fällig. Wird die Immobilie nicht verkauft, schulden Sie uns keinen Rappen.',
        en: 'No. Veracy adheres to a zero-risk principle: our flat fees are payable exclusively upon successful notary deed execution. If the property is not sold, you pay zero CHF.',
      },
    },
    {
      q: {
        de: 'Unterstützt Veracy auch bei der Schweizer Grundstückgewinnsteuer und Notariatsfragen?',
        en: 'Does Veracy assist with Swiss real estate capital gains tax and notary matters?',
      },
      a: {
        de: 'Ja. Das kantonale Steuer- und Sachenrecht ist anspruchsvoll. Wir berechnen für Sie vorab die voraussichtliche kantonale Grundstückgewinnsteuer, koordinieren das Notariat und das Grundbuchamt und prüfen alle Kauf- und Reservationsverträge.',
        en: 'Yes. Cantonal tax and property law requires specialized expertise. We calculate preliminary capital gains tax estimations, coordinate with notaries and land registries, and review formal reservation and purchase contracts.',
      },
    },
  ];

  return (
    <section className="py-20 bg-neutral-50 border-t border-neutral-200 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold mb-2">
            {language === 'de' ? 'Transparenz & FAQ' : 'Transparency & FAQ'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-neutral-950">
            {language === 'de'
              ? 'Häufig gestellte Fragen zum Verkauf & Schätzung'
              : 'Frequently Asked Questions regarding Selling & Valuation'}
          </h2>
          <p className="text-xs text-neutral-600 mt-2 font-light">
            {language === 'de'
              ? 'Klarheit schaffen vor dem ersten Schritt. Hier erfahren Sie alles zu Verträgen, Schutz und Kosten.'
              : 'Total clarity before your first step. Learn about our procedures, security, and fee structures.'}
          </p>
        </motion.div>

        {/* Accordion FAQ */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white rounded-lg border border-neutral-200 overflow-hidden transition-all shadow-sm hover:border-neutral-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
                >
                  <span className="text-sm font-semibold text-neutral-900">
                    {faq.q[language]}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-neutral-950' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-neutral-600 font-light leading-relaxed border-t border-neutral-100">
                        {faq.a[language]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* SEO Swiss Real Estate Trust Summary Box */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="mt-12 p-6 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-600 space-y-2 shadow-sm hover:border-neutral-300 transition-colors"
        >
          <div className="font-semibold text-neutral-900 flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {language === 'de'
                ? 'Veracy Immobilien – Die neue Generation des Schweizer Immobilienverkaufs'
                : 'Veracy Immobilien – Next-Generation Swiss Property Brokerage'}
            </span>
          </div>
          <p className="font-light leading-relaxed">
            {language === 'de'
              ? 'Veracy Immobilien steht für das zeitgemäße Maklererlebnis in den Kantonen Zürich und Aargau (Baden, Aarau, Winterthur und Umgebung): Höchste fachliche Präzision, garantierte Erreichbarkeit und Festpreise, die Ihnen als Eigentümer zehntausende Franken an Maklerprovision einsparen. Ob Sie eine Immobilie verkaufen, ein neues Zuhause kaufen oder mieten oder eine fundierte Schätzung benötigen – wir sind Ihr verlässlicher Schweizer Partner.'
              : 'Veracy Immobilien represents contemporary Swiss brokerage excellence across the cantons of Zurich and Aargau (Baden, Aarau, Winterthur and surrounding regions): technical rigor, verified response times, and flat-rate models that save owners tens of thousands in fees. Whether you want to sell a property, buy or rent, or obtain an accurate valuation, Veracy is your trusted Swiss ally.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
