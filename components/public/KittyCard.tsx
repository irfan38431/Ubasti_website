import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";

interface Props {
  slug: string;
  name: string;
  imageUrl?: string | null;
  age?: string | null;
  personality?: string | null;
  status: string;
}

const statusColor = (s: string) =>
  s === "available" ? "green" : s === "on-hold" ? "yellow" : "gray";

export function KittyCard({ slug, name, imageUrl, age, personality, status }: Props) {
  return (
    <Link href={`/kitties#${slug}`} className="group block">
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "var(--ubasti-white)", boxShadow: "0 8px 24px rgba(44,46,31,0.08)" }}
      >
        <div className="relative aspect-[3/4]">
          <Image
            src={imageUrl ?? "/images/placeholders/kitty-placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3">
            <StatusBadge
              label={status === "on-hold" ? "On Hold" : status === "adopted" ? "Adopted" : "Available"}
              color={statusColor(status) as "green" | "yellow" | "gray"}
            />
          </div>
        </div>
        <div className="p-4 flex flex-col gap-1">
          <h3
            className="text-xl"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
          >
            {name}
          </h3>
          {age && <p className="text-xs" style={{ color: "var(--ubasti-sage)" }}>{age}</p>}
          {personality && (
            <p className="text-sm leading-snug" style={{ color: "var(--ubasti-sage)" }}>
              {personality}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
