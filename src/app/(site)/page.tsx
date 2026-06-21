import { Hero } from "@/components/home/hero";
import { ServicesSection } from "@/components/home/services-section";
import { AboutSection } from "@/components/home/about-section";
import { WorksSection } from "@/components/home/works-section";
import { WhySection } from "@/components/home/why-section";
import { BlogSection } from "@/components/home/blog-section";
import { CtaSection } from "@/components/home/cta-section";
import { ContactSection } from "@/components/home/contact-section";
import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site-config";

export default async function HomePage() {
  const settings = await getSiteSettings();

  // JSON-LD structured data for the organization.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.brandName,
    url: siteConfig.url,
    slogan: settings.slogan,
    description: siteConfig.description,
    sameAs: [
      settings.instagramUrl,
      settings.facebookUrl,
      settings.xUrl,
      settings.linkedinUrl,
      settings.youtubeUrl,
    ].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero
        headline={settings.heroHeadline}
        subheadline={settings.heroSubheadline}
      />
      <ServicesSection />
      <AboutSection />
      <WorksSection />
      <WhySection />
      <BlogSection />
      <CtaSection />
      <ContactSection
        social={{
          instagramUrl: settings.instagramUrl,
          facebookUrl: settings.facebookUrl,
          xUrl: settings.xUrl,
          linkedinUrl: settings.linkedinUrl,
          youtubeUrl: settings.youtubeUrl,
        }}
      />
    </>
  );
}
