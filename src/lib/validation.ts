import { z } from "zod";

/** Shared field rules. Server-side validation is the source of truth. */
const name = z
  .string()
  .trim()
  .min(2, "Lütfen adınızı girin.")
  .max(120, "Ad çok uzun.");

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Geçerli bir e-posta adresi girin.")
  .max(160);

const phone = z
  .string()
  .trim()
  .max(40)
  .regex(/^[0-9+()\s-]*$/, "Geçerli bir telefon numarası girin.")
  .optional()
  .or(z.literal(""));

const message = z
  .string()
  .trim()
  .min(10, "Mesajınız en az 10 karakter olmalı.")
  .max(5000, "Mesaj çok uzun.");

export const serviceTypeEnum = z.enum([
  "EDITORLUK",
  "DIZGI",
  "KAPAK_TASARIMI",
]);

/** Compact contact form (home + contact page). */
export const contactSchema = z.object({
  name,
  email,
  message,
  // Honeypot — must stay empty. Bots tend to fill every field.
  company: z.string().max(0).optional().or(z.literal("")),
});

/** Full quote/teklif form (with service + optional phone + file). */
export const quoteSchema = z.object({
  name,
  email,
  phone,
  serviceType: serviceTypeEnum.optional(),
  message,
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;

// ── Secure file-upload constraints (server-enforced) ──
export const ALLOWED_UPLOAD_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
};
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB
