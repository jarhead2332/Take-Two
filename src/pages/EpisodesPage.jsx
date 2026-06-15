import React, { useEffect, useRef } from 'react';
import { Circle, CheckCircle2, Plus, X } from 'lucide-react';
import { COLORS, STATUS_OPTIONS, STATUS_META } from '../theme.js';
import { Select, TextInput } from '../components/ui.jsx';

export default function EpisodesPage({ episodes, setEpisodes, focusNum, onFocusHandled }) {
  const refs = useRef({});

  // Scroll to a specific episode when opened from the dashboard.
  useEffect(() => {
    if (focusNum != null && refs.current[focusNum]) {
      refs.current[focusNum].scrollIntoView({ behavior: 'smooth', block: 'start' });
      onFocusHandled?.();
    }
  }, [focusNum, onFocusHandled]);

  const updateEpisode = (num, patch) =>
    setEpisodes((eps) => eps.map((e) => (e.num === num ? { ...e, ...patch } : e)));

  const toggleSubject = (num, idx) =>
    setEpisodes((eps) =>
      eps.map((e) =>
        e.num === num
          ? { ...e, subjects: e.subjects.map((s, i) => (i === idx ? { ...s, done: !s.done } : s)) }
          : e,
      ),
    );

  const addSubject = (num, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setEpisodes((eps) =>
      eps.map((e) =>
        e.num === num ? { ...e, subjects: [...e.subjects, { name: trimmed, done: false }] } : e,
      ),
    );
  };

  const removeSubject = (num, idx) =>
    setEpisodes((eps) =>
      eps.map((e) =>
        e.num === num ? { ...e, subjects: e.subjects.filter((_, i) => i !== idx) } : e,
      ),
    );

  const sorted = [...episodes].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>
        Episodes
      </h1>
      <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>
        Sorted by completion order — rough cuts can start as soon as an episode's interviews wrap.
      </p>

      <div className="space-y-4">
        {sorted.map((ep) => (
          <div
            key={ep.num}
            ref={(el) => (refs.current[ep.num] = el)}
            className="rounded-xl border p-5 scroll-mt-4"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <div className="text-xs font-mono tracking-widest uppercase mb-0.5" style={{ color: COLORS.gold }}>
                  Episode {ep.num} · Cut order #{ep.order}
                </div>
                <h3 className="text-lg font-bold" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>
                  {ep.title}
                </h3>
                <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>
                  {ep.focus}
                </p>
              </div>

              {/* Status dropdown */}
              <Select value={ep.status} onChange={(e) => updateEpisode(ep.num, { status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Interview subjects */}
            <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: COLORS.inkSoft }}>
              Interview subjects
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {ep.subjects.map((s, idx) => (
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
                    onClick={() => toggleSubject(ep.num, idx)}
                    className="inline-flex items-center gap-1.5"
                    title={s.done ? 'Mark not interviewed' : 'Mark interviewed'}
                  >
                    {s.done ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                    {s.name}
                  </button>
                  <button
                    onClick={() => removeSubject(ep.num, idx)}
                    className="ml-0.5 opacity-50 hover:opacity-100"
                    title="Remove subject"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <AddSubject onAdd={(name) => addSubject(ep.num, name)} />

            {/* Notes */}
            <div className="text-xs font-semibold uppercase tracking-wide mb-2 mt-4" style={{ color: COLORS.inkSoft }}>
              Notes
            </div>
            <textarea
              value={ep.notes || ''}
              onChange={(e) => updateEpisode(ep.num, { notes: e.target.value })}
              placeholder="Loose observations, follow-ups, story threads…"
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[#1C1A17] resize-y"
              style={{ backgroundColor: '#FFFDF9', borderColor: COLORS.border, color: COLORS.ink }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AddSubject({ onAdd }) {
  const [name, setName] = React.useState('');
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
