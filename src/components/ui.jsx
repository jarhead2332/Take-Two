import React from 'react';
import { Plus } from 'lucide-react';
import { COLORS, STATUS_META } from '../theme.js';

// Page title row with an optional circular "+" action button on the right.
export function PageTitle({ title, subtitle, onAdd, addLabel = 'Add' }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-6">
      <div className="min-w-0">
        <h1
          className="text-2xl sm:text-3xl font-bold"
          style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>
            {subtitle}
          </p>
        )}
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          aria-label={addLabel}
          className="shrink-0 flex items-center justify-center rounded-full shadow-md transition-transform active:scale-95"
          style={{ width: 40, height: 40, backgroundColor: COLORS.red, color: '#FFFFFF' }}
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META['standing-by'];
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${meta.color}22`, color: meta.color }}
    >
      <Icon size={12} strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

export function PageHeader({ kicker, title, subtitle }) {
  return (
    <header className="mb-6">
      {kicker && (
        <div
          className="text-xs font-mono tracking-widest uppercase mb-1"
          style={{ color: COLORS.gold }}
        >
          {kicker}
        </div>
      )}
      <h1
        className="text-2xl sm:text-3xl font-bold"
        style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}

// Shared text input that matches the paper-card aesthetic.
export const TextInput = React.forwardRef(function TextInput({ className = '', ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[#1C1A17] ${className}`}
      style={{ backgroundColor: '#FFFDF9', borderColor: COLORS.border, color: COLORS.ink }}
    />
  );
});

export function Select({ className = '', children, ...props }) {
  return (
    <select
      {...props}
      className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[#1C1A17] ${className}`}
      style={{ backgroundColor: '#FFFDF9', borderColor: COLORS.border, color: COLORS.ink }}
    >
      {children}
    </select>
  );
}

export function Button({ variant = 'solid', className = '', children, ...props }) {
  const styles =
    variant === 'solid'
      ? { backgroundColor: COLORS.ink, color: COLORS.card, borderColor: COLORS.ink }
      : { backgroundColor: 'transparent', color: COLORS.inkSoft, borderColor: COLORS.border };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={styles}
    >
      {children}
    </button>
  );
}
