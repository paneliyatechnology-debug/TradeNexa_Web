"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  /** Used for scroll-to-error targeting (`data-form-field`) */
  fieldKey?: string;
  hint?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
  className = "",
  fieldKey,
  hint,
}: FormFieldProps) {
  return (
    <div
      className={`space-y-1.5 ${className}`}
      data-form-field={fieldKey ?? htmlFor}
    >
      <label
        htmlFor={htmlFor}
        className="mb-0 block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="ml-1 text-error">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-fg">{hint}</p>
      )}
      {error ? (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-error"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Shared focus ring — keep in sync with Button / Select. */
export const controlFocusClass =
  "focus:border-primary focus:ring-2 focus:ring-primary/25 focus:outline-none";

export const controlFocusErrorClass =
  "focus:border-error focus:ring-2 focus:ring-error/20 focus:outline-none";

/** Default control height: h-10 (design system md). */
export const inputClassName = (hasError?: boolean) =>
  `h-10 w-full rounded-lg border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-placeholder outline-none transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-55 ${
    hasError
      ? `border-error/40 bg-error-soft ${controlFocusErrorClass}`
      : `border-border hover:border-border-hover ${controlFocusClass}`
  }`;

export const textareaClassName = (hasError?: boolean) =>
  `min-h-[7.5rem] w-full resize-y rounded-lg border bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-placeholder outline-none transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-55 ${
    hasError
      ? `border-error/40 bg-error-soft ${controlFocusErrorClass}`
      : `border-border hover:border-border-hover ${controlFocusClass}`
  }`;

export const dateInputClassName = (hasError?: boolean, className = "") =>
  `${inputClassName(hasError)} date-input cursor-pointer ${className}`.trim();
