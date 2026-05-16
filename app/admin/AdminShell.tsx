"use client";

import { AdminSidebar } from "@/components/layout/AdminSidebar";

const ENV_LABEL =
  process.env.NODE_ENV === "production"
    ? null
    : process.env.NODE_ENV === "test"
    ? "test"
    : "dev";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--ubasti-paper)" }}>
      {/* Sidebar — hidden on mobile, shown from lg */}
      <div className="hidden lg:flex h-full">
        <AdminSidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="h-14 shrink-0 flex items-center justify-between px-6"
          style={{
            background: "var(--ubasti-white)",
            borderBottom: "1px solid var(--ubasti-blush-light)",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-base tracking-widest uppercase lg:hidden"
              style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-olive-dark)" }}
            >
              Ubasti
            </span>
            {ENV_LABEL && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold uppercase"
                style={{ background: "var(--ubasti-mustard)", color: "var(--ubasti-ink)" }}
              >
                {ENV_LABEL}
              </span>
            )}
          </div>
          <span
            className="text-xs opacity-50"
            style={{ color: "var(--ubasti-ink)", fontFamily: "var(--font-jetbrains)" }}
          >
            Admin Panel
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
