const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const clock = (date) => date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

// The time under a message: "3:45 PM" today, "Nov 3, 3:45 PM" on another day this year, with the year
// for older ones. Takes a date or a time in milliseconds.
export function formatMessageTime(value, now = Date.now()) {
  if (!value) return "";
  const date = new Date(value);
  const today = new Date(now);
  if (sameDay(date, today)) return clock(date);
  const day = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() === today.getFullYear() ? {} : { year: "numeric" }),
  });
  return `${day}, ${clock(date)}`;
}

// The date on the right of a conversation in the list: the time today, otherwise "Nov 3" (with the
// year if it is from another year).
export function formatListDate(value, now = Date.now()) {
  if (!value) return "";
  const date = new Date(value);
  const today = new Date(now);
  if (sameDay(date, today)) return clock(date);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() === today.getFullYear() ? {} : { year: "numeric" }),
  });
}