/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MainCategory, Language, SellingPackage } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QualityValueModel } from './components/QualityValueModel';
import { TrustSection } from './components/TrustSection';
import { SellPage } from './components/SellPage';
import { RentOutPage } from './components/RentOutPage';
import { ValuationPage } from './components/ValuationPage';
import { ObjektauflagePage } from './components/ObjektauflagePage';
import { SeoCopySection } from './components/SeoCopySection';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import { trackPageView, trackEvent } from './services/analytics';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<MainCategory>('home');
  const [language, setLanguage] = useState<Language>('de');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SellingPackage | null>(null);
  const [propertyContext, setPropertyContext] = useState<{ title: string; location?: string; type: 'viewing' | 'expose' } | null>(null);
  const [valuationInitialQuery, setValuationInitialQuery] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Direct link parsing (?page=objektauflage, #objektauflage, /objektauflage)
  useEffect(() => {
    const parseUrlRoute = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') || params.get('p') || params.get('form');
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();

      if (page === 'objektauflage' || hash === 'objektauflage' || path === 'objektauflage') {
        setCurrentCategory('objektauflage');
      } else if (page === 'sell' || hash === 'sell' || path === 'sell') {
        setCurrentCategory('sell');
      } else if (page === 'rent-out' || hash === 'rent-out' || path === 'rent-out') {
        setCurrentCategory('rent-out');
      } else if (page === 'valuation' || hash === 'valuation' || path === 'valuation') {
        setCurrentCategory('valuation');
      }
    };

    parseUrlRoute();
    window.addEventListener('popstate', parseUrlRoute);
    window.addEventListener('hashchange', parseUrlRoute);
    return () => {
      window.removeEventListener('popstate', parseUrlRoute);
      window.removeEventListener('hashchange', parseUrlRoute);
    };
  }, []);

  useEffect(() => {
    const pageTitles: Record<MainCategory, string> = {
      home: 'Veracy Immobilien – Startseite',
      sell: 'Veracy Immobilien – Immobilie verkaufen',
      'rent-out': 'Veracy Immobilien – Immobilie vermieten',
      valuation: 'Veracy Immobilien – Hedonische Schätzung',
      objektauflage: 'Veracy Immobilien – Objektauflage (Vermietungsmandat)',
    };
    trackPageView(`/${currentCategory === 'home' ? '' : currentCategory}`, pageTitles[currentCategory]);
  }, [currentCategory]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'de' ? 'en' : 'de'));
  };

  const handleSelectPackage = (pkg: SellingPackage) => {
    setSelectedPackage(pkg);
    setPropertyContext(null);
    setIsConsultationOpen(true);
  };

  const handleStartValuationFromHero = (query: string) => {
    setValuationInitialQuery(query);
    setCurrentCategory('valuation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (category: MainCategory) => {
    setCurrentCategory(category);
    try {
      const url = new URL(window.location.href);
      if (category === 'home') {
        url.searchParams.delete('page');
        url.searchParams.delete('p');
        url.searchParams.delete('form');
        window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
      } else {
        url.searchParams.set('page', category);
        window.history.pushState({}, '', url.toString());
      }
    } catch {
      // Safe fallback
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-[#F5EEDB] selection:text-[#6E5516] relative">
      {/* Top Navigation Bar with strict 3 categories */}
      <Navbar
        currentCategory={currentCategory}
        onSelectCategory={handleNavigate}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenConsultation={() => {
          setSelectedPackage(null);
          setPropertyContext(null);
          setIsConsultationOpen(true);
        }}
      />

      {/* Main Page Content with smooth transition between categories */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentCategory === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* 1. Hero Section - Veracy Brokerage & Core Proposition */}
              <HeroSection
                language={language}
                onNavigate={handleNavigate}
                onOpenConsultation={() => {
                  setSelectedPackage(null);
                  setPropertyContext(null);
                  setIsConsultationOpen(true);
                }}
              />

              {/* 2. Interactive Savings & Fee Comparison (Selling 0.7% & Renting 15 Days) */}
              <QualityValueModel
                language={language}
                onOpenConsultation={() => {
                  setSelectedPackage(null);
                  setIsConsultationOpen(true);
                }}
              />

              {/* 3. Sleek Valuation Callout - Uncluttered */}
              <div className="bg-[#FAF6EE] py-8 border-b border-[#EBDCB7]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#8C6D1F] font-semibold">
                      {language === 'de' ? '100% Kostenlos & Diskret' : '100% Free & Confidential'}
                    </div>
                    <div className="text-base font-semibold text-neutral-900 font-display">
                      {language === 'de' ? 'Möchten Sie vorab den Marktwert Ihrer Liegenschaft erfahren?' : 'Want to know the current market value of your property?'}
                    </div>
                    <div className="text-xs text-neutral-600 font-light">
                      {language === 'de' ? 'Fundierte hedonische Marktwertanalyse durch Experten innert 24 Stunden.' : 'In-depth hedonic market valuation by local experts within 24 hours.'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavigate('valuation')}
                    className="px-5 py-2.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-sm shrink-0"
                  >
                    <span>{language === 'de' ? 'Kostenlose Schätzung' : 'Start Valuation'}</span>
                    <ChevronUp className="w-3.5 h-3.5 rotate-90 text-[#DFB76C]" />
                  </button>
                </div>
              </div>

              {/* 4. Swiss Precision & Trust Section (Testimonials) */}
              <TrustSection language={language} />

              {/* 5. SEO & FAQ Section */}
              <SeoCopySection language={language} />
            </motion.div>
          )}

          {currentCategory === 'sell' && (
            <motion.div
              key="sell"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <SellPage
                language={language}
                onSelectPackage={handleSelectPackage}
                onOpenConsultation={() => {
                  setSelectedPackage(null);
                  setIsConsultationOpen(true);
                }}
              />
            </motion.div>
          )}

          {currentCategory === 'rent-out' && (
            <motion.div
              key="rent-out"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <RentOutPage
                language={language}
                onOpenConsultation={() => {
                  setSelectedPackage(null);
                  setPropertyContext(null);
                  setIsConsultationOpen(true);
                }}
              />
            </motion.div>
          )}

          {currentCategory === 'valuation' && (
            <motion.div
              key="valuation"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ValuationPage
                language={language}
                initialQuery={valuationInitialQuery}
                onOpenConsultation={() => {
                  setSelectedPackage(null);
                  setPropertyContext(null);
                  setIsConsultationOpen(true);
                }}
              />
            </motion.div>
          )}

          {currentCategory === 'objektauflage' && (
            <motion.div
              key="objektauflage"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ObjektauflagePage
                language={language}
                onNavigateHome={() => handleNavigate('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Classy Footer */}
      <Footer
        language={language}
        onNavigate={handleNavigate}
        onOpenConsultation={() => {
          setSelectedPackage(null);
          setPropertyContext(null);
          setIsConsultationOpen(true);
        }}
      />

      {/* Smooth Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-40 p-3 bg-neutral-900 text-[#DFB76C] hover:text-[#E6CA85] rounded-full shadow-lg border border-neutral-700 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Global Consultation Modal */}
      <ContactModal
        isOpen={isConsultationOpen}
        onClose={() => {
          setIsConsultationOpen(false);
          setPropertyContext(null);
        }}
        language={language}
        preselectedPackage={selectedPackage}
        propertyContext={propertyContext}
      />
    </div>
  );
}
