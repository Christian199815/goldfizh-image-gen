import {
  defaultModelDefinition,
  type DevModelDefinition,
} from "@/lib/dev/model-catalog";

export type TokenUsageCounts = {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
};

export function estimateUsageCostUsd(
  usage: TokenUsageCounts,
  modelId: string,
  pricing?: Pick<
    DevModelDefinition,
  "inputPerMillionUsd" | "outputPerMillionUsd" | "fallbackPerImageUsd"
  >,
): number {
  const rates = pricing ?? defaultModelDefinition(modelId);

  const hasTokenCounts =
    usage.totalTokenCount > 0 ||
    usage.promptTokenCount > 0 ||
    usage.candidatesTokenCount > 0;

  if (!hasTokenCounts) {
    return rates.fallbackPerImageUsd;
  }

  const fromTokens =
    (usage.promptTokenCount * rates.inputPerMillionUsd) / 1_000_000 +
    (usage.candidatesTokenCount * rates.outputPerMillionUsd) / 1_000_000;

  if (fromTokens > 0) {
    return fromTokens;
  }

  return rates.fallbackPerImageUsd;
}

export function formatUsd(amount: number): string {
  if (amount < 0.01) {
    return `$${amount.toFixed(4)}`;
  }
  if (amount < 1) {
    return `$${amount.toFixed(3)}`;
  }
  return `$${amount.toFixed(2)}`;
}

export function formatTokenCount(count: number): string {
  return new Intl.NumberFormat("en-US").format(count);
}
