import type { GeneratedImage } from "@/types/generation";

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

function extensionFromMimeType(mimeType: string): string {
  const normalized = mimeType.toLowerCase().split(";")[0]?.trim() ?? "";
  return MIME_TO_EXTENSION[normalized] ?? "png";
}

function downloadFilename(mimeType: string): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `goldfizh-image-${y}-${m}-${d}.${extensionFromMimeType(mimeType)}`;
}

function triggerBrowserDownload(href: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/**
 * Downloads the generated image locally without sending bytes to a third party.
 */
export async function downloadGeneratedImage(
  image: GeneratedImage,
): Promise<void> {
  const filename = downloadFilename(image.mimeType);

  if (image.base64) {
    triggerBrowserDownload(
      `data:${image.mimeType};base64,${image.base64}`,
      filename,
    );
    return;
  }

  if (!image.displayUrl) {
    return;
  }

  const response = await fetch(image.displayUrl);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  try {
    triggerBrowserDownload(objectUrl, filename);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
