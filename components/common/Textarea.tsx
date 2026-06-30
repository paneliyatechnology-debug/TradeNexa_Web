"use client";

import React from "react";
import { inputClassName } from "./FormField";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  error?: boolean;
}

export function Textarea({ id, error, className = "", ...rest }: TextareaProps) {
  return (
    <textarea
      id={id}
      aria-invalid={!!error}
      className={`${inputClassName(error)} resize-none ${className}`}
      {...rest}
    />
  );
}
