"use client";

import type { BrandSegment } from "@/types/context";

import { CustomSelect } from "./CustomSelect";
import { FormField } from "./FormField";

type BrandSegmentSelectProps = {
  brandSegments: BrandSegment[];
  value: string;
  onChange: (segmentId: string) => void;
  disabled?: boolean;
};

const FIELD_ID = "generator-brand-segment";
const CONTROL_ID = `${FIELD_ID}-control`;

export function BrandSegmentSelect({
  brandSegments,
  value,
  onChange,
  disabled,
}: BrandSegmentSelectProps) {
  const selected = brandSegments.find((segment) => segment.id === value);

  return (
    <FormField
      id={FIELD_ID}
      controlId={CONTROL_ID}
      label="Brand direction"
      hint={selected?.audienceDescription}
    >
      <CustomSelect
        id={CONTROL_ID}
        labelledBy={FIELD_ID}
        name="brandSegment"
        value={value}
        disabled={disabled || brandSegments.length === 0}
        placeholder="No segments available"
        aria-describedby={
          selected?.audienceDescription ? `${FIELD_ID}-hint` : undefined
        }
        onChange={onChange}
        options={
          brandSegments.length === 0
            ? [{ value: "", label: "No segments available", disabled: true }]
            : brandSegments.map((segment) => ({
                value: segment.id,
                label: segment.label,
              }))
        }
      />
    </FormField>
  );
}
