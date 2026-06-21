import { requireUser } from "@/lib/auth-helpers";
import { ensureSiteSettings } from "@/lib/settings";
import { getValueItems } from "@/lib/values";
import { getWhyReasons } from "@/lib/why";
import { AdminPageHeader } from "@/components/admin/ui";
import { PagesForm } from "@/components/admin/settings-forms";
import { ValuesManager } from "@/components/admin/values-manager";
import { WhyManager } from "@/components/admin/why-manager";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  await requireUser();
  const s = await ensureSiteSettings();
  const values = await getValueItems();
  const whyReasons = await getWhyReasons();

  return (
    <>
      <AdminPageHeader
        title="Sayfalar"
        description="Ana sayfadaki Hero, Hakkımızda ve değerler bölümlerinin içeriğini düzenleyin."
      />
      <div className="space-y-6">
        <PagesForm
          defaults={{
            heroHeadline: s.heroHeadline,
            heroSubheadline: s.heroSubheadline,
            aboutTitle: s.aboutTitle,
            aboutContent: s.aboutContent,
          }}
        />
        <ValuesManager
          items={values.map((v) => ({
            id: v.id,
            title: v.title,
            description: v.description,
            icon: v.icon,
          }))}
        />
        <WhyManager
          items={whyReasons.map((w) => ({
            id: w.id,
            title: w.title,
            description: w.description,
            icon: w.icon,
          }))}
        />
      </div>
    </>
  );
}
