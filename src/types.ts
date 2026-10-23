export type Language = 'de' | 'en';

export type MainCategory = 'home' | 'sell' | 'buy-rent' | 'valuation';

export interface Property {
  id: string;
  title: {
    de: string;
    en: string;
  };
  type: 'sale' | 'rent';
  category: 'apartment' | 'house' | 'penthouse' | 'villa';
  price: number;
  currency: string;
  priceFormatted: string;
  location: {
    address: string;
    city: string;
    canton: string;
    zip: string;
  };
  livingArea: number; // m²
  rooms: number;
  bathrooms: number;
  yearBuilt: number;
  availableFrom: string;
  description: {
    de: string;
    en: string;
  };
  features: string[];
  imageUrl: string;
  gallery: string[];
  monthlyExpenses?: number; // Nebenkosten
  energyLabel?: string;
  parkingSpaces?: number;
}

export interface SellingPackage {
  id: string;
  name: {
    de: string;
    en: string;
  };
  tagline: {
    de: string;
    en: string;
  };
  priceDisplay: {
    de: string;
    en: string;
  };
  priceNote: {
    de: string;
    en: string;
  };
  popular?: boolean;
  features: {
    de: string[];
    en: string[];
  };
  idealFor: {
    de: string;
    en: string;
  };
}

export interface ValuationFormData {
  propertyType: string;
  zipAndCity: string;
  livingArea: number;
  rooms: number;
  constructionYear: number;
  condition: string;
  standard: string;
  features: string[];
  name: string;
  email: string;
  phone: string;
  sellingIntent: string;
}

export interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  interest: 'sell' | 'buy' | 'valuation' | 'general';
  message: string;
  preferredContact: 'phone' | 'email';
}

export interface SearchProfileData {
  transactionType: 'buy' | 'rent';
  propertyTypes: string[];
  cantons: string[];
  specificLocations: string;
  commuteFlexibility: string;
  minRooms: number;
  minLivingArea: number;
  minPlotArea?: number;
  minBathrooms: number;
  parkingPreferences: string[];
  maxBudget: number;
  financialReadiness: string;
  timeframe: string;
  features: string[];
  specialNotes: string;
  name: string;
  email: string;
  phone: string;
  wantsOffMarket: boolean;
}

