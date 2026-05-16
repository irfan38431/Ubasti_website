import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Ideology() {
  return (
    <section
      className="py-16 md:py-20"
      style={{ background: "var(--ubasti-paper)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="max-w-[65ch] mx-auto text-center flex flex-col gap-5">
            <p
              className="text-lg md:text-xl leading-relaxed"
              style={{ color: "var(--ubasti-sage)", fontFamily: "var(--font-cormorant)", fontSize: "1.25rem" }}
            >
              Ubasti is a cat cafe and adoption lounge in Chennai. We believe every cat
              deserves a forever home, and every person deserves a few minutes of purring.
              Come for the coffee. Stay for the cats. Leave with a friend.
            </p>
            <p
              className="text-lg md:text-xl leading-relaxed"
              style={{ color: "var(--ubasti-sage)", fontFamily: "var(--font-cormorant)", fontSize: "1.25rem" }}
            >
              Whether you&apos;re looking for a quiet escape from the city or want to unwind
              in the company of playful felines, Ubasti is a space made for cat lovers of
              every kind. Come for the coffee, stay for the cats, leave with a smile (and
              maybe a kitty)!
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
