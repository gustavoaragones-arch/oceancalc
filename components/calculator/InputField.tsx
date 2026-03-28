"use client";

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  step?: string;
}

export function InputField({
  id,
  label,
  value,
  onChange,
  min,
  step = "any",
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        step={step === "any" ? "any" : step}
        className="input-field max-w-xs text-base"
      />
    </div>
  );
}
