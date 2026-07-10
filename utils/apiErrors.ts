export interface ApiFieldError {
  field: string;
  message: string;
}

function readErrorData(err: unknown): Record<string, unknown> | null {
  if (!err || typeof err !== "object") return null;
  const data = (err as { data?: unknown }).data;
  return data && typeof data === "object" ? (data as Record<string, unknown>) : null;
}

/** Extract field-level validation messages from API error responses. */
export function getApiFieldErrors(err: unknown): Record<string, string> {
  const data = readErrorData(err);
  if (!data || !Array.isArray(data.errors)) return {};

  const map: Record<string, string> = {};
  for (const item of data.errors) {
    if (!item || typeof item !== "object") continue;
    const field = "field" in item ? String((item as ApiFieldError).field) : "";
    const message = "message" in item ? String((item as ApiFieldError).message) : "";
    if (field && message && !map[field]) {
      map[field] = message;
    }
  }
  return map;
}

export function formatApiErrorMessage(err: unknown, fallback = "Request failed"): string {
  if (err && typeof err === "object" && "message" in err) {
    const message = String((err as { message: string }).message);
    if (message.trim()) return message;
  }
  return fallback;
}

export function formatApiValidationSummary(err: unknown, fallback?: string): string {
  const fieldErrors = getApiFieldErrors(err);
  const messages = Object.values(fieldErrors);
  if (messages.length > 0) {
    return messages.slice(0, 3).join(" · ");
  }
  return formatApiErrorMessage(err, fallback ?? "Validation failed");
}
