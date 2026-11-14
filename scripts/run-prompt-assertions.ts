import { assertBrandAwarePromptsForDemoClients } from "@/lib/generation/prompt-composition/brand-aware-prompt.example";
import { assertPromptBuilderExample } from "@/lib/generation/prompt-builder.example";

assertPromptBuilderExample();
assertBrandAwarePromptsForDemoClients();

console.log("Prompt composition assertions passed.");
