import React, { useState } from 'react';
import { Language } from '../types';
import { Check, X, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface QualityValueModelProps {
  language: Language;
  onOpenConsultation: () => void;
}

export const QualityValueModel: React.FC<QualityValueModelProps> = ({
  language,
  onOpenConsultation,
}) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(1250000);

  // Traditional Swiss broker commission (typically 2.5% - 3.0% + MWST)
  const traditionalRate = 0.025;
  const traditionalFee = Math.round(propertyPrice * traditionalRate);
  const veracyFlatFee = 7900;
  const savings = Math.max(0, traditionalFee - veracyFlatFee);

  const formatChf = (val: number) => {
    return `CHF ${val.toLocaleString('de-CH')}`;
  };

  return (
    <section className="py-20 sm:py-28 bg-neutral-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-[#E6CA85] font-semibold mb-2">
            {language === 'de' ? 'Das Veracy Wertmodell' : 'The Veracy Value Model'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal font-display tracking-tight text-white text-balance">
            {language === 'de'
              ? 'Höchste Schweizer Maklerqualität zu fairen Festpreisen.'
              : 'Uncompromising Swiss Broker Quality at Fair Flat Fees.'}
          </h2>
          <p className="mt-3 text-base text-neutral-300 font-light leading-relaxed">
            {language === 'de'
              ? 'Warum 2.5% bis 3% Maklerprovision für dieselben Portalinserate und Notariatsabläufe bezahlen? Durch modernste digitale Workflows und schlanke Strukturen bieten wir vollwertigen Maklerservice vor Ort – ohne überhöhte Provisionen.'
              : 'Why pay 2.5% to 3.0% in broker commissions for the same property listings and notary filings? By eliminating unnecessary administrative overhead, we provide full on-site Swiss brokerage with massive savings.'}
          </p>
        </motion.div>

        {/* Interactive Savings Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-6 sm:p-10 mb-16 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Input Slider */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1">
                  {language === 'de' ? 'Interaktiver Provisionsrechner' : 'Interactive Fee Calculator'}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  {language === 'de' ? 'Berechnen Sie Ihre Ersparnis' : 'Calculate Your Net Savings'}
                </h3>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm text-neutral-300 font-medium">
                    {language === 'de' ? 'Verkaufswert Ihrer Liegenschaft:' : 'Expected Property Sale Price:'}
                  </span>
                  <span className="text-2xl font-semibold text-[#E6CA85] font-mono tabular-nums">
                    {formatChf(propertyPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={3500000}
                  step={50000}
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                />
                <div className="flex justify-between text-xs text-neutral-500 mt-2 font-mono">
                  <span>CHF 500'000</span>
                  <span>CHF 1'800'000</span>
                  <span>CHF 3'500'000</span>
                </div>
              </div>

              <div className="p-4 bg-neutral-900/60 rounded border border-neutral-700/60 text-xs text-neutral-300 space-y-1">
                <p className="font-medium text-white">
                  {language === 'de' ? 'Transparente Schweizer Kalkulation:' : 'Transparent Swiss Calculation:'}
                </p>
                <p>
                  {language === 'de'
                    ? 'Traditionelle Makler: 2.5% zzgl. Nebenkosten. Veracy Standard Full Service: CHF 7’900 Festpreis nur im Erfolgsfall.'
                    : 'Traditional Swiss brokers: 2.5% plus extra fees. Veracy Standard Full Service: Flat CHF 7,900 only upon successful sale.'}
                </p>
              </div>
            </div>

            {/* Right: Calculated Comparison Box */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Traditional Broker Box */}
              <div className="bg-neutral-900/80 p-5 rounded-lg border border-neutral-700/70 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
                    {language === 'de' ? 'Traditioneller Makler (2.5%)' : 'Traditional Broker (2.5%)'}
                  </div>
                  <div className="text-2xl font-semibold text-neutral-300 font-mono tabular-nums line-through decoration-red-400/80">
                    {formatChf(traditionalFee)}
                  </div>
                  <p className="text-xs text-neutral-400 mt-2">
                    {language === 'de'
                      ? 'Hohe prozentuale Provision auf den gesamten Verkaufswert.'
                      : 'High percentage fee calculated against total property value.'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-500">
                  {language === 'de' ? 'Oft intransparente Nebenspesen' : 'Often hidden extra expenses'}
                </div>
              </div>

              {/* Veracy Box */}
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-gradient-to-b from-neutral-800 to-neutral-900 p-5 rounded-lg border-2 border-[#C5A059] flex flex-col justify-between relative shadow-lg"
              >
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-neutral-950 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                  {language === 'de' ? 'Ihre Ersparnis' : 'Your Net Savings'}
                </div>
                <div>
                  <div className="text-xs text-[#E6CA85] uppercase tracking-wider mb-1 font-medium">
                    {language === 'de' ? 'Veracy Festpreis' : 'Veracy Flat Fee'}
                  </div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">
                    {formatChf(veracyFlatFee)}
                  </div>
                  <div className="mt-3 text-lg font-bold text-[#E6CA85] font-mono tabular-nums">
                    +{formatChf(savings)} {language === 'de' ? 'gespart' : 'saved'}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-700/70 text-[11px] text-neutral-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#DFB76C] shrink-0" />
                  <span>{language === 'de' ? 'Voller Service vor Ort inklusive' : 'Full on-site broker service included'}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="bg-neutral-950/60 rounded-xl border border-neutral-800 overflow-hidden"
        >
          <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-800">
            <h4 className="text-base font-semibold text-white">
              {language === 'de'
                ? 'Vergleich: Veracy vs. Traditionelle Schweizer Makler'
                : 'Comparison: Veracy vs. Traditional Swiss Brokers'}
            </h4>
          </div>
          <div className="divide-y divide-neutral-800/80 text-sm">
            {[
              {
                feature: language === 'de' ? 'Kostenstruktur' : 'Cost Structure',
                veracy: language === 'de' ? 'Transparenter Festpreis ab CHF 3’900' : 'Transparent flat rate from CHF 3,900',
                traditional: language === 'de' ? '2.5% – 3.0% Provision (CHF 25’000 – 60’000+)' : '2.5% – 3.0% commission (CHF 25k – 60k+)',
              },
              {
                feature: language === 'de' ? 'Persönlicher Makler vor Ort' : 'Personal Broker On-Site',
                veracy: language === 'de' ? 'Ja, zertifizierter Makler leitet Besichtigungen' : 'Yes, certified broker leads viewings',
                traditional: language === 'de' ? 'Ja' : 'Yes',
              },
              {
                feature: language === 'de' ? 'Reaktionszeit & Erreichbarkeit' : 'Response Time & Availability',
                veracy: language === 'de' ? 'Garantierte Rückmeldung innert < 24 Stunden' : 'Guaranteed callback in < 24 hours',
                traditional: language === 'de' ? 'Oft mehrere Tage Verzögerung' : 'Often multiple days delay',
              },
              {
                feature: language === 'de' ? 'Inserate auf Homegate & ImmoScout24' : 'Portal Listings (Homegate, ImmoScout)',
                veracy: language === 'de' ? 'Inklusive Top-Listing & Premium-Platzierung' : 'Included Top Listing & priority visibility',
                traditional: language === 'de' ? 'Oft zusätzliche Inseratekosten verrechnet' : 'Often billed separately as ad cost',
              },
              {
                feature: language === 'de' ? 'Kostenrisiko bei Nichterfolg' : 'Risk If Not Sold',
                veracy: language === 'de' ? '0 CHF (Erfolgsbasiert, kein Risiko)' : '0 CHF (Strictly success-based, zero risk)',
                traditional: language === 'de' ? 'Teils Aufwandentschädigungen' : 'Often charges retainer / expense fee',
              },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 p-4 sm:px-6 items-center gap-2 hover:bg-neutral-900/40 transition-colors">
                <div className="md:col-span-4 font-medium text-neutral-300">
                  {row.feature}
                </div>
                <div className="md:col-span-4 text-[#E6CA85] font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#E6CA85] shrink-0" />
                  <span>{row.veracy}</span>
                </div>
                <div className="md:col-span-4 text-neutral-400 flex items-center gap-2">
                  <span className="text-neutral-500 text-xs hidden md:inline">vs.</span>
                  <span>{row.traditional}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#B38E3E] hover:from-[#E8C785] hover:to-[#C5A059] text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded transition-all shadow-md active:scale-[0.99] cursor-pointer border border-[#C5A059]/40"
          >
            <span>{language === 'de' ? 'Kostenlose Beratung & Einsparung prüfen' : 'Check Your Potential Savings Today'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};
