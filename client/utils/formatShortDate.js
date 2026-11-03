// A short date for a list row: "Oct 28". Takes a time in milliseconds.
export function formatShortDate(time) {
  if (!time) return "";
  return new Date(time).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}