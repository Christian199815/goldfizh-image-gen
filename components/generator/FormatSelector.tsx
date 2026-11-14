"use client";

import type { ImageFormat } from "@/types/generation";

import { FormField, OptionButton, optionGroupClassName } from "./FormField";

const FORMAT_OPTIONS: { value: ImageFormat; label: string }[] = [
  { value: "square", label: "1:1 square" },
  { value: "portrait", label: "4:5 standing" },
  { value: "landscape", label: "16:9 horizontal" },
];

type FormatSelectorProps = {
  value: ImageFormat;
  onChange: (format: ImageFormat) => void;
  disabled?: boolean;
};

const GROUP_ID = "generator-format";

export function FormatSelector({
  value,
  onChange,
  disabled,
}: FormatSelectorProps) {
  return (
    <FormField id={GROUP_ID} label="Format">
      <div role="radiogroup" className={optionGroupClassName}>
        {FORMAT_OPTIONS.map((option) => (
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
