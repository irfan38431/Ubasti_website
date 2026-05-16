import Link from "next/link";
import { Mail } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span
              className="text-2xl tracking-widest uppercase"
              style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-cream)" }}
            >
              Ubasti
            </span>
            <p
              className="text-sm leading-relaxed opacity-80"
              style={{ fontFamily: "var(--font-caveat)", fontSize: "1.1rem" }}
            >
              Sip. Cuddle. Relax.
            </p>
            <p className="text-sm opacity-60">
              Cat Cafe & Adoption Lounge — Chennai, Tamil Nadu
            </p>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Explore</p>
            {[
              { href: "/about",           label: "About Us" },
              { href: "/kitties",         label: "Meet the Kitties" },
              { href: "/events",          label: "Calendar of Events" },
              { href: "/private-parties", label: "Private Parties" },
              { href: "/blog",            label: "Blog" },
              { href: "/waiver",          label: "Waiver" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm opacity-75 hover:opacity-100 transition-opacity"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Visit */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Visit Us</p>
            <address className="not-italic text-sm opacity-75 leading-relaxed">
              Ubasti Cat Cafe & Lounge<br />
              Chennai, Tamil Nadu, India
            </address>
            <div className="text-sm opacity-75 flex flex-col gap-1">
              <p>Mon–Sun: 10am – 8pm</p>
              <p className="text-xs opacity-60">(Hours subject to change)</p>
            </div>
          </div>

          {/* Stay in touch */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Stay in Touch</p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/ubasti.cafe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                style={{ background: "rgba(242,224,205,0.15)" }}
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="mailto:hello@ubasti.cafe"
                aria-label="Email"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                style={{ background: "rgba(242,224,205,0.15)" }}
              >
                <Mail size={18} />
              </a>
            </div>
            <Link
              href="/book"
              className="inline-flex h-10 items-center justify-center px-5 rounded-full text-sm font-medium transition-opacity hover:opacity-90 mt-2"
              style={{ background: "var(--ubasti-blush)", color: "var(--ubasti-ink)" }}
            >
              Book a Session
            </Link>
          </div>
        </div>

        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-50"
          style={{ borderTop: "1px solid rgba(242,224,205,0.2)" }}
        >
          <p>© {new Date().getFullYear()} Ubasti Cat Cafe & Lounge. Made with whiskers in Chennai.</p>
          <Link href="/waiver" className="hover:opacity-100 transition-opacity">Waiver</Link>
        </div>
      </div>
    </footer>
  );
}
