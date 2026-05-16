"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/",                label: "Home" },
  { href: "/about",           label: "About" },
  { href: "/kitties",         label: "Kitties" },
  { href: "/events",          label: "Events" },
  { href: "/private-parties", label: "Private Parties" },
  { href: "/blog",            label: "Blog" },
  { href: "/book",            label: "Book" },
  { href: "/waiver",          label: "Waiver" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, refetch } = useAuth();
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus inside drawer when open
  useEffect(() => {
    if (!open) return;
    const el = drawerRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    refetch();
    setOpen(false);
    router.push("/");
  }

  return (
    <>
      {/* Skip to content — first focusable element */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-20 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm"
        style={{ background: "var(--ubasti-blush)", color: "var(--ubasti-ink)" }}
      >
        Skip to content
      </a>

      {/* Floating cat-icon button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2"
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        style={{ background: "var(--ubasti-ink)" }}
      >
        <Image
          src="/images/decorative/cat-disco.svg"
          alt=""
          fill
          className="object-contain rounded-full"
          aria-hidden="true"
        />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="fixed top-0 left-0 h-full z-[60] flex flex-col transition-transform duration-300"
        style={{
          width: "min(320px, 85vw)",
          background: "var(--ubasti-ink)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-lg tracking-widest uppercase"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-cream)" }}
          >
            Ubasti
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            aria-label="Close navigation"
          >
            <X size={20} style={{ color: "var(--ubasti-cream)" }} />
          </button>
        </div>

        <hr style={{ borderColor: "rgba(242,224,205,0.15)" }} />

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-medium transition-colors hover:bg-white/10"
              style={{ color: "var(--ubasti-cream)", fontFamily: "var(--font-cormorant)", fontSize: "1.15rem" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        {user && (
          <>
            <hr style={{ borderColor: "rgba(242,224,205,0.15)" }} />
            <div className="px-4 py-4 flex flex-col gap-1">
              <Link href="/account" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/10"
                style={{ color: "var(--ubasti-cream)", fontSize: "0.9rem" }}>
                <User size={16} /> My Account
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/10"
                  style={{ color: "var(--ubasti-cream)", fontSize: "0.9rem" }}>
                  <LayoutDashboard size={16} /> Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors hover:bg-white/10"
                style={{ color: "var(--ubasti-danger)", fontSize: "0.9rem" }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
