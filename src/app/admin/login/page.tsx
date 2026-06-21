"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Lock } from "lucide-react";
import { authenticate, type LoginState } from "@/app/actions/auth";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const initial: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
    </Button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(authenticate, initial);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="h-12 w-12 text-primary" />
          <h1 className="mt-4 font-display text-2xl font-semibold">
            NERAAJANS Yönetim
          </h1>
          <p className="mt-1 text-sm text-muted">
            Devam etmek için giriş yapın
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-8"
        >
          {state.error && (
            <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Kullanıcı adı veya e-posta
            </span>
            <input
              name="email"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Şifre</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <SubmitButton />
        </form>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
          <Lock className="h-3.5 w-3.5" />
          Bu alan yalnızca yetkili kullanıcılar içindir.
        </p>
      </div>
    </div>
  );
}
