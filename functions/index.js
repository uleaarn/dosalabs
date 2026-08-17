const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");
const nodemailer = require("nodemailer");

initializeApp();
const db = getFirestore();

// Gmail account used to send + receive booking mail.
// GMAIL_APP_PASSWORD is a Firebase secret (16-char Google App Password), never hard-coded.
const GMAIL_USER = "dosalabsusa@gmail.com";
const OWNER_EMAIL = "dosalabsusa@gmail.com"; // where new-booking notifications land

function getTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
  });
}

const LAB_CATALOG = {
  "c1": { name: "Dosa Mastery Lab", priceCents: 8900 },
  "c2": { name: "Idli Perfect Lab", priceCents: 8900 },
  "c3": { name: "Sambar Base Lab", priceCents: 4900 },
  "c4": { name: "Chutneys 4 Ways", priceCents: 4900 },
  "c5": { name: "South Indian Starter Pack", priceCents: 19900 },
  "c6": { name: "Weekend Family Dosa Lab", priceCents: 24900 },
  "c7": { name: "Kids Dosa Lab", priceCents: 3900 }
};

async function sendBookingEmails(booking, bookingId) {
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.error("Missing GMAIL_APP_PASSWORD secret");
    return { data: null, error: { name: "CONFIG_ERROR", message: "Mail provider not configured" } };
  }

  const transporter = getTransport();
  const from = `"Dosalabs" <${GMAIL_USER}>`;

  const dashboardUrl = `https://dosalabs.io/#/dashboard?bid=${booking.bookingRequestId}`;
  const whatsappUrl = `https://chat.whatsapp.com/example-dosalabs-community`; // Replace with actual group link

  // --- 1) Confirmation email to the customer ---
  const customerPayload = {
    from,
    replyTo: OWNER_EMAIL,
    to: booking.email,
    subject: `Lab Confirmed: ${booking.labName} [${bookingId}]`,
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E6E7EB; border-radius: 24px; overflow: hidden; background: #FFF;">
        <div style="background-color: #0B0B0C; padding: 48px 40px; text-align: center;">
          <h1 style="color: #BF9264; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 3px; font-weight: 800;">Laboratory Confirmed</h1>
        </div>
        <div style="padding: 40px; color: #0B0B0C; line-height: 1.6;">
          <p style="font-size: 16px;">Hi ${booking.guestName},</p>
          <p style="font-size: 16px;">Welcome to the Lab. Your <strong>${booking.labName}</strong> is officially scheduled.</p>
          
          <div style="background-color: #F6F7F8; padding: 32px; border-radius: 16px; margin: 32px 0; border: 1px solid #EDEFF2;">
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #3A3D42;"><strong>Booking ID:</strong> <span style="font-family: monospace; font-weight: bold; color: #0B0B0C;">${bookingId}</span></p>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #3A3D42;"><strong>Session:</strong> ${booking.datetimeISO.replace('T', ' ')}</p>
            <p style="margin: 0; font-size: 14px; color: #3A3D42;"><strong>Total Paid:</strong> $${(booking.amountCents / 100).toFixed(2)}</p>
          </div>

          <div style="margin-bottom: 32px;">
            <p style="font-size: 14px; font-weight: bold; color: #0B0B0C; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">Critical Steps:</p>
            <a href="${dashboardUrl}" style="display: block; background-color: #0B0B0C; color: #FFFFFF; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; text-align: center; margin-bottom: 12px;">Download Prep Checklist & Grains Guide</a>
            <a href="${whatsappUrl}" style="display: block; background-color: #25D366; color: #FFFFFF; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; text-align: center;">Join WhatsApp Updates Community</a>
          </div>

          <p style="font-size: 13px; color: #6B7280; text-align: center;">
            Check your dashboard for the "Batter Consistency 101" pre-lab video.<br/>
            Questions? Reply to this email or find us in the WhatsApp group.
          </p>
        </div>
        <div style="background-color: #F6F7F8; padding: 20px; text-align: center; border-top: 1px solid #E6E7EB;">
          <p style="margin: 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #9CA3AF;">Dosalabs — Technique-First Culinary Education</p>
        </div>
      </div>
    `
  };

  // --- 2) New-booking notification to the owner (dosalabsusa@gmail.com) ---
  const ownerPayload = {
    from: `"Dosalabs Bookings" <${GMAIL_USER}>`,
    replyTo: booking.email,
    to: OWNER_EMAIL,
    subject: `New booking: ${booking.labName} — ${booking.guestName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #0B0B0C;">
        <h2 style="margin: 0 0 16px;">New booking received</h2>
        <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #6B7280;">Booking ID</td><td style="padding: 6px 0; font-weight: bold;">${bookingId}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B7280;">Lab</td><td style="padding: 6px 0; font-weight: bold;">${booking.labName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B7280;">Name</td><td style="padding: 6px 0;">${booking.guestName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${booking.email}">${booking.email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6B7280;">Phone</td><td style="padding: 6px 0;">${booking.phone || "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B7280;">Session</td><td style="padding: 6px 0;">${booking.datetimeISO.replace('T', ' ')}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B7280;">Amount</td><td style="padding: 6px 0;">$${(booking.amountCents / 100).toFixed(2)}</td></tr>
        </table>
        <p style="font-size: 13px; color: #6B7280; margin-top: 20px;">Reply to this email to reach the customer directly.</p>
      </div>
    `
  };

  try {
    // The customer confirmation is the primary send — its result drives emailStatus.
    const info = await transporter.sendMail(customerPayload);

    // Owner notification is best-effort: never let it fail the booking.
    try {
      await transporter.sendMail(ownerPayload);
    } catch (ownerErr) {
      console.error("Owner notification failed (non-fatal):", ownerErr && ownerErr.message);
    }

    return { data: { id: info.messageId }, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

// Using cors: true allows requests from any origin (e.g., preview domains)
exports.submitBooking = onRequest({ secrets: ["GMAIL_APP_PASSWORD"], cors: true }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { bookingRequestId, email, labId, datetimeISO, guestName, phone } = req.body;

  if (!bookingRequestId || !email || !labId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const lab = LAB_CATALOG[labId];
    if (!lab) return res.status(400).json({ error: "Invalid Lab Selection" });

    const bookingId = `DL-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = FieldValue.serverTimestamp();

    const bookingData = {
      bookingRequestId,
      bookingId,
      email,
      guestName: guestName || "Guest",
      phone: phone || "",
      labId,
      labName: lab.name,
      datetimeISO,
      amountCents: lab.priceCents,
      currency: "USD",
      createdAt: now,
      updatedAt: now,
      emailStatus: "QUEUED",
      emailSendCount: 0,
      lastEmailAttemptAt: null
    };

    try {
      await db.collection("bookings").doc(bookingRequestId).create(bookingData);
    } catch (e) {
      if (e.code === 6) { // ALREADY_EXISTS
        const doc = await db.collection("bookings").doc(bookingRequestId).get();
        const data = doc.data();
        return res.status(200).json({ 
          status: "ALREADY_EXISTS", 
          bookingId: data.bookingId, 
          emailStatus: data.emailStatus 
        });
      }
      throw e;
    }

    const { data, error } = await sendBookingEmails(bookingData, bookingId);
    
    const update = {
      emailSendCount: 1,
      lastEmailAttemptAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    if (error) {
      update.emailStatus = "FAILED";
      update.emailErrorCode = error.name || "RESEND_ERROR";
      update.emailErrorMessage = error.message || "Failed to send initial email";
    } else {
      update.emailStatus = "SENT";
      update.emailMessageId = data.id;
    }

    await db.collection("bookings").doc(bookingRequestId).update(update);

    return res.status(200).json({
      status: "CREATED",
      bookingId,
      emailStatus: update.emailStatus
    });

  } catch (err) {
    console.error("[Fatal Error]", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.resendBookingEmail = onRequest({ secrets: ["GMAIL_APP_PASSWORD"], cors: true }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { bookingRequestId } = req.body;
  if (!bookingRequestId) return res.status(400).json({ error: "Missing bookingRequestId" });

  try {
    const docRef = db.collection("bookings").doc(bookingRequestId);
    const doc = await docRef.get();
    
    if (!doc.exists) return res.status(404).json({ error: "Booking not found" });
    const data = doc.data();

    if (data.emailStatus === "SENT") {
      return res.status(200).json({ success: true, status: "SENT", message: "Email already sent" });
    }

    if (data.emailSendCount >= 3) {
      return res.status(429).json({ error: "Max resend attempts reached" });
    }

    if (data.lastEmailAttemptAt) {
      const last = data.lastEmailAttemptAt.toDate().getTime();
      const diff = Date.now() - last;
      if (diff < 5 * 60 * 1000) {
        return res.status(429).json({ error: "Please wait 5 minutes between retries" });
      }
    }

    const { data: emailData, error } = await sendBookingEmails(data, data.bookingId);
    
    const update = {
      emailSendCount: FieldValue.increment(1),
      lastEmailAttemptAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    if (error) {
      update.emailStatus = "FAILED";
      update.emailErrorCode = error.name;
      update.emailErrorMessage = error.message;
    } else {
      update.emailStatus = "SENT";
      update.emailMessageId = emailData.id;
    }

    await docRef.update(update);
    return res.status(200).json({ 
      success: !error, 
      emailStatus: update.emailStatus, 
      error: error ? error.message : null 
    });

  } catch (err) {
    console.error("[Resend Fatal]", err);
    return res.status(500).json({ error: "Internal Error" });
  }
});

exports.getBooking = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { bookingRequestId } = req.body;
  if (!bookingRequestId) return res.status(400).json({ error: "Missing ID" });

  try {
    const doc = await db.collection("bookings").doc(bookingRequestId).get();
    if (!doc.exists) return res.status(404).json({ error: "Not found" });
    
    const d = doc.data();
    return res.status(200).json({
      bookingId: d.bookingId,
      labName: d.labName,
      datetimeISO: d.datetimeISO,
      amountCents: d.amountCents,
      currency: d.currency,
      emailStatus: d.emailStatus
    });
  } catch (e) {
    return res.status(500).json({ error: "Fetch failed" });
  }
});