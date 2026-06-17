import React from 'react';
import { COLORS, STATUS_META } from '../data/constants.js';

// Page top bar: small red eyebrow, title, optional subtitle + right-side badge.
export function TopBar({ eyebrow, title, subtitle, badge, accent = COLORS.red }) {
  return (
    <div className="pt-1 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && (
            <div
              className="text-[11px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: accent }}
            >
              {eyebrow}
            </div>
          )}
          <h1 className="text-[22px] font-semibold leading-tight" style={{ color: COLORS.ink }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-[12px] mt-0.5" style={{ color: COLORS.muted }}>
              {subtitle}
            </p>
          )}
        </div>
        {badge && (
          <span
            className="shrink-0 mt-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full"
            style={{ backgroundColor: '#f3f4f6', color: COLORS.muted }}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

export function SectionLabel({ children, className = '' }) {
  return (
    <div
      className={`text-[11px] font-semibold uppercase tracking-wide mb-2 ${className}`}
      style={{ color: COLORS.muted }}
    >
      {children}
    </div>
  );
}

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META['standing-by'];
  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
}

export const TextInput = React.forwardRef(function TextInput({ className = '', ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={`rounded-[10px] border px-3 text-[14px] outline-none focus:border-gray-400 ${className}`}
      style={{ borderColor: COLORS.border, color: COLORS.ink, height: 44, borderWidth: 0.5 }}
    />
  );
});

export function Select({ className = '', children, ...props }) {
  return (
    <select
      {...props}
      className={`rounded-[10px] border px-3 text-[14px] outline-none focus:border-gray-400 bg-white ${className}`}
      style={{ borderColor: COLORS.border, color: COLORS.ink, height: 44, borderWidth: 0.5 }}
    >
      {children}
    </select>
  );
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={`rounded-[10px] border px-3 py-2 text-[14px] outline-none focus:border-gray-400 resize-y ${className}`}
      style={{ borderColor: COLORS.border, color: COLORS.ink, borderWidth: 0.5 }}
    />
  );
}
