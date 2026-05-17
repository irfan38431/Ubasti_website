type Props = {
  topColor: string;
  bottomColor: string;
  height?: number;
  variant?: "single" | "double";
  flip?: boolean;
};

/**
 * A flowing, organic wave divider that creates smooth section transitions.
 * - `single`: one gentle wave crest
 * - `double`: two layered waves for a richer, parallax-like feel
 */
export function WavyDivider({
  topColor,
  bottomColor,
  height = 100,
  variant = "double",
  flip = false,
}: Props) {
  return (
    <div
      style={{ background: topColor, lineHeight: 0, fontSize: 0 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: `${height}px`,
          display: "block",
          transform: flip ? "scaleY(-1)" : "none",
        }}
        focusable="false"
      >
        {variant === "double" && (
          <path
            d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 V120 H0 Z"
            fill={bottomColor}
            opacity={0.4}
          />
        )}
        <path
          d="M0,80 C180,40 360,110 540,70 C720,30 900,100 1080,60 C1260,20 1380,80 1440,70 V120 H0 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}
