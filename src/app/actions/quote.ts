"use server";

import { prisma } from "@/lib/prisma";
import { quoteSchema } from "@/lib/validation";
import { saveUpload } from "@/lib/upload";
import { sendNotificationEmail, escapeHtml } from "@/lib/email";
import { rateLimit, getClientIp, hashIp } from "@/lib/rate-limit";
import { serviceTypeLabels } from "@/lib/site-config";

export type QuoteState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export async function submitQuote(
  _prev: QuoteState,
  formData: FormData,
): Promise<QuoteState> {
  const ip = await getClientIp();
  const limited = await rateLimit(`quote:${hashIp(ip)}`, { limit: 4, windowMs: 60_000 });
  if (!limited.ok) {
    return {
      ok: false,
      message: "Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin.",
    };
  }

  const rawService = formData.get("serviceType");
  const parsed = quoteSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    serviceType: rawService ? String(rawService) : undefined,
    message: formData.get("message"),
    company: formData.get("company"),
  });

  const keep = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    serviceType: rawService ? String(rawService) : "",
    message: String(formData.get("message") ?? ""),
  };

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
      values: keep,
    };
  }

  if (parsed.data.company) {
    return { ok: true, message: "Teklif talebiniz alındı. Teşekkür ederiz!" };
  }

  const { name, email, phone, serviceType, message } = parsed.data;

  // Optional file upload — validated & stored securely.
  let fileUrl: string | null = null;
  let fileName: string | null = null;
  const file = formData.get("file");
  if (file instanceof File && file.size > 0) {
    const result = await saveUpload(file);
    if (!result.ok) {
      return {
        ok: false,
        message: result.error,
        errors: { file: result.error },
        values: keep,
      };
    }
    fileUrl = result.url;
    fileName = result.fileName;
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        serviceType: serviceType ?? null,
        message,
        fileUrl,
        fileName,
        ipHash: hashIp(ip),
      },
    });
  } catch (err) {
    console.error("[quote] db save failed:", err);
  }

  await sendNotificationEmail({
    subject: `Yeni teklif talebi — ${name}`,
    replyTo: email,
    html: `
      <h2>Yeni Teklif Talebi</h2>
      <p><strong>Ad Soyad:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(phone || "-")}</p>
      <p><strong>Hizmet Türü:</strong> ${
        serviceType ? serviceTypeLabels[serviceType] : "-"
      }</p>
      <p><strong>Mesaj:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      ${fileUrl ? `<p><strong>Dosya:</strong> ${escapeHtml(fileUrl)}</p>` : ""}
    `,
  });

  return {
    ok: true,
    message:
      "Teklif talebiniz başarıyla iletildi. Ekibimiz en kısa sürede sizinle iletişime geçecek.",
  };
}
