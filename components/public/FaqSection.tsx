interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  title?: string;
  items: FaqItem[];
}

export function FaqSection({ title = "Frequently Asked Questions", items }: Props) {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-2xl mx-auto px-6">
        <h2
          className="text-2xl mb-6 text-center"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
        >
          {title}
        </h2>
        <div className="divide-y" style={{ borderColor: "var(--ubasti-blush)" }}>
          {items.map((item) => (
            <details key={item.q} className="group py-5">
              <summary
                className="flex items-center justify-between cursor-pointer text-base font-medium list-none"
                style={{ color: "var(--ubasti-ink)" }}
              >
                {item.q}
                <span
                  className="text-xl transition-transform group-open:rotate-45 shrink-0 ml-4"
                  style={{ color: "var(--ubasti-mustard)" }}
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
