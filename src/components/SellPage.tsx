import React, { useState } from 'react';
import { Language, SellingPackage } from '../types';
import { SELLING_PACKAGES } from '../data/mockData';
import { Check, ArrowRight, ShieldCheck, Clock, HelpCircle, FileText, Sparkles } from 'lucide-react';

interface SellPageProps {
  language: Language;
  onSelectPackage: (pkg: SellingPackage) => void;
  onOpenConsultation: () => void;
}

export const SellPage: React.FC<SellPageProps> = ({
  language,
  onSelectPackage,
  onOpenConsultation,
}) => {
  const [salesPrice, setSalesPrice] = useState<number>(1650000);

  const traditionalCommission = Math.round(salesPrice * 0.025);
  const veracyStandardFee = 7900;
  const netSavings = Math.max(0, traditionalCommission - veracyStandardFee);

  const formatChf = (val: number) => `CHF ${val.toLocaleString('de-CH')}`;

  const sellingSteps = [
    {
      step: '01',
      title: {
        de: 'Kostenlose Marktwertanalyse & Strategie',
        en: 'Complimentary Valuation & Strategy',
      },
      desc: {
        de: 'Wir analysieren den aktuellen Marktwert Ihrer Liegenschaft mit hedonischen Vergleichsdaten und besprechen die optimale Preisstrategie vor Ort.',
        en: 'We analyze your property’s fair market value using Swiss hedonic databases and define the ideal pricing strategy on-site.',
      },
    },
    {
      step: '02',
      title: {
        de: 'High-End Aufbereitung & Multi-Kanal Vermarktung',
        en: 'High-End Media & Multi-Channel Marketing',
      },
      desc: {
        de: 'Professionelle HDR-Fotografie, maßgeschneiderte Grundrisse und Premium-Präsenz auf Homegate, ImmoScout24 sowie in unserem diskreten Käufernetzwerk.',
        en: 'Professional HDR photography, tailored floor plans, and priority positioning on Homegate, ImmoScout24, and our private VIP buyer pool.',
      },
    },
    {
      step: '03',
      title: {
        de: 'Besichtigungen & Geprüfte Bonitätsprüfung',
        en: 'Viewings & Solvency Verification',
      },
      desc: {
        de: 'Unsere lizenzierten Makler führen die Besichtigungen durch und prüfen verbindliche Finanzierungszusagen Schweizer Banken vor Abschluss.',
        en: 'Our licensed brokers conduct viewings, qualify buyers, and verify formal mortgage confirmations from Swiss financial institutions.',
      },
    },
    {
      step: '04',
      title: {
        de: 'Notarielle Beurkundung & Schlüsselübergabe',
        en: 'Notarization & Official Handover',
      },
      desc: {
        de: 'Wir koordinieren den Notartermin, begleiten Sie zum Grundbuchamt, unterstützen bei der Grundstückgewinnsteuer und leiten die offizielle Übergabe.',
        en: 'We coordinate the notary appointment, accompany you to the land registry, assist with capital gains tax, and manage official handover.',
      },
    },
  ];

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-neutral-900 text-white py-16 sm:py-24 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-400 font-medium mb-3">
              <span>{language === 'de' ? 'Immobilie verkaufen' : 'Sell Property'}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{language === 'de' ? 'Transparente Festpreise' : 'Transparent Flat Fees'}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{language === 'de' ? 'Schweizer Qualität' : 'Swiss Excellence'}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-normal font-display tracking-tight text-white leading-tight">
              {language === 'de'
                ? 'Ihre Immobilie erfolgreich verkaufen. Ohne überhöhte Maklerprovision.'
                : 'Sell Your Property Successfully. Without Inflated Broker Fees.'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
              {language === 'de'
                ? 'Wählen Sie aus drei transparenten Verkaufspaketen. Vom digitalen Einstieg bis zum vollumfänglichen Concierge-Service: Bei Veracy bezahlen Sie nur für echte Leistung bei garantierter Schnelligkeit und Schweizer Diskretion.'
                : 'Choose from three clear selling packages. From digital-direct marketing to end-to-end concierge representation: with Veracy, you enjoy full Swiss broker quality with guaranteed speed and discretion.'}
            </p>
          </div>
        </div>
      </div>

      {/* The 3 Selling Packages */}
      <section className="py-20 sm:py-28 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold mb-2">
              {language === 'de' ? 'Transparente Preismodelle' : 'Transparent Packages'}
            </div>
            <h2 className="text-3xl font-normal font-display text-neutral-950 tracking-tight">
              {language === 'de'
                ? 'Drei klare Pakete für Ihren Immobilienverkauf'
                : 'Three Tailored Packages for Selling Your Property'}
            </h2>
            <p className="mt-2 text-sm text-neutral-600 font-light">
              {language === 'de'
                ? 'Keine versteckten Gebühren. Erfolgshonorar wird erst nach erfolgreicher notarieller Beurkundung fällig.'
                : 'No hidden fees. Invoiced only upon successful notarization and transfer of ownership.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {SELLING_PACKAGES.map((pkg) => {
              const isPopular = pkg.popular;
              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between rounded-xl bg-white transition-all duration-200 ${
                    isPopular
                      ? 'border-2 border-neutral-900 shadow-xl lg:-translate-y-2'
                      : 'border border-neutral-200/90 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-neutral-900 text-amber-400 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded">
                      {language === 'de' ? 'Meistgewähltes Paket' : 'Most Popular Choice'}
                    </div>
                  )}

                  <div className="p-7 sm:p-8">
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                        {pkg.name[language]}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 min-h-[32px] font-light leading-relaxed">
                        {pkg.tagline[language]}
                      </p>
                    </div>

                    {/* Price Lockup */}
                    <div className="mb-6 pb-6 border-b border-neutral-100">
                      <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-neutral-950">
                        {pkg.priceDisplay[language]}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {pkg.priceNote[language]}
                      </div>
                      <div className="mt-3 text-[11px] text-amber-800 bg-amber-50 rounded px-2.5 py-1 inline-block font-medium">
                        {language === 'de' ? 'Ideal für: ' : 'Ideal for: '}
                        {pkg.idealFor[language]}
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                        {language === 'de' ? 'Leistungsumfang:' : 'Included Services:'}
                      </div>
                      <ul className="space-y-2.5">
                        {pkg.features[language].map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 leading-snug">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="p-7 sm:p-8 pt-0">
                    <button
                      onClick={() => onSelectPackage(pkg)}
                      className={`w-full py-3 px-4 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isPopular
                          ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow'
                          : 'bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-900'
                      }`}
                    >
                      <span>{language === 'de' ? 'Paket unverbindlich anfragen' : 'Request Package Consultation'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real Estate Savings Calculator in Switzerland */}
      <section className="py-20 bg-white border-t border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-900 text-white rounded-2xl p-8 sm:p-12 shadow-xl">
            <div className="max-w-2xl mb-8">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                {language === 'de' ? 'Transparenz im Schweizer Vergleich' : 'Transparent Swiss Comparison'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-normal text-white mt-2">
                {language === 'de'
                  ? 'Wie viel sparen Sie mit Veracy?'
                  : 'How Much Do You Save with Veracy?'}
              </h2>
              <p className="text-sm text-neutral-300 mt-2 font-light">
                {language === 'de'
                  ? 'Vergleichen Sie unseren beliebten Standard Full Service Festpreis (CHF 7’900) mit der üblichen Maklerprovision von 2.5% in der Schweiz.'
                  : 'Compare our popular Standard Full Service flat rate (CHF 7,900) with typical 2.5% Swiss broker commissions.'}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm text-neutral-300">
                    {language === 'de' ? 'Verkaufspreis Liegenschaft:' : 'Property Sale Price:'}
                  </span>
                  <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                    {formatChf(salesPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={800000}
                  max={4000000}
                  step={50000}
                  value={salesPrice}
                  onChange={(e) => setSalesPrice(Number(e.target.value))}
                  className="w-full h-2.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-1 font-mono">
                  <span>CHF 800'000</span>
                  <span>CHF 2'400'000</span>
                  <span>CHF 4'000'000</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
                <div className="bg-neutral-800/80 p-4 rounded-lg">
                  <div className="text-xs text-neutral-400 mb-1">
                    {language === 'de' ? 'Klassische Provision (2.5%)' : 'Classic Broker (2.5%)'}
                  </div>
                  <div className="text-xl font-bold text-neutral-300 font-mono tabular-nums line-through decoration-red-400">
                    {formatChf(traditionalCommission)}
                  </div>
                </div>

                <div className="bg-neutral-800/80 p-4 rounded-lg">
                  <div className="text-xs text-amber-300 mb-1">
                    {language === 'de' ? 'Veracy Full Service' : 'Veracy Full Service'}
                  </div>
                  <div className="text-xl font-bold text-white font-mono tabular-nums">
                    {formatChf(veracyStandardFee)}
                  </div>
                </div>

                <div className="bg-amber-400 text-neutral-950 p-4 rounded-lg flex flex-col justify-between">
                  <div className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                    {language === 'de' ? 'Ihre Netto-Ersparnis' : 'Your Net Savings'}
                  </div>
                  <div className="text-2xl font-extrabold font-mono tabular-nums">
                    +{formatChf(netSavings)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selling Journey in 4 Steps */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold mb-2">
              {language === 'de' ? 'Der Verkaufsprozess' : 'The Selling Journey'}
            </div>
            <h2 className="text-3xl font-normal font-display text-neutral-950 tracking-tight">
              {language === 'de' ? 'In vier Schritten zum beurkundeten Verkauf' : 'Four Clear Steps from Valuation to Notary'}
            </h2>
            <p className="mt-2 text-sm text-neutral-600 font-light">
              {language === 'de'
                ? 'Strukturiert, transparent und mit persönlicher Begleitung in jeder Phase.'
                : 'Structured, transparent, and personally guided through every phase.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sellingSteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-lg bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl font-mono font-bold text-neutral-300 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-2">
                    {step.title[language]}
                  </h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    {step.desc[language]}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-200/60 text-[11px] text-neutral-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>{language === 'de' ? 'Reaktion innert 24h' : 'Response in 24h'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Free Consultation Callout */}
          <div className="mt-16 text-center">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-all shadow cursor-pointer inline-flex items-center gap-2"
            >
              <span>{language === 'de' ? 'Kostenlose Verkaufsberatung vereinbaren' : 'Schedule Free Selling Consultation'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
