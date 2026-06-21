"use client";

import { useActionState, useRef, useEffect } from "react";
import { changePassword, type AccountState } from "@/app/actions/account";
import { Card, Field, SaveButton, FormStatus } from "@/components/admin/ui";

const initial: AccountState = { ok: false, message: "" };

export function PasswordForm() {
  const [state, action] = useActionState(changePassword, initial);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the fields after a successful change.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <Card className="max-w-lg">
      <h2 className="font-semibold">Şifre Değiştir</h2>
      <p className="mt-1 mb-5 text-sm text-muted">
        Güvenliğiniz için güçlü ve size özel bir şifre kullanın.
      </p>
      <form ref={formRef} action={action} className="space-y-4">
        <FormStatus state={state} />
        <Field
          label="Mevcut Şifre"
          name="currentPassword"
          type="password"
          required
        />
        <Field
          label="Yeni Şifre"
          name="newPassword"
          type="password"
          required
          hint="En az 6 karakter."
        />
        <Field
          label="Yeni Şifre (Tekrar)"
          name="confirmPassword"
          type="password"
          required
        />
        <SaveButton>Şifreyi Güncelle</SaveButton>
      </form>
    </Card>
  );
}
