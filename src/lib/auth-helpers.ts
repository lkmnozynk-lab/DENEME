import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Returns the authenticated admin user or redirects to the login page.
 * Use at the top of every admin page and mutating server action.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session.user;
}
