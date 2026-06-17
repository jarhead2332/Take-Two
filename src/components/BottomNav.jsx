import React from 'react';
import { Film, Camera, LayoutDashboard, CalendarRange, HelpCircle } from 'lucide-react';
import { COLORS } from '../data/constants.js';

// 5-tab bar; the center Dashboard tab is a raised red button.
const TABS = [
  { id: 'episodes', label: 'Episodes', icon: Film },
  { id: 'footage', label: 'Footage', icon: Camera },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, center: true },
  { id: 'schedule', label: 'Schedule', icon: CalendarRange },
  { id: 'questions', label: 'Questions', icon: HelpCircle },
];

export default function BottomNav({ current, onSelect }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40"
      style={{
        backgroundColor: COLORS.navy,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="relative mx-auto flex max-w-2xl items-end justify-around" style={{ height: 76 }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = current === tab.id;

          if (tab.center) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelect(tab.id)}
                aria-label={tab.label}
                className="relative flex flex-col items-center justify-center"
                style={{ width: 72, height: '100%' }}
              >
                <span
                  className="flex items-center justify-center"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 14,
                    backgroundColor: COLORS.red,
                    color: '#fff',
                    position: 'absolute',
                    top: -16,
                    boxShadow: '0 8px 18px rgba(230,57,70,0.5)',
                  }}
                >
                  <Icon size={26} strokeWidth={2.2} />
                </span>
                <span
                  className="text-[10px] font-semibold"
                  style={{ marginTop: 40, color: active ? COLORS.red : '#6b7280' }}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              aria-label={tab.label}
              className="flex flex-1 flex-col items-center justify-center gap-1"
              style={{ height: '100%', color: active ? COLORS.red : '#6b7280' }}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
