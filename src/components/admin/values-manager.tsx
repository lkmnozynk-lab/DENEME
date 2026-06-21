"use client";

import { useActionState } from "react";
import { Plus, Save } from "lucide-react";
import {
  createValueItem,
  updateValueItem,
  deleteValueItem,
  type ValueState,
} from "@/app/actions/values";
import { Card, FormStatus, SaveButton } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Icon, iconOptions } from "@/components/ui/icon";

type Item = { id: string; title: string; description: string; icon: string };
const initial: ValueState = { ok: false, message: "" };

function IconSelect({ name, defaultValue }: { name: string; defaultValue?: string }) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? "badge"}
      className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    >
      {iconOptions.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function ValuesManager({ items }: { items: Item[] }) {
  const [state, addAction] = useActionState(createValueItem, initial);

  return (
    <Card className="space-y-5">
      <div>
        <h2 className="font-semibold">Değerlerimiz / İlkeler</h2>
        <p className="mt-1 text-sm text-muted">
          “Çalışma biçimimizi belirleyen ilkeler” bölümü (Hakkımızda ve ana sayfada
          görünür).
        </p>
      </div>

      {/* Existing items */}
      <div className="space-y-3">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-xl border border-border bg-background p-4"
          >
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon name={it.icon} className="h-5 w-5" />
              </span>
              {/* Edit form and delete are siblings — never nest <form> in <form>. */}
              <form action={updateValueItem} className="flex-1 space-y-2">
                <input type="hidden" name="id" value={it.id} />
                <div className="flex flex-wrap gap-2">
                  <input
                    name="title"
                    defaultValue={it.title}
                    className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <IconSelect name="icon" defaultValue={it.icon} />
                </div>
                <textarea
                  name="description"
                  defaultValue={it.description}
                  rows={2}
                  className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Save className="h-4 w-4" /> Kaydet
                </button>
              </form>
              <DeleteButton action={deleteValueItem} id={it.id} iconOnly />
            </div>
          </div>
        ))}
      </div>

      {/* Add new */}
      <form action={addAction} className="space-y-3 border-t border-border pt-5">
        <p className="text-sm font-medium">Yeni İlke Ekle</p>
        <FormStatus state={state} />
        <div className="flex flex-wrap gap-2">
          <input
            name="title"
            placeholder="Başlık"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <IconSelect name="icon" />
        </div>
        <textarea
          name="description"
          placeholder="Açıklama"
          rows={2}
          className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <SaveButton>
          <Plus className="h-4 w-4" /> Ekle
        </SaveButton>
      </form>
    </Card>
  );
}
