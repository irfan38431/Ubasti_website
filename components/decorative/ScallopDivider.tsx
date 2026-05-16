type Props = {
  top: string;
  bottom: string;
  flip?: boolean;
  height?: number;
};

export function ScallopDivider({ top, bottom, flip = false, height = 80 }: Props) {
  return (
    <div
      style={{ background: top, lineHeight: 0, fontSize: 0 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: `${height}px`,
          display: "block",
          transform: flip ? "scaleX(-1)" : "none",
        }}
        focusable="false"
      >
        <path
          d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,0 1440,40 V80 H0 Z"
          fill={bottom}
        />
      </svg>
    </div>
  );
}
