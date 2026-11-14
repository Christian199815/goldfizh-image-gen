"use client";

import type { ColorMode } from "@/types/generation";

import { FormField, OptionButton, optionGroupClassName } from "./FormField";

const COLOR_MODE_OPTIONS: { value: ColorMode; label: string }[] = [
  { value: "vibrant", label: "Vibrant" },
  { value: "monochrome", label: "Black & white" },
  { value: "other", label: "Other" },
];

type ColorModeSelectorProps = {
  value: ColorMode;
  onChange: (colorMode: ColorMode) => void;
  disabled?: boolean;
};

const GROUP_ID = "generator-color-mode";

export function ColorModeSelector({
  value,
  onChange,
  disabled,
}: ColorModeSelectorProps) {
  return (
    <FormField id={GROUP_ID} label="Color">
      <div role="radiogroup" className={optionGroupClassName}>
        {COLOR_MODE_OPTIONS.map((option) => (
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
