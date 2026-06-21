"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { PostFormState } from "@/app/actions/blog";
import dynamic from "next/dynamic";
import { Card, Field, SaveButton, FormStatus } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/image-field";

// Tiptap is a heavy client bundle; load it lazily so the blog form page becomes
// interactive faster (the editor streams in with a lightweight placeholder).
const RichEditor = dynamic(
  () => import("@/components/admin/rich-editor").then((m) => m.RichEditor),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2">
        <span className="mb-1.5 block text-sm font-medium">İçerik</span>
        <div className="h-64 animate-pulse rounded-xl border border-border bg-surface-2/50" />
      </div>
    ),
  },
);

type PostAction = (prev: PostFormState, fd: FormData) => Promise<PostFormState>;

export type PostValues = {
  id?: string;
  title?: string;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  categoryId?: string | null;
  published?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

const initial: PostFormState = { ok: false, message: "" };

export function BlogForm({
  action,
  values = {},
  categories,
}: {
  action: PostAction;
  values?: PostValues;
  categories: { id: string; name: string }[];
}) {
  const [state, formAction] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-6">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      <FormStatus state={state} />

      <Card className="space-y-5">
        <Field label="Başlık" name="title" defaultValue={values.title} required />
        <Field
          label="Özet"
          name="excerpt"
          textarea
          rows={2}
          defaultValue={values.excerpt ?? ""}
          hint="Boş bırakılırsa içerikten otomatik oluşturulur."
        />
        <RichEditor name="content" label="İçerik" defaultValue={values.content ?? ""} />
      </Card>

      <Card className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Kategori">
            <select
              name="categoryId"
              defaultValue={values.categoryId ?? ""}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Kategorisiz</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 pt-7 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={values.published}
              className="h-4 w-4 accent-primary"
            />
            Yayında
          </label>
        </div>
        <ImageField name="coverImage" label="Kapak Görseli" defaultValue={values.coverImage} />
      </Card>

      <Card className="space-y-5">
        <h2 className="font-semibold">SEO (opsiyonel)</h2>
        <Field label="SEO Başlığı" name="seoTitle" defaultValue={values.seoTitle ?? ""} />
        <Field
          label="SEO Açıklaması"
          name="seoDescription"
          textarea
          rows={2}
          defaultValue={values.seoDescription ?? ""}
        />
      </Card>

      <div className="flex items-center gap-3">
        <SaveButton />
        <Link href="/admin/blog" className="text-sm font-medium text-muted hover:text-foreground">
          İptal
        </Link>
      </div>
    </form>
  );
}
