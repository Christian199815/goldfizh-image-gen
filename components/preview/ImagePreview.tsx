import type { GeneratedImage, GenerationStatus } from "@/types/generation";

import { EmptyImageState } from "./EmptyImageState";
import { GeneratedImage as GeneratedImageView } from "./GeneratedImage";
import { GeneratingState } from "./GeneratingState";
import { GenerationError } from "./GenerationError";
import { GenerationStatus as GenerationStatusLabel } from "./GenerationStatus";
import { ImageActions } from "./ImageActions";
import { RegeneratingOverlay } from "./RegeneratingOverlay";
import { ViewPromptDisclosure } from "./ViewPromptDisclosure";

const previewCanvasBaseClassName =
  "mt-6 flex min-h-[280px] w-full flex-1 items-center justify-center overflow-hidden rounded-lg border p-4 sm:min-h-[360px] lg:min-h-0";

export type ImagePreviewProps = {
  status: GenerationStatus;
  image?: GeneratedImage | null;
  error?: string | null;
  onRegenerate?: () => void;
  onDownload?: () => void;
};

export function ImagePreview({
  status,
  image = null,
  error = null,
  onRegenerate,
  onDownload,
}: ImagePreviewProps) {
  const isGenerating = status === "generating";
  const showImageCanvas =
    Boolean(image) &&
    (status === "completed" || status === "generating" || status === "failed");
  const showActions =
    Boolean(image) &&
    (status === "completed" || status === "generating" || status === "failed");
  const canDownload = Boolean(image?.base64 || image?.displayUrl);
  const showFailedBanner = status === "failed" && Boolean(image) && Boolean(error);

  const canvasStyleClassName = showImageCanvas
    ? "border-solid border-gf-panel-border bg-gf-panel"
    : "border-dashed border-gf-preview-border bg-gf-preview";

  function renderCanvasContent() {
    switch (status) {
      case "idle":
        return <EmptyImageState />;
      case "generating":
        if (image) {
          return (
            <div className="relative flex h-full w-full items-center justify-center">
              <GeneratedImageView image={image} />
              <RegeneratingOverlay />
            </div>
          );
        }
        return <GeneratingState />;
      case "completed":
        if (image) {
          return <GeneratedImageView image={image} />;
        }
        return (
          <p className="px-4 text-center text-sm text-gf-text">
            No image was returned. Try generating again.
          </p>
        );
      case "failed":
        if (image) {
          return (
            <div className="relative flex h-full w-full items-center justify-center opacity-90">
              <GeneratedImageView image={image} />
            </div>
          );
        }
        return (
          <GenerationError
            message={error ?? "Something went wrong. Please try again."}
            onRegenerate={onRegenerate}
          />
        );
      default: {
        const _exhaustive: never = status;
        return _exhaustive;
      }
    }
  }

  return (
    <section
      aria-labelledby="preview-heading"
      className="flex min-h-0 min-w-0 flex-1 flex-col rounded-xl border border-gf-panel-border bg-gf-panel p-6"
    >
      <h2 id="preview-heading" className="text-base font-semibold text-gf-heading">
        Preview
      </h2>
      <GenerationStatusLabel status={status} />

      <figure
        className={`${previewCanvasBaseClassName} ${canvasStyleClassName}`}
      >
        {renderCanvasContent()}
      </figure>

      {showFailedBanner ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      {showActions ? (
        <>
          <ImageActions
            onDownload={onDownload}
            onRegenerate={onRegenerate}
            disableDownload={!onDownload || !canDownload}
            disableRegenerate={isGenerating || !onRegenerate}
          />
          {image?.prompt ? (
            <ViewPromptDisclosure prompt={image.prompt} />
          ) : null}
        </>
      ) : null}
    </section>
  );
}
