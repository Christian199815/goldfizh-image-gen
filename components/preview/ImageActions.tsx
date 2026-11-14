import { Download, RefreshCw } from "lucide-react";

type ImageActionsProps = {
  onDownload?: () => void;
  onRegenerate?: () => void;
  disableDownload?: boolean;
  disableRegenerate?: boolean;
};

export function ImageActions({
  onDownload,
  onRegenerate,
  disableDownload = false,
  disableRegenerate = false,
}: ImageActionsProps) {
  const showDownload = Boolean(onDownload);
  const showRegenerate = Boolean(onRegenerate);

  if (!showDownload && !showRegenerate) {
    return null;
  }

  const actionClassName =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-gf-panel-border bg-gf-input px-3 py-2 text-sm font-medium text-gf-heading transition-colors hover:bg-gf-option focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {showDownload ? (
        <button
          type="button"
          onClick={onDownload}
          disabled={disableDownload}
          className={actionClassName}
        >
          <Download className="h-4 w-4" aria-hidden />
          Download
        </button>
      ) : null}
      {showRegenerate ? (
        <button
          type="button"
          onClick={onRegenerate}
          disabled={disableRegenerate}
          className={actionClassName}
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Regenerate
        </button>
      ) : null}
    </div>
  );
}
