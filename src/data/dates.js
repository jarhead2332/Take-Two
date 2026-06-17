// Parse 'YYYY-MM-DD' as a local date (avoids timezone shifts).
export function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatShort(s) {
  const d = parseDate(s);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

export function formatRange(start, end) {
  if (start === end) return formatShort(start);
  const a = parseDate(start);
  const b = parseDate(end);
  if (a.getMonth() === b.getMonth()) {
    return `${MONTHS_SHORT[a.getMonth()]} ${a.getDate()}–${b.getDate()}`;
  }
  return `${formatShort(start)} – ${formatShort(end)}`;
}

export const dayDiff = (a, b) => Math.round((b - a) / 86400000);
