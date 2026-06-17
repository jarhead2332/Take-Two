// Shared design tokens and lookups.

export const COLORS = {
  white: '#ffffff',
  navy: '#1a1a2e', // bottom nav
  red: '#e63946', // primary accent
  ink: '#111111',
  muted: '#6b7280',
  border: '#e5e7eb',
  statBg: '#f9fafb',
  alertBg: '#fff5f5',
  alertBorder: '#fecaca',
};

// StudioBinder-style episode palette (assignable per episode).
export const EPISODE_PALETTE = [
  '#e63946', // red
  '#7c3aed', // purple
  '#2563eb', // blue
  '#0d9488', // teal
  '#16a34a', // green
  '#d97706', // amber
  '#ea580c', // orange
  '#db2777', // pink
];

export const STATUS_META = {
  'standing-by': { label: 'Standing by', bg: '#f3f4f6', color: '#6b7280' },
  'in-progress': { label: 'Filming', bg: '#ede9fe', color: '#6d28d9' },
  editing: { label: 'Editing', bg: '#fef3c7', color: '#b45309' },
  done: { label: 'Done', bg: '#dcfce7', color: '#16a34a' },
};

export const STATUS_ORDER = ['standing-by', 'in-progress', 'editing', 'done'];

export const FOOTAGE_CATEGORIES = [
  'Set construction',
  'Choreography',
  'Costumes',
  'AV / Booth',
  'Advertising',
  'Other',
];
