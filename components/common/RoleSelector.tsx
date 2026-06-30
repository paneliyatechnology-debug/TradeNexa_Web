"use client";

import React from "react";
import { Store, ShoppingCart, ArrowLeftRight } from "lucide-react";
import type { UserRole } from "@/app/context/AppContext";

interface RoleSelectorProps {
  value: UserRole | "";
  onChange: (role: UserRole) => void;
  error?: string;
  compact?: boolean;
}

const roles: { id: UserRole; label: string; description: string; icon: typeof Store }[] = [
  {
    id: "seller",
    label: "Seller",
    description: "List products & receive buyer inquiries",
    icon: Store,
  },
  {
    id: "buyer",
    label: "Buyer",
    description: "Source products from verified suppliers",
    icon: ShoppingCart,
  },
  {
    id: "both",
    label: "Both",
    description: "Buy supplies and sell your own catalog",
    icon: ArrowLeftRight,
  },
];

export function RoleSelector({ value, onChange, error, compact }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <div className={`grid gap-3 ${compact ? "grid-cols-3" : "grid-cols-1 sm:grid-cols-3"}`}>
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = value === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id)}
              className={`group relative flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                  : "border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50"
              } ${error && !value ? "border-red-300" : ""}`}
            >
              <div
                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-sm font-bold ${isSelected ? "text-primary" : "text-slate-900"}`}
              >
                {role.label}
              </span>
              {!compact && (
                <span className="mt-1 text-[11px] leading-snug text-slate-500">
                  {role.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
