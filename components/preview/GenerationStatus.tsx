import type { GenerationStatus as GenerationStatusValue } from "@/types/generation";

const STATUS_LABELS: Record<GenerationStatusValue, string> = {
  idle: "Nothing generated",
  generating: "Generating…",
  completed: "Image ready",
  failed: "Generation failed",
};

type GenerationStatusProps = {
  status: GenerationStatusValue;
};

export function GenerationStatus({ status }: GenerationStatusProps) {
  const label = STATUS_LABELS[status];

  return (
    <p
      role="status"
      aria-live={status === "generating" ? "polite" : undefined}
      className="mt-1 text-sm text-gf-text"
    >
      {label}
    </p>
  );
}
