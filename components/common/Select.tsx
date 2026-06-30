"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { inputClassName } from "./FormField";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
}

export function Select({
  id,
  options,
  placeholder = "Select an option",
  error,
  className = "",
  ...rest
}: SelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        aria-invalid={!!error}
        className={`${inputClassName(error)} appearance-none pr-10 ${className}`}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
