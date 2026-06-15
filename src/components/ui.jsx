import React from 'react';
import { ChevronRight } from 'lucide-react';
import { COLORS, STATUS_META } from '../theme.js';

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
export function TextInput({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[#1C1A17] ${className}`}
      style={{ backgroundColor: '#FFFDF9', borderColor: COLORS.border, color: COLORS.ink }}
    />
  );
}

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

export function ReelCard({ ep, onClick }) {
  const doneCount = ep.subjects.filter((s) => s.done).length;
  const total = ep.subjects.length || 1;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <button
      onClick={onClick}
      className="text-left w-full rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
        boxShadow: '0 2px 8px rgba(28,26,23,0.06)',
      }}
    >
      <div className="flex justify-between px-4 pt-3" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{ width: 6, height: 6, backgroundColor: COLORS.ink, opacity: 0.08 }}
          />
        ))}
      </div>

      <div className="p-5 pt-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-xs font-mono tracking-widest uppercase" style={{ color: COLORS.gold }}>
              Episode {ep.num}
            </div>
            <h3
              className="text-xl font-bold leading-tight mt-0.5"
              style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}
            >
              {ep.title}
            </h3>
          </div>
          <ChevronRight size={20} style={{ color: COLORS.inkSoft }} />
        </div>

        <p className="text-sm mb-4" style={{ color: COLORS.inkSoft }}>
          {ep.focus}
        </p>

        <div className="flex items-center justify-between mb-2">
          <StatusBadge status={ep.status} />
          <span className="text-xs font-mono" style={{ color: COLORS.inkSoft }}>
            {doneCount}/{ep.subjects.length} interviews
          </span>
        </div>

        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: COLORS.red }}
          />
        </div>
      </div>
    </button>
  );
}
