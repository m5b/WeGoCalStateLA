const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Shows an event's date with the month spelled out: "2026-11-03" -> "Nov 3, 2026".
// Only the screen text changes. The date itself stays YYYY-MM-DD everywhere else (sorting,
// the edit form, the server). Anything that isn't a valid YYYY-MM-DD date is returned as it came.
export function formatEventDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!match) return value ?? "";
  const month = MONTHS[Number(match[2]) - 1];
  if (!month) return value;
  return `${month} ${Number(match[3])}, ${match[1]}`;
}