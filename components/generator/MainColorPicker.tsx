"use client";

import type { BrandColor } from "@/types/context";

import { FormField } from "./FormField";

const WHITE_SWATCH = "#FFFFFF";

type MainColorPickerProps = {
  brandColors: BrandColor[];
  value: string;
  onChange: (hex: string) => void;
  disabled?: boolean;
};

const GROUP_ID = "generator-main-color";

function normalizeHex(hex: string): string {
  return hex.trim().toUpperCase();
}

function buildSwatches(brandColors: BrandColor[]): { hex: string; label: string }[] {
  const entries = brandColors.map((color) => ({
    hex: color.hex,
    label: color.name,
  }));

  const hasWhite = entries.some(
    (entry) => normalizeHex(entry.hex) === normalizeHex(WHITE_SWATCH),
  );

  if (!hasWhite) {
    entries.unshift({ hex: WHITE_SWATCH, label: "White" });
  }

  return entries;
}

export function MainColorPicker({
  brandColors,
  value,
  onChange,
  disabled,
}: MainColorPickerProps) {
  const swatches = buildSwatches(brandColors);

  return (
    <FormField id={GROUP_ID} label="Main color">
      <div
        role="radiogroup"
        className="grid w-full min-w-0 gap-2"
        style={{
          gridTemplateColumns: `repeat(${swatches.length}, minmax(0, 1fr))`,
        }}
      >
        {swatches.map((swatch) => {
          const selected = normalizeHex(value) === normalizeHex(swatch.hex);
          const isLight =
            normalizeHex(swatch.hex) === normalizeHex(WHITE_SWATCH);

          return (
            <button
              key={swatch.hex}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={swatch.label}
              title={swatch.label}
              disabled={disabled}
              onClick={() => onChange(swatch.hex)}
              className={`relative mx-auto aspect-square w-full max-h-10 max-w-10 rounded-full border-2 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 ${
                selected
                  ? "border-gf-brand ring-2 ring-gf-brand ring-offset-1"
                  : isLight
                    ? "border-gf-panel-border"
                    : "border-transparent"
              }`}
              style={{ backgroundColor: swatch.hex }}
            />
          );
        })}
      </div>
    </FormField>
  );
}
