"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import type { ApiQuotation, ReviseQuotationPayload } from "@/types/rfq";
import { reviseQuotation } from "@/services/rfqService";
import { formatApiValidationSummary, getApiFieldErrors } from "@/utils/apiErrors";
import { getBuyerRevisionRemarks } from "@/utils/rfqHelpers";
import { scrollToFirstFormError } from "@/utils/scrollToFormError";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

interface ReviseQuotationFormProps {
  quotation: ApiQuotation;
  onRevised?: (updated: ApiQuotation) => void;
  onCancel?: () => void;
}

interface ReviseQuotationFormModalProps extends ReviseQuotationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_TO_FORM_FIELD = {
  price: "price",
  delivery_days: "deliveryDays",
  remarks: "remarks",
} as const;

type FormField = keyof typeof API_TO_FORM_FIELD extends infer K
  ? K extends keyof typeof API_TO_FORM_FIELD
    ? (typeof API_TO_FORM_FIELD)[K]
    : never
  : never;

type FormState = {
  price: string;
  deliveryDays: string;
  remarks: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const FIELD_ERROR_ORDER: (keyof FormState)[] = ["price", "deliveryDays", "remarks"];

function buildInitialForm(quotation: ApiQuotation): FormState {
  return {
    price: quotation.price != null ? String(quotation.price) : "",
    deliveryDays: quotation.delivery_days != null ? String(quotation.delivery_days) : "",
    remarks: "",
  };
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};

  const priceStr = form.price.trim();
  if (!priceStr) {
    errors.price = "Price is required";
  } else {
    const price = Number(priceStr);
    if (!Number.isFinite(price) || price <= 0) {
      errors.price = "Price must be a positive number";
    }
  }

  const deliveryStr = form.deliveryDays.trim();
  if (!deliveryStr) {
    errors.deliveryDays = "Delivery days is required";
  } else {
    const deliveryDays = Number(deliveryStr);
    if (!Number.isFinite(deliveryDays) || deliveryDays < 1) {
      errors.deliveryDays = "Delivery days must be at least 1";
    }
  }

  const remarks = form.remarks.trim();
  if (!remarks) {
    errors.remarks = "Remarks are required for a revision";
  } else if (remarks.length < 10) {
    errors.remarks = "Remarks must be at least 10 characters";
  }

  return errors;
}

function mapApiErrorsToForm(apiErrors: Record<string, string>): FormErrors {
  const errors: FormErrors = {};
  for (const [apiField, message] of Object.entries(apiErrors)) {
    const formField = API_TO_FORM_FIELD[apiField as keyof typeof API_TO_FORM_FIELD] as FormField | undefined;
    if (formField) errors[formField] = message;
  }
  return errors;
}

function ReviseQuotationForm({
  quotation,
  onRevised,
  onCancel,
}: ReviseQuotationFormProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialForm(quotation));
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(buildInitialForm(quotation));
    setFieldErrors({});
  }, [quotation.id]);

  const labelClass = "mb-1.5 block text-xs font-bold text-muted-fg";

  function fieldError(name: keyof FormState): string | undefined {
    return fieldErrors[name];
  }

  function inputClass(name: keyof FormState): string {
    const base =
      "w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors duration-200";
    return fieldError(name)
      ? `${base} border-error/40 bg-error-soft focus:border-error focus:ring-2 focus:ring-error/20`
      : `${base} border-border hover:border-border-hover focus:border-primary focus:ring-2 focus:ring-primary/25`;
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function FieldHint({ name }: { name: keyof FormState }) {
    const message = fieldError(name);
    if (!message) return null;
    return <p className="mt-1 text-xs text-error">{message}</p>;
  }

  function RequiredLabel({ children }: { children: React.ReactNode }) {
    return (
      <label className={labelClass}>
        {children} <span className="text-error">*</span>
      </label>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const clientErrors = validateForm(form);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      scrollToFirstFormError(clientErrors as Record<string, string>, {
        fieldOrder: FIELD_ERROR_ORDER,
      });
      return;
    }

    const payload: ReviseQuotationPayload = {
      price: Number(form.price),
      delivery_days: Math.floor(Number(form.deliveryDays)),
      remarks: form.remarks.trim(),
    };

    setSubmitting(true);
    setFieldErrors({});

    try {
      const updated = await reviseQuotation(quotation.id, payload);
      showSuccessToast("Quotation revised");
      onRevised?.(updated);
    } catch (err) {
      const apiErrors = mapApiErrorsToForm(getApiFieldErrors(err));
      if (Object.keys(apiErrors).length > 0) {
        setFieldErrors(apiErrors);
        scrollToFirstFormError(apiErrors as Record<string, string>, {
          fieldOrder: FIELD_ERROR_ORDER,
        });
        return;
      }
      showErrorToast(formatApiValidationSummary(err, "Failed to revise quotation"));
    } finally {
      setSubmitting(false);
    }
  }

  const buyerRevisionRemarks = getBuyerRevisionRemarks(quotation);

  return (
    <form onSubmit={(e) => void handleSubmit(e)} noValidate className="space-y-4">
      {buyerRevisionRemarks ? (
        <div className="rounded-xl border border-warning/25 bg-warning-soft px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-warning">
            Buyer&apos;s revision request
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-fg">{buyerRevisionRemarks}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-fg">
          The buyer requested changes. Update your quote and explain what changed.
        </p>
      )}

      <div data-form-field="price">
        <RequiredLabel>Revised unit price (INR)</RequiredLabel>
        <input
          type="number"
          min={0.01}
          step="0.01"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          className={inputClass("price")}
          placeholder="e.g. 430"
        />
        <FieldHint name="price" />
      </div>

      <div data-form-field="deliveryDays">
        <RequiredLabel>Delivery days</RequiredLabel>
        <input
          type="number"
          min={1}
          value={form.deliveryDays}
          onChange={(e) => updateField("deliveryDays", e.target.value)}
          className={inputClass("deliveryDays")}
          placeholder="e.g. 5"
        />
        <FieldHint name="deliveryDays" />
      </div>

      <div data-form-field="remarks">
        <RequiredLabel>Revision remarks</RequiredLabel>
        <textarea
          value={form.remarks}
          onChange={(e) => updateField("remarks", e.target.value)}
          rows={4}
          className={inputClass("remarks")}
          placeholder="Revised quotation as requested by the buyer. Explain the updated price, delivery timeline, or other changes..."
        />
        <FieldHint name="remarks" />
      </div>

      <div className="flex flex-wrap gap-2">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" loading={submitting} className="flex-1">
          Submit revision
        </Button>
      </div>
    </form>
  );
}

export function ReviseQuotationFormModal({
  isOpen,
  onClose,
  quotation,
  onRevised,
}: ReviseQuotationFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      bodyClassName="px-5 py-5 sm:px-6"
      title={
        <div className="min-w-0">
          <p className="text-lg font-semibold text-foreground">Revise quotation</p>
          <p className="mt-0.5 text-xs font-medium text-muted-fg">
            Quote #{quotation.id}
            {quotation.quantity != null
              ? ` · ${quotation.quantity} ${quotation.unit ?? ""}`
              : ""}
          </p>
        </div>
      }
    >
      <ReviseQuotationForm
        key={quotation.id}
        quotation={quotation}
        onCancel={onClose}
        onRevised={(updated) => {
          onRevised?.(updated);
          onClose();
        }}
      />
    </Modal>
  );
}

export default ReviseQuotationForm;
