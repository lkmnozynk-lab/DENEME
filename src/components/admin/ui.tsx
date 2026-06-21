"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAdminToast } from "@/components/admin/toast";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-6 shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  error,
  hint,
  textarea,
  rows = 4,
  children,
}: {
  label: string;
  name?: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  textarea?: boolean;
  rows?: number;
  children?: ReactNode;
}) {
  const base =
    "w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20";
  const cls = cn(base, error ? "border-danger" : "border-border");
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      {children ? (
        children
      ) : textarea ? (
        <textarea
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={cn(cls, "resize-y")}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          className={cls}
        />
      )}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

export function SaveButton({
  children = "Kaydet",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:brightness-105 disabled:opacity-50",
        className,
      )}
    >
      {pending ? "Kaydediliyor…" : children}
    </button>
  );
}

/**
 * Surfaces a server-action result as a modern toast (success/error) instead of
 * an inline box. Renders nothing itself — drop it anywhere inside a form that
 * uses useActionState and pass the returned `state`; it fires a toast whenever a
 * new result with a message arrives.
 */
export function FormStatus({
  state,
}: {
  state?: { ok?: boolean; message?: string };
}) {
  const { show } = useAdminToast();
  const lastSeen = useRef<unknown>(null);

  useEffect(() => {
    if (state && state.message && state !== lastSeen.current) {
      lastSeen.current = state;
      show({ type: state.ok ? "success" : "error", message: state.message });
    }
  }, [state, show]);

  return null;
}
