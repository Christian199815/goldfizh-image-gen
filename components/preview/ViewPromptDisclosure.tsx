import { ChevronDown } from "lucide-react";

type ViewPromptDisclosureProps = {
  prompt: string;
};

export function ViewPromptDisclosure({ prompt }: ViewPromptDisclosureProps) {
  return (
    <details className="group mt-3 rounded-lg border border-gf-panel-border bg-gf-input">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-gf-heading marker:hidden [&::-webkit-details-marker]:hidden">
        <span>View prompt</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-gf-text transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap border-t border-gf-panel-border px-3 py-2 text-xs leading-relaxed text-gf-text">
        {prompt}
      </pre>
    </details>
  );
}
