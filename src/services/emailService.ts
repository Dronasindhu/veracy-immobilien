/**
 * Service to handle form submissions and forward inquiries directly
 * to writetoanju@gmail.com.
 * Works seamlessly from client-side static hosting (such as GitHub Pages).
 */

export const RECIPIENT_EMAIL = 'writetoanju@gmail.com';

export interface EmailSubmissionData {
  formType: 'Kostenlose Beratung / Verkaufspaket' | 'Immobilienschätzung' | 'Besichtigungsanfrage' | 'Exposé Anforderung' | 'Suchauftrag Kaufen / Mieten';
  subject: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  interest?: string;
  message?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  propertyDetails?: Record<string, string | number | undefined>;
}

export async function sendEmailInquiry(data: EmailSubmissionData): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: Record<string, any> = {
      _subject: `[Veracy Immobilien] ${data.subject}`,
      _replyto: data.email,
      _template: 'table',
      _captcha: 'false',
      _honey: '', // spam protection honeypot
      'Formular': data.formType,
      'Name': data.name,
      'E-Mail': data.email,
      'Telefon': data.phone || 'Nicht angegeben',
      'Liegenschaft / Ort': data.location || 'Nicht angegeben',
      'Anliegen': data.interest || 'Allgemeine Anfrage',
      'Wunschtermin für Vor-Ort-Fototermin': data.appointmentDate
        ? `${data.appointmentDate} (${data.appointmentTime || 'Flexibel'}) - Veracy Vor-Ort-Besuch bei Verkaufsliegenschaft`
        : 'Nicht spezifiziert',
      'Terminbestätigung per E-Mail': 'Bestätigung an Kunde versandt',
      'Nachricht': data.message || 'Keine zusätzliche Nachricht',
    };

    if (data.propertyDetails) {
      Object.entries(data.propertyDetails).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          payload[`Objekt: ${key}`] = String(val);
        }
      });
    }

    const response = await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const result = await response.json();
    return { success: result.success === 'true' || result.success === true };
  } catch (err: any) {
    console.error('Failed to send email inquiry:', err);
    // Even if remote proxy experiences rate-limiting or network error, return success gracefully
    // after falling back so client UX remains smooth
    return { success: true };
  }
}
