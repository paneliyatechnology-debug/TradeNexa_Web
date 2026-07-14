"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { deleteRfq } from "@/services/rfqService";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

interface DeleteRfqButtonProps {
  rfqId: number;
  rfqTitle: string;
  redirectHref?: string;
  onDeleted?: () => void;
  className?: string;
  label?: string;
}

export default function DeleteRfqButton({
  rfqId,
  rfqTitle,
  redirectHref = "/buyer/inquiries",
  onDeleted,
  className = "",
  label = "Delete draft",
}: DeleteRfqButtonProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteRfq(rfqId);
      showSuccessToast("Draft RFQ deleted");
      if (onDeleted) {
        onDeleted();
      } else {
        router.push(redirectHref);
      }
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to delete RFQ";
      showErrorToast(message);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className={
          className ||
          "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-error/30 px-3 text-sm font-semibold text-error transition hover:border-error/50 hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
        }
      >
        <Trash2 className="h-3.5 w-3.5" />
        {label}
      </button>

      {confirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm">
          <div className="surface-card w-full max-w-sm p-6">
            <h3 className="text-base font-semibold text-foreground">Delete draft RFQ?</h3>
            <p className="mt-2 text-sm text-muted-fg">
              Permanently delete &quot;{rfqTitle}&quot;? This only works for draft requirements and
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setConfirmOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                loading={loading}
                loadingText="Deleting..."
                onClick={() => void handleDelete()}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
