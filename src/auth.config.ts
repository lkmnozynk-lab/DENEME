import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no database / bcrypt imports).
 * Used by middleware for route protection and shared with the full config.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isLogin = path === "/admin/login";
      const isAdminArea = path.startsWith("/admin");

      if (isLogin) {
        // Already authenticated users skip the login screen.
        if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }
      if (isAdminArea) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? "EDITOR";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // defined in auth.ts (Node runtime)
} satisfies NextAuthConfig;
