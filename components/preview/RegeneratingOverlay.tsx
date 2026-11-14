import { Loader2 } from "lucide-react";

export function RegeneratingOverlay() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-gf-panel/80 px-4 text-center backdrop-blur-[2px]"
      aria-busy="true"
      aria-live="polite"
    >
      <Loader2
        className="h-9 w-9 animate-spin text-gf-brand"
        aria-hidden
      />
      <p className="text-sm font-medium text-gf-heading">Regenerating…</p>
    </div>
  );
}
