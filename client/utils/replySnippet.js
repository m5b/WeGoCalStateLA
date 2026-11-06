// A short line that says what a reply was, for "Replying to ..." above the reply bar: its first words
// (all on one line, shortened with "..." if long), or "Photo" when it was only a picture.
export function replySnippet(reply, max = 80) {
  const text = (reply?.text || "").replace(/\s+/g, " ").trim();
  if (!text) return reply?.imageUri ? "Photo" : "";
  return text.length <= max ? text : `${text.slice(0, max - 1).trim()}\u2026`;
}