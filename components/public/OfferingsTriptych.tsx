import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { OFFERINGS as O, DECORATIVE } from "@/lib/replacements";

const OFFERINGS = [
  { image: O.coffee,    label: "coffee",  alt: "Craft coffee at Ubasti" },
  { image: O.cats,      label: "cats",    alt: "Resident cats at Ubasti" },
  { image: O.community, label: "cuddles", alt: "Cuddles and community at Ubasti" },
];

export function OfferingsTriptych() {
  return (
    <section
      className="py-20 md:py-28 overflow-hidden"
      style={{ background: "var(--ubasti-paper)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16 relative">
        {/* Leaves decorations */}
        <div
          className="absolute -top-4 left-0 w-20 h-20 md:w-28 md:h-28 opacity-55 hidden sm:block"
          style={{ transform: "rotate(-20deg)" }}
          aria-hidden="true"
        >
          <Image src={DECORATIVE.leaves} alt="" fill className="object-contain" />
        </div>
        <div
          className="absolute top-1/3 right-0 w-16 h-16 md:w-24 md:h-24 opacity-50 hidden sm:block"
          style={{ transform: "rotate(10deg)" }}
          aria-hidden="true"
        >
          <Image src={DECORATIVE.leaves} alt="" fill className="object-contain" />
        </div>
        <div
          className="absolute -bottom-4 left-1/3 w-14 h-14 md:w-20 md:h-20 opacity-45 hidden md:block"
          style={{ transform: "rotate(30deg) scaleX(-1)" }}
          aria-hidden="true"
        >
          <Image src={DECORATIVE.leaves} alt="" fill className="object-contain" />
        </div>

        <ScrollReveal>
          <h2
            className="text-3xl md:text-4xl text-center mb-12"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
          >
            Our Offerings
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {OFFERINGS.map((o, i) => (
            <ScrollReveal key={o.label} delay={i * 0.1}>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/5]">
                  <Image src={o.image} alt={o.alt} fill className="object-cover" />
                </div>
                <p
                  className="text-2xl md:text-3xl lowercase"
                  style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 400 }}
                >
                  {o.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
