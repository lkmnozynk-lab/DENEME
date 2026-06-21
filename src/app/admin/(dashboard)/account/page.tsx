import { User as UserIcon } from "lucide-react";
import { requireUser } from "@/lib/auth-helpers";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { PasswordForm } from "@/components/admin/password-form";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <>
      <AdminPageHeader
        title="Hesap"
        description="Hesap bilgilerinizi görüntüleyin ve şifrenizi değiştirin."
      />

      <div className="space-y-6">
        <Card className="max-w-lg">
          <div className="flex items-center gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
              <UserIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">{user.name ?? "Yönetici"}</p>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
          </div>
        </Card>

        <PasswordForm />
      </div>
    </>
  );
}
