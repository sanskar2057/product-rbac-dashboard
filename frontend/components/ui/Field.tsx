import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/utils/cn";

const baseControl =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500";

function controlClasses(error?: string): string {
  return cn(
    baseControl,
    error
      ? "border-red-400 focus:ring-red-500/30 dark:border-red-500"
      : "border-zinc-300 dark:border-zinc-600",
  );
}

interface FieldWrapperProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FieldWrapper({
  label,
  htmlFor,
  error,
  required,
  children,
}: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextInput({ label, error, id, required, ...props }: InputProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} required={required}>
      <input id={id} className={controlClasses(error)} {...props} />
    </FieldWrapper>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextArea({ label, error, id, required, ...props }: TextAreaProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} required={required}>
      <textarea
        id={id}
        className={cn(controlClasses(error), "resize-none")}
        {...props}
      />
    </FieldWrapper>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function SelectInput({
  label,
  error,
  id,
  required,
  options,
  ...props
}: SelectProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} required={required}>
      <select id={id} className={controlClasses(error)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
