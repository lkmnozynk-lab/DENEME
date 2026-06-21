"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle, Send, Mail } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { SectionHeading } from "@/components/ui/section-heading";
import { SocialLinks, type SocialLinks as SocialLinksType } from "@/components/layout/social-links";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: ContactState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Gönderiliyor…" : "Mesajı Gönder"}
      <Send className="h-4 w-4" />
    </Button>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  defaultValue,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  defaultValue?: string;
  textarea?: boolean;
}) {
  const cls = cn(
    "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20",
    error ? "border-danger" : "border-border",
  );
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={5}
          defaultValue={defaultValue}
          className={cn(cls, "resize-y")}
          aria-invalid={!!error}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          className={cls}
          aria-invalid={!!error}
        />
      )}
      {error && (
        <span className="mt-1 flex items-center gap-1 text-xs text-danger">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </span>
      )}
    </label>
  );
}

export function ContactSection({ social }: { social: SocialLinksType }) {
  const [state, formAction] = useActionState(submitContact, initialState);

  return (
    <section id="iletisim" className="bg-surface py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="İletişim"
            title="Projenizden bahsedin"
            description="Eseriniz, türü ve beklentileriniz hakkında birkaç satır yazmanız yeterli. Size en kısa sürede dönüş yapalım."
          />
          <div className="mt-8 rounded-2xl border border-border bg-background p-6 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold">Daha kapsamlı bir teklif mi?</h3>
                <p className="mt-1 text-sm text-muted">
                  Dosya yükleme ve hizmet seçimi için{" "}
                  <a href="/teklif-al" className="font-medium text-primary underline-offset-4 hover:underline">
                    Teklif Al
                  </a>{" "}
                  formunu kullanabilirsiniz.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <p className="mb-3 text-sm font-medium text-muted">Bizi takip edin</p>
            <SocialLinks links={social} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 shadow-soft sm:p-8">
          {state.ok ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="h-14 w-14 text-success" />
              <h3 className="mt-4 text-xl font-semibold">Teşekkürler!</h3>
              <p className="mt-2 max-w-sm text-sm text-muted">{state.message}</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-5" noValidate>
              {state.message && !state.ok && (
                <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {state.message}
                </div>
              )}
              <Field
                label="Ad Soyad"
                name="name"
                error={state.errors?.name}
                defaultValue={state.values?.name}
              />
              <Field
                label="E-posta"
                name="email"
                type="email"
                error={state.errors?.email}
                defaultValue={state.values?.email}
              />
              <Field
                label="Mesajınız"
                name="message"
                textarea
                error={state.errors?.message}
                defaultValue={state.values?.message}
              />
              {/* Honeypot: hidden from users, visible to bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />
              <SubmitButton />
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
