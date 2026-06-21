"use client";

import { Trash2 } from "lucide-react";

/**
 * Delete control backed by a server action. Wraps the action in a form and
 * asks for confirmation before submitting.
 */
export function DeleteButton({
  action,
  id,
  label = "Sil",
  confirmText = "Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
  iconOnly = false,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  confirmText?: string;
  iconOnly?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        title={label}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-sm text-muted transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 className="h-4 w-4" />
        {!iconOnly && label}
      </button>
    </form>
  );
}
