"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Send, UploadCloud } from "lucide-react";
import { submitQuote, type QuoteState } from "@/app/actions/quote";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const initialState: QuoteState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Gönderiliyor…" : "Teklif Talebi Gönder"}
      <Send className="h-4 w-4" />
    </Button>
  );
}

function inputCls(error?: string) {
  return cn(
    "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20",
    error ? "border-danger" : "border-border",
  );
}

function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <span className="mt-1 flex items-center gap-1 text-xs text-danger">
      <AlertCircle className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export function QuoteForm() {
  const [state, formAction] = useActionState(submitQuote, initialState);
  const [fileName, setFileName] = useState<string | null>(null);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-16 text-center shadow-soft">
        <CheckCircle2 className="h-16 w-16 text-success" />
        <h2 className="mt-5 text-2xl font-semibold">Talebiniz Alındı</h2>
        <p className="mt-3 max-w-md text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8"
      noValidate
    >
      {state.message && !state.ok && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Ad Soyad *</span>
          <input
            name="name"
            className={inputCls(state.errors?.name)}
            defaultValue={state.values?.name}
          />
          <ErrorText>{state.errors?.name}</ErrorText>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">E-posta *</span>
          <input
            name="email"
            type="email"
            className={inputCls(state.errors?.email)}
            defaultValue={state.values?.email}
          />
          <ErrorText>{state.errors?.email}</ErrorText>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Telefon</span>
          <input
            name="phone"
            type="tel"
            className={inputCls(state.errors?.phone)}
            defaultValue={state.values?.phone}
          />
          <ErrorText>{state.errors?.phone}</ErrorText>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Hizmet Türü</span>
          <select
            name="serviceType"
            defaultValue={state.values?.serviceType ?? ""}
            className={inputCls(state.errors?.serviceType)}
          >
            <option value="">Seçiniz…</option>
            {services.map((s) => (
              <option key={s.key} value={s.key}>
                {s.title}
              </option>
            ))}
          </select>
          <ErrorText>{state.errors?.serviceType}</ErrorText>
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Mesajınız *</span>
        <textarea
          name="message"
          rows={6}
          className={cn(inputCls(state.errors?.message), "resize-y")}
          defaultValue={state.values?.message}
          placeholder="Eseriniz, türü, sayfa sayısı ve beklentileriniz hakkında kısaca bilgi verin."
        />
        <ErrorText>{state.errors?.message}</ErrorText>
      </label>

      <div>
        <span className="mb-1.5 block text-sm font-medium">
          Dosya Yükleme{" "}
          <span className="font-normal text-muted">(PDF, DOCX, ZIP · maks. 10 MB)</span>
        </span>
        <label
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-xl border border-dashed bg-background px-4 py-4 text-sm transition-colors hover:border-primary/50",
            state.errors?.file ? "border-danger" : "border-border",
          )}
        >
          <UploadCloud className="h-5 w-5 text-primary" />
          <span className="text-muted">
            {fileName ?? "Dosya seçmek için tıklayın"}
          </span>
          <input
            type="file"
            name="file"
            accept=".pdf,.doc,.docx,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        <ErrorText>{state.errors?.file}</ErrorText>
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <SubmitButton />
      <p className="text-center text-xs text-muted">
        Gönderdiğiniz bilgiler yalnızca teklif sürecinde kullanılır.
      </p>
    </form>
  );
}
