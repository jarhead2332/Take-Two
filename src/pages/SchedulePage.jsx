import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, CalendarDays } from 'lucide-react';
import { COLORS } from '../theme.js';
import { Button, Select, TextInput, PageTitle } from '../components/ui.jsx';
import { nextId, scheduleSortKey } from '../utils.js';

const EMPTY = { week: '', day: 'mon', people: '', tag: '', episode: '' };

// The production timeline lives in 2026 (Jul 6 = Monday, etc.).
const YEAR = 2026;
const MONTH_ABBR = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Resolve a session's calendar date from its week label + day.
function sessionDate(s) {
  const m = /([A-Za-z]{3})\w*\s+(\d{1,2})/.exec(s.week || '');
  if (!m) return null;
  const month = MONTH_ABBR[m[1].toLowerCase()];
  if (month == null) return null;
  let day = parseInt(m[2], 10);
  if (s.day === 'tue') day += 1;
  return { month, day };
}

const dayKey = (month, day) => `${month}-${day}`;

export default function SchedulePage({ schedule, setSchedule }) {
  const [form, setForm] = useState(EMPTY);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);

  const updateSession = (id, patch) =>
    setSchedule((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const deleteSession = (id) => setSchedule((list) => list.filter((s) => s.id !== id));

  const addSession = (e) => {
    e.preventDefault();
    if (!form.week.trim() || !form.people.trim()) return;
    setSchedule((list) => [
      ...list,
      {
        id: nextId(list),
        week: form.week.trim(),
        day: form.day,
        people: form.people.trim(),
        tag: form.tag.trim(),
        episode: form.episode === '' ? null : Number(form.episode),
        done: false,
      },
    ]);
    setForm(EMPTY);
    setShowAdd(false);
  };

  // Map sessions onto calendar days and group the months in play.
  const byDay = new Map();
  const monthsSet = new Set();
  const undated = [];
  schedule.forEach((s) => {
    const d = sessionDate(s);
    if (!d) {
      undated.push(s);
      return;
    }
    monthsSet.add(d.month);
    const k = dayKey(d.month, d.day);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k).push(s);
  });
  const months = [...monthsSet].sort((a, b) => a - b);

  // Default selection: first not-done session by date, else first session.
  let defaultKey = null;
  const ordered = [...schedule]
    .filter((s) => sessionDate(s))
    .sort((a, b) => scheduleSortKey(a) - scheduleSortKey(b));
  const firstUndone = ordered.find((s) => !s.done) || ordered[0];
  if (firstUndone) {
    const d = sessionDate(firstUndone);
    defaultKey = dayKey(d.month, d.day);
  }
  const activeKey = selectedKey || defaultKey;
  const selectedSessions = activeKey ? byDay.get(activeKey) || [] : [];

  return (
    <div>
      <PageTitle
        title="Interview Schedule"
        subtitle="Mondays & Tuesdays, July 6–28, all sessions at Jared's house."
        onAdd={() => setShowAdd((s) => !s)}
        addLabel="Add session"
      />

      {showAdd && <AddForm form={form} setForm={setForm} onSubmit={addSession} />}

      {months.map((month) => (
        <MonthCalendar
          key={month}
          month={month}
          byDay={byDay}
          activeKey={activeKey}
          onSelectDay={setSelectedKey}
        />
      ))}

      {/* Selected day detail */}
      {activeKey && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays size={16} style={{ color: COLORS.gold }} />
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>
              {keyToLabel(activeKey)}
            </h2>
          </div>
          {selectedSessions.length === 0 ? (
            <div
              className="rounded-xl border p-5 text-sm text-center"
              style={{ backgroundColor: COLORS.card, borderColor: COLORS.border, color: COLORS.inkSoft }}
            >
              No sessions this day. Tap a highlighted date, or use + to add one.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedSessions.map((s) => (
                <SessionCard
                  key={s.id}
                  session={s}
                  onUpdate={(patch) => updateSession(s.id, patch)}
                  onDelete={() => deleteSession(s.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sessions without a parseable date */}
      {undated.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: COLORS.inkSoft }}>
            Unscheduled
          </h2>
          <div className="space-y-2">
            {undated.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                onUpdate={(patch) => updateSession(s.id, patch)}
                onDelete={() => deleteSession(s.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function keyToLabel(key) {
  const [month, day] = key.split('-').map(Number);
  const date = new Date(YEAR, month, day);
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
  return `${weekday}, ${MONTH_NAMES[month]} ${day}`;
}

function MonthCalendar({ month, byDay, activeKey, onSelectDay }) {
  const firstWeekday = new Date(YEAR, month, 1).getDay();
  const daysInMonth = new Date(YEAR, month + 1, 0).getDate();
  const today = new Date();
  const isThisMonth = today.getFullYear() === YEAR && today.getMonth() === month;

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="rounded-2xl border overflow-hidden mb-4" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
      <div
        className="px-4 py-2.5 text-sm font-bold"
        style={{ backgroundColor: COLORS.ink, color: COLORS.card, fontFamily: 'Georgia, serif' }}
      >
        {MONTH_NAMES[month]} {YEAR}
      </div>

      <div className="grid grid-cols-7 text-center py-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        {WEEKDAY_LETTERS.map((w, i) => (
          <div key={i} className="text-[11px] font-semibold" style={{ color: COLORS.inkSoft }}>
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (d == null) return <div key={i} style={{ borderTop: `1px solid ${COLORS.border}` }} />;
          const key = dayKey(month, d);
          const sessions = byDay.get(key) || [];
          const has = sessions.length > 0;
          const active = key === activeKey;
          const isToday = isThisMonth && today.getDate() === d;

          return (
            <button
              key={i}
              onClick={() => has && onSelectDay(key)}
              disabled={!has}
              className="min-h-[58px] p-1 text-left align-top transition-colors"
              style={{
                borderTop: `1px solid ${COLORS.border}`,
                borderLeft: i % 7 === 0 ? 'none' : `1px solid ${COLORS.border}`,
                backgroundColor: active ? '#B8935A22' : 'transparent',
                cursor: has ? 'pointer' : 'default',
              }}
            >
              <div className="flex justify-end">
                <span
                  className="inline-flex items-center justify-center text-[11px] rounded-full"
                  style={{
                    width: 18,
                    height: 18,
                    color: isToday ? COLORS.card : has ? COLORS.ink : COLORS.inkSoft,
                    backgroundColor: isToday ? COLORS.red : 'transparent',
                    fontWeight: has ? 700 : 400,
                  }}
                >
                  {d}
                </span>
              </div>
              <div className="mt-0.5 space-y-0.5">
                {sessions.slice(0, 2).map((s) => (
                  <div
                    key={s.id}
                    className="truncate rounded px-1 py-0.5 text-[9px] leading-tight"
                    style={{
                      backgroundColor: s.done ? '#8A9B7E22' : '#C9472B22',
                      color: s.done ? COLORS.green : COLORS.red,
                      textDecoration: s.done ? 'line-through' : 'none',
                    }}
                    title={s.people}
                  >
                    {s.tag || s.people}
                  </div>
                ))}
                {sessions.length > 2 && (
                  <div className="text-[9px] px-1" style={{ color: COLORS.inkSoft }}>
                    +{sessions.length - 2} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AddForm({ form, setForm, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 items-end"
      style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
    >
      <Field label="Week">
        <TextInput
          value={form.week}
          onChange={(e) => setForm({ ...form, week: e.target.value })}
          placeholder="Jul 6–7"
          className="w-full"
        />
      </Field>
      <Field label="Day">
        <Select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full">
          <option value="mon">Monday</option>
          <option value="tue">Tuesday</option>
        </Select>
      </Field>
      <Field label="People" className="lg:col-span-2">
        <TextInput
          value={form.people}
          onChange={(e) => setForm({ ...form, people: e.target.value })}
          placeholder="Who's filming"
          className="w-full"
        />
      </Field>
      <Field label="Tag">
        <TextInput
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
          placeholder="Dept."
          className="w-full"
        />
      </Field>
      <div className="flex gap-2">
        <Select
          value={form.episode}
          onChange={(e) => setForm({ ...form, episode: e.target.value })}
          className="flex-1"
        >
          <option value="">No ep.</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              Ep {n}
            </option>
          ))}
        </Select>
        <Button type="submit" title="Add session">
          <Plus size={16} />
        </Button>
      </div>
    </form>
  );
}

function Field({ label, className = '', children }) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: COLORS.inkSoft }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function SessionCard({ session, onUpdate, onDelete }) {
  return (
    <div
      className="rounded-xl border p-3 flex flex-col sm:flex-row sm:items-center gap-3"
      style={{ backgroundColor: COLORS.card, borderColor: COLORS.border, opacity: session.done ? 0.6 : 1 }}
    >
      <button
        onClick={() => onUpdate({ done: !session.done })}
        className="shrink-0 self-start"
        style={{ color: session.done ? COLORS.green : COLORS.inkSoft }}
        title={session.done ? 'Mark not done' : 'Mark done'}
      >
        {session.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <TextInput
          value={session.people}
          onChange={(e) => onUpdate({ people: e.target.value })}
          placeholder="People"
          className="w-full"
        />
        <TextInput
          value={session.tag}
          onChange={(e) => onUpdate({ tag: e.target.value })}
          placeholder="Tag / department"
          className="w-full"
        />
        <Select
          value={session.episode ?? ''}
          onChange={(e) => onUpdate({ episode: e.target.value === '' ? null : Number(e.target.value) })}
          className="w-full"
        >
          <option value="">No episode</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              Episode {n}
            </option>
          ))}
        </Select>
      </div>

      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg transition-colors hover:bg-black/5 self-start sm:self-center shrink-0"
        style={{ color: COLORS.inkSoft }}
        title="Delete session"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
