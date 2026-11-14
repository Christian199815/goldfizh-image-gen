import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
  /** Focus target id for single controls (select, input). Omit for radio groups. */
  controlId?: string;
};

const labelClassName = "text-sm font-medium text-gf-text";
const hintClassName = "mt-2 text-xs text-gf-text";

export function FormField({
  id,
  label,
  children,
  hint,
  controlId,
}: FormFieldProps) {
  const hintBlock = hint ? (
    <p id={`${id}-hint`} className={hintClassName}>
      {hint}
    </p>
  ) : null;

  if (controlId) {
    return (
      <div className="flex flex-col gap-3">
        <label id={id} htmlFor={controlId} className={labelClassName}>
          {label}
        </label>
        {children}
        {hintBlock}
      </div>
    );
  }

  return (
    <fieldset id={id} className="m-0 min-w-0 space-y-3 border-0 p-0">
      <legend className={`${labelClassName} mb-0 block w-full pb-1`}>
        {label}
      </legend>
      {children}
      {hintBlock}
    </fieldset>
  );
}

export const selectClassName =
  "w-full rounded-lg border border-gf-panel-border bg-gf-input px-3 py-2.5 text-sm text-gf-heading transition-colors focus-visible:border-gf-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export const optionGroupClassName = "flex flex-wrap gap-x-2 gap-y-3";

export function OptionButton({
  pressed,
  onClick,
  disabled,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gf-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
        pressed
          ? "bg-gf-brand text-white"
          : "bg-gf-option text-gf-heading hover:bg-gf-brand-hover hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
