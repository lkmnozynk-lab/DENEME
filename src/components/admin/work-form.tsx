"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { WorkFormState } from "@/app/actions/works";
import { Card, Field, SaveButton, FormStatus } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/image-field";
import { services as serviceList } from "@/lib/site-config";

type WorkAction = (prev: WorkFormState, fd: FormData) => Promise<WorkFormState>;

export type WorkValues = {
  id?: string;
  title?: string;
  description?: string;
  coverImage?: string | null;
  client?: string | null;
  year?: number | null;
  services?: string[];
  featured?: boolean;
  published?: boolean;
  order?: number;
};

const initial: WorkFormState = { ok: false, message: "" };

export function WorkForm({
  action,
  values = {},
}: {
  action: WorkAction;
  values?: WorkValues;
}) {
  const [state, formAction] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-6">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      <FormStatus state={state} />

      <Card className="space-y-5">
        <Field label="Başlık" name="title" defaultValue={values.title} required />
        <Field
          label="Açıklama"
          name="description"
          textarea
          rows={5}
          defaultValue={values.description}
          required
        />
        <ImageField name="coverImage" label="Kapak Görseli" defaultValue={values.coverImage} />
      </Card>

      <Card className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Müşteri" name="client" defaultValue={values.client ?? ""} />
          <Field label="Yıl" name="year" type="number" defaultValue={values.year ?? ""} />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium">Verilen Hizmetler</span>
          <div className="flex flex-wrap gap-2">
            {serviceList.map((s) => (
              <label
                key={s.key}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-sm has-checked:border-primary has-checked:bg-primary-soft has-checked:text-primary"
              >
                <input
                  type="checkbox"
                  name="services"
                  value={s.key}
                  defaultChecked={values.services?.includes(s.key)}
                  className="accent-primary"
                />
                {s.title}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Sıra" name="order" type="number" defaultValue={values.order ?? 0} />
          <label className="flex items-center gap-2 pt-7 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={values.featured}
              className="h-4 w-4 accent-primary"
            />
            Öne çıkar
          </label>
          <label className="flex items-center gap-2 pt-7 text-sm">
            <input
              type="checkbox"
              name="published"
              defaultChecked={values.published ?? true}
              className="h-4 w-4 accent-primary"
            />
            Yayında
          </label>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <SaveButton />
        <Link
          href="/admin/works"
          className="text-sm font-medium text-muted hover:text-foreground"
        >
          İptal
        </Link>
      </div>
    </form>
  );
}
