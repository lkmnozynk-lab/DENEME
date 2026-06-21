"use client";

import { useActionState } from "react";
import { Plus, Save } from "lucide-react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryState,
} from "@/app/actions/categories";
import { Card, FormStatus } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";

type Cat = { id: string; name: string; postCount: number };
const initial: CategoryState = { ok: false, message: "" };

export function CategoryManager({ categories }: { categories: Cat[] }) {
  const [state, addAction] = useActionState(createCategory, initial);

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="font-semibold">Yeni Kategori</h2>
        <FormStatus state={state} />
        <form action={addAction} className="flex flex-col gap-3 sm:flex-row">
          <input
            name="name"
            placeholder="Kategori adı"
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:brightness-105"
          >
            <Plus className="h-4 w-4" />
            Ekle
          </button>
        </form>
      </Card>

      <Card className="p-0">
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-muted">Henüz kategori yok.</p>
        ) : (
          <ul className="divide-y divide-border">
            {categories.map((c) => (
              <li
                key={c.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <form
                  action={updateCategory}
                  className="flex flex-1 items-center gap-2"
                >
                  <input type="hidden" name="id" value={c.id} />
                  <input
                    name="name"
                    defaultValue={c.name}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="submit"
                    title="Kaydet"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                </form>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">{c.postCount} yazı</span>
                  <DeleteButton
                    action={deleteCategory}
                    id={c.id}
                    iconOnly
                    confirmText="Kategoriyi silmek istediğinize emin misiniz? Yazılar kategorisiz kalacak."
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
