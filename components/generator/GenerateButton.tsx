"use client";

import { Loader2 } from "lucide-react";

type GenerateButtonProps = {
  disabled?: boolean;
  isGenerating?: boolean;
};

export function GenerateButton({
  disabled,
  isGenerating,
}: GenerateButtonProps) {
  const isDisabled = Boolean(disabled || isGenerating);

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="mt-2 flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-gf-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gf-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Generating…
        </>
      ) : (
        "Generate image"
      )}
    </button>
  );
}
