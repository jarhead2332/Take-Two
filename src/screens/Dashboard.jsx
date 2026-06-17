import React from 'react';
import { AlertTriangle, Calendar, Camera } from 'lucide-react';
import { COLORS } from '../data/constants.js';
import { TopBar, SectionLabel } from '../components/ui.jsx';
import { parseDate, formatShort } from '../data/dates.js';

function Stat({ value, label }) {
  return (
    <div
      className="flex-1 rounded-[10px] px-3 py-3"
      style={{ backgroundColor: COLORS.statBg, border: `0.5px solid ${COLORS.border}` }}
    >
      <div className="text-[20px] font-semibold leading-none" style={{ color: COLORS.ink }}>
        {value}
      </div>
      <div className="text-[10px] mt-1.5" style={{ color: COLORS.muted }}>
        {label}
      </div>
    </div>
  );
}

export default function Dashboard({ episodes, footage, questions, schedule }) {
  const colorOf = (num) => episodes.find((e) => e.num === num)?.colorHex || COLORS.muted;

  const captured = footage.filter((f) => f.status === 'captured').length;
  const needed = footage.filter((f) => f.status === 'needed');
  const subjects = episodes.flatMap((e) => e.subjects);
  const interviewsDone = subjects.filter((s) => s.done).length;
  const questionsOpen = questions.filter((q) => !q.done).length;

  const upNext = schedule
    .filter((t) => t.section === 'Interviews' && !t.done)
    .sort((a, b) => parseDate(a.start) - parseDate(b.start))
    .slice(0, 2);

  return (
    <div>
      <TopBar
        eyebrow="Production Tracker"
        title="Behind the Show"
        subtitle="Grace Bible Fellowship · USO Show"
        badge="Pre-production"
      />

      <div className="flex gap-2 mb-5">
        <Stat value={`${captured}/${footage.length}`} label="Footage captured" />
        <Stat value={`${interviewsDone}/${subjects.length}`} label="Interviews done" />
        <Stat value={questionsOpen} label="Open questions" />
      </div>

      {needed.length > 0 && (
        <div
          className="flex items-start gap-2 rounded-[12px] px-3 py-3 mb-5"
          style={{ backgroundColor: COLORS.alertBg, border: `0.5px solid ${COLORS.alertBorder}` }}
        >
          <AlertTriangle size={16} style={{ color: COLORS.red, marginTop: 1 }} />
          <div className="text-[13px]" style={{ color: COLORS.ink }}>
            <span className="font-semibold">{needed.length} footage item{needed.length > 1 ? 's' : ''} still needed</span>
            <span style={{ color: COLORS.muted }}> — film before Jun 27.</span>
          </div>
        </div>
      )}

      <SectionLabel>Up next — interviews</SectionLabel>
      <div className="space-y-2 mb-6">
        {upNext.length === 0 && (
          <div className="text-[13px]" style={{ color: COLORS.muted }}>All interviews wrapped. 🎬</div>
        )}
        {upNext.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-[10px] px-3"
            style={{ minHeight: 44, border: `0.5px solid ${COLORS.border}` }}
          >
            <span style={{ width: 5, height: 28, borderRadius: 3, backgroundColor: colorOf(t.episode) }} />
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium truncate" style={{ color: COLORS.ink }}>{t.label}</div>
              <div className="text-[11px]" style={{ color: COLORS.muted }}>
                {formatShort(t.start)}{t.episode ? ` · Ep ${t.episode}` : ''}
              </div>
            </div>
            <Calendar size={15} style={{ color: COLORS.muted }} />
          </div>
        ))}
      </div>

      <SectionLabel>Footage still needed</SectionLabel>
      <div className="space-y-2">
        {needed.length === 0 && (
          <div className="text-[13px]" style={{ color: COLORS.muted }}>Everything's captured.</div>
        )}
        {needed.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-3 rounded-[10px] px-3"
            style={{ minHeight: 44, border: `0.5px solid ${COLORS.border}` }}
          >
            <span style={{ width: 5, height: 28, borderRadius: 3, backgroundColor: colorOf(f.episode) }} />
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium truncate" style={{ color: COLORS.ink }}>{f.label}</div>
              <div className="text-[11px]" style={{ color: COLORS.muted }}>Ep {f.episode} · {f.category}</div>
            </div>
            <Camera size={15} style={{ color: COLORS.red }} />
          </div>
        ))}
      </div>
    </div>
  );
}
