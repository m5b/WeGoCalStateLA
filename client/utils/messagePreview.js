// The second line of a conversation in the list: "You: see you there", "Thanks!", or "Photo".
export function previewText(conversation) {
  const { text, hasPhoto, fromMe } = conversation?.lastMessage ?? {};
  const body = (text || "").trim() || (hasPhoto ? "Photo" : "");
  return fromMe && body ? `You: ${body}` : body;
}

// A count for a small badge: 3 -> "3", 12 -> "9+", nothing to show -> "".
export function badgeText(count) {
  if (!count || count < 1) return "";
  return count > 9 ? "9+" : String(count);
}