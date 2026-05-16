import { Suspense } from "react";
import { AccountView } from "./AccountView";

export const metadata = { title: "My Account — Ubasti" };

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
