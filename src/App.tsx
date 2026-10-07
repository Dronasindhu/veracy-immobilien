/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<MainCategory>('home');
  const [language, setLanguage] = useState<Language>('de');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SellingPackage | null>(null);
  const [propertyContext, setPropertyContext] = useState<{ title: string; location?: string; type: 'viewing' | 'expose' } | null>(null);
  const [valuationInitialQuery, setValuationInitialQuery] = useState<string>('');

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

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
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

      {/* Main Page Content */}
      <main className="flex-1">
        {currentCategory === 'home' && (
          <>
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

            {/* 4. Swiss Precision & Trust Section (Testimonials, Cantons) */}
            <TrustSection language={language} />

            {/* 5. SEO & FAQ Section */}
            <SeoCopySection language={language} />
          </>
        )}

        {currentCategory === 'sell' && (
          <SellPage
            language={language}
            onSelectPackage={handleSelectPackage}
            onOpenConsultation={() => {
              setSelectedPackage(null);
              setIsConsultationOpen(true);
            }}
          />
        )}

        {currentCategory === 'buy-rent' && (
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
        )}

        {currentCategory === 'valuation' && (
          <ValuationPage
            language={language}
            initialQuery={valuationInitialQuery}
            onOpenConsultation={() => {
              setSelectedPackage(null);
              setPropertyContext(null);
              setIsConsultationOpen(true);
            }}
          />
        )}
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
