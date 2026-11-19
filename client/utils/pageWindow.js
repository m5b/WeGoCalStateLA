// Which page numbers to show in a pager, like Google's: always the first and last page, the current page with
// one neighbor on each side, and "…" where numbers are skipped.
//
//   pageWindow(7, 13) -> [1, "…", 6, 7, 8, "…", 13]
//   pageWindow(1, 13) -> [1, 2, 3, 4, "…", 13]
export function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  // Near either end, show a few more numbers so the row doesn't jump around.
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p));

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let last = 0;
  for (const p of sorted) {
    if (last && p - last === 2) out.push(last + 1); // a gap of one page: show it instead of "…"
    else if (last && p - last > 2) out.push("…");
    out.push(p);
    last = p;
  }
  return out;
}