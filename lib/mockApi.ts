import { BookingState } from '../types.ts';

// Detect if we are running locally to use the Firebase Emulator
// Includes check for common local hostnames and cloud-based IDE preview hostnames
const isLocal = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname.includes('.lovableproject.com');

const PROJECT_ID = "dosalabs-prod";
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

export const submitBooking = async (
  bookingData: BookingState & { labName: string; bookingRequestId: string }
): Promise<BookingResponse> => {
  try {
    const payload = {
      bookingRequestId: bookingData.bookingRequestId,
      email: bookingData.contact.email,
      guestName: bookingData.contact.fullName,
      labId: bookingData.selection.classId,
      datetimeISO: `${bookingData.selection.date}T${bookingData.selection.timeSlot}`,
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
