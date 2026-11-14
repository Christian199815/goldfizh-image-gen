import { FormField, selectClassName } from "./FormField";

const textareaClassName = `${selectClassName} min-h-[7.5rem] resize-y`;

type ImageRequestFieldProps = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function ImageRequestField({
  value,
  disabled,
  onChange,
}: ImageRequestFieldProps) {
  return (
    <FormField
      id="image-request"
      label="Image request"
      controlId="image-request-input"
      hint="Optional. Describe the scene or subject; otherwise intent is inferred from page, segment, and choices. Brand styling is applied on the server."
    >
      <textarea
        id="image-request-input"
        name="imageRequest"
        rows={4}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Create an image of two people exercising in a modern gym."
        aria-describedby="image-request-hint"
        className={textareaClassName}
      />
    </FormField>
  );
}
