/**
 * Google Analytics 4 (GA4) Integration Helper
 * Measurement ID: G-CCKP7QP9N4
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-CCKP7QP9N4';

/**
 * Tracks a page or tab transition in the single-page application.
 */
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }
};

/**
 * Tracks custom user interactions and conversions.
 */
export const trackEvent = (
  eventName: string,
  parameters: Record<string, string | number | boolean | undefined> = {}
) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, parameters);
  }
};
