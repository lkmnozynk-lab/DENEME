"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Wrench,
  BookMarked,
  Newspaper,
  Inbox,
  Settings,
  UserCog,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", label: "Sayfalar", Icon: FileText },
  { href: "/admin/services", label: "Hizmetler", Icon: Wrench },
  { href: "/admin/works", label: "Çalışmalarımız", Icon: BookMarked },
  { href: "/admin/blog", label: "Blog", Icon: Newspaper },
  { href: "/admin/submissions", label: "Teklifler", Icon: Inbox },
  { href: "/admin/settings", label: "Site Ayarları", Icon: Settings },
  { href: "/admin/account", label: "Hesap", Icon: UserCog },
];

export function Sidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Mobile topbar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <LogoMark className="h-7 w-7 text-foreground" />
          <span className="font-display font-semibold">Yönetim</span>
        </Link>
        <div className="flex items-center gap-2">
          <AdminThemeToggle className="h-9 w-9" />
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border"
            aria-label="Menü"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <aside
        className={cn(
          "border-border bg-surface lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-r",
          open ? "block border-b" : "hidden lg:block",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="hidden items-center justify-between gap-2 px-6 py-5 lg:flex">
            <Link href="/admin" className="flex items-center gap-2.5">
              <LogoMark className="h-8 w-8 text-foreground" />
              <span className="font-display text-lg font-semibold">
                NERA<span className="text-primary">AJANS</span>
              </span>
            </Link>
            <AdminThemeToggle className="h-9 w-9 shrink-0" />
          </div>

          <nav className="flex-1 space-y-1 px-3 py-3 lg:py-2">
            {nav.map(({ href, label, Icon, exact }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(href, exact)
                    ? "bg-primary-soft text-primary"
                    : "text-muted hover:bg-surface-2 hover:text-foreground",
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="space-y-1 border-t border-border px-3 py-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <ExternalLink className="h-4.5 w-4.5" />
              Siteyi Görüntüle
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger"
              >
                <LogOut className="h-4.5 w-4.5" />
                Çıkış Yap
              </button>
            </form>
            {userName && (
              <p className="px-3 pt-2 text-xs text-muted">
                Giriş: <span className="font-medium text-foreground">{userName}</span>
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
