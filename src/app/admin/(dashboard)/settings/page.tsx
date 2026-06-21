import { requireUser } from "@/lib/auth-helpers";
import { ensureSiteSettings, ensureSEOSettings } from "@/lib/settings";
import { AdminPageHeader } from "@/components/admin/ui";
import { SiteSettingsForm, SEOForm } from "@/components/admin/settings-forms";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireUser();
  const [site, seo] = await Promise.all([ensureSiteSettings(), ensureSEOSettings()]);

  return (
    <>
      <AdminPageHeader
        title="Site Ayarları"
        description="Marka bilgileri, sosyal medya bağlantıları ve SEO ayarları."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <SiteSettingsForm
          defaults={{
            brandName: site.brandName,
            slogan: site.slogan,
            instagramUrl: site.instagramUrl ?? "",
            facebookUrl: site.facebookUrl ?? "",
            xUrl: site.xUrl ?? "",
            linkedinUrl: site.linkedinUrl ?? "",
            youtubeUrl: site.youtubeUrl ?? "",
          }}
        />
        <SEOForm
          defaults={{
            defaultTitle: seo.defaultTitle,
            titleTemplate: seo.titleTemplate,
            defaultDescription: seo.defaultDescription,
            keywords: seo.keywords ?? "",
          }}
        />
      </div>
    </>
  );
}
