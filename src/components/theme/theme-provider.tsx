"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Wraps next-themes. Default light mode, class-based dark mode, and the
 * preference is persisted to localStorage automatically (key: "theme").
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="neraajans-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
