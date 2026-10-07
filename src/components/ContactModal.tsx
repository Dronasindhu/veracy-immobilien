import React, { useState } from 'react';
import { Language, SellingPackage } from '../types';
import { X, CheckCircle2, Phone, Mail, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  preselectedPackage?: SellingPackage | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  language,
  preselectedPackage,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [interest, setInterest] = useState<string>(
    preselectedPackage ? `package-${preselectedPackage.id}` : 'sell'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative text-neutral-900">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-1 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-medium text-neutral-950">
              {language === 'de' ? 'Vielen Dank für Ihre Anfrage' : 'Thank You for Reaching Out'}
            </h3>
            <p className="text-xs text-neutral-600 font-light leading-relaxed max-w-sm mx-auto">
              {language === 'de'
                ? `Wir haben Ihre Nachricht erhalten. Ein lizenzierter Senior-Makler von Veracy Immobilien meldet sich werktags garantiert innerhalb von 24 Stunden bei Ihnen unter ${phone || email}.`
                : `We received your request. A senior Veracy real estate advisor will contact you within 24 hours on business days at ${phone || email}.`}
            </p>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                {language === 'de' ? 'Schliessen' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold mb-1">
                {language === 'de' ? 'Kostenlose Erstberatung' : 'Free Consultation'}
              </div>
              <h3 className="text-2xl font-display font-medium text-neutral-950">
                {language === 'de'
                  ? 'Sprechen Sie mit unseren Schweizer Maklern'
                  : 'Connect with a Swiss Real Estate Expert'}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {preselectedPackage
                  ? language === 'de'
                    ? `Ihre Anfrage zum Paket: ${preselectedPackage.name.de}`
                    : `Inquiry regarding: ${preselectedPackage.name.en}`
                  : language === 'de'
                  ? 'Unverbindlich, diskret und garantiert innert 24 Stunden beantwortet.'
                  : 'Confidential, no obligation, guaranteed response within 24 hours.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  {language === 'de' ? 'Anliegen' : 'Primary Interest'}
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full text-xs rounded border border-neutral-300 p-2.5 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  <option value="sell">{language === 'de' ? 'Immobilie verkaufen (Kostenlose Erstberatung)' : 'Selling Property (Free Consultation)'}</option>
                  <option value="buy">{language === 'de' ? 'Immobilie kaufen oder mieten' : 'Buying or Renting Property'}</option>
                  <option value="valuation">{language === 'de' ? 'Marktwertschätzung anfordern' : 'Requesting Valuation Dossier'}</option>
                  <option value="package-digital-direct">Paket: Starter / Digital Direkt (CHF 3'900)</option>
                  <option value="package-standard-full">Paket: Standard Full Service (CHF 7'900)</option>
                  <option value="package-exclusive-mandate">Paket: Exklusiv Mandat (1.0%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  {language === 'de' ? 'Name und Vorname' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Sandra Vollenweider"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs rounded border border-neutral-300 p-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    {language === 'de' ? 'E-Mail' : 'Email'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.ch"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs rounded border border-neutral-300 p-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    {language === 'de' ? 'Telefonnummer' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+41 79 000 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs rounded border border-neutral-300 p-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  {language === 'de' ? 'Liegenschaft / PLZ (optional)' : 'Property Location / ZIP (optional)'}
                </label>
                <input
                  type="text"
                  placeholder="z.B. 8008 Zürich Seefeld oder 5400 Baden"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs rounded border border-neutral-300 p-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  {language === 'de' ? 'Ihre Nachricht oder Fragen' : 'Your Message'}
                </label>
                <textarea
                  rows={3}
                  placeholder={language === 'de' ? 'Worum geht es bei Ihrer Liegenschaft?' : 'Details about your property or inquiry...'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs rounded border border-neutral-300 p-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow"
                >
                  <span>{language === 'de' ? 'Beratung kostenlos anfragen' : 'Send Free Consultation Request'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  {language === 'de' ? 'Antwort garantiert < 24h' : 'Response < 24h'}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-neutral-400" />
                  {language === 'de' ? '100% Schweizer Diskretion' : '100% Swiss Discretion'}
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
