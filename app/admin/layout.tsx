import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AdminShell } from "./AdminShell";

export const metadata = { robots: "noindex" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hdrs    = await headers();
  const userId  = hdrs.get("x-user-id");
  const isAdmin = hdrs.get("x-is-admin");

  if (!userId || isAdmin !== "true") {
    redirect("/login?next=/admin");
  }

  return <AdminShell>{children}</AdminShell>;
}
