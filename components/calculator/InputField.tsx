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
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
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
        className="w-full max-w-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
      />
    </div>
  );
}
