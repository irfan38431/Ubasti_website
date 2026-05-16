import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Badge } from "@/components/ui/Badge";

const OFFERINGS = [
  {
    image: "/images/placeholders/offering-coffee.svg",
    badge: "coffee-cause" as const,
    title: "Craft Coffee",
    body: "Specialty brews, teas, and light bites — savoured in the quiet company of cats.",
  },
  {
    image: "/images/placeholders/offering-cats.svg",
    badge: "forever-friend" as const,
    title: "Resident Cats",
    body: "Eight resident felines looking for cuddles, playtime, and — if the stars align — forever homes.",
  },
  {
    image: "/images/placeholders/offering-community.svg",
    badge: "purrfect-partners" as const,
    title: "Community",
    body: "Events, yoga mornings, adoption drives, and private bookings. A space that brings people together.",
  },
];

export function OfferingsTriptych() {
  return (
    <section
      className="py-24 md:py-32"
      style={{ background: "var(--ubasti-cream)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <p className="text-sm font-bold uppercase tracking-widest text-center mb-12"
            style={{ color: "var(--ubasti-mustard)" }}>
            What We Offer
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OFFERINGS.map((o, i) => (
            <ScrollReveal key={o.title} delay={i * 0.1}>
              <div className="rounded-2xl overflow-hidden flex flex-col"
                style={{ background: "var(--ubasti-white)", boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
                <div className="relative h-56">
                  <Image src={o.image} alt={o.title} fill className="object-cover" />
                  <div className="absolute top-4 right-4">
                    <Badge variant={o.badge} size={72} rotate={-8} />
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <h3
                    className="text-2xl"
                    style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
                  >
                    {o.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>
                    {o.body}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
