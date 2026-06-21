"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { updateServiceContent, type ActionState } from "@/app/actions/services";
import { Card, Field, SaveButton, FormStatus } from "@/components/admin/ui";

type Feature = { title: string; text: string };
type Step = { step: string; title: string; text: string };
type Faq = { q: string; a: string };

export type ServiceContent = {
  id: string;
  key: string;
  title: string;
  shortDescription: string;
  tagline: string;
  intro: string;
  features: Feature[];
  process: Step[];
  faqs: Faq[];
};

const initial: ActionState = { ok: false, message: "" };

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20";

function RowShell({
  index,
  onRemove,
  children,
}: {
  index: number;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-xl border border-border bg-background p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">#{index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          title="Bu satırı sil"
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-border px-3 text-sm text-muted transition-colors hover:border-primary/40 hover:text-primary"
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

export function ServiceContentManager({ service }: { service: ServiceContent }) {
  const [state, action] = useActionState(updateServiceContent, initial);

  const [features, setFeatures] = useState<Feature[]>(service.features);
  const [process, setProcess] = useState<Step[]>(service.process);
  const [faqs, setFaqs] = useState<Faq[]>(service.faqs);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={service.id} />
      {/* Lists are submitted as JSON via hidden inputs kept in sync with state. */}
      <input type="hidden" name="features" value={JSON.stringify(features)} />
      <input type="hidden" name="process" value={JSON.stringify(process)} />
      <input type="hidden" name="faqs" value={JSON.stringify(faqs)} />

      <FormStatus state={state} />

      {/* Genel */}
      <Card className="space-y-5">
        <h2 className="font-semibold">Genel</h2>
        <Field label="Başlık" name="title" defaultValue={service.title} required />
        <Field
          label="Üst Başlık (tagline)"
          name="tagline"
          defaultValue={service.tagline}
          hint="Detay sayfasında başlığın üstünde görünen kısa ifade."
        />
        <Field
          label="Kısa Açıklama"
          name="shortDescription"
          textarea
          rows={3}
          defaultValue={service.shortDescription}
          hint="Hizmet listesinde ve detay sayfası başlığında görünür."
          required
        />
        <Field
          label="Giriş Paragrafı"
          name="intro"
          textarea
          rows={4}
          defaultValue={service.intro}
          hint="Detay sayfasının üst kısmındaki tanıtım metni."
        />
      </Card>

      {/* Features — Bu hizmet kapsamında */}
      <Card className="space-y-4">
        <div>
          <h2 className="font-semibold">Bu hizmet kapsamında</h2>
          <p className="mt-1 text-sm text-muted">“Neler Yapıyoruz” bölümündeki maddeler.</p>
        </div>
        <div className="space-y-3">
          {features.map((f, i) => (
            <RowShell
              key={i}
              index={i}
              onRemove={() => setFeatures(features.filter((_, j) => j !== i))}
            >
              <input
                className={`${inputCls} font-medium`}
                placeholder="Başlık"
                value={f.title}
                onChange={(e) =>
                  setFeatures(features.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
                }
              />
              <textarea
                className={`${inputCls} resize-y`}
                rows={2}
                placeholder="Açıklama"
                value={f.text}
                onChange={(e) =>
                  setFeatures(features.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))
                }
              />
            </RowShell>
          ))}
        </div>
        <AddButton label="Madde ekle" onClick={() => setFeatures([...features, { title: "", text: "" }])} />
      </Card>

      {/* Process — Süreç */}
      <Card className="space-y-4">
        <div>
          <h2 className="font-semibold">Süreç</h2>
          <p className="mt-1 text-sm text-muted">
            “Nasıl çalışıyoruz?” adımları. Numaralar otomatik atanır.
          </p>
        </div>
        <div className="space-y-3">
          {process.map((p, i) => (
            <RowShell
              key={i}
              index={i}
              onRemove={() => setProcess(process.filter((_, j) => j !== i))}
            >
              <input
                className={`${inputCls} font-medium`}
                placeholder="Adım başlığı"
                value={p.title}
                onChange={(e) =>
                  setProcess(process.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
                }
              />
              <textarea
                className={`${inputCls} resize-y`}
                rows={2}
                placeholder="Adım açıklaması"
                value={p.text}
                onChange={(e) =>
                  setProcess(process.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))
                }
              />
            </RowShell>
          ))}
        </div>
        <AddButton
          label="Adım ekle"
          onClick={() => setProcess([...process, { step: "", title: "", text: "" }])}
        />
      </Card>

      {/* FAQs — Sıkça sorulan sorular */}
      <Card className="space-y-4">
        <div>
          <h2 className="font-semibold">Sıkça Sorulan Sorular</h2>
          <p className="mt-1 text-sm text-muted">Detay sayfasındaki SSS bölümü.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <RowShell key={i} index={i} onRemove={() => setFaqs(faqs.filter((_, j) => j !== i))}>
              <input
                className={`${inputCls} font-medium`}
                placeholder="Soru"
                value={f.q}
                onChange={(e) =>
                  setFaqs(faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))
                }
              />
              <textarea
                className={`${inputCls} resize-y`}
                rows={2}
                placeholder="Cevap"
                value={f.a}
                onChange={(e) =>
                  setFaqs(faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))
                }
              />
            </RowShell>
          ))}
        </div>
        <AddButton label="Soru ekle" onClick={() => setFaqs([...faqs, { q: "", a: "" }])} />
      </Card>

      <div className="sticky bottom-4 z-10">
        <SaveButton className="w-full sm:w-auto">Tüm İçeriği Kaydet</SaveButton>
      </div>
    </form>
  );
}
