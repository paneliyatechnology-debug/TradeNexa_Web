import type { ApiChatConversation, ChatRole } from "@/types/chat";

export function counterpartyDisplayName(
  conversation: ApiChatConversation | null | undefined,
  role: ChatRole,
  fallbackName?: string | null
): string {
  if (fallbackName?.trim()) return fallbackName.trim();
  const other =
    conversation?.other_party ??
    (role === "buyer" ? conversation?.seller : conversation?.buyer);
  return (
    other?.company_name?.trim() ||
    other?.name?.trim() ||
    (role === "buyer" ? "Seller" : "Buyer")
  );
}

export function counterpartySellerId(
  conversation: ApiChatConversation | null | undefined,
  explicitSellerId?: number | null
): number | null {
  if (explicitSellerId != null && explicitSellerId > 0) return explicitSellerId;
  if (!conversation) return null;
  const fromConversation =
    conversation.seller_id ??
    conversation.seller?.id ??
    conversation.seller?.user_id ??
    conversation.other_party?.id ??
    conversation.other_party?.user_id;
  return typeof fromConversation === "number" && fromConversation > 0
    ? fromConversation
    : null;
}
