"use client";

import { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calendar, BookOpen, FileText,
  Users, Image, ClipboardList, LogOut, ChevronRight,
  PartyPopper, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/auth";
import { useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/events",       label: "Events",       icon: PartyPopper },
  { href: "/admin/blog",         label: "Blog",         icon: BookOpen },
  { href: "/admin/pages",        label: "Pages",        icon: FileText },
  { href: "/admin/inquiries",    label: "Inquiries",    icon: ClipboardList },
  { href: "/admin/media",        label: "Media",        icon: Image },
  { href: "/admin/team",         label: "Team",         icon: Users },
  { href: "/admin/audit",        label: "Audit Log",    icon: Settings },
];

export function AdminSidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, refetch } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    refetch();
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-full transition-all duration-200",
        collapsed ? "w-16" : "w-56"
      )}
      style={{ background: "var(--ubasti-paper)", borderRight: "1px solid var(--ubasti-blush-light)" }}
    >
      {/* Logo + collapse */}
      <div className="flex items-center justify-between h-14 px-3 shrink-0">
        <Link href="/admin" className="relative block shrink-0 rounded-full overflow-hidden" style={{ width: 36, height: 36 }}>
          <NextImage
            src="/images/placeholders/Ubasti Symbol_Pink.jpg"
            alt="Ubasti Admin"
            fill
            className="object-cover"
          />
        </Link>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="p-1.5 rounded-lg hover:bg-[var(--ubasti-cream)] ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight
            size={16}
            className="transition-transform duration-200"
            style={{
              color: "var(--ubasti-sage)",
              transform: collapsed ? "none" : "rotate(180deg)",
            }}
          />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-2" aria-label="Admin navigation">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const exact  = href === "/admin";
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-[var(--ubasti-olive-dark)] text-[var(--ubasti-cream)]"
                  : "text-[var(--ubasti-sage)] hover:bg-[var(--ubasti-cream)] hover:text-[var(--ubasti-ink)]"
              )}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="shrink-0 p-3 border-t" style={{ borderColor: "var(--ubasti-blush-light)" }}>
        {!collapsed && user && (
          <p className="text-xs mb-2 truncate opacity-60" style={{ color: "var(--ubasti-ink)" }}>
            {user.displayName ?? user.phoneE164}
          </p>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--ubasti-cream)]"
          style={{ color: "var(--ubasti-danger)" }}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
