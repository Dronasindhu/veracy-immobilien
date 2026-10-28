import React, { useState } from 'react';
import { Language } from '../types';
import { Sparkles, ArrowRight, CheckCircle2, Tag, KeyRound } from 'lucide-react';
import { motion } from 'motion/react';

interface QualityValueModelProps {
  language: Language;
  onOpenConsultation: () => void;
}

export const QualityValueModel: React.FC<QualityValueModelProps> = ({
  language,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<'sell' | 'rent'>('sell');
  const [propertyPrice, setPropertyPrice] = useState<number>(1500000);
  const [monthlyRent, setMonthlyRent] = useState<number>(2600);

  // Sales commission: 2.5% traditional vs 0.7% Veracy
  const traditionalSalesFee = Math.round(propertyPrice * 0.025);
  const veracySalesFee = Math.round(propertyPrice * 0.007);
  const salesSavings = Math.max(0, traditionalSalesFee - veracySalesFee);

  // Rental commission: Traditional brokers charge 1-2 months rent (standard 1.0 month)
  // Veracy charges 15 days of rent (monthlyRent / 30 * 15 = monthlyRent * 0.5)
  const traditionalRentFee = Math.round(monthlyRent * 1.0);
  const veracyRentFee = Math.round(monthlyRent * 0.5);
  const rentSavings = Math.max(0, traditionalRentFee - veracyRentFee);

  const formatChf = (val: number) => `CHF ${val.toLocaleString('de-CH')}`;

  return (
    <section className="py-16 sm:py-24 bg-neutral-900 text-white relative overflow-hidden border-b border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Clean Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-[#E6CA85] font-semibold mb-2">
            {language === 'de' ? 'Transparente Konditionen' : 'Transparent Terms'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal font-display tracking-tight text-white">
            {language === 'de'
              ? 'Berechnen Sie Ihre Ersparnis'
              : 'Calculate Your Broker Savings'}
          </h2>
          <p className="mt-3 text-sm text-neutral-300 font-light leading-relaxed">
            {language === 'de'
              ? 'Vergleichen Sie die Veracy Konditionen direkt mit traditionellen Schweizer Maklergebühren.'
              : 'Compare Veracy terms directly with standard Swiss real estate broker fees.'}
          </p>

          {/* Tab Selector: Sell vs Rent-Out */}
          <div className="mt-6 inline-flex p-1 rounded-lg bg-neutral-800 border border-neutral-700">
            <button
              onClick={() => setActiveTab('sell')}
              className={`px-5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'sell'
                  ? 'bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{language === 'de' ? 'Verkauf (0.7%)' : 'Selling (0.7%)'}</span>
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`px-5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'rent'
                  ? 'bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{language === 'de' ? 'Vermietung (15 Tage Miete)' : 'Renting (15 Days Rent)'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Calculator Box */}
        <div className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          {activeTab === 'sell' ? (
            /* Sales Calculator */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1">
                    {language === 'de' ? 'Verkaufswert Liegenschaft' : 'Expected Sale Price'}
                  </div>
                  <div className="text-3xl font-semibold text-[#E6CA85] font-mono tabular-nums">
                    {formatChf(propertyPrice)}
                  </div>
                </div>

                <div>
                  <input
                    type="range"
                    min={500000}
                    max={3500000}
                    step={50000}
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-500 mt-2 font-mono">
                    <span>CHF 500'000</span>
                    <span>CHF 1'800'000</span>
                    <span>CHF 3'500'000</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-400 pt-2">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#DFB76C] shrink-0" />
                    <span>{language === 'de' ? 'Traditionell: 2.5% Provision fällig' : 'Traditional: 2.5% commission'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#DFB76C] shrink-0" />
                    <span>{language === 'de' ? 'Veracy: Nur 0.7% Erfolgshonorar bei Beurkundung' : 'Veracy: Only 0.7% success fee upon notarization'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#E6CA85]">
                    <Sparkles className="w-3.5 h-3.5 text-[#DFB76C] shrink-0" />
                    <span>{language === 'de' ? 'Inklusive Profi-Fotos, interaktive 3D Tour & Video-Walkthrough' : 'Includes pro photos, interactive 3D tour & video walkthrough'}</span>
                  </div>
                </div>
              </div>

              {/* Calculated Comparison */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-neutral-900/90 p-5 rounded-xl border border-neutral-800 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
                      {language === 'de' ? 'Marktstandard (2.5%)' : 'Market standard (2.5%)'}
                    </div>
                    <div className="text-xl font-semibold text-neutral-400 font-mono tabular-nums line-through decoration-red-400/80">
                      {formatChf(traditionalSalesFee)}
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      {language === 'de' ? 'Übliche Schweizer Maklerprovision.' : 'Standard Swiss broker fee.'}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 p-5 rounded-xl border-2 border-[#C5A059] flex flex-col justify-between relative shadow-lg">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#E6CA85] mb-1">
                    {language === 'de' ? 'Veracy (Nur 0.7%)' : 'Veracy (Only 0.7%)'}
                  </div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums">
                    {formatChf(veracySalesFee)}
                  </div>
                  <div className="mt-3 pt-3 border-t border-neutral-700/80">
                    <div className="text-[11px] text-neutral-300">
                      {language === 'de' ? 'Ihre Ersparnis:' : 'Your Savings:'}
                    </div>
                    <div className="text-lg font-bold text-[#E6CA85] font-mono tabular-nums">
                      +{formatChf(salesSavings)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Rental Calculator */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1">
                    {language === 'de' ? 'Monatlicher Mietzins (netto)' : 'Monthly Net Rent'}
                  </div>
                  <div className="text-3xl font-semibold text-[#E6CA85] font-mono tabular-nums">
                    {formatChf(monthlyRent)} / Mt.
                  </div>
                </div>

                <div>
                  <input
                    type="range"
                    min={1200}
                    max={6000}
                    step={100}
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-500 mt-2 font-mono">
                    <span>CHF 1'200</span>
                    <span>CHF 3'500</span>
                    <span>CHF 6'000</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-400 pt-2">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#DFB76C] shrink-0" />
                    <span>{language === 'de' ? 'Traditionell: 1 bis 2 Monatsmieten Provision' : 'Traditional: 1 to 2 months rent'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#DFB76C] shrink-0" />
                    <span>{language === 'de' ? 'Veracy: Nur 15 Tage Miete (halbe Monatsmiete)' : 'Veracy: Only 15 days rent (0.5 month)'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#E6CA85]">
                    <Sparkles className="w-3.5 h-3.5 text-[#DFB76C] shrink-0" />
                    <span>{language === 'de' ? 'Inklusive Profi-Fotos, interaktive 3D Tour & Video-Walkthrough' : 'Includes pro photos, interactive 3D tour & video walkthrough'}</span>
                  </div>
                </div>
              </div>

              {/* Calculated Comparison */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-neutral-900/90 p-5 rounded-xl border border-neutral-800 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
                      {language === 'de' ? 'Marktstandard (1 Monatsmiete)' : 'Market standard (1 mo. rent)'}
                    </div>
                    <div className="text-xl font-semibold text-neutral-400 font-mono tabular-nums line-through decoration-red-400/80">
                      {formatChf(traditionalRentFee)}
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">
                      {language === 'de' ? 'Oft 1–2 Monatskaltmieten.' : 'Typically 1–2 full months.'}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 p-5 rounded-xl border-2 border-[#C5A059] flex flex-col justify-between relative shadow-lg">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#E6CA85] mb-1">
                    {language === 'de' ? 'Veracy (Nur 15 Tage Miete)' : 'Veracy (Only 15 Days Rent)'}
                  </div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums">
                    {formatChf(veracyRentFee)}
                  </div>
                  <div className="mt-3 pt-3 border-t border-neutral-700/80">
                    <div className="text-[11px] text-neutral-300">
                      {language === 'de' ? 'Ihre Ersparnis:' : 'Your Savings:'}
                    </div>
                    <div className="text-lg font-bold text-[#E6CA85] font-mono tabular-nums">
                      +{formatChf(rentSavings)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Unified Action */}
          <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#B38E3E] text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer border border-[#C5A059]/40"
            >
              <span>{language === 'de' ? 'Kostenlose Beratung anfordern' : 'Request Free Consultation'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
