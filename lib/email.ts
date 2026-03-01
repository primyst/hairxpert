import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Hairxpert <bookings@hairxpert.com.ng>";
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);

// ─── Email sent to admin when new booking is created ─────────
export async function sendAdminBookingAlert(booking: {
  id: string;
  user_name: string;
  user_email: string;
  service: string;
  price: string;
  stylist: string;
  slot: string;
  duration: string;
}) {
  if (!ADMIN_EMAILS.length) return;

  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAILS,
    subject: `🗓 New Booking: ${booking.service} — ${booking.slot}`,
    html: adminBookingEmailHtml(booking),
  });
}

// ─── Email sent to client when status changes ─────────────────
export async function sendClientStatusEmail(booking: {
  user_name: string;
  user_email: string;
  service: string;
  stylist: string;
  slot: string;
  status: "confirmed" | "cancelled" | "completed";
}) {
  if (!booking.user_email) return;

  const subjects = {
    confirmed: `✅ Confirmed: Your Hairxpert appointment`,
    cancelled: `❌ Cancelled: Your Hairxpert appointment`,
    completed: `⭐ Thank you for visiting Hairxpert`,
  };

  return resend.emails.send({
    from: FROM,
    to: booking.user_email,
    subject: subjects[booking.status],
    html: clientStatusEmailHtml(booking),
  });
}

// ─── Email sent to client on initial booking confirmation ──────
export async function sendClientBookingConfirmation(booking: {
  user_name: string;
  user_email: string;
  service: string;
  price: string;
  stylist: string;
  slot: string;
  duration: string;
}) {
  if (!booking.user_email) return;

  return resend.emails.send({
    from: FROM,
    to: booking.user_email,
    subject: `🎉 Booking Confirmed — Hairxpert`,
    html: clientConfirmationEmailHtml(booking),
  });
}

// ─── HTML Templates ───────────────────────────────────────────

function baseLayout(content: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#18181b;border-radius:16px;border:1px solid #27272a;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#92400e,#78350f);padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;color:#fbbf24;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">Hairxpert</p>
                  <p style="margin:4px 0 0;color:#fff;font-size:22px;font-weight:900;font-style:italic;">Luxury Salon & Grooming</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:32px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #27272a;">
            <p style="margin:0;color:#52525b;font-size:11px;text-align:center;">
              14 Luxury Lane, Victoria Island, Lagos &nbsp;·&nbsp; +234 800 123 4567
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function bookingRow(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #27272a;">
      <span style="color:#71717a;font-size:13px;">${label}</span>
    </td>
    <td style="padding:10px 0;border-bottom:1px solid #27272a;text-align:right;">
      <span style="color:#e4e4e7;font-size:13px;font-weight:600;">${value}</span>
    </td>
  </tr>`;
}

function adminBookingEmailHtml(b: {
  id: string; user_name: string; user_email: string;
  service: string; price: string; stylist: string; slot: string; duration: string;
}) {
  return baseLayout(`
    <p style="margin:0 0 6px;color:#fbbf24;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">New Booking</p>
    <h1 style="margin:0 0 24px;color:#fff;font-size:24px;font-weight:900;">Someone just booked!</h1>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${bookingRow("Client", `${b.user_name} (${b.user_email})`)}
      ${bookingRow("Service", b.service)}
      ${bookingRow("Stylist", b.stylist)}
      ${bookingRow("Date & Time", b.slot)}
      ${bookingRow("Duration", b.duration)}
      ${bookingRow("Price", `<strong style="color:#fbbf24;">${b.price}</strong>`)}
    </table>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
       style="display:inline-block;background:#f59e0b;color:#09090b;font-weight:900;font-size:14px;padding:14px 28px;border-radius:50px;text-decoration:none;">
      View in Admin Dashboard →
    </a>
  `);
}

function clientConfirmationEmailHtml(b: {
  user_name: string; service: string; price: string;
  stylist: string; slot: string; duration: string;
}) {
  const firstName = b.user_name?.split(" ")[0] || "there";
  return baseLayout(`
    <p style="margin:0 0 6px;color:#fbbf24;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">Booking Confirmed</p>
    <h1 style="margin:0 0 8px;color:#fff;font-size:24px;font-weight:900;">You're all set, ${firstName}!</h1>
    <p style="margin:0 0 24px;color:#71717a;font-size:14px;line-height:1.6;">
      Your appointment has been confirmed. We can't wait to see you.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${bookingRow("Service", b.service)}
      ${bookingRow("Stylist", b.stylist)}
      ${bookingRow("When", b.slot)}
      ${bookingRow("Duration", b.duration)}
      ${bookingRow("Price", `<strong style="color:#fbbf24;">${b.price}</strong>`)}
    </table>

    <div style="background:#1c1917;border:1px solid #292524;border-radius:12px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;color:#78716c;font-size:13px;line-height:1.6;">
        📍 <strong style="color:#a8a29e;">14 Luxury Lane, Victoria Island, Lagos</strong><br/>
        Please arrive 5 minutes early. Need to reschedule? Call us at +234 800 123 4567.
      </p>
    </div>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
       style="display:inline-block;background:#f59e0b;color:#09090b;font-weight:900;font-size:14px;padding:14px 28px;border-radius:50px;text-decoration:none;">
      View My Bookings →
    </a>
  `);
}

function clientStatusEmailHtml(b: {
  user_name: string; service: string; stylist: string;
  slot: string; status: string;
}) {
  const firstName = b.user_name?.split(" ")[0] || "there";

  const messages: Record<string, { headline: string; body: string; cta: string; ctaHref: string }> = {
    confirmed: {
      headline: `Confirmed, ${firstName}!`,
      body: "Your appointment has been confirmed by our team. See you soon.",
      cta: "View Booking →",
      ctaHref: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    },
    cancelled: {
      headline: `Your appointment was cancelled`,
      body: "We're sorry your appointment was cancelled. Book a new time whenever you're ready.",
      cta: "Book Again →",
      ctaHref: `${process.env.NEXT_PUBLIC_APP_URL}/book`,
    },
    completed: {
      headline: `Thank you, ${firstName}!`,
      body: "We hope you loved your experience at Hairxpert. We'd love to see you again.",
      cta: "Book Next Visit →",
      ctaHref: `${process.env.NEXT_PUBLIC_APP_URL}/book`,
    },
  };

  const m = messages[b.status] || messages.confirmed;

  return baseLayout(`
    <h1 style="margin:0 0 8px;color:#fff;font-size:24px;font-weight:900;">${m.headline}</h1>
    <p style="margin:0 0 24px;color:#71717a;font-size:14px;line-height:1.6;">${m.body}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${bookingRow("Service", b.service)}
      ${bookingRow("Stylist", b.stylist)}
      ${bookingRow("When", b.slot)}
    </table>

    <a href="${m.ctaHref}"
       style="display:inline-block;background:#f59e0b;color:#09090b;font-weight:900;font-size:14px;padding:14px 28px;border-radius:50px;text-decoration:none;">
      ${m.cta}
    </a>
  `);
}
