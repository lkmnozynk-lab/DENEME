/**
 * Static brand & navigation configuration.
 * Editable runtime values (hero text, social URLs, SEO) live in the database
 * via SiteSettings/SEOSettings; this file holds structural defaults that the
 * UI falls back to and that rarely change.
 */

export const siteConfig = {
  name: "NERAAJANS",
  slogan: "Kelimelerinize Profesyonel Bir Kimlik Kazandırıyoruz.",
  description:
    "NERAAJANS; editörlük, dizgi ve kapak tasarımı hizmetleriyle eserlerinizi yayın standartlarına uygun şekilde hazırlayan profesyonel yayıncılık ve tasarım ajansıdır.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "tr_TR",
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "Hizmetler", href: "/hizmetler" },
  { label: "Çalışmalarımız", href: "/calismalarimiz" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];

export const services = [
  {
    key: "EDITORLUK",
    slug: "editorluk",
    title: "Editörlük",
    description:
      "Metninizi profesyonel editörlük ve redaksiyon süreçlerinden geçirerek anlatım gücünü artırıyor, dil ve imla hatalarını gideriyor, eserinizi yayın standartlarına uygun hâle getiriyoruz.",
  },
  {
    key: "DIZGI",
    slug: "dizgi",
    title: "Dizgi",
    description:
      "Kitabınızı profesyonel yayıncılık standartlarına uygun şekilde diziyor, okunabilirliği ve görsel düzeni en üst seviyeye taşıyoruz.",
  },
  {
    key: "KAPAK_TASARIMI",
    slug: "kapak-tasarimi",
    title: "Kapak Tasarımı",
    description:
      "Eserinizin ruhunu yansıtan, dikkat çekici ve özgün kapak tasarımları hazırlayarak kitabınızı okuyucuyla buluşturuyoruz.",
  },
] as const;

export const serviceTypeLabels: Record<string, string> = {
  EDITORLUK: "Editörlük",
  DIZGI: "Dizgi",
  KAPAK_TASARIMI: "Kapak Tasarımı",
};

export const submissionStatusLabels: Record<string, string> = {
  NEW: "Yeni",
  IN_REVIEW: "İncelemede",
  CONTACTED: "İletişime geçildi",
  ARCHIVED: "Arşivlendi",
};

export const submissionStatusStyles: Record<string, string> = {
  NEW: "bg-primary-soft text-primary",
  IN_REVIEW: "bg-secondary-soft text-secondary",
  CONTACTED: "bg-success/15 text-success",
  ARCHIVED: "bg-surface-2 text-muted",
};

export const blogCategories = [
  { name: "Editörlük", slug: "editorluk" },
  { name: "Dizgi", slug: "dizgi" },
  { name: "Kapak Tasarımı", slug: "kapak-tasarimi" },
  { name: "Yayıncılık Rehberi", slug: "yayincilik-rehberi" },
] as const;

/** Social platforms. URLs are managed in the admin (SiteSettings). */
export const socialPlatforms = [
  { key: "instagramUrl", label: "Instagram" },
  { key: "facebookUrl", label: "Facebook" },
  { key: "xUrl", label: "X" },
  { key: "linkedinUrl", label: "LinkedIn" },
  { key: "youtubeUrl", label: "YouTube" },
] as const;

/** Fallback social links used until the admin sets real ones. */
export const defaultSocialLinks = {
  instagramUrl: "https://instagram.com",
  facebookUrl: "https://facebook.com",
  xUrl: "https://x.com",
  linkedinUrl: "https://linkedin.com",
  youtubeUrl: "https://youtube.com",
};
