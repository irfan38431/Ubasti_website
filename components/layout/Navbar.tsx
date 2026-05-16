"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth";
import { useState } from "react";

export function Navbar() {
  const router = useRouter();
  const { user, isAdmin, refetch } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    refetch();
    setUserMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 h-[72px] flex items-center" style={{ background: "var(--ubasti-paper)" }}>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        style={{ background: "var(--ubasti-blush)", color: "var(--ubasti-ink)" }}
      >
        Skip to content
      </a>

      <div className="max-w-[1280px] mx-auto w-full px-6 md:px-12 lg:px-16 flex items-center justify-center relative">
        {/* Centered logo */}
        <Link href="/" aria-label="Ubasti — home">
          <span
            className="text-xl tracking-widest uppercase"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-olive-dark)" }}
          >
            Ubasti
          </span>
        </Link>

        {/* Auth user menu — positioned absolutely so logo stays centered */}
        {user && (
          <div className="absolute right-6 md:right-12 lg:right-16">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors hover:bg-[var(--ubasti-cream)]"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--ubasti-sage)", color: "var(--ubasti-cream)" }}
              >
                {(user.displayName ?? "?")[0].toUpperCase()}
              </span>
              <ChevronDown size={14} style={{ color: "var(--ubasti-sage)" }} />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 z-50"
                style={{ background: "var(--ubasti-white)", border: "1px solid var(--ubasti-blush-light)" }}
              >
                <Link href="/account" onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--ubasti-cream)]"
                  style={{ color: "var(--ubasti-ink)" }}>
                  <User size={14} /> My Account
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--ubasti-cream)]"
                    style={{ color: "var(--ubasti-ink)" }}>
                    <LayoutDashboard size={14} /> Admin
                  </Link>
                )}
                <hr style={{ borderColor: "var(--ubasti-blush-light)" }} className="my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-[var(--ubasti-cream)]"
                  style={{ color: "var(--ubasti-danger)" }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
