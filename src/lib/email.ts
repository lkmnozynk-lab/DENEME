import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM ?? "NERAAJANS <onboarding@resend.dev>";
const TO = process.env.CONTACT_NOTIFICATION_EMAIL ?? "info@neraajans.com";

type Mail = { subject: string; html: string; replyTo?: string };

/**
 * Sends a notification email. In development (or when RESEND_API_KEY is unset),
 * the email is logged to the console instead of being sent — so the app works
 * end-to-end without external credentials.
 */
export async function sendNotificationEmail({ subject, html, replyTo }: Mail) {
  if (!resend) {
    console.info(
      `[email:dev] To: ${TO}\nSubject: ${subject}\nReply-To: ${replyTo ?? "-"}\n${html}`,
    );
    return { ok: true, dev: true as const };
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject,
      html,
      replyTo,
    });
    if (error) {
      console.error("[email] send failed:", error);
      return { ok: false as const };
    }
    return { ok: true as const, dev: false as const };
  } catch (err) {
    console.error("[email] unexpected error:", err);
    return { ok: false as const };
  }
}

/** Minimal HTML escaping for values interpolated into email bodies. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
