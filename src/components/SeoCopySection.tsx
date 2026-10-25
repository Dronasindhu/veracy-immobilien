import React, { useState } from 'react';
import { Language } from '../types';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SeoCopySectionProps {
  language: Language;
}

export const SeoCopySection: React.FC<SeoCopySectionProps> = ({ language }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: {
        de: 'Wie funktioniert die Verkaufsprovision von nur 0.7%?',
        en: 'How does the 0.7% sales commission work?',
      },
      a: {
        de: 'Sie erhalten vollen Schweizer Maklerservice vor Ort: Professionelle HDR-Fotografie, Grundrisse, Premium-Inserate auf Homegate und ImmoScout24, Durchführung aller Besichtigungen, Bonitätsprüfung der Käufer und Koordination des Notartermins. Unsere Provision beträgt lediglich 0.7% des notariell beurkundeten Verkaufspreises (statt üblicher 2.5% bis 3.0%). Fällig wird sie erst bei erfolgreicher Eigentumsübertragung.',
        en: 'You receive full on-site Swiss brokerage: HDR photography, floor plans, priority listings on Homegate & ImmoScout24, accompanied viewings, buyer solvency vetting, and notary coordination. Our commission is strictly 0.7% of the notarized sales price (instead of 2.5%–3.0%), payable only upon successful completion.',
      },
    },
    {
      q: {
        de: 'Was bedeutet die Vermietungsprovision von nur 15 Tagen Miete?',
        en: 'What does the 15-day rent commission for landlords mean?',
      },
      a: {
        de: 'Bei erfolgreicher Vermietung Ihrer Liegenschaft zahlen Sie als Vermieter lediglich 15 Tage des vereinbarten Nettomietzinses (ca. eine halbe Monatsmiete) als Erfolgshonorar. Im Schweizer Markt verlangen traditionelle Makler meist 1 bis 2 volle Monatsmieten. Bei Veracy ist der gesamte Vermietungsprozess (Inserate, Bonitätsprüfung, Betreibungsauszug, Mietvertrag nach OR) inbegriffen – und fällig erst bei unterschriebenem Mietvertrag.',
        en: 'Upon successful lease signing, landlords pay only 15 days of the agreed net rent (approx. half a month’s rent) as success commission. Traditional Swiss brokers charge 1 to 2 full months’ rent. At Veracy, the entire service (listings, solvency check, debt enforcement register, OR lease contract) is included — payable only after contract signing.',
      },
    },
    {
      q: {
        de: 'Entstehen mir Kosten, wenn meine Immobilie nicht vermittelt wird?',
        en: 'Do I incur any costs if my property is not sold or rented?',
      },
      a: {
        de: 'Nein. Bei Veracy gilt das 100% Erfolgsprinzip: Sowohl beim Verkauf (0.7%) als auch bei der Vermietung (15 Tage Miete) schulden Sie uns keinen Rappen, falls kein Abschluss zustande kommt. Es gibt keine versteckten Spesen oder Vorabkosten.',
        en: 'No. Veracy operates on a 100% performance basis: For both sales (0.7%) and rentals (15 days rent), you pay zero CHF if no contract is executed. There are no hidden expenses or upfront retainer fees.',
      },
    },
    {
      q: {
        de: 'Unterstützt Veracy auch bei Notariatsfragen und der Grundstückgewinnsteuer?',
        en: 'Does Veracy assist with notary coordination and property taxes?',
      },
      a: {
        de: 'Ja. Wir berechnen für Sie vorab die voraussichtliche kantonale Grundstückgewinnsteuer in Zürich oder Aargau, stimmen Verträge mit dem Notariat und Grundbuchamt ab und begleiten Sie persönlich bis zur Schlüsselübergabe.',
        en: 'Yes. We calculate estimated cantonal capital gains taxes in Zurich or Aargau, coordinate directly with notaries and land registries, and accompany you through official property transfer.',
      },
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-neutral-50 border-t border-neutral-200 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold mb-2">
            {language === 'de' ? 'Transparenz & FAQ' : 'Transparency & FAQ'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-medium text-neutral-950">
            {language === 'de'
              ? 'Häufig gestellte Fragen'
              : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs text-neutral-600 mt-2 font-light">
            {language === 'de'
              ? 'Alles Wissenswerte zu unseren Konditionen, Verträgen und Abläufen.'
              : 'Clear answers regarding our terms, contracts, and procedures.'}
          </p>
        </div>

        {/* Accordion FAQ */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-lg border border-neutral-200 overflow-hidden transition-all shadow-xs hover:border-neutral-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
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
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-neutral-600 font-light leading-relaxed border-t border-neutral-100">
                        {faq.a[language]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
