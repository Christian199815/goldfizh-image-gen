"use client";

import { useId } from "react";

import { STYLE_CUSTOM_MAX_LENGTH } from "@/lib/generation/validation";
import type { ColorMode } from "@/types/generation";

import {
  FormField,
  OptionButton,
  optionGroupClassName,
  selectClassName,
} from "./FormField";

const COLOR_MODE_OPTIONS: { value: ColorMode; label: string }[] = [
  { value: "vibrant", label: "Vibrant" },
  { value: "monochrome", label: "Black & white" },
  { value: "other", label: "Other" },
];

type ColorModeSelectorProps = {
  value: ColorMode;
  colorModeCustom: string;
  onChange: (colorMode: ColorMode) => void;
  onColorModeCustomChange: (colorModeCustom: string) => void;
  disabled?: boolean;
};

const GROUP_ID = "generator-color-mode";

export function ColorModeSelector({
  value,
  colorModeCustom,
  onChange,
  onColorModeCustomChange,
  disabled,
}: ColorModeSelectorProps) {
  const customColorInputId = useId();

  return (
    <FormField id={GROUP_ID} label="Color Style">
      <div className="flex flex-col gap-3">
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
        {value === "other" ? (
          <input
            id={customColorInputId}
            type="text"
            name="colorModeCustom"
            disabled={disabled}
            value={colorModeCustom}
            maxLength={STYLE_CUSTOM_MAX_LENGTH}
            onChange={(event) => onColorModeCustomChange(event.target.value)}
            placeholder="Describe the color style (e.g. muted pastels, duotone teal and cream)"
            aria-label="Custom color style"
            autoFocus
            className={selectClassName}
          />
        ) : null}
      </div>
    </FormField>
  );
}