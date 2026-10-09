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
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b transition-all duration-300 ${
        scrolled ? 'border-neutral-200/90 shadow-sm' : 'border-neutral-200/60'
      }`}
    >
      {/* Top micro reassurance bar */}
      <div className="bg-neutral-900 text-neutral-300 text-[11px] py-1 px-4 sm:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-neutral-400">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'de' ? 'Schweizer Präzision & Diskretion' : 'Swiss Precision & Discretion'}</span>
            </span>
            <span className="hidden sm:inline text-neutral-600">·</span>
            <span className="hidden sm:flex items-center gap-1 text-neutral-400">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span>{language === 'de' ? 'Erstantwort garantiert < 24h' : 'Initial response guaranteed < 24h'}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+41442108800"
              className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1 font-mono tracking-tight"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>+41 44 210 88 00</span>
            </a>
            <span className="text-neutral-700">|</span>
            <button
              onClick={onToggleLanguage}
              className="font-medium text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer uppercase tracking-wider"
              aria-label="Language switch"
            >
              {language === 'de' ? 'EN' : 'DE'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand — 3 Clean Nav Categories — Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single clean text element) */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
              VERACY
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium group-hover:text-amber-700 transition-colors">
              Immobilien
            </span>
          </div>
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
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {item.label[language]}
                {isActive && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-full"
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
            className="group px-5 py-2.5 text-xs font-semibold tracking-wide uppercase text-neutral-900 bg-amber-400 hover:bg-amber-300 transition-colors rounded shadow-sm hover:shadow active:scale-[0.99] flex items-center gap-2 cursor-pointer"
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
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-2.5 px-3 rounded text-base font-medium transition-colors cursor-pointer ${
                    currentCategory === item.id
                      ? 'bg-neutral-100 text-neutral-900 font-semibold'
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
                  className="w-full py-3 text-center text-xs font-semibold tracking-wide uppercase text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded cursor-pointer"
                >
                  {language === 'de' ? 'Kostenlose Beratung anfragen' : 'Request Free Consultation'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
