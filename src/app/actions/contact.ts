"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { sendNotificationEmail, escapeHtml } from "@/lib/email";
import { rateLimit, getClientIp, hashIp } from "@/lib/rate-limit";

export type ContactState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  values?: { name?: string; email?: string; message?: string };
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // 1) Rate limit by client IP (brute-force / spam protection).
  const ip = await getClientIp();
  const limited = await rateLimit(`contact:${hashIp(ip)}`, { limit: 5, windowMs: 60_000 });
  if (!limited.ok) {
    return {
      ok: false,
      message: "Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin.",
    };
  }

  // 2) Server-side validation (never trust the client).
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company"), // honeypot
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return {
      ok: false,
      message: "Lütfen formdaki hataları düzeltin.",
      errors,
      values: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        message: String(formData.get("message") ?? ""),
      },
    };
  }

  // 3) Honeypot caught a bot — pretend success, do nothing.
  if (parsed.data.company) {
    return { ok: true, message: "Mesajınız alındı. Teşekkür ederiz!" };
  }

  const { name, email, message } = parsed.data;

  // 4) Persist (best-effort) + audit.
  try {
    await prisma.contactSubmission.create({
      data: { name, email, message, ipHash: hashIp(ip) },
    });
  } catch (err) {
    console.error("[contact] db save failed:", err);
    // Continue — we still attempt the notification email.
  }

  // 5) Notify.
  await sendNotificationEmail({
    subject: `Yeni iletişim mesajı — ${name}`,
    replyTo: email,
    html: `
      <h2>Yeni İletişim Mesajı</h2>
      <p><strong>Ad Soyad:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
      <p><strong>Mesaj:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `,
  });

  return {
    ok: true,
    message: "Mesajınız başarıyla gönderildi. En kısa sürede dönüş yapacağız.",
  };
}
