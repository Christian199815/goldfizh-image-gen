"use client";

import type { PageListItem } from "@/types/context";

import { CustomSelect } from "./CustomSelect";
import { FormField } from "./FormField";

type PageUrlSelectProps = {
  pages: PageListItem[];
  value: string;
  onChange: (pageId: string) => void;
  disabled?: boolean;
};

const FIELD_ID = "generator-page";
const CONTROL_ID = `${FIELD_ID}-control`;

export function PageUrlSelect({
  pages,
  value,
  onChange,
  disabled,
}: PageUrlSelectProps) {
  const selected = pages.find((page) => page.id === value);

  return (
    <FormField
      id={FIELD_ID}
      controlId={CONTROL_ID}
      label="Page"
      hint={selected?.url}
    >
      <CustomSelect
        id={CONTROL_ID}
        labelledBy={FIELD_ID}
        name="pageId"
        value={value}
        disabled={disabled || pages.length === 0}
        placeholder="No pages available"
        aria-describedby={selected?.url ? `${FIELD_ID}-hint` : undefined}
        onChange={onChange}
        options={
          pages.length === 0
            ? [{ value: "", label: "No pages available", disabled: true }]
            : pages.map((page) => ({ value: page.id, label: page.label }))
        }
      />
    </FormField>
  );
}
