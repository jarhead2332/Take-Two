import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { COLORS } from '../data/constants.js';
import { TopBar, SectionLabel } from '../components/ui.jsx';
import { parseDate, formatRange } from '../data/dates.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function Schedule({ schedule, setSchedule, episodes }) {
  // Default to the month of the earliest scheduled task.
  const earliest = schedule.length
    ? new Date(Math.min(...schedule.map((t) => parseDate(t.start))))
    : new Date();
  const [view, setView] = useState({ year: earliest.getFullYear(), month: earliest.getMonth() });
  const [selected, setSelected] = useState(null); // Date or null

  const today = new Date();

  const colorOf = (task) => {
    if (task.episode) return episodes.find((e) => e.num === task.episode)?.colorHex || COLORS.muted;
    return task.colorHex || COLORS.muted;
  };

  // Tasks whose [start, end] range covers a given day.
  const tasksOnDay = (date) =>
    schedule.filter((t) => {
      const s = parseDate(t.start);
      const e = parseDate(t.end);
      return date >= s && date <= e;
    });

  const toggleDone = (id) =>
    setSchedule((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const changeMonth = (delta) => {
    setSelected(null);
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const firstWeekday = new Date(view.year, view.month, 1).getDay();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedTasks = selected ? tasksOnDay(selected) : [];

  return (
    <div>
      <TopBar
        eyebrow="Timeline"
        title="Schedule"
        subtitle="Mondays & Tuesdays, July 6–28 · All sessions at Rhoads House"
      />

      {/* Month switcher */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => changeMonth(-1)} aria-label="Previous month" className="p-2" style={{ color: COLORS.red }}>
          <ChevronLeft size={22} />
        </button>
        <div className="text-[17px] font-semibold" style={{ color: COLORS.ink }}>
          {MONTH_NAMES[view.month]} {view.year}
        </div>
        <button onClick={() => changeMonth(1)} aria-label="Next month" className="p-2" style={{ color: COLORS.red }}>
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Calendar card */}
      <div className="rounded-[12px] overflow-hidden" style={{ border: `0.5px solid ${COLORS.border}` }}>
        {/* Weekday header */}
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((w, i) => (
            <div key={i} className="text-center text-[11px] font-medium py-2" style={{ color: COLORS.muted }}>
              {w}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            if (d == null) {
              return <div key={i} style={{ borderTop: `0.5px solid ${COLORS.border}`, minHeight: 56 }} />;
            }
            const date = new Date(view.year, view.month, d);
            const isWeekend = i % 7 === 0 || i % 7 === 6;
            const isToday = sameDay(date, today);
            const isSelected = selected && sameDay(date, selected);
            const tasks = tasksOnDay(date);
            const dots = tasks.slice(0, 3);

            return (
              <button
                key={i}
                onClick={() => setSelected(isSelected ? null : date)}
                className="flex flex-col items-center pt-2"
                style={{ borderTop: `0.5px solid ${COLORS.border}`, minHeight: 56 }}
              >
                <span
                  className="flex items-center justify-center text-[16px]"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '9999px',
                    backgroundColor: isSelected ? COLORS.red : 'transparent',
                    color: isSelected
                      ? '#fff'
                      : isToday
                        ? COLORS.red
                        : isWeekend
                          ? COLORS.muted
                          : COLORS.ink,
                    fontWeight: isToday || isSelected ? 600 : 400,
                  }}
                >
                  {d}
                </span>
                <span className="flex items-center gap-0.5 mt-0.5" style={{ height: 6 }}>
                  {dots.map((t, di) => (
                    <span
                      key={di}
                      style={{
                        width: 5, height: 5, borderRadius: '9999px',
                        backgroundColor: isSelected ? '#fff' : colorOf(t),
                        opacity: t.done ? 0.4 : 1,
                      }}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day detail (expands below) */}
      {selected && (
        <div className="mt-4">
          <SectionLabel>
            {WEEKDAYS_FULL[selected.getDay()]}, {MONTH_NAMES[selected.getMonth()]} {selected.getDate()}
          </SectionLabel>
          {selectedTasks.length === 0 ? (
            <div
              className="rounded-[10px] px-3 py-4 text-[13px] text-center"
              style={{ border: `0.5px solid ${COLORS.border}`, color: COLORS.muted }}
            >
              Nothing scheduled this day.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-[10px] px-3 py-2.5"
                  style={{ border: `0.5px solid ${COLORS.border}` }}
                >
                  <span style={{ width: 5, height: 34, borderRadius: 3, backgroundColor: colorOf(t), flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[14px] font-medium"
                      style={{ color: t.done ? COLORS.muted : COLORS.ink, textDecoration: t.done ? 'line-through' : 'none' }}
                    >
                      {t.label}
                    </div>
                    <div className="text-[11px]" style={{ color: COLORS.muted }}>
                      {t.section} · {formatRange(t.start, t.end)}{t.episode ? ` · Ep ${t.episode}` : ''}
                    </div>
                  </div>
                  {t.section === 'Interviews' && (
                    <button onClick={() => toggleDone(t.id)} aria-label="Toggle done" style={{ color: t.done ? '#16a34a' : COLORS.muted }}>
                      {t.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const WEEKDAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
