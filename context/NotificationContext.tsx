"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { useActiveRole } from "@/context/ActiveRoleContext";
import {
  coalesceIncomingSocketPayload,
  connectChatSocket,
  emitNotificationGetUnreadCount,
  emitNotificationMarkAllRead,
  emitNotificationMarkRead,
  getChatSocketStatus,
  subscribeChatEvent,
  subscribeChatSocketStatus,
  unwrapSocketPayload,
} from "@/services/chatSocket";
import {
  fetchNotificationUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  markNotificationsRead,
} from "@/services/notificationService";
import {
  extractNotificationFromSocketPayload,
  isMarkAllUpdatedPayload,
  normalizeUnreadCountPayload,
  unreadCountForRole,
} from "@/utils/notificationHelpers";
import type { AppNotification, NotificationUnreadCount } from "@/types/notifications";

type InboxListener = (event: {
  kind: "new" | "updated" | "mark_all";
  notification?: AppNotification;
}) => void;

interface NotificationContextValue {
  /** Unread count for the active portal role (buyer or seller). */
  unreadCount: number;
  unreadByRole: NotificationUnreadCount;
  refreshUnreadCount: () => Promise<void>;
  markRead: (id: number) => Promise<AppNotification | null>;
  /** POST /notifications/read — mark selected ids as read. */
  markSelectedRead: (ids: number[]) => Promise<number>;
  markAllRead: () => Promise<number>;
  /** Subscribe to live inbox row changes (list pages). */
  subscribeInbox: (listener: InboxListener) => () => void;
}

const EMPTY_COUNTS: NotificationUnreadCount = {
  total: 0,
  buyer: 0,
  seller: 0,
  unread_count: 0,
  role: null,
};

import { showNotificationToast } from "@/utils/toast";

const NotificationContext = createContext<NotificationContextValue | null>(null);

const inboxListeners = new Set<InboxListener>();

