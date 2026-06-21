"use client";

import { useEffect, useRef } from "react";
import { useAdminToast } from "./toast";

/**
 * Reads a server-set flash cookie value (passed from the layout), shows it as a
 * toast once, then clears the cookie so it doesn't reappear on later renders.
 */
export function FlashToast({ value }: { value: string | null }) {
  const { show } = useAdminToast();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!value || handled.current === value) return;
    handled.current = value;
    try {
      const parsed = JSON.parse(value) as { type?: string; message?: string };
      if (parsed.message) {
        show({ type: parsed.type === "error" ? "error" : "success", message: parsed.message });
      }
    } catch {
      // ignore malformed flash
    }
    document.cookie = "admin_flash=; Max-Age=0; path=/admin";
  }, [value, show]);

  return null;
}
