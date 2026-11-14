import { Loader2 } from "lucide-react";

export function GeneratingState() {
  return (
    <div
      className="flex flex-col items-center gap-3 px-4 text-center"
      aria-busy="true"
    >
      <Loader2
        className="h-10 w-10 animate-spin text-gf-brand"
        aria-hidden
      />
      <p className="text-sm font-medium text-gf-heading">
        Creating your image…
      </p>
      <p className="max-w-xs text-sm text-gf-text">
        This may take a moment. You can adjust settings after generation
        finishes.
      </p>
    </div>
  );
}
