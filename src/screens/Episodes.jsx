import React from 'react';
import { ChevronRight } from 'lucide-react';
import { COLORS } from '../data/constants.js';
import { TopBar, StatusBadge } from '../components/ui.jsx';

export default function Episodes({ episodes, onOpen }) {
  const sorted = [...episodes].sort((a, b) => a.order - b.order || a.num - b.num);

  return (
    <div>
      <TopBar eyebrow={`${episodes.length} episodes`} title="Episodes" subtitle="Sorted by cut order" />

      <div className="space-y-2.5">
        {sorted.map((ep) => {
          const doneCount = ep.subjects.filter((s) => s.done).length;
          return (
            <button
              key={ep.num}
              onClick={() => onOpen(ep.num)}
              className="w-full flex items-stretch text-left rounded-[12px] overflow-hidden bg-white"
              style={{ border: `0.5px solid ${COLORS.border}` }}
            >
              <span style={{ width: 5, backgroundColor: ep.colorHex, flexShrink: 0 }} />
              <div className="flex-1 min-w-0 px-3.5 py-3">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: ep.colorHex }}>
                    Episode {ep.num} · Cut #{ep.order}
                  </span>
                  <StatusBadge status={ep.status} />
                </div>
                <div className="text-[15px] font-semibold truncate" style={{ color: COLORS.ink }}>
                  {ep.title}
                </div>
                <div className="text-[12px] mt-0.5 truncate" style={{ color: COLORS.muted }}>
                  {ep.focus}
                </div>
                <div className="text-[11px] mt-1.5" style={{ color: COLORS.muted }}>
                  {doneCount}/{ep.subjects.length} interviews
                </div>
              </div>
              <span className="flex items-center pr-2" style={{ color: COLORS.muted }}>
                <ChevronRight size={18} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
