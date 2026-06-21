"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminTheme } from "./admin-theme";

/** Light/dark toggle for the admin panel only (independent of the site theme). */
export function AdminThemeToggle({ className }: { className?: string }) {
  const { theme, toggle, mounted } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Açık moda geç" : "Koyu moda geç"}
      title={isDark ? "Açık mod" : "Koyu mod"}
      onClick={toggle}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-2",
        className,
      )}
    >
      {mounted ? (
        isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />
      ) : (
        <span className="h-4.5 w-4.5" />
      )}
    </button>
  );
}
