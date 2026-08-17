import { BookingState } from '../types.ts';

// Detect if we are running locally to use the Firebase Emulator
// Includes check for common local hostnames and cloud-based IDE preview hostnames
const isLocal = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname.includes('.lovableproject.com');

const PROJECT_ID = "dosalabs-95e1b";
const REGION = "us-central1";

// Production URL vs Emulator URL
// Note: For production, ensure you have deployed the functions to the correct PROJECT_ID and REGION.
const API_BASE = isLocal 
  ? `http://localhost:5001/${PROJECT_ID}/${REGION}`
  : `https://${REGION}-${PROJECT_ID}.cloudfunctions.net`;

export interface BookingResponse {
  success: boolean;
  status?: string;
  bookingId: string;
  emailStatus: 'SENT' | 'FAILED' | 'QUEUED' | 'PENDING';
  error?: string;
}

const handleFetch = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
      throw new Error(errorData.error || `Server responded with ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      throw new Error(`Connection failed to ${url}. Check if the backend is running/deployed.`);
    }
    throw error;
  }
};

/**
 * Helper to convert time label to HH:mm:ss format
 */
const formatTimeLabel = (label: string): string => {
  const match = label.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return "10:00:00";

  let hours = parseInt(match[1]);
  const minutes = match[2].padStart(2, '0');
  const ampm = match[3].toUpperCase();

  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
};

/**
 * Submits a new lab booking to the Firebase Functions backend.
 */
export const submitBooking = async (
  bookingData: BookingState & { labName: string; bookingRequestId: string }
): Promise<BookingResponse> => {
  try {
    const formattedTime = formatTimeLabel(bookingData.selection.timeSlot);
    
    const payload = {
      bookingRequestId: bookingData.bookingRequestId,
      email: bookingData.contact.email,
      guestName: bookingData.contact.fullName,
      phone: bookingData.contact.phone,
      labId: bookingData.selection.classId,
      // Create valid datetime string for backend consumption
      datetimeISO: `${bookingData.selection.date}T${formattedTime}`,
    };

    const result = await handleFetch(`${API_BASE}/submitBooking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return { 
      success: true, 
      status: result.status,
      bookingId: result.bookingId, 
      emailStatus: result.emailStatus
    };
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return { 
      success: false, 
      bookingId: '', 
      emailStatus: 'FAILED',
      error: error.message 
    };
  }
};

/**
 * Fetches booking details for a specific bookingRequestId from the backend.
 */
export const getBookingDetails = async (bookingRequestId: string) => {
  try {
    return await handleFetch(`${API_BASE}/getBooking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingRequestId })
    });
  } catch (err) {
    console.error("Fetch booking failed:", err);
    return null;
  }
};

/**
 * Requests the backend to resend the confirmation email for a given bookingRequestId.
 */
export const resendBookingEmail = async (bookingRequestId: string): Promise<{ success: boolean; error?: string; emailStatus?: string }> => {
  try {
    const result = await handleFetch(`${API_BASE}/resendBookingEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingRequestId })
    });
    return { success: result.success, emailStatus: result.emailStatus };
  } catch (err: any) {
    console.error("Email resend failed:", err);
    return { success: false, error: err.message };
  }
};

export interface CateringPayload {
  bookingRequestId: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guests: number;
  city: string;
  appetizers: string[];
  rice: string;
  dessert: string;
  notes: string;
}

export interface CateringResponse {
  success: boolean;
  status?: string;
  cateringId: string;
  emailStatus: 'SENT' | 'FAILED' | 'QUEUED' | 'PENDING';
  totalCents?: number;
  error?: string;
}

/**
 * Submits a Live Dosa Catering request to the Firebase Functions backend.
 * The server recomputes the price, so the returned total is authoritative.
 */
export const submitCatering = async (payload: CateringPayload): Promise<CateringResponse> => {
  try {
    const result = await handleFetch(`${API_BASE}/submitCatering`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return {
      success: true,
      status: result.status,
      cateringId: result.cateringId,
      emailStatus: result.emailStatus,
      totalCents: result.totalCents
    };
  } catch (error: any) {
    console.error("Catering API Error:", error);
    return { success: false, cateringId: '', emailStatus: 'FAILED', error: error.message };
  }
};