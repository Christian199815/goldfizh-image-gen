"use client";

import type { ImageStyle } from "@/types/generation";

import { FormField, OptionButton, optionGroupClassName } from "./FormField";

const STYLE_OPTIONS: { value: ImageStyle; label: string }[] = [
  { value: "simple", label: "Simple" },
  { value: "abstract", label: "Abstract" },
  { value: "other", label: "Other" },
];

type StyleSelectorProps = {
  value: ImageStyle;
  onChange: (style: ImageStyle) => void;
  disabled?: boolean;
};

const GROUP_ID = "generator-style";

export function StyleSelector({ value, onChange, disabled }: StyleSelectorProps) {
  return (
    <FormField id={GROUP_ID} label="Style">
      <div role="radiogroup" className={optionGroupClassName}>
        {STYLE_OPTIONS.map((option) => (
          <OptionButton
            key={option.value}
            pressed={value === option.value}
            disabled={disabled}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </OptionButton>
        ))}
      </div>
    </FormField>
  );
}
