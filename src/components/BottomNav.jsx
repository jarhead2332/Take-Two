import React from 'react';
import { COLORS } from '../theme.js';

// Persistent bottom tab bar — primary navigation, visible on every page.
export default function BottomNav({ items, current, onSelect }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t"
      style={{
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
        boxShadow: '0 -2px 12px rgba(28,26,23,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="mx-auto flex max-w-2xl">
        {items.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
              style={{ color: active ? COLORS.red : COLORS.inkSoft }}
            >
              {/* active indicator */}
              <span
                aria-hidden="true"
                className="absolute top-0 h-0.5 rounded-full transition-all"
                style={{
                  width: active ? 24 : 0,
                  backgroundColor: COLORS.red,
                  opacity: active ? 1 : 0,
                }}
              />
              <Icon size={21} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[10px] font-medium leading-none">{item.short}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
