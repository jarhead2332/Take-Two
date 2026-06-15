import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { COLORS } from '../theme.js';
import { Button, Select, TextInput } from '../components/ui.jsx';
import { nextId, scheduleSortKey } from '../utils.js';

const EMPTY = { week: '', day: 'mon', people: '', tag: '', episode: '' };

export default function SchedulePage({ schedule, setSchedule }) {
  const [form, setForm] = useState(EMPTY);

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
  };

  // Group by week, weeks ordered by date.
  const weeks = [];
  const byWeek = new Map();
  [...schedule]
    .sort((a, b) => scheduleSortKey(a) - scheduleSortKey(b))
    .forEach((s) => {
      if (!byWeek.has(s.week)) {
        byWeek.set(s.week, []);
        weeks.push(s.week);
      }
      byWeek.get(s.week).push(s);
    });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>
        Interview Schedule
      </h1>
      <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>
        Mondays &amp; Tuesdays, July 6–28, all sessions at Jared's house.
      </p>

      <div className="space-y-3 mb-8">
        {weeks.map((week) => (
          <div key={week} className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
            <div
              className="px-4 py-2 text-xs font-mono tracking-widest uppercase"
              style={{ backgroundColor: COLORS.ink, color: COLORS.card }}
            >
              Week of {week}
            </div>
            <div className="divide-y" style={{ borderColor: COLORS.border }}>
              {byWeek.get(week).map((s) => (
                <SessionRow
                  key={s.id}
                  session={s}
                  onUpdate={(patch) => updateSession(s.id, patch)}
                  onDelete={() => deleteSession(s.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add session */}
      <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: COLORS.inkSoft }}>
        Add a session
      </h2>
      <form
        onSubmit={addSession}
        className="rounded-xl border p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 items-end"
        style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
      >
        <Field label="Week">
          <TextInput
            value={form.week}
            onChange={(e) => setForm({ ...form, week: e.target.value })}
            placeholder="Aug 3–4"
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
    </div>
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

function SessionRow({ session, onUpdate, onDelete }) {
  return (
    <div
      className="p-4 flex flex-col sm:flex-row sm:items-center gap-3"
      style={{ backgroundColor: COLORS.card, opacity: session.done ? 0.6 : 1 }}
    >
      <button
        onClick={() => onUpdate({ done: !session.done })}
        className="shrink-0 self-start"
        style={{ color: session.done ? COLORS.green : COLORS.inkSoft }}
        title={session.done ? 'Mark not done' : 'Mark done'}
      >
        {session.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>

      <div className="text-xs font-semibold uppercase shrink-0 w-16" style={{ color: COLORS.gold }}>
        {session.day === 'tue' ? 'Tuesday' : 'Monday'}
      </div>

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
