type Props = {
  color?: string;
  width?: number;
};

export function WavyUnderline({ color = "var(--ubasti-blush)", width = 180 }: Props) {
  return (
    <svg
      viewBox="0 0 180 18"
      width={width}
      height={18}
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      <path
        d="M0,9 C20,2 40,16 60,9 C80,2 100,16 120,9 C140,2 160,16 180,9"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
