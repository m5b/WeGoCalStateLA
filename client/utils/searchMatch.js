// True when every word typed in the search box appears somewhere in the given
// fields (case-insensitive, in any order). An empty search matches everything.
export function matchesSearch(query, fields) {
  const words = (query || "").toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = fields
    .filter(Boolean)
    .map((f) => String(f).toLowerCase())
    .join(" ");
  return words.every((w) => haystack.includes(w));
}
