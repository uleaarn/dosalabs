
import { BookingState, BookingRecord, NotificationLog } from '../types.ts';
import classesData from '../data/classes.ts';

const DB_KEY = 'dosalabs_bookings_db';
const LOG_KEY = 'dosalabs_notifications_log';

// Helper to interact with Mock DB
const db = {
  getBookings: (): BookingRecord[] => JSON.parse(localStorage.getItem(DB_KEY) || '[]'),
  saveBooking: (record: BookingRecord) => {
    const records = db.getBookings();
    localStorage.setItem(DB_KEY, JSON.stringify([...records, record]));
  },
  getLogs: (): NotificationLog[] => JSON.parse(localStorage.getItem(LOG_KEY) || '[]'),
  saveLog: (log: NotificationLog) => {
    const logs = db.getLogs();
    const index = logs.findIndex(l => l.id === log.id);
    if (index > -1) logs[index] = log;
    else logs.push(log);
    localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  }
};

/**
 * Simulates POST /api/bookings
 */
export const submitBooking = async (bookingData: BookingState): Promise<{ success: boolean; bookingId: string }> => {
  // Idempotency check
  const existing = db.getBookings().find(b => b.id === bookingData.bookingId);
  if (existing) {
    return { success: true, bookingId: existing.id };
  }

  const bookingId = bookingData.bookingId || `DL-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const record: BookingRecord = {
    ...bookingData,
    id: bookingId,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  // 1. Save to DB
  db.saveBooking(record);

  // 2. Trigger Async Notifications (Non-blocking)
  processNotifications(record);

  return { success: true, bookingId };
};

/**
 * Handles the background notification flow with retry logic
 */
const processNotifications = async (booking: BookingRecord) => {
  const types: Array<'instructor_email' | 'guest_email'> = ['instructor_email', 'guest_email'];
  
  for (const type of types) {
    const logId = `${booking.id}-${type}`;
    const initialLog: NotificationLog = {
      id: logId,
      bookingId: booking.id,
      type,
      status: 'retrying',
      retries: 0,
      updatedAt: new Date().toISOString()
    };
    db.saveLog(initialLog);
    
    // Attempt sending with exponential backoff
    attemptSend(initialLog, booking);
  }
};

const attemptSend = async (log: NotificationLog, booking: BookingRecord) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulated flakiness (10% chance of failure to test retries)
    if (Math.random() < 0.1) {
      throw new Error("SMTP Server Timeout");
    }

    const lab = classesData.find(c => c.id === booking.selection.classId);
    const labName = lab?.name || 'Dosa Lab';

    if (log.type === 'guest_email') {
      const whatsappLink = `https://wa.me/19730000000?text=${encodeURIComponent(`Hi Dosalabs, I just booked a lab! My Booking ID is ${booking.id}. I'd like to join updates for my ${labName} session.`)}`;
      
      const emailContent = `
--- SIMULATED GUEST EMAIL ---
TO: ${booking.contact.email}
SUBJECT: Lab Confirmed: ${labName} (ID: ${booking.id})

Hi ${booking.contact.fullName},

Get ready to master the spread! Your booking for the ${labName} is confirmed.

DETAILS:
- Date: ${booking.selection.date}
- Slot: ${booking.selection.timeSlot}
- Format: ${booking.selection.format.toUpperCase()}
- Headcount: ${booking.details.headcount} guests

PREPARATION (REQUIRED):
1. Download Prep Checklist: https://dosalabs.io/#/prep-checklist/${booking.id}
2. Sourcing Guide: Included in your prep packet.
3. Technique Drills: Watch "Batter Consistency 101" at https://dosalabs.io/#/library

MOBILE UPDATES:
Join our WhatsApp group for real-time session updates and fermentation alerts:
${whatsappLink}

See you in the Lab!
- The Dosalabs Team
-----------------------------
      `;
      console.log(emailContent);
    } else {
      console.log(`[Notification] Instructor Alert sent for ${booking.id}: ${labName} with ${booking.details.headcount} guests.`);
    }

    // Success
    log.status = 'sent';
    log.updatedAt = new Date().toISOString();
    db.saveLog(log);

  } catch (error: any) {
    log.retries += 1;
    log.errorMessage = error.message;

    if (log.retries >= 3) {
      log.status = 'failed';
      log.updatedAt = new Date().toISOString();
      db.saveLog(log);
      console.error(`[Notification] ${log.type} permanently failed for ${booking.id}`);
    } else {
      const delay = Math.pow(2, log.retries) * 1000;
      console.warn(`[Notification] ${log.type} retrying in ${delay}ms...`);
      setTimeout(() => attemptSend(log, booking), delay);
    }
  }
};
