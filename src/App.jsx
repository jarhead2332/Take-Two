import React, { useEffect, useRef, useState } from 'react';
import {
  Film, Camera, CalendarDays, Users, ListChecks, Clapperboard, Download, Upload, Menu, X,
} from 'lucide-react';
import { COLORS } from './theme.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import {
  SEED_EPISODES, SEED_FOOTAGE, SEED_SCHEDULE, SEED_TEAM, SEED_QUESTIONS,
} from './data/seed.js';

import Dashboard from './pages/Dashboard.jsx';
import EpisodesPage from './pages/EpisodesPage.jsx';
import FootageLog from './pages/FootageLog.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import OpenQuestionsPage from './pages/OpenQuestionsPage.jsx';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Clapperboard },
  { id: 'episodes', label: 'Episodes', icon: Film },
  { id: 'footage', label: 'Footage Log', icon: Camera },
  { id: 'schedule', label: 'Interview Schedule', icon: CalendarDays },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'questions', label: 'Open Questions', icon: ListChecks },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  const [episodes, setEpisodes] = useLocalStorage('episodes', SEED_EPISODES);
  const [footage, setFootage] = useLocalStorage('footage', SEED_FOOTAGE);
  const [schedule, setSchedule] = useLocalStorage('schedule', SEED_SCHEDULE);
  const [team, setTeam] = useLocalStorage('team', SEED_TEAM);
  const [questions, setQuestions] = useLocalStorage('questions', SEED_QUESTIONS);

  const fileRef = useRef(null);

  // Close the menu on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (id) => {
    setPage(id);
    setMenuOpen(false);
  };

  const exportData = () => {
    const payload = { episodes, footage, schedule, team, questions, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `behind-the-show-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
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
        if (Array.isArray(data.schedule)) setSchedule(data.schedule);
        if (Array.isArray(data.team)) setTeam(data.team);
        if (Array.isArray(data.questions)) setQuestions(data.questions);
      } catch {
        alert('That file could not be read as a valid backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setMenuOpen(false);
  };

  const currentLabel = NAV.find((n) => n.id === page)?.label || '';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-30"
        style={{
          backgroundColor: COLORS.sidebar,
          borderBottom: `1px solid ${COLORS.sidebarBorder}`,
          // Clear the iPhone status bar / notch in standalone PWA mode.
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          <div className="min-w-0">
            <div className="text-[10px] font-mono tracking-widest uppercase leading-none" style={{ color: COLORS.gold }}>
              Behind the Show
            </div>
            <div
              className="text-base font-bold leading-tight truncate"
              style={{ color: COLORS.card, fontFamily: 'Georgia, serif' }}
            >
              {currentLabel}
            </div>
          </div>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="shrink-0 flex items-center justify-center rounded-lg"
            style={{
              width: 42,
              height: 42,
              backgroundColor: menuOpen ? '#B8935A22' : '#FFFFFF12',
              color: menuOpen ? COLORS.gold : COLORS.card,
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Dropdown menu + backdrop */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30"
            style={{ backgroundColor: 'rgba(28,26,23,0.35)' }}
            aria-hidden="true"
          />
          <div
            className="fixed right-3 z-40 rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              top: 'calc(env(safe-area-inset-top, 0px) + 58px)',
              width: 240,
              backgroundColor: COLORS.card,
              borderColor: COLORS.border,
            }}
            role="menu"
          >
            <nav className="p-2">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = page === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    role="menuitem"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: active ? '#B8935A22' : 'transparent',
                      color: active ? COLORS.gold : COLORS.ink,
                    }}
                  >
                    <Icon size={17} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="p-2 border-t" style={{ borderColor: COLORS.border }}>
              <div className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide" style={{ color: COLORS.inkSoft }}>
                Backup
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportData}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium border"
                  style={{ borderColor: COLORS.border, color: COLORS.inkSoft }}
                >
                  <Download size={14} /> Export
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium border"
                  style={{ borderColor: COLORS.border, color: COLORS.inkSoft }}
                >
                  <Upload size={14} /> Import
                </button>
                <input ref={fileRef} type="file" accept="application/json" onChange={importData} className="hidden" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-5 sm:p-8 pb-24">
        {page === 'dashboard' && (
          <Dashboard
            episodes={episodes}
            setEpisodes={setEpisodes}
            footage={footage}
            questions={questions}
            schedule={schedule}
            onGoto={setPage}
          />
        )}
        {page === 'episodes' && (
          <EpisodesPage episodes={episodes} setEpisodes={setEpisodes} />
        )}
        {page === 'footage' && <FootageLog footage={footage} setFootage={setFootage} />}
        {page === 'schedule' && <SchedulePage schedule={schedule} setSchedule={setSchedule} />}
        {page === 'team' && <TeamPage team={team} setTeam={setTeam} />}
        {page === 'questions' && <OpenQuestionsPage questions={questions} setQuestions={setQuestions} />}
      </main>
    </div>
  );
}
