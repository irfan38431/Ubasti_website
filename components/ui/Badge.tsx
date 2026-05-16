import { cn } from "@/lib/utils";

type Variant = "forever-friend" | "coffee-cause" | "purrfect-partners" | "sip-cuddle-relax";

interface Props {
  variant: Variant;
  size?: number;   // diameter in px
  rotate?: number; // degrees
  className?: string;
}

const configs: Record<Variant, { bg: string; fg: string; lines: string[] }> = {
  "forever-friend":      { bg: "#5C6A3A", fg: "#F2E0CD", lines: ["Forever", "Friend"] },
  "coffee-cause":        { bg: "#C9A961", fg: "#2B2E1F", lines: ["Coffee", "Cause"] },
  "purrfect-partners":   { bg: "#E8B8AE", fg: "#2B2E1F", lines: ["Purrfect", "Partners"] },
  "sip-cuddle-relax":    { bg: "#B5BC91", fg: "#2B2E1F", lines: ["Sip · Cuddle", "Relax"] },
};

export function Badge({ variant, size = 96, rotate = 0, className }: Props) {
  const { bg, fg, lines } = configs[variant];
  const r = size / 2;
  // Scalloped edge via a 12-point star polygon
  const points = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 24;
    const rad   = i % 2 === 0 ? r : r * 0.85;
    return `${r + rad * Math.cos(angle)},${r + rad * Math.sin(angle)}`;
  }).join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn(className)}
      style={{ transform: `rotate(${rotate}deg)`, flexShrink: 0 }}
      aria-hidden="true"
    >
      <polygon points={points} fill={bg} />
      {lines.map((line, i) => (
        <text
          key={i}
          x={r}
          y={r + (i - (lines.length - 1) / 2) * (size * 0.16) + size * 0.04}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={fg}
          fontSize={size * 0.13}
          fontFamily="var(--font-inter), system-ui, sans-serif"
          fontWeight="700"
          letterSpacing="0.05em"
          style={{ textTransform: "uppercase" }}
        >
          {line}
        </text>
      ))}
    </svg>
  );
}

// Small text/status badge (admin tables, status pills)
interface StatusBadgeProps {
  label: string;
  color?: "green" | "yellow" | "red" | "blue" | "gray";
  className?: string;
}

const statusColors: Record<NonNullable<StatusBadgeProps["color"]>, string> = {
  green:  "bg-[var(--ubasti-success)]/15 text-[var(--ubasti-success)]",
  yellow: "bg-[var(--ubasti-warning)]/15 text-[var(--ubasti-warning)]",
  red:    "bg-[var(--ubasti-danger)]/15  text-[var(--ubasti-danger)]",
  blue:   "bg-[var(--ubasti-info)]/15    text-[var(--ubasti-info)]",
  gray:   "bg-[var(--ubasti-sage-light)]/30 text-[var(--ubasti-ink)]",
};

export function StatusBadge({ label, color = "gray", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide",
        statusColors[color],
        className
      )}
    >
      {label}
    </span>
  );
}
