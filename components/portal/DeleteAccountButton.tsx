"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

interface DeleteAccountButtonProps {
  compact?: boolean;
}

export default function DeleteAccountButton({ compact = false }: DeleteAccountButtonProps) {
  const router = useRouter();
  const { deleteAccountAction } = useAuth();
  const { clearWishlist } = useWishlist();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const ok = await deleteAccountAction();
      if (ok) {
        clearWishlist();
        showSuccessToast("Account deleted successfully");
        router.replace("/");
      }
    } catch {
      showErrorToast("Failed to delete account");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }

  if (!confirmOpen) {
    return (
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-error/30 bg-error/10 px-4 text-sm font-semibold text-error transition-colors duration-200 hover:bg-error/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/25 ${
          compact ? "shrink-0" : "w-full"
        }`}
      >
        <Trash2 className="h-4 w-4" />
        Delete Account
      </button>
    );
  }

  return (
    <div className={`rounded-xl border border-error/20 bg-error-soft p-4 ${compact ? "w-full max-w-md" : ""}`}>
      <p className="text-sm font-semibold text-error">Delete your account?</p>
      <p className="mt-1 text-xs text-error/80">
        This permanently removes your profile and cannot be undone.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setConfirmOpen(false)}
          disabled={loading}
          className="h-10 flex-1 rounded-lg border border-border bg-card text-sm font-semibold text-muted-fg transition-colors duration-200 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void handleDelete()}
          disabled={loading}
          className="h-10 flex-1 rounded-lg bg-error text-sm font-semibold text-white transition-colors duration-200 hover:bg-error-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/25"
        >
          {loading ? "Deleting..." : "Confirm Delete"}
        </button>
      </div>
    </div>
  );
}
