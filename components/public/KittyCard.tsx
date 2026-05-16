import Image from "next/image";

interface Props {
  name: string;
  imageUrl?: string | null;
  age?: string | null;
  sex?: string | null;
}

export function KittyCard({ name, imageUrl, age, sex }: Props) {
  const detail = [age, sex].filter(Boolean).join(" · ");
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "var(--ubasti-cream)", boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}>
      <div className="relative aspect-[3/4]">
        <Image
          src={imageUrl ?? "/images/placeholders/kitty-placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
          {name}
        </h3>
        {detail && <p className="text-xs" style={{ color: "var(--ubasti-sage)" }}>{detail}</p>}
      </div>
    </div>
  );
}
