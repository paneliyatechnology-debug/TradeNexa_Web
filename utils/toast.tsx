"use client";

import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, X, Bell } from "lucide-react";

/** Toast visible duration in milliseconds (3000ms = 3 seconds) */
export const TOAST_DURATION_MS = 3000;
export const NOTIFICATION_TOAST_DURATION_MS = 6000;

type ToastType = "success" | "error";

function showToast(message: string, type: ToastType) {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all duration-300 ${
          t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        } ${
          type === "success"
            ? "border-success/25 bg-white text-foreground"
            : "border-error/25 bg-white text-foreground"
        }`}
        style={{ minWidth: 280, maxWidth: 360 }}
      >
        {type === "success" ? (
          <CheckCircle className="h-5 w-5 flex-shrink-0 text-success" />
        ) : (
          <XCircle className="h-5 w-5 flex-shrink-0 text-error" />
        )}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-1 flex-shrink-0 rounded-md p-1 text-muted-placeholder transition-colors hover:bg-muted hover:text-muted-fg"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    { duration: TOAST_DURATION_MS }
  );
}

export const showSuccessToast = (message: string) => showToast(message, "success");
export const showErrorToast   = (message: string) => showToast(message, "error");

export interface NotificationToastOptions {
  title: string;
  body: string;
  onClick?: () => void;
  duration?: number;
}

function playNotificationChime() {
  try {
    if (typeof window === "undefined") return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.1); // A5
    gain2.gain.setValueAtTime(0.15, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.35);
  } catch {
    /* AudioContext might be silent until user gesture */
  }
}

const recentToastKeys = new Map<string, number>();

export function showNotificationToast({
  title,
  body,
  onClick,
  duration = NOTIFICATION_TOAST_DURATION_MS,
}: NotificationToastOptions) {
  const safeTitle = (title || "Notification").trim();
  const safeBody = (body || "").trim();
  const key = `${safeTitle}:::${safeBody}`;
  const now = Date.now();
  const lastTime = recentToastKeys.get(key) || 0;
  if (now - lastTime < 3000) {
    // Deduplicate: same notification was triggered in the last 3 seconds
    return;
  }
  recentToastKeys.set(key, now);

  if (recentToastKeys.size > 20) {
    recentToastKeys.forEach((t, k) => {
      if (now - t > 10000) recentToastKeys.delete(k);
    });
  }

  playNotificationChime();

  toast.custom(
    (t) => (
      <div
        onClick={() => {
          if (onClick) onClick();
          toast.dismiss(t.id);
        }}
        className={`flex items-start gap-3 rounded-2xl border border-primary/25 bg-white/95 backdrop-blur-md p-4 shadow-2xl transition-all duration-300 cursor-pointer hover:border-primary/50 dark:bg-slate-900/95 w-[calc(100vw-32px)] sm:w-auto sm:min-w-[320px] sm:max-w-[420px] ${
          t.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"
        }`}
        style={{ zIndex: 99999999 }}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Bell className="h-5 w-5 animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-foreground line-clamp-1">{safeTitle}</h4>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{safeBody}</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(t.id);
          }}
          className="ml-1 shrink-0 rounded-lg p-1 text-muted-placeholder transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    { duration }
  );
}
