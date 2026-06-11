"use client";

import {
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useId,
} from "react";

interface BaseFieldProps {
  /** Mono uppercase label above the control. */
  label: string;
  /** Inline error message (ember). Sets aria-invalid + aria-describedby. */
  error?: string;
  /** Wrapper className. */
  className?: string;
}

const LABEL_CLS =
  "block font-mono text-[11px] uppercase tracking-[0.2em] text-latte";

function controlCls(error?: string, extra = "") {
  return [
    "mt-2 w-full rounded-lg border bg-roast px-4 py-3 text-sm text-crema",
    "placeholder:text-latte/80 transition-colors duration-200 motion-reduce:transition-none",
    "focus:border-gold",
    error ? "border-ember" : "border-line",
    extra,
  ].join(" ");
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="text-ember mt-1.5 text-xs">
      {error}
    </p>
  );
}

export type InputProps = BaseFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

export function Input({ label, error, className, id, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className={className}>
      <label htmlFor={inputId} className={LABEL_CLS}>
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={controlCls(error)}
        {...rest}
      />
      <ErrorText id={errorId} error={error} />
    </div>
  );
}

export type SelectProps = BaseFieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "className">;

export function Select({
  label,
  error,
  className,
  id,
  children,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = `${selectId}-error`;

  return (
    <div className={className}>
      <label htmlFor={selectId} className={LABEL_CLS}>
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={controlCls(error, "appearance-none pr-10")}
          {...rest}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className="text-latte pointer-events-none absolute top-1/2 right-4 h-2 w-3 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 1.5 6 6.5 11 1.5" />
        </svg>
      </div>
      <ErrorText id={errorId} error={error} />
    </div>
  );
}

export type TextareaProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

export function Textarea({
  label,
  error,
  className,
  id,
  rows = 4,
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const errorId = `${textareaId}-error`;

  return (
    <div className={className}>
      <label htmlFor={textareaId} className={LABEL_CLS}>
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={controlCls(error, "resize-y")}
        {...rest}
      />
      <ErrorText id={errorId} error={error} />
    </div>
  );
}
