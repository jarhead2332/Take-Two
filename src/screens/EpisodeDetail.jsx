import React from 'react';
import { ChevronLeft, Circle, CheckCircle2 } from 'lucide-react';
import { COLORS, EPISODE_PALETTE, STATUS_ORDER, STATUS_META } from '../data/constants.js';
import { SectionLabel, Select, Textarea } from '../components/ui.jsx';

export default function EpisodeDetail({ episode, setEpisodes, onBack }) {
  const update = (patch) =>
    setEpisodes((eps) => eps.map((e) => (e.num === episode.num ? { ...e, ...patch } : e)));

  const toggleSubject = (idx) =>
    setEpisodes((eps) =>
      eps.map((e) =>
        e.num === episode.num
          ? { ...e, subjects: e.subjects.map((s, i) => (i === idx ? { ...s, done: !s.done } : s)) }
          : e,
      ),
    );

  const doneCount = episode.subjects.filter((s) => s.done).length;
  const pct = Math.round((doneCount / (episode.subjects.length || 1)) * 100);

  return (
    <div>
      {/* Color accent header */}
      <div style={{ height: 4, backgroundColor: episode.colorHex, borderRadius: 2 }} className="mb-3" />

      <button onClick={onBack} className="flex items-center gap-1 mb-3 text-[14px] font-medium" style={{ color: COLORS.muted }}>
        <ChevronLeft size={18} /> Episodes
      </button>

      <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: episode.colorHex }}>
        Episode {episode.num} · Cut #{episode.order}
      </div>
      <h1 className="text-[22px] font-semibold leading-tight" style={{ color: COLORS.ink }}>
        {episode.title}
      </h1>
      <p className="text-[13px] mt-1 mb-5" style={{ color: COLORS.muted }}>{episode.focus}</p>

      {/* Status */}
      <SectionLabel>Status</SectionLabel>
      <Select value={episode.status} onChange={(e) => update({ status: e.target.value })} className="w-full mb-5">
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>{STATUS_META[s].label}</option>
        ))}
      </Select>

      {/* Color picker */}
      <SectionLabel>Color</SectionLabel>
      <div className="flex flex-wrap gap-2.5 mb-5">
        {EPISODE_PALETTE.map((c) => {
          const selected = episode.colorHex.toLowerCase() === c.toLowerCase();
          return (
            <button
              key={c}
              onClick={() => update({ colorHex: c })}
              aria-label={`Set color ${c}`}
              style={{
                width: 32, height: 32, borderRadius: 9, backgroundColor: c,
                outline: selected ? `2px solid ${COLORS.ink}` : 'none',
                outlineOffset: 2,
              }}
            />
          );
        })}
      </div>

      {/* Subjects */}
      <div className="flex items-center justify-between mb-2">
        <SectionLabel className="mb-0">Interview subjects</SectionLabel>
        <span className="text-[11px]" style={{ color: COLORS.muted }}>{doneCount}/{episode.subjects.length}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ backgroundColor: COLORS.border }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: episode.colorHex }} />
      </div>
      <div className="space-y-2 mb-5">
        {episode.subjects.map((s, idx) => (
          <button
            key={idx}
            onClick={() => toggleSubject(idx)}
            className="w-full flex items-center gap-3 rounded-[10px] px-3 text-left"
            style={{ minHeight: 44, border: `0.5px solid ${COLORS.border}` }}
          >
            {s.done
              ? <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
              : <Circle size={18} style={{ color: COLORS.muted }} />}
            <span
              className="text-[14px]"
              style={{ color: s.done ? COLORS.muted : COLORS.ink, textDecoration: s.done ? 'line-through' : 'none' }}
            >
              {s.name}
            </span>
          </button>
        ))}
      </div>

      {/* Notes */}
      <SectionLabel>Notes</SectionLabel>
      <Textarea
        defaultValue={episode.notes || ''}
        onBlur={(e) => update({ notes: e.target.value })}
        placeholder="Loose observations, follow-ups, story threads…"
        rows={4}
        className="w-full"
      />
    </div>
  );
}
