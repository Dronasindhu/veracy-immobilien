import React, { useState, useEffect } from 'react';
import { MainCategory, Language } from '../types';
import { Menu, X, PhoneCall, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentCategory: MainCategory;
  onSelectCategory: (category: MainCategory) => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCategory,
  onSelectCategory,
  language,
  onToggleLanguage,
  onOpenConsultation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: MainCategory; label: { de: string; en: string } }[] = [
    {
      id: 'sell',
      label: {
        de: 'Immobilie verkaufen',
        en: 'Sell Property',
      },
    },
    {
      id: 'buy-rent',
      label: {
        de: 'Kaufen & Mieten',
        en: 'Buy & Rent',
      },
    },
    {
      id: 'valuation',
      label: {
        de: 'Schätzung',
        en: 'Valuation',
      },
    },
  ];

  const handleNavClick = (cat: MainCategory) => {
    onSelectCategory(cat);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white border-b transition-all duration-300 ${
        scrolled ? 'border-neutral-200 shadow-sm' : 'border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Top micro reassurance bar - crisp pure white background */}
      <div className="bg-white text-neutral-600 text-[11px] py-2 px-4 sm:px-8 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-neutral-600">
            <span className="flex items-center gap-1.5 text-neutral-800 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language === 'de' ? 'Schweizer Präzision & Diskretion' : 'Swiss Precision & Discretion'}</span>
            </span>
            <span className="hidden sm:inline text-neutral-300">·</span>
            <span className="hidden sm:flex items-center gap-1 text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language === 'de' ? 'Erstantwort garantiert < 24h' : 'Initial response guaranteed < 24h'}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+41442108800"
              className="text-neutral-700 hover:text-neutral-950 transition-colors flex items-center gap-1 font-mono tracking-tight font-medium"
            >
              <PhoneCall className="w-3 h-3 text-[#C5A059]" />
              <span>+41 44 210 88 00</span>
            </a>
            <span className="text-neutral-300">|</span>
            <button
              onClick={onToggleLanguage}
              className="font-semibold text-[#8C6D1F] hover:text-[#6E5516] transition-colors cursor-pointer uppercase tracking-wider"
              aria-label="Language switch"
            >
              {language === 'de' ? 'EN' : 'DE'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand — 3 Clean Nav Categories — Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between bg-white">
        {/* Zone 1: Brand Logo on clean white background */}
        <button
          onClick={() => handleNavClick('home')}
          aria-label="Veracy Immobilien – Startseite"
          className="shrink-0 text-left group cursor-pointer focus:outline-none flex items-center py-2"
        >
          <img
            src="/veracy-logo-main.png"
            alt="Veracy Immobilien"
            width={1467}
            height={377}
            className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-opacity group-hover:opacity-85"
          />
        </button>

        {/* Zone 2: Strictly the 3 Main Navigation Categories */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = currentCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium tracking-normal transition-colors relative py-2 cursor-pointer ${
                  isActive
                    ? 'text-neutral-950 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {item.label[language]}
                {isActive && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C5A059] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="hidden sm:flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenConsultation}
            className="group px-5 py-2.5 text-xs font-semibold tracking-wide uppercase text-neutral-950 bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#B38E3E] hover:from-[#E8C785] hover:to-[#C5A059] transition-all rounded shadow-sm hover:shadow-[0_2px_12px_rgba(197,160,89,0.28)] active:scale-[0.99] flex items-center gap-2 cursor-pointer border border-[#C5A059]/40"
          >
            <span>{language === 'de' ? 'Kostenlose Beratung' : 'Free Consultation'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-neutral-900 focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 shadow-lg overflow-hidden"
          >
            <div className="flex flex-col space-y-3">
              <div className="pb-2 border-b border-neutral-100 flex items-center">
                <img
                  src="/veracy-logo-main.png"
                  alt="Veracy Immobilien"
                  width={1467}
                  height={377}
                  className="h-8 w-auto object-contain"
                />
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-2.5 px-3 rounded text-base font-medium transition-colors cursor-pointer ${
                    currentCategory === item.id
                      ? 'bg-neutral-100 text-neutral-900 font-semibold border-l-4 border-[#C5A059]'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  {item.label[language]}
                </button>
              ))}
              <div className="pt-2 border-t border-neutral-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="w-full py-3 text-center text-xs font-semibold tracking-wide uppercase text-neutral-950 bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#B38E3E] rounded shadow-sm flex items-center justify-center gap-2 cursor-pointer border border-[#C5A059]/40"
                >
                  <span>{language === 'de' ? 'Kostenlose Beratung anfragen' : 'Request Free Consultation'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
