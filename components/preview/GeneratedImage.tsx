import type { GeneratedImage as GeneratedImageType } from "@/types/generation";

import { getGeneratedImageDisplaySrc } from "./getGeneratedImageDisplaySrc";

type GeneratedImageProps = {
  image: GeneratedImageType;
};

export function GeneratedImage({ image }: GeneratedImageProps) {
  const src = getGeneratedImageDisplaySrc(image);

  if (!src) {
    return (
      <p className="px-4 text-center text-sm text-gf-text">
        Image data is unavailable. Try generating again.
      </p>
    );
  }

  return (
    // Dynamic data/blob URLs from generation are not suited to next/image.
    // eslint-disable-next-line @next/next/no-img-element -- client-generated preview src
    <img
      src={src}
      alt="Generated marketing image"
      className="max-h-full max-w-full object-contain"
      decoding="async"
    />
  );
}
