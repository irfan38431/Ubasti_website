import Image from "next/image";

export function FeaturePhoto() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-0 overflow-hidden">
      <div className="relative w-full aspect-[21/9] md:aspect-[21/8]">
        <Image
          src="/images/placeholders/offering-cats.svg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
