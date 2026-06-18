import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Plus, Trash2, X } from 'lucide-react';
import { COLORS } from '../data/constants.js';
import { TopBar, SectionLabel, TextInput, Select } from '../components/ui.jsx';
import { parseDate, formatRange } from '../data/dates.js';
import { nextId, SCHEDULE_SECTIONS } from '../data/seed.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const pad = (n) => String(n).padStart(2, '0');
const toYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function Schedule({ schedule, setSchedule, episodes }) {
  const earliest = schedule.length
    ? new Date(Math.min(...schedule.map((t) => parseDate(t.start))))
    : new Date();
  const [view, setView] = useState({ year: earliest.getFullYear(), month: earliest.getMonth() });
  const [selected, setSelected] = useState(null); // Date or null
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(null);

  const today = new Date();

  const colorOf = (task) => {
    if (task.episode) return episodes.find((e) => e.num === task.episode)?.colorHex || COLORS.muted;
    return task.colorHex || COLORS.muted;
  };

  const tasksOnDay = (date) =>
    schedule.filter((t) => {
      const s = parseDate(t.start);
      const e = parseDate(t.end);
      return date >= s && date <= e;
    });

  const toggleDone = (id) =>
    setSchedule((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = (id) => setSchedule((list) => list.filter((t) => t.id !== id));

  const changeMonth = (delta) => {
    setSelected(null);
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const openAdd = () => {
    const base = selected || new Date(view.year, view.month, 1);
    const ymd = toYMD(base);
    setForm({ label: '', section: 'Interviews', start: ymd, end: ymd, episode: '' });
    setAdding(true);
  };

  const submitAdd = (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.start) return;
    const end = form.end && form.end >= form.start ? form.end : form.start;
    setSchedule((list) => [
      ...list,
      {
        id: nextId(list),
        section: form.section,
        label: form.label.trim(),
        start: form.start,
        end,
        episode: form.episode === '' ? null : Number(form.episode),
        done: false,
      },
    ]);
    setSelected(parseDate(form.start));
    setView({ year: parseDate(form.start).getFullYear(), month: parseDate(form.start).getMonth() });
    setAdding(false);
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
        <div className="grid grid-cols-7">
          {WEEKDAYS.map((w, i) => (
            <div key={i} className="text-center text-[11px] font-medium py-2" style={{ color: COLORS.muted }}>
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            if (d == null) {
              return <div key={i} style={{ borderTop: `0.5px solid ${COLORS.border}`, minHeight: 56 }} />;
            }
            const date = new Date(view.year, view.month, d);
            const isWeekend = i % 7 === 0 || i % 7 === 6;
            const isToday = sameDay(date, today);
            const isSelected = selected && sameDay(date, selected);
            const dots = tasksOnDay(date).slice(0, 3);

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
                    width: 30, height: 30, borderRadius: '9999px',
                    backgroundColor: isSelected ? COLORS.red : 'transparent',
                    color: isSelected ? '#fff' : isToday ? COLORS.red : isWeekend ? COLORS.muted : COLORS.ink,
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

      {/* Selected day detail */}
      {selected && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <SectionLabel className="mb-0">
              {WEEKDAYS_FULL[selected.getDay()]}, {MONTH_NAMES[selected.getMonth()]} {selected.getDate()}
            </SectionLabel>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-1 text-[12px] font-semibold"
              style={{ color: COLORS.red }}
            >
              <Plus size={15} /> Add event
            </button>
          </div>

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
                  <button onClick={() => deleteTask(t.id)} aria-label="Delete event" style={{ color: COLORS.muted }}>
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={openAdd}
        aria-label="Add event"
        className="fixed z-30 flex items-center justify-center rounded-full"
        style={{
          right: 18,
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 92px)',
          width: 52, height: 52, backgroundColor: COLORS.red, color: '#fff',
          boxShadow: '0 6px 16px rgba(230,57,70,0.45)',
        }}
      >
        <Plus size={26} />
      </button>

      {/* Add sheet */}
      {adding && form && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setAdding(false)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitAdd}
            className="w-full bg-white rounded-t-2xl p-5 space-y-3"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold" style={{ color: COLORS.ink }}>Add event</h2>
              <button type="button" onClick={() => setAdding(false)} style={{ color: COLORS.muted }}><X size={20} /></button>
            </div>

            <TextInput
              autoFocus
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="What's happening?"
              className="w-full"
            />

            <Select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="w-full">
              {SCHEDULE_SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>

            <div className="flex gap-2">
              <label className="flex-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                Start
                <input
                  type="date"
                  value={form.start}
                  onChange={(e) => setForm({ ...form, start: e.target.value })}
                  className="mt-1 w-full rounded-[10px] border px-3 text-[14px] bg-white"
                  style={{ borderColor: COLORS.border, color: COLORS.ink, height: 44, borderWidth: 0.5 }}
                />
              </label>
              <label className="flex-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                End
                <input
                  type="date"
                  value={form.end}
                  min={form.start}
                  onChange={(e) => setForm({ ...form, end: e.target.value })}
                  className="mt-1 w-full rounded-[10px] border px-3 text-[14px] bg-white"
                  style={{ borderColor: COLORS.border, color: COLORS.ink, height: 44, borderWidth: 0.5 }}
                />
              </label>
            </div>

            <Select value={form.episode} onChange={(e) => setForm({ ...form, episode: e.target.value })} className="w-full">
              <option value="">No episode (grey)</option>
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>Episode {n}</option>)}
            </Select>

            <button
              type="submit"
              className="w-full rounded-[10px] text-[15px] font-semibold text-white"
              style={{ height: 48, backgroundColor: COLORS.red }}
            >
              Add to calendar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
