import { prisma } from "@/lib/prisma";
import { siteConfig, defaultSocialLinks } from "@/lib/site-config";

export type ResolvedSiteSettings = {
  brandName: string;
  slogan: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutTitle: string;
  aboutContent: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  xUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
};

const FALLBACK: ResolvedSiteSettings = {
  brandName: siteConfig.name,
  slogan: siteConfig.slogan,
  heroHeadline: "Kelimeleriniz Profesyonel Bir Tasarımla Buluşuyor.",
  heroSubheadline:
    "Editörlük, dizgi ve kapak tasarımı hizmetlerimizle eserlerinizi yayın standartlarına uygun şekilde hazırlıyor, okuyucularınızla buluşmaya hazır hale getiriyoruz.",
  aboutTitle: "Sözcüklerin arkasındaki titiz işçilik",
  aboutContent:
    "NERAAJANS, editörlük ve yayın tasarımı alanında uzmanlaşmış bir ekiple çalışır. Her projeye, metnin kendi sesini koruyarak yayın standartlarına taşıyan disiplinli bir süreçle yaklaşırız.",
  ...defaultSocialLinks,
};

/**
 * Returns site settings from the database, falling back to sensible defaults
 * when the row (or the database itself) is not yet available. This keeps the
 * public site fully renderable before the first admin save / before db setup.
 */
/** Ensures the SiteSettings singleton exists and returns the raw row (admin). */
export async function ensureSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", heroSubheadline: FALLBACK.heroSubheadline, aboutContent: FALLBACK.aboutContent },
  });
}

/** Ensures the SEOSettings singleton exists and returns the raw row (admin). */
export async function ensureSEOSettings() {
  return prisma.sEOSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      defaultDescription: siteConfig.description,
    },
  });
}

export async function getSiteSettings(): Promise<ResolvedSiteSettings> {
  try {
    const row = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
    if (!row) return FALLBACK;
    return {
      brandName: row.brandName,
      slogan: row.slogan,
      heroHeadline: row.heroHeadline,
      heroSubheadline: row.heroSubheadline,
      aboutTitle: row.aboutTitle,
      aboutContent: row.aboutContent,
      instagramUrl: row.instagramUrl ?? defaultSocialLinks.instagramUrl,
      facebookUrl: row.facebookUrl ?? defaultSocialLinks.facebookUrl,
      xUrl: row.xUrl ?? defaultSocialLinks.xUrl,
      linkedinUrl: row.linkedinUrl ?? defaultSocialLinks.linkedinUrl,
      youtubeUrl: row.youtubeUrl ?? defaultSocialLinks.youtubeUrl,
    };
  } catch {
    return FALLBACK;
  }
}
