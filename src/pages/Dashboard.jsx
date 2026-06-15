import React from 'react';
import { Camera, CalendarClock, ChevronRight } from 'lucide-react';
import { COLORS } from '../theme.js';
import { ReelCard, StatusBadge } from '../components/ui.jsx';
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

export default function Dashboard({ episodes, footage, questions, schedule, onOpenEpisode, onGoto }) {
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

      {/* Up Next */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((ep) => (
          <ReelCard key={ep.num} ep={ep} onClick={() => onOpenEpisode(ep.num)} />
        ))}
      </div>
    </div>
  );
}
