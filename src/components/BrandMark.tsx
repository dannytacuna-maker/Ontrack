import Image from "next/image";

type Props = {
  className?: string;
  priority?: boolean;
  height?: number;
  /** onDark = white wordmark for dark UI; onLight = dark wordmark for white bands */
  tone?: "onDark" | "onLight";
};

/** Official OnTrack wordmark only (orange mark + name — no partner lockup). */
export function BrandMark({
  className = "",
  priority = false,
  height = 48,
  tone = "onDark",
}: Props) {
  const ratio = 1845 / 559;
  const src =
    tone === "onLight" ? "/logo-ontrack-on-light.png" : "/logo-ontrack.png";
  return (
    <Image
      src={src}
      alt="OnTrack"
      width={1845}
      height={559}
      priority={priority}
      quality={100}
      sizes={`${Math.round(height * ratio * 2)}px`}
      className={`h-auto w-auto object-contain ${className}`}
      style={{ height, width: "auto" }}
    />
  );
}
