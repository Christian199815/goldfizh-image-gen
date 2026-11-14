import { ImageIcon } from "lucide-react";

export function EmptyImageState() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gf-option text-gf-text"
        aria-hidden
      >
        <ImageIcon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <p className="max-w-xs text-sm text-gf-text">
        Choose your settings and generate an image to see a preview here.
      </p>
    </div>
  );
}
