/**
 * Socket.IO events from Chat Module Frontend Guide.
 *
 * Rooms: user:{id} (auto on connect), conversation:{id} (after conversation:join)
 * Auth: handshake.auth.token = raw JWT
 *
 * Send chat text via REST only — Socket delivers receive_message / message:new after DB write.
 * Nav unread badge is driven by these live events (seeded once via REST on connect).
 */

/** Server → client (canonical) */
export const CHAT_SOCKET_LISTEN_EVENTS = [
  "message:new",
  "conversation:updated",
  "message:read",
  "typing:indicator",
  /** Live Unread Inbox guide — full badge + per-conversation snapshot */
  "unread_summary",
  "chat:error",
  /** Push_Notifications_Frontend_Guide §7 — RFQ/inquiry in-app inbox */
  "notification:new",
  "notification:unread_count",
  "notification:updated",
  "notification:error",
] as const;

/**
 * Guide aliases — bind these on the socket and fan-in to the canonical handlers
 * so nav unread stays live regardless of which event name the backend emits.
 */
export const CHAT_SOCKET_ALIAS_EVENTS = {
  receive_message: "message:new",
  messages_read: "message:read",
  user_typing: "typing:indicator",
  user_stop_typing: "typing:indicator",
  typing: "typing:indicator",
} as const;

/** Client → server */
export const CHAT_SOCKET_EMIT_EVENTS = [
  "conversation:join",
  "conversation:leave",
  "message:read",
  "typing_start",
  "typing_stop",
  "typing:start",
  "typing:stop",
  /** Request a fresh unread_summary snapshot */
  "get_unread_summary",
  "notification:get_unread_count",
  "notification:mark_read",
  "notification:mark_all_read",
] as const;

export type ChatSocketListenEvent = (typeof CHAT_SOCKET_LISTEN_EVENTS)[number];
export type ChatSocketEmitEvent = (typeof CHAT_SOCKET_EMIT_EVENTS)[number];
