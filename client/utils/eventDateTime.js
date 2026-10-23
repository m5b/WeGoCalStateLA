export function parseEventTime(value) {
  const match = /^(1[0-2]|[1-9]):([0-5]\d) (AM|PM)$/.exec(value || '');
  return match ? { hour: match[1], minute: match[2], period: match[3] } : null;
}

export function formatEventDate(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function parseEventDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  // Local noon avoids UTC conversion shifting the selected calendar day.
  const date = new Date(value + 'T12:00:00');
  return !Number.isNaN(date.getTime()) && formatEventDate(date) === value ? date : null;
}

export function formatEventTime(date) {
  return (date.getHours() % 12 || 12) + ':' + String(date.getMinutes()).padStart(2, '0') + (date.getHours() < 12 ? ' AM' : ' PM');
}

export function dateForEventTime(value) {
  const parts = parseEventTime(value);
  const date = new Date();
  if (parts) date.setHours(Number(parts.hour) % 12 + (parts.period === 'PM' ? 12 : 0), Number(parts.minute), 0, 0);
  return date;
}
