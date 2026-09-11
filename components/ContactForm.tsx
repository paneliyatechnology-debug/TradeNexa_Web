"use client";

import React, { useState } from "react";
import { useApp, UserRole } from "@/app/context/AppContext";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { RoleSelector } from "@/components/common/RoleSelector";
import { scrollToFirstFormError } from "@/utils/scrollToFormError";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactForm() {
  const { addInquiry } = useApp();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    role: "" as UserRole | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const clearError = (field: string) => {
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.role)
      newErrors.role = t("contact.roleRequired", "Please select your role on the platform.");
    if (!formData.name.trim())
      newErrors.name = t("contact.nameRequired", "Full name is required.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t("contact.emailRequired", "Email address is required.");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t("contact.emailInvalid", "Please enter a valid email address.");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("contact.phoneRequired", "Phone number is required.");
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = t("contact.phoneDigitsOnly", "Phone number must contain digits only.");
    } else if (formData.phone.length !== 10) {
      newErrors.phone = t("contact.phoneLength", "Phone number must be exactly 10 digits.");
    }
    if (!formData.company.trim())
      newErrors.company = t("contact.companyRequired", "Company name is required.");
    if (!formData.message.trim())
      newErrors.message = t("contact.messageRequired", "Message details are required.");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      scrollToFirstFormError(newErrors, {
        fieldOrder: ["role", "name", "email", "phone", "company", "message"],
        fieldIds: {
          role: "contact-role",
          name: "contact-name",
          email: "contact-email",
          phone: "contact-phone",
          company: "contact-company",
          message: "contact-message",
        },
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      addInquiry({
        ...formData,
        role: formData.role as UserRole,
      });
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", company: "", message: "", role: "" });
      setTimeout(() => setSubmitted(false), 4000);
    }, 1500);
  };

  return (
    <div className="surface-card rounded-xl p-6 md:p-8">
      {submitted ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            {t("contact.successTitle", "Inquiry Sent Successfully!")}
          </h3>
          <p className="mt-2 text-sm text-muted-fg">
            {t(
              "contact.successSubtitle",
              "Thank you for reaching out. A platform representative will contact you within 24 hours."
            )}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {t("contact.directMessageTitle", "Send a direct message")}
            </h3>
            <p className="mt-1 text-sm text-muted-fg">
              {t(
                "contact.directMessageSubtitle",
                "Tell us about your business and how we can help you connect."
              )}
            </p>
          </div>

          <FormField
            label={t("contact.yourRole", "Your Role")}
            htmlFor="contact-role"
            fieldKey="role"
            required
            error={errors.role}
          >
            <RoleSelector
              value={formData.role}
              onChange={(role) => {
                setFormData({ ...formData, role });
                clearError("role");
              }}
              error={errors.role}
              compact
            />
          </FormField>

          <FormField
            label={t("contact.fullName", "Full Name")}
            htmlFor="contact-name"
            required
            error={errors.name}
          >
            <Input
              id="contact-name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                clearError("name");
              }}
              placeholder={t("contact.namePlaceholder", "Your name")}
              error={!!errors.name}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label={t("contact.emailAddress", "Email Address")}
              htmlFor="contact-email"
              required
              error={errors.email}
            >
              <Input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  clearError("email");
                }}
                placeholder="name@company.com"
                error={!!errors.email}
              />
            </FormField>
            <FormField
              label={t("contact.phone", "Phone Number")}
              htmlFor="contact-phone"
              required
              error={errors.phone}
            >
              <Input
                id="contact-phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  clearError("phone");
                }}
                placeholder={t("contact.phonePlaceholder", "10-digit phone number")}
                error={!!errors.phone}
              />
            </FormField>
          </div>

          <FormField
            label={t("contact.companyName", "Company Name")}
            htmlFor="contact-company"
            required
            error={errors.company}
          >
            <Input
              id="contact-company"
              value={formData.company}
              onChange={(e) => {
                setFormData({ ...formData, company: e.target.value });
                clearError("company");
              }}
              placeholder={t("contact.companyPlaceholder", "Business name")}
              error={!!errors.company}
            />
          </FormField>

          <FormField
            label={t("contact.message", "Message")}
            htmlFor="contact-message"
            required
            error={errors.message}
          >
            <Textarea
              id="contact-message"
              rows={4}
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                clearError("message");
              }}
              placeholder={t("contact.messagePlaceholder", "How can we assist your business today?")}
              error={!!errors.message}
            />
          </FormField>

          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            loadingText={t("contact.sendingMessage", "Sending message...")}
          >
            <Send className="h-4 w-4" />
            {t("contact.sendInquiry", "Send Inquiry")}
          </Button>
        </form>
      )}
    </div>
  );
}
