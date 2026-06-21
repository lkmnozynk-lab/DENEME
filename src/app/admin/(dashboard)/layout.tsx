import { requireUser } from "@/lib/auth-helpers";
import { readFlash } from "@/lib/flash";
import { Sidebar } from "@/components/admin/sidebar";
import { AdminThemeRoot } from "@/components/admin/admin-theme";
import { AdminToastProvider } from "@/components/admin/toast";
import { FlashToast } from "@/components/admin/flash-toast";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const flash = await readFlash();

  return (
    <AdminThemeRoot>
      <AdminToastProvider>
        <FlashToast value={flash} />
        <Sidebar userName={user.name ?? user.email} />
        <div className="flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            {children}
          </div>
        </div>
      </AdminToastProvider>
    </AdminThemeRoot>
  );
}
