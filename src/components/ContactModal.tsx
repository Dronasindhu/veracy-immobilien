import React, { useState } from 'react';
import { Language, SellingPackage } from '../types';
import { sendEmailInquiry } from '../services/emailService';
import { trackEvent } from '../services/analytics';
import { X, CheckCircle2, Phone, Mail, Clock, ShieldCheck, ArrowRight, Loader2, Calendar, Camera, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  preselectedPackage?: SellingPackage | null;
  propertyContext?: { title: string; location?: string; type: 'viewing' | 'expose' } | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  language,
  preselectedPackage,
  propertyContext,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(propertyContext?.location || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('morning');
  const [message, setMessage] = useState('');
  const [interest, setInterest] = useState<string>(
    propertyContext
      ? `${propertyContext.type === 'viewing' ? 'Besichtigungstermin' : 'Exposé (PDF)'}: ${propertyContext.title}`
      : preselectedPackage
      ? `package-${preselectedPackage.id}`
      : 'sell'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const timeLabel =
      appointmentTime === 'morning'
        ? (language === 'de' ? 'Vormittag (09:00 – 12:00 Uhr)' : 'Morning (09:00 – 12:00)')
        : appointmentTime === 'afternoon'
        ? (language === 'de' ? 'Nachmittag (13:00 – 16:00 Uhr)' : 'Afternoon (13:00 – 16:00)')
        : appointmentTime === 'late'
        ? (language === 'de' ? 'Spätnachmittag (16:00 – 19:00 Uhr)' : 'Late Afternoon (16:00 – 19:00)')
        : (language === 'de' ? 'Ganztags flexibel nach Absprache' : 'Flexible all day');

    await sendEmailInquiry({
      formType: 'Kostenlose Beratung / Verkaufspaket',
      subject: `Beratungsanfrage: ${name} (${interest})${appointmentDate ? ` – ${appointmentDate}` : ''}`,
      name,
      email,
      phone,
      location,
      interest: preselectedPackage ? `Paket: ${preselectedPackage.name.de}` : interest,
      appointmentDate,
      appointmentTime: timeLabel,
      message,
    });

    trackEvent('consultation_submitted', {
      interest: preselectedPackage ? preselectedPackage.id : interest,
      has_appointment_date: Boolean(appointmentDate),
    });

    setIsSending(false);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setAppointmentDate('');
    setAppointmentTime('morning');
    setMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop with smooth blur & fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-neutral-200 relative text-neutral-900 z-10"
          >
            <button
              onClick={handleResetAndClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-1 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-6 sm:py-8 space-y-4"
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-medium text-neutral-950">
                  {language === 'de' ? 'Beratungsanfrage erfolgreich erhalten!' : 'Consultation Request Confirmed!'}
                </h3>
                <p className="text-xs text-neutral-600 font-light leading-relaxed max-w-sm mx-auto">
                  {language === 'de'
                    ? `Vielen Dank, ${name || 'Eigentümer/in'}. Wir haben Ihren Wunschtermin für das unverbindliche Beratungsgespräch vorgemerkt.`
                    : `Thank you, ${name || 'property owner'}. We have noted your requested appointment for your confidential consultation.`}
                </p>

                {/* Appointment & Email Confirmation Card */}
                <div className="bg-[#FAF6EE] border border-[#EBDCB7] rounded-xl p-4 text-left space-y-2.5 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#8C6D1F]">
                    <Calendar className="w-4 h-4 text-[#C5A059]" />
                    <span>{language === 'de' ? 'Vorgemerkter Beratungstermin:' : 'Reserved Consultation Date:'}</span>
                  </div>
                  <div className="font-mono text-neutral-900 font-semibold text-sm pl-5">
                    {appointmentDate
                      ? `${appointmentDate} · ${
                          appointmentTime === 'morning'
                            ? (language === 'de' ? 'Vormittag (09:00 – 12:00)' : 'Morning (09:00 – 12:00)')
                            : appointmentTime === 'afternoon'
                            ? (language === 'de' ? 'Nachmittag (13:00 – 16:00)' : 'Afternoon (13:00 – 16:00)')
                            : appointmentTime === 'late'
                            ? (language === 'de' ? 'Spätnachmittag (16:00 – 19:00)' : 'Late Afternoon (16:00 – 19:00)')
                            : (language === 'de' ? 'Flexibel nach Absprache' : 'Flexible')
                        }`
                      : (language === 'de' ? 'Terminabstimmung erfolgt umgehend' : 'Date will be confirmed promptly')}
                  </div>
                  {location && (
                    <div className="text-neutral-600 pl-5 text-[11px]">
                      {language === 'de' ? 'Liegenschaft:' : 'Property:'} <span className="font-medium text-neutral-800">{location}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#EBDCB7] flex items-start gap-2 text-neutral-700 text-[11px] font-light leading-relaxed">
                    <Mail className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span>
                      {language === 'de'
                        ? `Bestätigungs-E-Mail versendet: Eine schriftliche Terminbestätigung mit allen Angaben für Ihr Beratungsgespräch wurde an ${email} gesendet. Unser Maklerteam meldet sich zudem telefonisch bei Ihnen.`
                        : `Confirmation email dispatched: A written confirmation with all consultation details has been sent to ${email}. Our brokerage team will also contact you by phone.`}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleResetAndClose}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm"
                  >
                    {language === 'de' ? 'Schliessen' : 'Close'}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#8C6D1F] mb-1.5">
                    {language === 'de' ? 'Kostenlose Eigentümer-Beratung' : 'Free Owner Consultation'}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-medium text-neutral-950">
                    {language === 'de'
                      ? 'Sprechen Sie mit unseren Schweizer Maklern'
                      : 'Connect with a Swiss Real Estate Expert'}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed font-normal">
                    {propertyContext
                      ? language === 'de'
                        ? `Anfrage zu: ${propertyContext.title}`
                        : `Inquiry for: ${propertyContext.title}`
                      : preselectedPackage
                      ? language === 'de'
                        ? `Ihre Anfrage zum Paket: ${preselectedPackage.name.de}`
                        : `Inquiry regarding: ${preselectedPackage.name.en}`
                      : language === 'de'
                      ? 'Unverbindlich, diskret und garantiert innert 24 Stunden beantwortet.'
                      : 'Confidential, no obligation, guaranteed response within 24 hours.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                      {language === 'de' ? 'Anliegen' : 'Primary Interest'}
                    </label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full text-base rounded-xl border border-neutral-300 p-3 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-colors"
                    >
                      <option value="sell">{language === 'de' ? 'Immobilie verkaufen (Nur 0.7% Provision)' : 'Sell Property (Only 0.7% Commission)'}</option>
                      <option value="rent-out">{language === 'de' ? 'Immobilie vermieten (Nur 15 Tage Miete Provision)' : 'Rent Out Property (Only 15 Days Rent Commission)'}</option>
                      <option value="valuation">{language === 'de' ? 'Kostenlose Marktwertschätzung anfordern' : 'Request Complimentary Valuation'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                      {language === 'de' ? 'Name und Vorname' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="z.B. Sandra Vollenweider"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-base rounded-xl border border-neutral-300 p-3 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-colors placeholder:text-neutral-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                        {language === 'de' ? 'E-Mail' : 'Email'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@domain.ch"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-base rounded-xl border border-neutral-300 p-3 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-colors placeholder:text-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                        {language === 'de' ? 'Telefonnummer' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+41 76 588 69 89"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-base rounded-xl border border-neutral-300 p-3 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-colors placeholder:text-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                      {language === 'de' ? 'Liegenschaft / PLZ (Adresse der Verkaufsimmobilie)' : 'Property Address / Location (Property to be Sold)'}
                    </label>
                    <input
                      type="text"
                      placeholder="z.B. Seestrasse 42, 8700 Küsnacht oder 5400 Baden"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-base rounded-xl border border-neutral-300 p-3 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-colors placeholder:text-neutral-400"
                    />
                  </div>

                  {/* Consultation Appointment Section (Purely Advisory / Consultation) */}
                  <div className="bg-[#FAF6EE] border border-[#EBDCB7] rounded-xl p-4 sm:p-5 space-y-3.5">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#8C6D1F]">
                      <Calendar className="w-4.5 h-4.5 text-[#C5A059]" />
                      <span>
                        {language === 'de'
                          ? 'Wunschtermin: Persönliche Eigentümer-Beratung'
                          : 'Preferred Owner Consultation Date'}
                      </span>
                    </div>

                    <div className="bg-white/90 rounded-lg p-3 border border-[#EBDCB7]/70 text-sm text-neutral-700 font-normal leading-relaxed">
                      <p className="font-bold text-neutral-900 mb-1">
                        {language === 'de'
                          ? '📌 Unverbindliche Beratung durch Veracy Immobilien:'
                          : '📌 Confidential Consultation by Veracy Real Estate:'}
                      </p>
                      <p>
                        {language === 'de'
                          ? 'Dieses Erstgespräch ist dafür bestimmt, Ihre Immobilie, Ihre Vorstellungen und den realistischen Marktpreis oder Mietzins unverbindlich zu analysieren. Unser lizenzierter Makler berät Sie fundiert und diskret – persönlich vor Ort, per Video oder telefonisch.'
                          : 'This initial consultation is intended to review your property, your objectives, and realistic market valuations or rent levels. Our certified broker provides thorough, confidential advice — in person on-site, via video, or by phone.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-neutral-800 mb-1.5 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#C5A059]" />
                          <span>{language === 'de' ? 'Wunschdatum (Beratungsgespräch)' : 'Preferred Date (Consultation)'}</span>
                        </label>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          className="w-full text-base rounded-xl border border-neutral-300 bg-white p-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-neutral-800 mb-1.5 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#C5A059]" />
                          <span>{language === 'de' ? 'Bevorzugtes Zeitfenster' : 'Preferred Time Window'}</span>
                        </label>
                        <select
                          value={appointmentTime}
                          onChange={(e) => setAppointmentTime(e.target.value)}
                          className="w-full text-base rounded-xl border border-neutral-300 bg-white p-3 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-colors"
                        >
                          <option value="morning">{language === 'de' ? 'Vormittag (09:00 – 12:00 Uhr)' : 'Morning (09:00 – 12:00)'}</option>
                          <option value="afternoon">{language === 'de' ? 'Nachmittag (13:00 – 16:00 Uhr)' : 'Afternoon (13:00 – 16:00)'}</option>
                          <option value="late">{language === 'de' ? 'Spätnachmittag (16:00 – 19:00 Uhr)' : 'Late Afternoon (16:00 – 19:00)'}</option>
                          <option value="flexible">{language === 'de' ? 'Ganztags flexibel nach Absprache' : 'Flexible all day by arrangement'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Email confirmation notice */}
                    <div className="flex items-start gap-2.5 pt-2.5 border-t border-[#EBDCB7]/80 text-xs sm:text-sm text-[#6E5516] leading-relaxed">
                      <Mail className="w-4.5 h-4.5 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-bold text-neutral-900">
                          {language === 'de' ? 'Schriftliche Bestätigung per E-Mail: ' : 'Written Confirmation via Email: '}
                        </strong>
                        {language === 'de'
                          ? 'Sie erhalten unmittelbar nach dem Absenden eine schriftliche Terminbestätigung per E-Mail für Ihr persönliches Beratungsgespräch. Unser Maklerteam meldet sich zur Vorbereitung bei Ihnen.'
                          : 'Immediately after submitting, you will receive a written confirmation email for your personal consultation. Our brokerage team will contact you in advance.'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-1.5">
                      {language === 'de' ? 'Ihre Nachricht oder ergänzende Details' : 'Your Message or Additional Notes'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={language === 'de' ? 'Besonderheiten der Liegenschaft, Zugang oder Fragen...' : 'Property highlights, access details or questions...'}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-base rounded-xl border border-neutral-300 p-3 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059] resize-none transition-colors placeholder:text-neutral-400"
                    />
                  </div>

                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={isSending}
                      className="w-full py-4 bg-gradient-to-r from-[#DFB76C] via-[#C5A059] to-[#B38E3E] hover:from-[#E8C785] hover:to-[#C5A059] text-neutral-950 font-bold rounded-xl text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md border border-[#C5A059]/40 disabled:opacity-60"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-neutral-950" />
                          <span>{language === 'de' ? 'Wird übermittelt...' : 'Sending request...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{language === 'de' ? 'Termin & Beratung kostenlos anfragen' : 'Request Appointment & Free Consultation'}</span>
                          <ArrowRight className="w-5 h-5 text-neutral-950" />
                        </>
                      )}
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-600 pt-3 border-t border-neutral-100">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                      {language === 'de' ? 'Antwort < 24h' : 'Response < 24h'}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                      {language === 'de' ? 'E-Mail-Bestätigung' : 'Email Confirmation'}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                      {language === 'de' ? '100% Unverbindlich' : '100% Confidential'}
                    </span>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
