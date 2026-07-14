/**
 * Socket.IO events from Chat Module Frontend Guide.
 *
 * Rooms: user:{id} (auto on connect), conversation:{id} (after conversation:join)
 * Auth: handshake.auth.token = raw JWT
 *
 * Send chat text via REST only — Socket delivers message:new after DB write.
 */

/** Server → client */
export const CHAT_SOCKET_LISTEN_EVENTS = [
  "message:new",
  "conversation:updated",
  "message:read",
  "chat:error",
] as const;

/** Client → server */
export const CHAT_SOCKET_EMIT_EVENTS = [
  "conversation:join",
  "conversation:leave",
  "message:read",
] as const;

export type ChatSocketListenEvent = (typeof CHAT_SOCKET_LISTEN_EVENTS)[number];
export type ChatSocketEmitEvent = (typeof CHAT_SOCKET_EMIT_EVENTS)[number];
