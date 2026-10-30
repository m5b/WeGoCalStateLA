// Shows an event's date the way people write it in the US: "2026-11-01" -> "11/1/2026".
// Only the screen text changes. The date itself stays YYYY-MM-DD everywhere else (sorting,
// the edit form, the server). Anything that isn't a YYYY-MM-DD date is returned as it came.
export function formatEventDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!match) return value ?? "";
  return `${Number(match[2])}/${Number(match[3])}/${match[1]}`;
}