import React, { useState } from 'react';
import { Camera, CalendarClock, ChevronRight, ChevronDown } from 'lucide-react';
import { COLORS } from '../theme.js';
import { StatusBadge } from '../components/ui.jsx';
import EpisodeControls from '../components/EpisodeControls.jsx';
import { scheduleSortKey } from '../utils.js';

function Stat({ value, label }) {
  return (
    <div className="rounded-xl p-4 border" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
      <div className="text-2xl font-bold" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>
        {value}
      </div>
      <div className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>
        {label}
      </div>
    </div>
  );
}

// Episode reel card that expands in place to reveal its editable details.
function EpisodeCard({ ep, setEpisodes, expanded, onToggle }) {
  const doneCount = ep.subjects.filter((s) => s.done).length;
  const total = ep.subjects.length || 1;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <div
      className="rounded-xl border transition-shadow"
      style={{
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
        boxShadow: expanded ? '0 10px 28px rgba(28,26,23,0.14)' : '0 2px 8px rgba(28,26,23,0.06)',
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="text-left w-full rounded-xl transition-transform active:scale-[0.99]"
      >
        {/* perforated top edge */}
        <div className="flex justify-between px-4 pt-3" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="block rounded-full"
              style={{ width: 6, height: 6, backgroundColor: COLORS.ink, opacity: 0.08 }}
            />
          ))}
        </div>

        <div className="p-5 pt-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-xs font-mono tracking-widest uppercase" style={{ color: COLORS.gold }}>
                Episode {ep.num}
              </div>
              <h3
                className="text-xl font-bold leading-tight mt-0.5"
                style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}
              >
                {ep.title}
              </h3>
            </div>
            <ChevronDown
              size={20}
              style={{
                color: COLORS.inkSoft,
                transition: 'transform 280ms cubic-bezier(.2,.7,.2,1)',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </div>

          <p className="text-sm mb-4" style={{ color: COLORS.inkSoft }}>
            {ep.focus}
          </p>

          <div className="flex items-center justify-between mb-2">
            <StatusBadge status={ep.status} />
            <span className="text-xs font-mono" style={{ color: COLORS.inkSoft }}>
              {doneCount}/{ep.subjects.length} interviews
            </span>
          </div>

          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: COLORS.red }}
            />
          </div>
        </div>
      </button>

      {/* Expanding detail panel — animates height via the grid-rows trick */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div
            className="px-5 pb-5 pt-1 border-t mt-1"
            style={{ borderColor: COLORS.border }}
          >
            <EpisodeControls episode={ep} setEpisodes={setEpisodes} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ episodes, setEpisodes, footage, questions, schedule, onGoto }) {
  const [expandedNum, setExpandedNum] = useState(null);

  const sorted = [...episodes].sort((a, b) => a.order - b.order);
  const captured = footage.filter((f) => f.status === 'captured').length;
  const needed = footage.filter((f) => f.status === 'needed');
  const interviewsDone = episodes.flatMap((e) => e.subjects).filter((s) => s.done).length;
  const interviewsTotal = episodes.flatMap((e) => e.subjects).length;
  const questionsLeft = questions.filter((q) => !q.done).length;

  const upNext = [...schedule]
    .filter((s) => !s.done)
    .sort((a, b) => scheduleSortKey(a) - scheduleSortKey(b))
    .slice(0, 3);

  return (
    <div>
      <header className="mb-8">
        <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: COLORS.gold }}>
          Production Tracker
        </div>
        <h1 className="text-3xl font-bold" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>
          Behind the Show
        </h1>
        <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>
          6-episode documentary · Grace Bible Fellowship Church · USO Show, America's 250th
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <Stat value={`${captured}/${footage.length}`} label="B-roll clips captured" />
        <Stat value={`${interviewsDone}/${interviewsTotal}`} label="Interview slots completed" />
        <Stat value={questionsLeft} label="Open questions remaining" />
      </div>

      {upNext.length > 0 && (
        <div className="rounded-xl border mb-8 overflow-hidden" style={{ borderColor: COLORS.border }}>
          <div
            className="px-4 py-2 flex items-center gap-2 text-xs font-mono tracking-widest uppercase"
            style={{ backgroundColor: COLORS.ink, color: COLORS.card }}
          >
            <CalendarClock size={13} /> Up next
          </div>
          <div className="divide-y" style={{ backgroundColor: COLORS.card }}>
            {upNext.map((s) => (
              <button
                key={s.id}
                onClick={() => onGoto('schedule')}
                className="w-full text-left px-4 py-3 flex items-center justify-between transition-colors hover:bg-black/[0.03]"
              >
                <div>
                  <div className="text-sm font-medium" style={{ color: COLORS.ink }}>
                    {s.people || '—'}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>
                    {s.week} · {s.day === 'tue' ? 'Tuesday' : 'Monday'}
                    {s.tag ? ` · ${s.tag}` : ''}
                    {s.episode ? ` · Episode ${s.episode}` : ''}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: COLORS.inkSoft }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {needed.length > 0 && (
        <div
          className="rounded-xl p-4 mb-8 border flex items-start gap-3"
          style={{ backgroundColor: '#C9472B11', borderColor: '#C9472B33' }}
        >
          <Camera size={18} style={{ color: COLORS.red, marginTop: 2 }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: COLORS.ink }}>
              Footage still needed
            </div>
            <div className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>
              {needed.map((f) => f.label).join(' · ')} — film before June 27.
            </div>
          </div>
        </div>
      )}

      <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: COLORS.inkSoft }}>
        Episodes — by completion order
      </h2>
      <p className="text-xs mb-3" style={{ color: COLORS.inkSoft }}>
        Tap an episode to expand and edit it.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {sorted.map((ep) => (
          <EpisodeCard
            key={ep.num}
            ep={ep}
            setEpisodes={setEpisodes}
            expanded={expandedNum === ep.num}
            onToggle={() => setExpandedNum((cur) => (cur === ep.num ? null : ep.num))}
          />
        ))}
      </div>
    </div>
  );
}
