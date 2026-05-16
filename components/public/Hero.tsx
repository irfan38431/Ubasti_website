import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/placeholders/hero-cat-portrait.svg"
          alt="A cat lounging in the Ubasti cafe"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--ubasti-overlay)" }}
        />
      </div>

      {/* Decorative badge */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12 hidden sm:block">
        <Badge variant="forever-friend" size={112} rotate={12} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto w-full px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
        <div className="max-w-2xl flex flex-col gap-6">
          <p
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--ubasti-mustard)" }}
          >
            Chennai&apos;s First Cat Lounge
          </p>
          <h1
            className="text-5xl md:text-7xl leading-[1.05]"
            style={{ fontFamily: "var(--font-cinzel)", color: "var(--ubasti-cream)", fontWeight: 700 }}
          >
            Where Coffee<br />Meets Cats
          </h1>
          <p
            className="text-xl leading-relaxed"
            style={{ fontFamily: "var(--font-caveat)", color: "var(--ubasti-cream)", fontSize: "1.35rem", opacity: 0.9 }}
          >
            a sanctuary for snuggle time, slow mornings & furriends forever
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/book"
              className="inline-flex h-14 items-center px-8 rounded-full font-medium text-base transition-opacity hover:opacity-90"
              style={{ background: "var(--ubasti-blush)", color: "var(--ubasti-ink)" }}
            >
              Book a Session
            </Link>
            <Link
              href="/kitties"
              className="inline-flex h-14 items-center px-8 rounded-full font-medium text-base transition-colors"
              style={{ background: "rgba(242,224,205,0.15)", color: "var(--ubasti-cream)", border: "1px solid rgba(242,224,205,0.4)" }}
            >
              Meet the Kitties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
