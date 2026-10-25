import React from 'react';
import { MainCategory, Language } from '../types';
import { ShieldCheck, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  language: Language;
  onNavigate: (category: MainCategory) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigate,
  onOpenConsultation,
}) => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand info (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <img
              src="/veracy-logo-light.png"
              alt="Veracy Immobilien"
              width={1467}
              height={377}
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <p className="text-neutral-400 font-light leading-relaxed max-w-sm">
              {language === 'de'
                ? 'Schweizer Immobilienmakler für transparente Festpreise, verlässliche Marktwertschätzungen und persönliche Betreuung vor Ort in den Kantonen Zürich und Aargau.'
                : 'Swiss real estate brokerage providing transparent flat fees, accurate valuations, and dedicated on-site representation across the cantons of Zurich and Aargau.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-[#DFB76C]" />
              <span className="text-[11px] font-medium">
                {language === 'de' ? 'SVIT / USVT Standard-Konform' : 'Swiss SVIT / USVT Standards'}
              </span>
            </div>
          </div>

          {/* Navigation Categories (Col 5-7) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs uppercase tracking-wider text-neutral-200 font-semibold mb-2">
              {language === 'de' ? 'Hauptkategorien' : 'Main Categories'}
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('sell')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1 group"
                >
                  <span>{language === 'de' ? '01. Immobilie verkaufen (0.7%)' : '01. Sell Property (0.7%)'}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DFB76C]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rent-out')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1 group"
                >
                  <span>{language === 'de' ? '02. Immobilie vermieten (15 Tage Miete)' : '02. Rent Out Property (15 Days Rent)'}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DFB76C]" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('valuation')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1 group"
                >
                  <span>{language === 'de' ? '03. Professionelle Schätzung' : '03. Valuation'}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#DFB76C]" />
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenConsultation}
                  className="hover:text-[#E6CA85] transition-colors cursor-pointer text-left font-medium"
                >
                  {language === 'de' ? 'Kostenlose Erstberatung' : 'Free Consultation'}
                </button>
              </li>
            </ul>
          </div>

          {/* Key Swiss Cantons (Col 8-9) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs uppercase tracking-wider text-neutral-200 font-semibold mb-2">
              {language === 'de' ? 'Standorte' : 'Locations'}
            </div>
            <ul className="space-y-1.5 text-neutral-400">
              <li>Zürich Stadt & See (ZH)</li>
              <li>Winterthur & Unterland (ZH)</li>
              <li>Baden & Wettingen (AG)</li>
              <li>Aarau & Lenzburg (AG)</li>
              <li>Limmattal (ZH / AG)</li>
              <li>Freiamt & Bremgarten (AG)</li>
            </ul>
          </div>

          {/* Contact (Col 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs uppercase tracking-wider text-neutral-200 font-semibold mb-2">
              {language === 'de' ? 'Direktkontakt' : 'Direct Contact'}
            </div>
            <div className="space-y-2 text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#DFB76C] shrink-0 mt-0.5" />
                <span>Bahnhofstrasse 45, 8001 Zürich</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#DFB76C] shrink-0" />
                <a href="tel:+41442108800" className="hover:text-white font-mono">
                  +41 44 210 88 00
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#DFB76C] shrink-0" />
                <a href="mailto:kontakt@veracy-immobilien.ch" className="hover:text-white">
                  kontakt@veracy-immobilien.ch
                </a>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[11px] text-[#E6CA85] font-medium">
                {language === 'de' ? 'Reaktionszeit < 24h an Werktagen' : 'Response time < 24h on business days'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Veracy Immobilien AG. Alle Rechte vorbehalten.
          </div>
          <div className="flex items-center gap-6">
            <span>Impressum</span>
            <span>Datenschutz (DSG / DSGVO)</span>
            <span>AGB</span>
            <span>SVIT Partner</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};
