import Image from "next/image";

type Props = {
  src: string;
  size?: number;
  rotate?: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  opacity?: number;
  className?: string;
};

export function DecorativeImage({
  src,
  size = 120,
  rotate = 0,
  top,
  bottom,
  left,
  right,
  opacity = 0.7,
  className = "",
}: Props) {
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none ${className}`}
      style={{
        width: size,
        height: size,
        top,
        bottom,
        left,
        right,
        transform: `rotate(${rotate}deg)`,
        opacity,
        zIndex: 0,
      }}
    >
      <Image src={src} alt="" fill className="object-contain" />
    </div>
  );
}
