
import { BookingRecord } from '../types.ts';

/**
 * Generates an .ics file for the booking.
 * Uses local time components to ensure the event appears at the correct time in the user's calendar.
 */
export const generateICSFromBooking = (booking: BookingRecord, classTitle: string) => {
  // Parse date string (YYYY-MM-DD) to avoid UTC conversion issues
  const [year, month, day] = booking.selection.date.split('-').map(Number);
  const startDate = new Date(year, month - 1, day);
  
  // Basic time slot mapping
  const hoursMap: Record<string, number> = { 
    morning: 9, 
    afternoon: 13, 
    evening: 18 
  };
  const startHour = hoursMap[booking.selection.timeSlot] || 10;
  
  startDate.setHours(startHour, 0, 0);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2h duration

  // Format date as YYYYMMDDTHHMMSS for floating (local) time
  const formatDate = (date: Date) => {
    return date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0') +
      'T' +
      date.getHours().toString().padStart(2, '0') +
      date.getMinutes().toString().padStart(2, '0') +
      '00';
  };

  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);
  // DTSTAMP must be UTC (with Z)
  const stampStr = new Date().toISOString().replace(/-|:|\.\d+/g, "").split('Z')[0] + "Z";

  const description = `
DOSALABS LAB CONFIRMATION
Lab: ${classTitle}
Format: ${booking.selection.format.toUpperCase()}
Headcount: ${booking.details.headcount} guests
Booking ID: ${booking.id}

PREPARATION:
Check your email for the technical prep checklist and ingredient sourcing guide.
Watch "Batter Consistency 101" in the Lab Library before the session.

NOTES:
${booking.details.kitchenNotes || 'No specific kitchen notes provided.'}
Allergies: ${booking.details.allergies || 'None listed.'}

See you in the Lab!
`.trim().replace(/\n/g, "\\n");

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dosalabs//NONSGML Event//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${booking.id}@dosalabs.io`,
    `DTSTAMP:${stampStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:Dosalabs: ${classTitle}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${booking.selection.format === 'online' ? 'Zoom (Link in Email)' : booking.details.address || 'In-Home'}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `dosalabs_${booking.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
