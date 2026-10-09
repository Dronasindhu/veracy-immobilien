import React, { useState } from 'react';
import { Language, Property } from '../types';
import { PROPERTIES } from '../data/mockData';
import { Search, SlidersHorizontal, MapPin, Maximize2, BedDouble, Calendar, ArrowRight, X, Phone, Mail, CheckCircle2, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BuyRentPageProps {
  language: Language;
  onOpenConsultation: () => void;
  onOpenPropertyInquiry?: (context: { title: string; location?: string; type: 'viewing' | 'expose' }) => void;
}

export const BuyRentPage: React.FC<BuyRentPageProps> = ({
  language,
  onOpenConsultation,
  onOpenPropertyInquiry,
}) => {
  const [activeType, setActiveType] = useState<'all' | 'sale' | 'rent'>('all');
  const [selectedCanton, setSelectedCanton] = useState<string>('all');
  const [minRooms, setMinRooms] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Mortgage Calculator state inside modal
  const [equityDown, setEquityDown] = useState<number>(20); // 20% standard Swiss minimum
  const [mortgageRate, setMortgageRate] = useState<number>(1.5); // % Swiss interest rate benchmark

  // Filter listings
  const filteredProperties = PROPERTIES.filter((prop) => {
    if (activeType !== 'all' && prop.type !== activeType) return false;
    if (selectedCanton !== 'all' && !prop.location.canton.toLowerCase().includes(selectedCanton.toLowerCase())) return false;
    if (minRooms > 0 && prop.rooms < minRooms) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const inTitle = prop.title[language].toLowerCase().includes(q);
      const inCity = prop.location.city.toLowerCase().includes(q);
      const inZip = prop.location.zip.includes(q);
      if (!inTitle && !inCity && !inZip) return false;
    }
    return true;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-neutral-900 text-white py-14 sm:py-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-400 font-medium mb-2">
              <span>{language === 'de' ? 'Kaufen & Mieten' : 'Buy & Rent'}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{language === 'de' ? 'Kuratierte Schweizer Objekte' : 'Curated Swiss Properties'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-display tracking-tight text-white">
              {language === 'de' ? 'Wohn- & Anlageimmobilien in der Schweiz' : 'Prime Residential & Investment Real Estate'}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-neutral-300 font-light max-w-2xl">
              {language === 'de'
                ? 'Handverlesene Liegenschaften in Zürich und Aargau. Transparente Objektdaten, qualifizierte Unterlagen und diskreter Off-Market Zugang.'
                : 'Selected residences across Zurich and Aargau. Transparent property metrics, certified documentation, and discreet off-market opportunities.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="sticky top-20 z-30 bg-neutral-50/95 backdrop-blur-md border-b border-neutral-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Type Switcher Tabs (Segmented controls) */}
            <div className="flex items-center bg-neutral-200/80 p-1 rounded-lg self-start">
              <button
                onClick={() => setActiveType('all')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeType === 'all'
                    ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {language === 'de' ? 'Alle Objekte' : 'All Listings'}
              </button>
              <button
                onClick={() => setActiveType('sale')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeType === 'sale'
                    ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {language === 'de' ? 'Kaufen' : 'Buy'}
              </button>
              <button
                onClick={() => setActiveType('rent')}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  activeType === 'rent'
                    ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {language === 'de' ? 'Mieten' : 'Rent'}
              </button>
            </div>

            {/* Filter Inputs */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'de' ? 'Ort, PLZ, Suchbegriff...' : 'City, ZIP, keyword...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              {/* Canton Select */}
              <select
                value={selectedCanton}
                onChange={(e) => setSelectedCanton(e.target.value)}
                className="text-xs rounded border border-neutral-300 bg-white px-3 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
              >
                <option value="all">{language === 'de' ? 'Alle Regionen' : 'All Regions'}</option>
                <option value="Zürich">Zürich (ZH)</option>
                <option value="Aargau">Aargau (AG)</option>
                <option value="Luzern">Luzern (LU)</option>
                <option value="Bern">Bern (BE)</option>
              </select>

              {/* Rooms Select */}
              <select
                value={minRooms}
                onChange={(e) => setMinRooms(Number(e.target.value))}
                className="text-xs rounded border border-neutral-300 bg-white px-3 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
              >
                <option value={0}>{language === 'de' ? 'Alle Zimmer' : 'Any Rooms'}</option>
                <option value={3.5}>ab 3.5 Zimmer</option>
                <option value={4.5}>ab 4.5 Zimmer</option>
                <option value={5.5}>ab 5.5 Zimmer</option>
              </select>

              {/* Results count indicator */}
              <div className="text-xs text-neutral-500 font-medium tabular-nums px-2">
                {filteredProperties.length}{' '}
                {language === 'de' ? 'Objekte gefunden' : 'properties found'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Listings Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-24 bg-neutral-50 rounded-xl border border-dashed border-neutral-300 max-w-xl mx-auto p-8">
              <SlidersHorizontal className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-neutral-900">
                {language === 'de' ? 'Keine Objekte für diese Filter gefunden' : 'No properties found for this criteria'}
              </h3>
              <p className="text-xs text-neutral-500 mt-1 mb-6">
                {language === 'de'
                  ? 'Passen Sie Ihre Suchkriterien an oder kontaktieren Sie uns für diskrete Off-Market Liegenschaften.'
                  : 'Adjust your search filters or reach out to us for confidential off-market portfolios.'}
              </p>
              <button
                onClick={() => {
                  setActiveType('all');
                  setSelectedCanton('all');
                  setMinRooms(0);
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-medium cursor-pointer"
              >
                {language === 'de' ? 'Filter zurücksetzen' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, idx) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  onClick={() => setSelectedProperty(property)}
                  className="group bg-white rounded-lg border border-neutral-200/90 overflow-hidden hover:border-neutral-400/80 transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Photo Header */}
                    <div className="relative h-64 overflow-hidden bg-neutral-100">
                      <img
                        src={property.imageUrl}
                        alt={property.title[language]}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-80" />
                      
                      {/* Quiet Status overlay */}
                      <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded">
                        {property.type === 'sale'
                          ? language === 'de' ? 'Kaufobjekt' : 'For Sale'
                          : language === 'de' ? 'Mietobjekt' : 'For Rent'}
                      </div>

                      {/* Canton Location Badge */}
                      <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{property.location.city} ({property.location.canton})</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      {/* Price Title */}
                      <div className="text-2xl font-bold font-mono tracking-tight text-neutral-950 mb-2 tabular-nums">
                        {property.priceFormatted}
                      </div>

                      <h3 className="text-base font-semibold text-neutral-900 leading-snug line-clamp-2 mb-4 group-hover:text-amber-800 transition-colors">
                        {property.title[language]}
                      </h3>

                      {/* Unboxed Metadata (Zero-Pill discipline) with subtle separators */}
                      <div className="flex items-center gap-3 text-xs text-neutral-600 border-t border-b border-neutral-100 py-3 font-medium">
                        <span>{property.rooms} {language === 'de' ? 'Zimmer' : 'Rooms'}</span>
                        <span aria-hidden="true" className="text-neutral-300">·</span>
                        <span>{property.livingArea} m² {language === 'de' ? 'Wohnfläche' : 'Living'}</span>
                        <span aria-hidden="true" className="text-neutral-300">·</span>
                        <span>{property.yearBuilt}</span>
                      </div>

                      {/* Quick highlights */}
                      <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-neutral-500">
                        {property.features.slice(0, 3).map((f, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-amber-500" />
                            <span>{f}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="px-6 pb-6 pt-2">
                    <button className="w-full py-2.5 px-3 bg-neutral-50 hover:bg-neutral-900 hover:text-white border border-neutral-200 text-neutral-900 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-between">
                      <span>{language === 'de' ? 'Exposé & Details' : 'View Details & Dossier'}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Property Detail Modal with smooth entrance/exit */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedProperty(null)}
              className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 relative text-neutral-900 z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-4 right-4 z-20 bg-neutral-900/70 hover:bg-neutral-900 text-white p-2 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image Header */}
              <div className="relative h-72 sm:h-96 w-full bg-neutral-900">
                <img
                  src={selectedProperty.imageUrl}
                  alt={selectedProperty.title[language]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
                    {selectedProperty.type === 'sale'
                      ? language === 'de' ? 'Kaufobjekt' : 'Property For Sale'
                      : language === 'de' ? 'Mietobjekt' : 'Property For Rent'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-medium leading-tight">
                    {selectedProperty.title[language]}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-neutral-300 mt-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>
                      {selectedProperty.location.address}, {selectedProperty.location.zip}{' '}
                      {selectedProperty.location.city} ({selectedProperty.location.canton})
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Top Key Figures Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div>
                    <div className="text-xs text-neutral-500">
                      {selectedProperty.type === 'sale'
                        ? language === 'de' ? 'Verkaufspreis' : 'Purchase Price'
                        : language === 'de' ? 'Mietpreis' : 'Monthly Rent'}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-950 tabular-nums">
                      {selectedProperty.priceFormatted}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">{language === 'de' ? 'Wohnfläche' : 'Living Area'}</div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-950 tabular-nums">
                      {selectedProperty.livingArea} m²
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">{language === 'de' ? 'Zimmer' : 'Rooms'}</div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-950 tabular-nums">
                      {selectedProperty.rooms}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">{language === 'de' ? 'Baujahr' : 'Year Built'}</div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-950 tabular-nums">
                      {selectedProperty.yearBuilt}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-2">
                    {language === 'de' ? 'Objektbeschreibung' : 'Property Description'}
                  </h4>
                  <p className="text-sm text-neutral-600 font-light leading-relaxed">
                    {selectedProperty.description[language]}
                  </p>
                </div>

                {/* Features Matrix */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 mb-3">
                    {language === 'de' ? 'Ausstattungsmerkmale & Eckdaten' : 'Highlights & Specifications'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700">
                    {selectedProperty.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-neutral-50 rounded border border-neutral-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                    {selectedProperty.energyLabel && (
                      <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded border border-neutral-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Energiestandard: {selectedProperty.energyLabel}</span>
                      </div>
                    )}
                    {selectedProperty.monthlyExpenses && (
                      <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded border border-neutral-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Nebenkosten: CHF {selectedProperty.monthlyExpenses} / Monat</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Swiss Mortgage Calculator Preview for Sale Properties */}
                {selectedProperty.type === 'sale' && (
                  <div className="p-6 bg-neutral-900 text-white rounded-xl">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400 font-semibold mb-2">
                      <Calculator className="w-4 h-4" />
                      <span>{language === 'de' ? 'Schweizer Hypothekenrechner (Richtwert)' : 'Swiss Mortgage Estimator'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3">
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">
                          {language === 'de' ? `Eigenkapital: ${equityDown}%` : `Equity: ${equityDown}%`}
                        </label>
                        <input
                          type="range"
                          min={20}
                          max={50}
                          step={5}
                          value={equityDown}
                          onChange={(e) => setEquityDown(Number(e.target.value))}
                          className="w-full accent-amber-400"
                        />
                        <div className="text-xs text-neutral-400 font-mono mt-1">
                          CHF {Math.round((selectedProperty.price * equityDown) / 100).toLocaleString('de-CH')}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">
                          {language === 'de' ? `Hypothekarzins: ${mortgageRate}%` : `Interest: ${mortgageRate}%`}
                        </label>
                        <input
                          type="range"
                          min={1.0}
                          max={3.5}
                          step={0.1}
                          value={mortgageRate}
                          onChange={(e) => setMortgageRate(Number(e.target.value))}
                          className="w-full accent-amber-400"
                        />
                        <div className="text-xs text-neutral-400 font-mono mt-1">
                          SARON / Festhypothek
                        </div>
                      </div>

                      <div className="bg-neutral-800 p-3 rounded border border-neutral-700">
                        <div className="text-xs text-neutral-400">
                          {language === 'de' ? 'Geschätzte Zinskosten' : 'Estimated Interest'}
                        </div>
                        <div className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                          CHF {Math.round((selectedProperty.price * (1 - equityDown / 100) * (mortgageRate / 100)) / 12).toLocaleString('de-CH')} / Mt.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      const prop = selectedProperty;
                      setSelectedProperty(null);
                      if (onOpenPropertyInquiry) {
                        onOpenPropertyInquiry({
                          title: prop.title[language],
                          location: `${prop.location.city} (${prop.location.canton})`,
                          type: 'viewing',
                        });
                      } else {
                        onOpenConsultation();
                      }
                    }}
                    className="flex-1 py-3 px-6 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{language === 'de' ? 'Besichtigungstermin vereinbaren' : 'Schedule Viewing'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      const prop = selectedProperty;
                      setSelectedProperty(null);
                      if (onOpenPropertyInquiry) {
                        onOpenPropertyInquiry({
                          title: prop.title[language],
                          location: `${prop.location.city} (${prop.location.canton})`,
                          type: 'expose',
                        });
                      } else {
                        onOpenConsultation();
                      }
                    }}
                    className="py-3 px-6 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {language === 'de' ? 'Exposé (PDF) anfordern' : 'Request PDF Dossier'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
