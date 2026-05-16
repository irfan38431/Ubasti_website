import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function ArchImage({ src, alt, className = "", sizes }: Props) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        borderTopLeftRadius: "50% 38%",
        borderTopRightRadius: "50% 38%",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      />
    </div>
  );
}
