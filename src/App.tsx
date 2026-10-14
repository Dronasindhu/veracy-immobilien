/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MainCategory, Language, SellingPackage } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryOverview } from './components/CategoryOverview';
import { QualityValueModel } from './components/QualityValueModel';
import { TrustSection } from './components/TrustSection';
import { SellPage } from './components/SellPage';
import { BuyRentPage } from './components/BuyRentPage';
import { ValuationPage } from './components/ValuationPage';
import { SeoCopySection } from './components/SeoCopySection';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<MainCategory>('home');
  const [language, setLanguage] = useState<Language>('de');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SellingPackage | null>(null);
  const [propertyContext, setPropertyContext] = useState<{ title: string; location?: string; type: 'viewing' | 'expose' } | null>(null);
  const [valuationInitialQuery, setValuationInitialQuery] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

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
              {/* 1. Hero Section with Quick Valuation Widget */}
              <HeroSection
                language={language}
                onNavigate={handleNavigate}
                onStartValuation={handleStartValuationFromHero}
              />

              {/* 2. Overview of the 3 Main Categories */}
              <CategoryOverview
                language={language}
                onNavigate={handleNavigate}
              />

              {/* 3. "Quality at Low Price" Service & Savings Model */}
              <QualityValueModel
                language={language}
                onOpenConsultation={() => {
                  setSelectedPackage(null);
                  setIsConsultationOpen(true);
                }}
              />

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

          {currentCategory === 'buy-rent' && (
            <motion.div
              key="buy-rent"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <BuyRentPage
                language={language}
                onOpenConsultation={() => {
                  setSelectedPackage(null);
                  setPropertyContext(null);
                  setIsConsultationOpen(true);
                }}
                onOpenPropertyInquiry={(ctx) => {
                  setSelectedPackage(null);
                  setPropertyContext(ctx);
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
