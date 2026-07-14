"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/common/Button";
import { submitProductForReview } from "@/services/productService";
import type { ProductApprovalStatus } from "@/types/product";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

interface SubmitProductForReviewButtonProps {
  productId: number;
  className?: string;
  label?: string;
  onSubmitted?: (status: ProductApprovalStatus) => void;
}

export default function SubmitProductForReviewButton({
  productId,
  className = "",
  label = "Submit for review",
  onSubmitted,
}: SubmitProductForReviewButtonProps) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await submitProductForReview(productId);
      showSuccessToast("Product submitted for review");
      onSubmitted?.(result.approval_status ?? "in_review");
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to submit for review";
      showErrorToast(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={() => void handleSubmit()}
      loading={submitting}
      loadingText="Submitting..."
      className={className}
    >
      <Send className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
