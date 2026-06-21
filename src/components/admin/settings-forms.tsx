"use client";

import { useActionState } from "react";
import {
  updateSiteContent,
  updateSiteSettings,
  updateSEOSettings,
  updateService,
  type ActionState,
} from "@/app/actions/settings";
import { Card, Field, SaveButton, FormStatus } from "@/components/admin/ui";

const initial: ActionState = { ok: false, message: "" };

export function PagesForm({
  defaults,
}: {
  defaults: {
    heroHeadline: string;
    heroSubheadline: string;
    aboutTitle: string;
    aboutContent: string;
  };
}) {
  const [state, action] = useActionState(updateSiteContent, initial);
  return (
    <form action={action} className="space-y-5">
      <FormStatus state={state} />
      <Card className="space-y-5">
        <h2 className="font-semibold">Hero Bölümü</h2>
        <Field label="Başlık" name="heroHeadline" defaultValue={defaults.heroHeadline} required />
        <Field
          label="Alt Başlık"
          name="heroSubheadline"
          textarea
          rows={3}
          defaultValue={defaults.heroSubheadline}
          required
        />
      </Card>
      <Card className="space-y-5">
        <h2 className="font-semibold">Hakkımızda Bölümü</h2>
        <Field label="Başlık" name="aboutTitle" defaultValue={defaults.aboutTitle} required />
        <Field
          label="Metin"
          name="aboutContent"
          textarea
          rows={5}
          defaultValue={defaults.aboutContent}
          required
        />
      </Card>
      <SaveButton />
    </form>
  );
}

export function SiteSettingsForm({
  defaults,
}: {
  defaults: {
    brandName: string;
    slogan: string;
    instagramUrl: string;
    facebookUrl: string;
    xUrl: string;
    linkedinUrl: string;
    youtubeUrl: string;
  };
}) {
  const [state, action] = useActionState(updateSiteSettings, initial);
  return (
    <form action={action} className="space-y-5">
      <FormStatus state={state} />
      <Card className="space-y-5">
        <h2 className="font-semibold">Marka</h2>
        <Field label="Marka Adı" name="brandName" defaultValue={defaults.brandName} required />
        <Field label="Slogan" name="slogan" defaultValue={defaults.slogan} required />
      </Card>
      <Card className="space-y-5">
        <h2 className="font-semibold">Sosyal Medya Bağlantıları</h2>
        <p className="-mt-2 text-sm text-muted">Boş bırakılan platformlar sitede gösterilmez.</p>
        <Field label="Instagram" name="instagramUrl" type="url" defaultValue={defaults.instagramUrl} placeholder="https://instagram.com/..." />
        <Field label="Facebook" name="facebookUrl" type="url" defaultValue={defaults.facebookUrl} placeholder="https://facebook.com/..." />
        <Field label="X (Twitter)" name="xUrl" type="url" defaultValue={defaults.xUrl} placeholder="https://x.com/..." />
        <Field label="LinkedIn" name="linkedinUrl" type="url" defaultValue={defaults.linkedinUrl} placeholder="https://linkedin.com/..." />
        <Field label="YouTube" name="youtubeUrl" type="url" defaultValue={defaults.youtubeUrl} placeholder="https://youtube.com/..." />
      </Card>
      <SaveButton />
    </form>
  );
}

export function SEOForm({
  defaults,
}: {
  defaults: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    keywords: string;
  };
}) {
  const [state, action] = useActionState(updateSEOSettings, initial);
  return (
    <form action={action} className="space-y-5">
      <FormStatus state={state} />
      <Card className="space-y-5">
        <h2 className="font-semibold">SEO Ayarları</h2>
        <Field label="Varsayılan Başlık" name="defaultTitle" defaultValue={defaults.defaultTitle} required />
        <Field
          label="Başlık Şablonu"
          name="titleTemplate"
          defaultValue={defaults.titleTemplate}
          hint="%s yerine sayfa başlığı gelir. Örn: %s · NERAAJANS"
          required
        />
        <Field
          label="Varsayılan Açıklama"
          name="defaultDescription"
          textarea
          rows={3}
          defaultValue={defaults.defaultDescription}
          required
        />
        <Field label="Anahtar Kelimeler" name="keywords" defaultValue={defaults.keywords} hint="Virgülle ayırın." />
      </Card>
      <SaveButton />
    </form>
  );
}

export function ServiceForm({
  service,
}: {
  service: { id: string; title: string; shortDescription: string };
}) {
  const [state, action] = useActionState(updateService, initial);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={service.id} />
      <FormStatus state={state} />
      <Field label="Başlık" name="title" defaultValue={service.title} required />
      <Field
        label="Kısa Açıklama"
        name="shortDescription"
        textarea
        rows={4}
        defaultValue={service.shortDescription}
        required
      />
      <SaveButton>Hizmeti Kaydet</SaveButton>
    </form>
  );
}
