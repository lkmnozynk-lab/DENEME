import Link from "next/link";
import {
  BookMarked,
  Newspaper,
  Inbox,
  Wrench,
  ArrowRight,
  Clock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { formatDateTR } from "@/lib/utils";

async function getStats() {
  try {
    const [works, posts, newSubs, totalSubs, recent] = await Promise.all([
      prisma.work.count(),
      prisma.blogPost.count(),
      prisma.contactSubmission.count({ where: { status: "NEW" } }),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true, status: true },
      }),
    ]);
    return { works, posts, newSubs, totalSubs, recent, ok: true };
  } catch {
    return { works: 0, posts: 0, newSubs: 0, totalSubs: 0, recent: [], ok: false };
  }
}

export default async function AdminDashboard() {
  const user = await requireUser();
  const stats = await getStats();

  const cards = [
    { label: "Çalışmalar", value: stats.works, Icon: BookMarked, href: "/admin/works" },
    { label: "Blog Yazıları", value: stats.posts, Icon: Newspaper, href: "/admin/blog" },
    { label: "Yeni Teklifler", value: stats.newSubs, Icon: Inbox, href: "/admin/submissions" },
    { label: "Toplam Teklif", value: stats.totalSubs, Icon: Wrench, href: "/admin/submissions" },
  ];

  return (
    <>
      <AdminPageHeader
        title={`Hoş geldiniz, ${user.name ?? "Yönetici"}`}
        description="NERAAJANS içeriklerini buradan yönetebilirsiniz."
      />

      {!stats.ok && (
        <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          Veritabanına ulaşılamadı. `docker compose up -d` ve `npm run db:push`
          komutlarını çalıştırdığınızdan emin olun.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="transition-transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <c.Icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-muted" />
              </div>
              <p className="mt-4 font-display text-3xl font-semibold">{c.value}</p>
              <p className="mt-1 text-sm text-muted">{c.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Son Teklifler</h2>
            <Link
              href="/admin/submissions"
              className="text-sm font-medium text-primary hover:underline"
            >
              Tümü
            </Link>
          </div>
          {stats.recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              Henüz teklif talebi yok.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {stats.recent.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted">{s.email}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDateTR(s.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
