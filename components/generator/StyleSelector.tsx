"use client";

import { useId } from "react";

import { STYLE_CUSTOM_MAX_LENGTH } from "@/lib/generation/validation";
import type { ImageStyle } from "@/types/generation";

import {
  FormField,
  OptionButton,
  optionGroupClassName,
  selectClassName,
} from "./FormField";

const STYLE_OPTIONS: { value: ImageStyle; label: string }[] = [
  { value: "simple", label: "Simple" },
  { value: "abstract", label: "Abstract" },
  { value: "other", label: "Other" },
];

type StyleSelectorProps = {
  value: ImageStyle;
  styleCustom: string;
  onChange: (style: ImageStyle) => void;
  onStyleCustomChange: (styleCustom: string) => void;
  disabled?: boolean;
};

const GROUP_ID = "generator-style";

export function StyleSelector({
  value,
  styleCustom,
  onChange,
  onStyleCustomChange,
  disabled,
}: StyleSelectorProps) {
  const customStyleInputId = useId();

  return (
    <FormField id={GROUP_ID} label="Visual Style">
      <div className="flex flex-col gap-3">
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
        {value === "other" ? (
          <input
            id={customStyleInputId}
            type="text"
            name="styleCustom"
            disabled={disabled}
            value={styleCustom}
            maxLength={STYLE_CUSTOM_MAX_LENGTH}
            onChange={(event) => onStyleCustomChange(event.target.value)}
            placeholder="Describe the visual style (e.g. watercolor, editorial flat lay)"
            aria-label="Custom visual style"
            autoFocus
            className={selectClassName}
          />
        ) : null}
      </div>
    </FormField>
  );
}