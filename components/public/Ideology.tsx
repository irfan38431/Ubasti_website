import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Ideology() {
  return (
    <section
      className="py-24 md:py-32"
      style={{ background: "var(--ubasti-paper)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-8">
            <p
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--ubasti-mustard)" }}
            >
              Our Ideology
            </p>
            <h2
              className="text-4xl md:text-6xl leading-tight"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
            >
              Inspired by Bastet,<br />
              goddess of home, cats & calm.
            </h2>
            <p
              className="text-xl leading-relaxed"
              style={{ fontFamily: "var(--font-caveat)", color: "var(--ubasti-sage)", fontSize: "1.3rem" }}
            >
              &ldquo;the world could use more slow mornings, warm cups, and cats on laps&rdquo;
            </p>
            <p
              className="text-base leading-relaxed mx-auto max-w-xl"
              style={{ color: "var(--ubasti-sage)" }}
            >
              Ubasti is a cat cafe and adoption lounge in Chennai. We believe every cat
              deserves a forever home, and every person deserves a few minutes of purring.
              Come for the coffee. Stay for the cats. Leave with a friend.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
