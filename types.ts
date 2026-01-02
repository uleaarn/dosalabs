
export interface ClassItem {
  id: string;
  name: string;
  price: number;
  type: 'online' | 'in-home' | 'package';
  description: string;
  tagline: string;
  duration: string;
  slug: string;
  masteryList: string[];
  includedList: string[];
  ingredients: string[];
  equipment: string[];
  goodToKnow: string[];
  category?: 'adults' | 'kids';
}

export interface KitItem {
  id: string;
  name: string;
  price: number;
  delivery: 'ship' | 'pickup';
  description: string;
  image: string;
  details?: string[];
  recommended?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  role: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
}

export interface BookingState {
  step: number;
  bookingId?: string;
  contact: {
    fullName: string;
    email: string;
    phone: string;
    audienceType: 'individual' | 'family' | 'organization';
    organizationName?: string;
  };
  selection: {
    classId: string;
    date: string;
    format: 'online' | 'in-home';
    timeSlot: 'morning' | 'afternoon' | 'evening';
    timeZone?: string;
    selectedKits: string[];
  };
  details: {
    headcount: number;
    zipCode: string;
    address: string;
    kitchenNotes: string;
    allergies: string;
    pickupSlot?: string;
    consent: boolean;
    participantAgeGroup: 'kids' | 'teens' | 'adults';
    parentalSupervisionConsent?: boolean;
    safetyToolsConsent?: boolean;
  };
  pricing: {
    base: number;
    addons: number;
    total: number;
  };
}

export interface BookingRecord extends BookingState {
  id: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  bookingId: string;
  type: 'instructor_email' | 'guest_email';
  status: 'sent' | 'failed' | 'retrying';
  errorMessage?: string;
  retries: number;
  updatedAt: string;
}