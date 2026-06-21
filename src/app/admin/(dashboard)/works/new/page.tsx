import { requireUser } from "@/lib/auth-helpers";
import { createWork } from "@/app/actions/works";
import { AdminPageHeader } from "@/components/admin/ui";
import { WorkForm } from "@/components/admin/work-form";

export default async function NewWorkPage() {
  await requireUser();
  return (
    <>
      <AdminPageHeader title="Yeni Çalışma" description="Yeni bir portföy çalışması ekleyin." />
      <WorkForm action={createWork} />
    </>
  );
}
