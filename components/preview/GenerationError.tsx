import { AlertCircle } from "lucide-react";

type GenerationErrorProps = {
  message: string;
  onRegenerate?: () => void;
};

export function GenerationError({ message, onRegenerate }: GenerationErrorProps) {
  return (
    <div className="flex max-w-md flex-col items-center gap-4 px-4 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"
        aria-hidden
      >
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gf-heading">
          Could not generate image
        </p>
        <p className="text-sm text-gf-text">{message}</p>
      </div>
      {onRegenerate ? (
        <button
          type="button"
          onClick={onRegenerate}
          className="rounded-lg border border-gf-panel-border bg-gf-input px-4 py-2 text-sm font-medium text-gf-heading transition-colors hover:bg-gf-option focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand focus-visible:ring-offset-2"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
