import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ContactSection } from "@/components/home/contact-section";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Editörlük, dizgi ve kapak tasarımı projeleriniz için bizimle iletişime geçin. Formu doldurun, en kısa sürede dönüş yapalım.",
  alternates: { canonical: "/iletisim" },
};

export default async function IletisimPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        eyebrow="İletişim"
        title="Bizimle iletişime geçin"
        description="Projeniz, sorularınız veya iş birliği talepleriniz için formu doldurmanız yeterli."
        breadcrumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "İletişim" }]}
      />
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
