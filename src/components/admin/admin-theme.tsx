"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Admin-only theme, fully independent of the public site theme.
 *
 * The public site uses next-themes which toggles a class on <html>. The admin
 * panel instead scopes its theme to a wrapper element (#admin-root) via a
 * `data-admin="light|dark"` attribute, persisted under its own storage key. The
 * color tokens are CSS variables redefined under `[data-admin="light|dark"]`
 * (see globals.css), so the wrapper overrides whatever the site set on <html>
 * for the admin subtree only — the two themes never affect each other.
 *
 * An attribute (not a class) is used deliberately: Tailwind/Lightning CSS strips
 * unknown bare class selectors like `.light` during compilation, but leaves
 * attribute selectors intact.
 */
type Theme = "light" | "dark";
const STORAGE_KEY = "neraajans-admin-theme";
const ROOT_ID = "admin-root";

type Ctx = { theme: Theme; toggle: () => void; mounted: boolean };
const ThemeCtx = createContext<Ctx>({ theme: "light", toggle: () => {}, mounted: false });

export function useAdminTheme() {
  return useContext(ThemeCtx);
}

// Runs before hydration (first child of #admin-root) to avoid a theme flash.
const initScript = `(function(){try{
  var t = localStorage.getItem('${STORAGE_KEY}');
  var dark = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  var el = document.getElementById('${ROOT_ID}');
  if (el) el.setAttribute('data-admin', dark ? 'dark' : 'light');
}catch(e){}})();`;

export function AdminThemeRoot({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = document.getElementById(ROOT_ID);
    if (el) el.setAttribute("data-admin", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    [],
  );

  return (
    <ThemeCtx.Provider value={{ theme, toggle, mounted }}>
      <div id={ROOT_ID} className="min-h-screen bg-background lg:flex" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
        {children}
      </div>
    </ThemeCtx.Provider>
  );
}
