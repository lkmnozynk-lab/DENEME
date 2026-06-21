import { cookies } from "next/headers";

/**
 * Flash messages: a one-shot success/error notice that survives a redirect or a
 * server-action revalidation (when useActionState's returned state would be lost
 * because the action redirects or is a plain `void` action).
 *
 * A server action writes the flash via setFlash(); the admin layout reads it and
 * a client component (FlashToast) shows it as a toast, then clears the cookie so
 * it never fires twice. The cookie is not httpOnly so the client can clear it.
 */
const FLASH_COOKIE = "admin_flash";

export type FlashType = "success" | "error";

export async function setFlash(type: FlashType, message: string) {
  const store = await cookies();
  // `n` (nonce) makes each flash value unique so repeated identical messages
  // (e.g. saving the same item twice) are still treated as new and re-fire the
  // toast — the client dedupes on the whole value, which now always changes.
  const n = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  store.set(FLASH_COOKIE, JSON.stringify({ type, message, n }), {
    path: "/admin",
    maxAge: 30,
    sameSite: "lax",
  });
}

/** Raw cookie value (JSON string) or null. Cleared on the client by FlashToast. */
export async function readFlash(): Promise<string | null> {
  const store = await cookies();
  return store.get(FLASH_COOKIE)?.value ?? null;
}
