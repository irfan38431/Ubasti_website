import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const TEASER_CATS = [
  { name: "Nefertiti", img: "/images/placeholders/kitty-nefertiti.svg", status: "available" },
  { name: "Anubis",    img: "/images/placeholders/kitty-anubis.svg",    status: "available" },
  { name: "Cleo",      img: "/images/placeholders/kitty-cleo.svg",      status: "on-hold" },
  { name: "Ramses",    img: "/images/placeholders/kitty-ramses.svg",    status: "available" },
];

export function KittyTeaser() {
  return (
    <section
      className="py-24 md:py-32"
      style={{ background: "var(--ubasti-paper)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--ubasti-mustard)" }}>
                Meet the Gang
              </p>
              <h2
                className="text-4xl md:text-5xl"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
              >
                Our Resident Felines
              </h2>
            </div>
            <Link
              href="/kitties"
              className="text-sm font-medium underline underline-offset-4 shrink-0"
              style={{ color: "var(--ubasti-olive-dark)" }}
            >
              Meet all {8} kitties →
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {TEASER_CATS.map((cat, i) => (
            <ScrollReveal key={cat.name} delay={i * 0.08}>
              <Link href="/kitties" className="group block">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {cat.status === "on-hold" && (
                    <div
                      className="absolute top-3 left-3 text-xs font-bold uppercase px-2.5 py-1 rounded-full"
                      style={{ background: "var(--ubasti-mustard)", color: "var(--ubasti-ink)" }}
                    >
                      On Hold
                    </div>
                  )}
                </div>
                <p
                  className="mt-3 text-lg font-medium"
                  style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)" }}
                >
                  {cat.name}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
