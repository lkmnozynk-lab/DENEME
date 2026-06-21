"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { rateLimit, getClientIp, hashIp } from "@/lib/rate-limit";

export type LoginState = { error?: string };

export async function authenticate(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  // Brute-force protection on the login endpoint.
  const ip = await getClientIp();
  const limited = await rateLimit(`login:${hashIp(ip)}`, { limit: 8, windowMs: 300_000 });
  if (!limited.ok) {
    return { error: "Çok fazla başarısız deneme. Lütfen biraz sonra tekrar deneyin." };
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-posta veya şifre hatalı." };
    }
    // Re-throw redirect (NEXT_REDIRECT) and other control-flow errors.
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
