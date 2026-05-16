import { Suspense } from "react";
import { AccountView } from "./AccountView";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Your Account",
  description: "Manage your Ubasti bookings, waiver status, and account details.",
  path: "/account",
  noindex: true,
});

export default function AccountPage() {
  return (
    <div className="min-h-screen py-16 px-4" style={{ background: "var(--ubasti-paper)" }}>
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={null}>
          <AccountView />
        </Suspense>
      </div>
    </div>
  );
}
