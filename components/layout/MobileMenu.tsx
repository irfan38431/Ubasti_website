"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/contexts/auth";

const NAV_LINKS = [
  { href: "/",                label: "Home" },
  { href: "/about",           label: "About" },
  { href: "/kitties",         label: "Kitties" },
  { href: "/events",          label: "Events" },
  { href: "/private-parties", label: "Private Parties" },
  { href: "/blog",            label: "Blog" },
  { href: "/book",            label: "Book a Session" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, isAdmin, refetch } = useAuth();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus trap + ESC
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    refetch();
    onClose();
    router.push("/");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "var(--ubasti-olive-dark)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between px-6 h-[72px]">
            <Link href="/" onClick={onClose} className="relative block rounded-full overflow-hidden" style={{ width: 48, height: 48 }}>
              <Image
                src="/images/placeholders/Ubasti Symbol_Pink.jpg"
                alt="Ubasti — Home"
                fill
                className="object-cover"
              />
            </Link>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 rounded-lg"
            >
              <X size={24} style={{ color: "var(--ubasti-cream)" }} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-8 gap-2" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="text-3xl py-3 border-b border-[rgba(242,224,205,0.15)] transition-opacity hover:opacity-80"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    color: active ? "var(--ubasti-mustard)" : "var(--ubasti-cream)",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </Link>
              );
            })}

            {user ? (
              <>
                <Link href="/account" onClick={onClose}
                  className="text-3xl py-3 border-b border-[rgba(242,224,205,0.15)]"
                  style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}>
                  My Account
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={onClose}
                    className="text-3xl py-3 border-b border-[rgba(242,224,205,0.15)]"
                    style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}>
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-left text-xl py-3 mt-2 opacity-70 hover:opacity-100"
                  style={{ fontFamily: "var(--font-inter)", color: "var(--ubasti-blush)" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" onClick={onClose}
                className="text-xl py-3 mt-2 opacity-70 hover:opacity-100"
                style={{ fontFamily: "var(--font-inter)", color: "var(--ubasti-blush)" }}>
                Log in
              </Link>
            )}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
