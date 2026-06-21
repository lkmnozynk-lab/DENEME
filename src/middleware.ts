import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Protect the admin area at the edge using the database-free config.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
