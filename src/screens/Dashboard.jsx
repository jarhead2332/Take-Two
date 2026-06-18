import React, { useRef } from 'react';
import { AlertTriangle, Calendar, Camera, CalendarDays, Download, Upload, RotateCcw } from 'lucide-react';
import { COLORS } from '../data/constants.js';
import { TopBar, SectionLabel } from '../components/ui.jsx';
import { parseDate, formatShort } from '../data/dates.js';
import { SEED_EPISODES, SEED_FOOTAGE, SEED_QUESTIONS, SEED_SCHEDULE } from '../data/seed.js';

const SHOW_WEEK = [
  { date: 'Mon Jun 22', desc: 'Set build B-roll (10am–6pm)' },
  { date: 'Tue Jun 23 AM', desc: 'Setup & stage transformation (8am–3:30pm)' },
  { date: 'Tue Jun 23 PM', desc: 'Final Rehearsal — full show recorded on church cameras (5:30–9:30pm)' },
  { date: 'Wed Jun 24', desc: 'Final set touches (10am–6pm)' },
  { date: 'Thu Jun 25', desc: 'Show Night 1 — Guys arrive 4:30pm' },
  { date: 'Fri Jun 26', desc: 'Show Night 2 — Guys arrive 4:30pm' },
  { date: 'Sat Jun 27', desc: 'Show Night 3 — Guys arrive 11:30am' },
];

function Stat({ value, label }) {
  return (
    <div
      className="flex-1 rounded-[10px] px-3 py-3"
      style={{ backgroundColor: COLORS.statBg, border: `0.5px solid ${COLORS.border}` }}
    >
      <div className="text-[20px] font-semibold leading-none" style={{ color: COLORS.ink }}>{value}</div>
      <div className="text-[10px] mt-1.5" style={{ color: COLORS.muted }}>{label}</div>
    </div>
  );
}

function ShowWeekCard() {
  return (
    <div className="rounded-[12px] overflow-hidden mb-6" style={{ border: `0.5px solid ${COLORS.border}`, backgroundColor: COLORS.card }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: COLORS.navy }}>
        <CalendarDays size={14} style={{ color: '#fff' }} />
        <span className="text-[12px] font-semibold text-white">Show Week — June 22–27</span>
      </div>
      <div className="divide-y" style={{ borderColor: COLORS.border }}>
        {SHOW_WEEK.map((row, i) => (
          <div key={i} className="px-3 py-2 text-[12px]" style={{ borderColor: COLORS.border }}>
            <span className="font-semibold" style={{ color: COLORS.ink }}>{row.date}:</span>{' '}
            <span style={{ color: COLORS.muted }}>{row.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ episodes, footage, questions, schedule, setEpisodes, setFootage, setQuestions, setSchedule }) {
  const fileRef = useRef(null);
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

  const exportData = () => {
    const payload = { episodes, footage, questions, schedule, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `behind-the-show-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data.episodes)) setEpisodes(data.episodes);
        if (Array.isArray(data.footage)) setFootage(data.footage);
        if (Array.isArray(data.questions)) setQuestions(data.questions);
        if (Array.isArray(data.schedule)) setSchedule(data.schedule);
      } catch {
        alert('That file could not be read as a valid backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const resetDefaults = () => {
    const ok = window.confirm(
      'Reset to latest defaults?\n\nThis overwrites your current episodes, footage, schedule, and questions with the latest built-in data. Your edits will be lost. Consider exporting a backup first.',
    );
    if (!ok) return;
    setEpisodes(SEED_EPISODES);
    setFootage(SEED_FOOTAGE);
    setQuestions(SEED_QUESTIONS);
    setSchedule(SEED_SCHEDULE);
  };

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

      <ShowWeekCard />

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

      {/* Data / backup footer */}
      <div className="mt-8 pt-4" style={{ borderTop: `0.5px solid ${COLORS.border}` }}>
        <SectionLabel>Data</SectionLabel>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-[10px] text-[12px] font-medium"
            style={{ height: 40, border: `0.5px solid ${COLORS.border}`, color: COLORS.muted }}
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-[10px] text-[12px] font-medium"
            style={{ height: 40, border: `0.5px solid ${COLORS.border}`, color: COLORS.muted }}
          >
            <Upload size={14} /> Import
          </button>
          <button
            onClick={resetDefaults}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-[10px] text-[12px] font-medium"
            style={{ height: 40, border: `0.5px solid ${COLORS.alertBorder}`, color: COLORS.red }}
          >
            <RotateCcw size={14} /> Reset
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={importData} className="hidden" />
        </div>
        <p className="text-[10px] mt-2" style={{ color: COLORS.muted }}>
          "Reset" overwrites your data with the latest built-in defaults.
        </p>
      </div>
    </div>
  );
}
