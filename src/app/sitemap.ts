import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig, services } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/hakkimizda",
    "/hizmetler",
    "/calismalarimiz",
    "/blog",
    "/iletisim",
    "/teklif-al",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/hizmetler/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Dynamic content — fall back gracefully if the DB is unavailable.
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const [posts, works] = await Promise.all([
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.work.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);
    dynamicRoutes = [
      ...posts.map((p) => ({
        url: `${base}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...works.map((w) => ({
        url: `${base}/calismalarimiz/${w.slug}`,
        lastModified: w.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    // DB not ready — static + service routes are still emitted.
  }

  return [...staticRoutes, ...serviceRoutes, ...dynamicRoutes];
}