function notifyInboxListeners(event: Parameters<InboxListener>[0]) {
  inboxListeners.forEach((listener) => {
    try {
      listener(event);
    } catch {
      /* ignore subscriber errors */
    }
  });
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { activeRole } = useActiveRole();
  const [unreadByRole, setUnreadByRole] = useState<NotificationUnreadCount>(EMPTY_COUNTS);
  const refreshSeqRef = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const unreadCount = useMemo(
    () => unreadCountForRole(unreadByRole, activeRole),
    [unreadByRole, activeRole]
  );

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadByRole(EMPTY_COUNTS);
      return;
    }
    if (getChatSocketStatus() === "connected") {
      emitNotificationGetUnreadCount();
      return;
    }
    const seq = ++refreshSeqRef.current;
    try {
      const counts = await fetchNotificationUnreadCount();
      if (seq === refreshSeqRef.current) setUnreadByRole(counts);
    } catch {
      /* badge is best-effort */
    }
  }, [isAuthenticated]);

  const markRead = useCallback(
    async (id: number): Promise<AppNotification | null> => {
      if (!Number.isFinite(id) || id <= 0) return null;
      // Optimistic badge update for active role; socket/REST will reconcile.
      setUnreadByRole((prev) => {
        const nextBuyer =
          activeRole === "buyer" ? Math.max(0, prev.buyer - 1) : prev.buyer;
        const nextSeller =
          activeRole === "seller" ? Math.max(0, prev.seller - 1) : prev.seller;
        return {
          ...prev,
          buyer: nextBuyer,
          seller: nextSeller,
          total: Math.max(0, nextBuyer + nextSeller),
          unread_count: Math.max(0, nextBuyer + nextSeller),
        };
      });
      emitNotificationMarkRead(id);
      try {
        // PATCH /api/v1/notifications/:id/read
        const notification = await markNotificationRead(id);
        notifyInboxListeners({
          kind: "updated",
          notification: { ...notification, is_read: true },
        });
        // Optimistic count already applied; socket unread_count is authoritative.
        return { ...notification, is_read: true };
      } catch {
        void refreshUnreadCount();
        return null;
      }
    },
    [activeRole, refreshUnreadCount]
  );

  const markSelectedRead = useCallback(
    async (ids: number[]): Promise<number> => {
      const uniqueIds = [...new Set(ids.filter((id) => Number.isFinite(id) && id > 0))];
      if (uniqueIds.length === 0) return 0;

      setUnreadByRole((prev) => {
        const dec = uniqueIds.length;
        const nextBuyer =
          activeRole === "buyer" ? Math.max(0, prev.buyer - dec) : prev.buyer;
        const nextSeller =
          activeRole === "seller" ? Math.max(0, prev.seller - dec) : prev.seller;
        return {
          ...prev,
          buyer: nextBuyer,
          seller: nextSeller,
          total: Math.max(0, nextBuyer + nextSeller),
          unread_count: Math.max(0, nextBuyer + nextSeller),
        };
      });

      try {
        const res = await markNotificationsRead(uniqueIds);
        uniqueIds.forEach((id) =>
          notifyInboxListeners({
            kind: "updated",
            notification: { id, is_read: true } as AppNotification,
          })
        );
        void refreshUnreadCount();
        return res.updated;
      } catch {
        void refreshUnreadCount();
        return 0;
      }
    },
    [activeRole, refreshUnreadCount]
  );

  const markAllRead = useCallback(async (): Promise<number> => {
    // Clear active role unread badge optimistically.
    setUnreadByRole((prev) => {
      const nextBuyer = activeRole === "buyer" ? 0 : prev.buyer;
      const nextSeller = activeRole === "seller" ? 0 : prev.seller;
      return {
        ...prev,
        buyer: nextBuyer,
        seller: nextSeller,
        total: Math.max(0, nextBuyer + nextSeller),
        unread_count: Math.max(0, nextBuyer + nextSeller),
      };
    });
    emitNotificationMarkAllRead(activeRole);
    try {
      const res = await markAllNotificationsRead(activeRole);
      notifyInboxListeners({ kind: "mark_all" });
      void refreshUnreadCount();
      return res.updated;
    } catch {
      void refreshUnreadCount();
      return 0;
    }
  }, [activeRole, refreshUnreadCount]);

  const subscribeInbox = useCallback((listener: InboxListener) => {
    inboxListeners.add(listener);
    return () => {
      inboxListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadByRole(EMPTY_COUNTS);
      return;
    }

    connectChatSocket();
    void refreshUnreadCount();

    const unsubStatus = subscribeChatSocketStatus((next) => {
      if (next === "connected") {
        emitNotificationGetUnreadCount();
      }
    });

    const onUnreadCount = (...args: unknown[]) => {
      const payload = unwrapSocketPayload(coalesceIncomingSocketPayload(args));
      const counts = normalizeUnreadCountPayload(payload);
      if (counts) setUnreadByRole(counts);
    };

    const onNew = (...args: unknown[]) => {
      const payload = unwrapSocketPayload(coalesceIncomingSocketPayload(args));
      const notification = extractNotificationFromSocketPayload(payload);
      if (notification) {
        notifyInboxListeners({ kind: "new", notification });

        // Show prominent in-app notification popup toast
        showNotificationToast({
          title: notification.title || "New Notification",
          body: notification.body || "You received a new update.",
          onClick: () => {
            if (notification.click_action) {
              window.location.href = notification.click_action;
            } else if (notification.type?.includes("INQUIRY")) {
              window.location.href = activeRole === "seller" ? "/seller/inquiries" : "/buyer/inquiries";
            } else if (notification.type?.includes("RFQ")) {
              window.location.href = activeRole === "seller" ? "/seller/rfq" : "/buyer/rfq";
            } else {
              window.location.href = activeRole === "seller" ? "/seller/notifications" : "/buyer/notifications";
            }
          },
        });

        // Trigger native browser desktop notification if permitted
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          try {
            const n = new Notification(notification.title || "TradeNexa", {
              body: notification.body,
              icon: "/favicon.ico",
            });
            n.onclick = () => {
              window.focus();
              if (notification.click_action) {
                window.location.href = notification.click_action;
              }
            };
          } catch {
            /* ignore notification creation error */
          }
        }
      }
      // Badge: prefer `notification:unread_count` (emitted with new) — no local bump.
    };

    const onUpdated = (...args: unknown[]) => {
      const payload = unwrapSocketPayload(coalesceIncomingSocketPayload(args));
      if (isMarkAllUpdatedPayload(payload)) {
        setUnreadByRole(EMPTY_COUNTS);
        notifyInboxListeners({ kind: "mark_all" });
        return;
      }
      const notification = extractNotificationFromSocketPayload(payload);
      if (notification) {
        notifyInboxListeners({ kind: "updated", notification });
      }
    };

    const unsubCount = subscribeChatEvent("notification:unread_count", onUnreadCount);
    const unsubNew = subscribeChatEvent("notification:new", onNew);
    const unsubUpdated = subscribeChatEvent("notification:updated", onUpdated);

    return () => {
      unsubStatus();
      unsubCount();
      unsubNew();
      unsubUpdated();
    };
  }, [isAuthenticated, refreshUnreadCount, activeRole]);

  const value = useMemo(
    () => ({
      unreadCount,
      unreadByRole,
      refreshUnreadCount,
      markRead,
      markSelectedRead,
      markAllRead,
      subscribeInbox,
    }),
    [
      unreadCount,
      unreadByRole,
      refreshUnreadCount,
      markRead,
      markSelectedRead,
      markAllRead,
      subscribeInbox,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}
