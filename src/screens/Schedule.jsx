import React, { useState } from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../data/constants.js';
import { SCHEDULE_SECTIONS } from '../data/seed.js';
import { TopBar } from '../components/ui.jsx';
import { parseDate, dayDiff, formatRange } from '../data/dates.js';

const PX_PER_DAY = 6;
const LABEL_W = 92;
const ROW_H = 34;
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Schedule({ schedule, setSchedule, episodes }) {
  const [selected, setSelected] = useState(null);

  const colorOf = (task) => {
    if (task.episode) return episodes.find((e) => e.num === task.episode)?.colorHex || COLORS.muted;
    return task.colorHex || COLORS.muted;
  };

  // Timeline bounds.
  const starts = schedule.map((t) => parseDate(t.start));
  const ends = schedule.map((t) => parseDate(t.end));
  const min = new Date(Math.min(...starts));
  const max = new Date(Math.max(...ends));
  const totalDays = dayDiff(min, max) + 1;
  const trackWidth = totalDays * PX_PER_DAY;

  // Month gridlines/labels.
  const months = [];
  const cursor = new Date(min.getFullYear(), min.getMonth(), 1);
  while (cursor <= max) {
    const x = Math.max(0, dayDiff(min, cursor) * PX_PER_DAY);
    months.push({ x, label: `${MONTHS_SHORT[cursor.getMonth()]}` });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const toggleDone = (id) =>
    setSchedule((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div>
      <TopBar eyebrow="Timeline" title="Schedule" subtitle="Mondays & Tuesdays, July 6–28 · All sessions at Rhoads House" />

      <div className="overflow-x-auto -mx-1 px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div style={{ width: LABEL_W + trackWidth }}>
          {/* Month axis */}
          <div className="flex" style={{ height: 22 }}>
            <div style={{ width: LABEL_W, position: 'sticky', left: 0, background: '#fff', zIndex: 3 }} />
            <div style={{ width: trackWidth, position: 'relative' }}>
              {months.map((m, i) => (
                <div
                  key={i}
                  className="absolute text-[10px] font-semibold uppercase"
                  style={{ left: m.x + 3, top: 4, color: COLORS.muted }}
                >
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          {SCHEDULE_SECTIONS.map((section) => {
            const rows = schedule.filter((t) => t.section === section);
            if (rows.length === 0) return null;
            return (
              <div key={section}>
                {/* Section header */}
                <div style={{ backgroundColor: COLORS.navy, height: 26 }} className="flex items-center">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wide"
                    style={{ position: 'sticky', left: 0, color: '#fff', paddingLeft: 10, paddingRight: 10, backgroundColor: COLORS.navy }}
                  >
                    {section}
                  </span>
                </div>

                {rows.map((t) => {
                  const left = dayDiff(min, parseDate(t.start)) * PX_PER_DAY;
                  const span = dayDiff(parseDate(t.start), parseDate(t.end)) + 1;
                  const width = Math.max(span * PX_PER_DAY, 16);
                  const color = colorOf(t);
                  return (
                    <div key={t.id} className="flex items-center" style={{ height: ROW_H, borderBottom: `0.5px solid ${COLORS.border}` }}>
                      <div
                        style={{ width: LABEL_W, position: 'sticky', left: 0, background: '#fff', zIndex: 2 }}
                        className="flex items-center pr-2"
                      >
                        <span className="text-[11px] truncate" style={{ color: COLORS.ink }}>{t.label}</span>
                      </div>
                      <div style={{ width: trackWidth, position: 'relative', height: '100%' }}>
                        {/* month gridlines */}
                        {months.map((m, i) => (
                          <div key={i} className="absolute top-0 bottom-0" style={{ left: m.x, width: 1, backgroundColor: '#f3f4f6' }} />
                        ))}
                        <button
                          onClick={() => setSelected(t)}
                          className="absolute"
                          style={{
                            left,
                            width,
                            top: (ROW_H - 18) / 2,
                            height: 18,
                            borderRadius: 6,
                            backgroundColor: color,
                            opacity: t.done ? 0.45 : 1,
                          }}
                          aria-label={t.label}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail popover */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setSelected(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-t-2xl p-5"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: colorOf(selected) }} />
                <h2 className="text-[16px] font-semibold" style={{ color: COLORS.ink }}>{selected.label}</h2>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: COLORS.muted }}><X size={20} /></button>
            </div>
            <div className="text-[13px]" style={{ color: COLORS.muted }}>
              {selected.section} · {formatRange(selected.start, selected.end)}
              {selected.episode ? ` · Episode ${selected.episode}` : ''}
            </div>
            {selected.section === 'Interviews' && (
              <button
                onClick={() => { toggleDone(selected.id); setSelected({ ...selected, done: !selected.done }); }}
                className="mt-4 w-full rounded-[10px] text-[14px] font-semibold"
                style={{
                  height: 44,
                  border: `0.5px solid ${COLORS.border}`,
                  backgroundColor: selected.done ? '#dcfce7' : '#fff',
                  color: selected.done ? '#16a34a' : COLORS.ink,
                }}
              >
                {selected.done ? '✓ Done' : 'Mark as done'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
