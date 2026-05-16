import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionTitle({ eyebrow, title, subtitle, align = "center", className }: Props) {
  return (
    <div className={cn("flex flex-col gap-3", align === "center" && "items-center text-center", className)}>
      {eyebrow && (
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "var(--ubasti-mustard)", fontFamily: "var(--font-inter)" }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="text-4xl md:text-5xl leading-tight"
        style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-lg leading-relaxed max-w-xl"
          style={{ color: "var(--ubasti-sage)", fontFamily: "var(--font-caveat)", fontSize: "1.25rem" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
