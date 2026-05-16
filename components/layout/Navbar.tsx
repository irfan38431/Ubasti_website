"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",                label: "Home" },
  { href: "/about",           label: "About" },
  { href: "/kitties",         label: "Kitties" },
  { href: "/events",          label: "Events" },
  { href: "/private-parties", label: "Private Parties" },
  { href: "/blog",            label: "Blog" },
];

interface Props {
  onMenuOpen: () => void;
}

export function Navbar({ onMenuOpen }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, isAdmin, refetch } = useAuth();
  const [scrolled,     setScrolled]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    refetch();
    setUserMenuOpen(false);
    router.push("/");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-[72px] flex items-center transition-all duration-200",
        scrolled ? "backdrop-blur-md" : ""
      )}
      style={{
        background: scrolled
          ? "rgba(250,246,240,0.9)"
          : "var(--ubasti-paper)",
        borderBottom: scrolled ? "1px solid var(--ubasti-blush-light)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1280px] mx-auto w-full px-6 md:px-12 lg:px-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span
            className="text-xl tracking-widest uppercase"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-olive-dark)" }}
          >
            Ubasti
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-3 py-1.5 text-sm transition-colors rounded-md",
                  active
                    ? "text-[var(--ubasti-ink)]"
                    : "text-[var(--ubasti-sage)] hover:text-[var(--ubasti-ink)]"
                )}
              >
                {label}
                {active && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: "var(--ubasti-mustard)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!user ? (
            <Link
              href="/book"
              className="hidden md:inline-flex h-9 items-center px-5 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--ubasti-blush)", color: "var(--ubasti-ink)" }}
            >
              Book Now
            </Link>
          ) : (
            <div className="relative hidden md:block">
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

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={onMenuOpen}
            aria-label="Open menu"
          >
            <Menu size={22} style={{ color: "var(--ubasti-ink)" }} />
          </button>
        </div>
      </div>
    </header>
  );
}
