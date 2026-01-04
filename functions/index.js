const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");
const { Resend } = require("resend");

initializeApp();
const db = getFirestore();

const LAB_CATALOG = {
  "c1": { name: "Dosa Mastery Lab", priceCents: 8900 },
  "c2": { name: "Idli Perfect Lab", priceCents: 8900 },
  "c3": { name: "Sambar Base Lab", priceCents: 4900 },
  "c4": { name: "Chutneys 4 Ways", priceCents: 4900 },
  "c5": { name: "South Indian Starter Pack", priceCents: 19900 },
  "c6": { name: "Weekend Family Dosa Lab", priceCents: 24900 },
  "c7": { name: "Kids Dosa Lab", priceCents: 3900 }
};

async function sendResendEmail(booking, bookingId) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY secret");
    return { data: null, error: { name: "CONFIG_ERROR", message: "Mail provider not configured" } };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = "Dosalabs <hello@dosalabs.io>"; 
  const replyTo = "hello@dosalabs.io";
  
  const payload = {
    from,
    reply_to: replyTo,
    to: [booking.email],
    subject: `Lab Confirmed: ${booking.labName} [${bookingId}]`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E6E7EB; border-radius: 24px; overflow: hidden; background: #FFF;">
        <div style="background-color: #0B0B0C; padding: 48px 40px; text-align: center;">
          <h1 style="color: #BF9264; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 3px; font-weight: 800;">Confirmed</h1>
        </div>
        <div style="padding: 40px; color: #0B0B0C; line-height: 1.6;">
          <p style="font-size: 16px;">Hi ${booking.guestName},</p>
          <p style="font-size: 16px;">Your <strong>${booking.labName}</strong> session is officially in the calendar.</p>
          <div style="background-color: #F6F7F8; padding: 32px; border-radius: 16px; margin: 32px 0; border: 1px solid #EDEFF2;">
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #3A3D42;"><strong>Booking ID:</strong> <span style="font-family: monospace; font-weight: bold; color: #0B0B0C;">${bookingId}</span></p>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #3A3D42;"><strong>Date/Time:</strong> ${booking.datetimeISO.replace('T', ' ')}</p>
            <p style="margin: 0; font-size: 14px; color: #3A3D42;"><strong>Amount Paid:</strong> $${(booking.amountCents / 100).toFixed(2)}</p>
          </div>
          <p style="font-size: 14px; color: #3A3D42; margin-bottom: 24px;">Click below to access your Lab Dashboard where you can find your technical prep packet and ingredient sourcing guide.</p>
          <a href="https://dosalabs.io/#/dashboard?bid=${booking.bookingRequestId}" style="display: inline-block; background-color: #0B0B0C; color: #FFFFFF; padding: 18px 36px; border-radius: 100px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Access Guest Dashboard</a>
        </div>
      </div>
    `
  };

  try {
    return await resend.emails.send(payload);
  } catch (e) {
    return { data: null, error: e };
  }
}

// Using cors: true allows requests from any origin (e.g., preview domains)
exports.submitBooking = onRequest({ secrets: ["RESEND_API_KEY"], cors: true }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { bookingRequestId, email, labId, datetimeISO, guestName } = req.body;

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

    const { data, error } = await sendResendEmail(bookingData, bookingId);
    
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

exports.resendBookingEmail = onRequest({ secrets: ["RESEND_API_KEY"], cors: true }, async (req, res) => {
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

    const { data: emailData, error } = await sendResendEmail(data, data.bookingId);
    
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
