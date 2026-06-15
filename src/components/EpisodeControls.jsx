import React, { useState } from 'react';
import { Circle, CheckCircle2, Plus, X } from 'lucide-react';
import { COLORS, STATUS_OPTIONS, STATUS_META } from '../theme.js';
import { Select, TextInput } from './ui.jsx';

// Shared editor for a single episode's status, interview subjects, and notes.
// Used both on the Episodes page and inside the Dashboard's expandable cards,
// so edits stay consistent wherever they're made.
export default function EpisodeControls({ episode, setEpisodes }) {
  const num = episode.num;

  const update = (patch) =>
    setEpisodes((eps) => eps.map((e) => (e.num === num ? { ...e, ...patch } : e)));

  const toggleSubject = (idx) =>
    setEpisodes((eps) =>
      eps.map((e) =>
        e.num === num
          ? { ...e, subjects: e.subjects.map((s, i) => (i === idx ? { ...s, done: !s.done } : s)) }
          : e,
      ),
    );

  const addSubject = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setEpisodes((eps) =>
      eps.map((e) =>
        e.num === num ? { ...e, subjects: [...e.subjects, { name: trimmed, done: false }] } : e,
      ),
    );
  };

  const removeSubject = (idx) =>
    setEpisodes((eps) =>
      eps.map((e) =>
        e.num === num ? { ...e, subjects: e.subjects.filter((_, i) => i !== idx) } : e,
      ),
    );

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>
          Status
        </div>
        <Select value={episode.status} onChange={(e) => update({ status: e.target.value })}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </Select>
      </div>

      <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: COLORS.inkSoft }}>
        Interview subjects
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {episode.subjects.map((s, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 text-xs pl-2.5 pr-1.5 py-1 rounded-full border"
            style={{
              borderColor: COLORS.border,
              color: s.done ? COLORS.green : COLORS.inkSoft,
              backgroundColor: s.done ? '#8A9B7E11' : 'transparent',
            }}
          >
            <button
              onClick={() => toggleSubject(idx)}
              className="inline-flex items-center gap-1.5"
              title={s.done ? 'Mark not interviewed' : 'Mark interviewed'}
            >
              {s.done ? <CheckCircle2 size={12} /> : <Circle size={12} />}
              {s.name}
            </button>
            <button
              onClick={() => removeSubject(idx)}
              className="ml-0.5 opacity-50 hover:opacity-100"
              title="Remove subject"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      <AddSubject onAdd={addSubject} />

      <div className="text-xs font-semibold uppercase tracking-wide mb-2 mt-4" style={{ color: COLORS.inkSoft }}>
        Notes
      </div>
      <textarea
        value={episode.notes || ''}
        onChange={(e) => update({ notes: e.target.value })}
        placeholder="Loose observations, follow-ups, story threads…"
        rows={2}
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[#1C1A17] resize-y"
        style={{ backgroundColor: '#FFFDF9', borderColor: COLORS.border, color: COLORS.ink }}
      />
    </div>
  );
}

function AddSubject({ onAdd }) {
  const [name, setName] = useState('');
  const submit = (e) => {
    e.preventDefault();
    onAdd(name);
    setName('');
  };
  return (
    <form onSubmit={submit} className="flex gap-2">
      <TextInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add subject…"
        className="flex-1 max-w-xs"
      />
      <button
        type="submit"
        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-2 rounded-lg border transition-colors"
        style={{ borderColor: COLORS.border, color: COLORS.inkSoft }}
      >
        <Plus size={14} /> Add
      </button>
    </form>
  );
}
