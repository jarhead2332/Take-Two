const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

// Best-effort sortable key from a schedule row like { week: "Jul 6–7", day: "mon" }.
// Returns a comparable number; unparseable weeks sort to the end.
export function scheduleSortKey(row) {
  const match = /([A-Za-z]{3})\w*\s+(\d{1,2})/.exec(row.week || '');
  if (!match) return Number.MAX_SAFE_INTEGER;
  const month = MONTHS[match[1].toLowerCase()];
  if (month == null) return Number.MAX_SAFE_INTEGER;
  const dayOfMonth = parseInt(match[2], 10);
  const dayOffset = row.day === 'tue' ? 1 : 0;
  // Assume current-ish production year; only relative order matters.
  return month * 100 + dayOfMonth + dayOffset * 0.1;
}

export function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1;
}
