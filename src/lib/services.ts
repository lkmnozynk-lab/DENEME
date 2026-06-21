import { prisma } from "@/lib/prisma";
import { serviceDetails, getServiceBySlug } from "@/lib/services-data";

export type ServiceFeature = { title: string; text: string };
export type ServiceStep = { step: string; title: string; text: string };
export type ServiceFaq = { q: string; a: string };

export type ServiceDetail = {
  id: string | null;
  key: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  intro: string;
  features: ServiceFeature[];
  process: ServiceStep[];
  faqs: ServiceFaq[];
};

function safeParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Maps a DB ServicePage row onto the static fallback for that service. */
function mergeWithFallback(row: {
  id: string;
  key: string;
  slug: string;
  title: string;
  shortDescription: string;
  tagline: string | null;
  intro: string | null;
  features: string;
  process: string;
  faqs: string;
}): ServiceDetail {
  const fb = getServiceBySlug(row.slug) ?? serviceDetails.find((s) => s.key === row.key);
  const features = safeParse<ServiceFeature[]>(row.features, []);
  const process = safeParse<ServiceStep[]>(row.process, []);
  const faqs = safeParse<ServiceFaq[]>(row.faqs, []);
  return {
    id: row.id,
    key: row.key,
    slug: row.slug,
    title: row.title || fb?.title || row.key,
    tagline: row.tagline || fb?.tagline || "",
    description: row.shortDescription || fb?.description || "",
    intro: row.intro || fb?.intro || "",
    features: features.length > 0 ? features : (fb?.features ?? []),
    process: process.length > 0 ? process : (fb?.process ?? []),
    faqs: faqs.length > 0 ? faqs : (fb?.faqs ?? []),
  };
}

/** Static fallback shaped like a ServiceDetail (used before the DB is seeded). */
function fromStatic(slug: string): ServiceDetail | undefined {
  const fb = getServiceBySlug(slug);
  if (!fb) return undefined;
  return { id: null, ...fb };
}

/** All service detail pages, ordered. DB-backed with static fallback. */
export async function getAllServiceDetails(): Promise<ServiceDetail[]> {
  try {
    const rows = await prisma.servicePage.findMany({ orderBy: { order: "asc" } });
    if (rows.length > 0) return rows.map(mergeWithFallback);
  } catch {
    // fall through to static
  }
  return serviceDetails.map((s) => ({ id: null, ...s }));
}

/** Single service detail by slug. DB-backed with static fallback. */
export async function getServiceDetail(slug: string): Promise<ServiceDetail | undefined> {
  try {
    const row = await prisma.servicePage.findUnique({ where: { slug } });
    if (row) return mergeWithFallback(row);
  } catch {
    // fall through to static
  }
  return fromStatic(slug);
}
