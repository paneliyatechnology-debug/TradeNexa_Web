import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  className = "",
  ...rest
}) => {
  const inputStyles = `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
    error
      ? "border-red-400 focus:border-red-500"
      : "border-slate-200 focus:border-primary"
  } ${className}`;

  if (label) {
    return (
      <div className="space-y-1.5">
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
        >
          {label}
        </label>
        <input id={id} className={inputStyles} aria-invalid={!!error} {...rest} />
      </div>
    );
  }

  return <input id={id} className={inputStyles} aria-invalid={!!error} {...rest} />;
};
