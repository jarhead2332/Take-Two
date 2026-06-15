import React, { useRef, useState } from 'react';
import {
  Film, Camera, CalendarDays, Users, ListChecks, Clapperboard, Download, Upload,
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
  const [focusEpisode, setFocusEpisode] = useState(null);

  const [episodes, setEpisodes] = useLocalStorage('episodes', SEED_EPISODES);
  const [footage, setFootage] = useLocalStorage('footage', SEED_FOOTAGE);
  const [schedule, setSchedule] = useLocalStorage('schedule', SEED_SCHEDULE);
  const [team, setTeam] = useLocalStorage('team', SEED_TEAM);
  const [questions, setQuestions] = useLocalStorage('questions', SEED_QUESTIONS);

  const fileRef = useRef(null);

  const openEpisode = (num) => {
    setFocusEpisode(num);
    setPage('episodes');
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
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>
      {/* Sidebar */}
      <aside
        className="sm:w-64 sm:min-h-screen border-b sm:border-b-0 sm:border-r flex flex-col"
        style={{ backgroundColor: COLORS.sidebar, borderColor: COLORS.sidebarBorder }}
      >
        <div className="p-5 border-b" style={{ borderColor: COLORS.sidebarBorder }}>
          <div className="text-xs font-mono tracking-widest uppercase" style={{ color: COLORS.gold }}>
            Episode Tracker
          </div>
          <div className="text-lg font-bold mt-1" style={{ color: COLORS.card, fontFamily: 'Georgia, serif' }}>
            Behind the Show
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-row sm:flex-col gap-1 overflow-x-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: active ? '#B8935A22' : 'transparent',
                  color: active ? COLORS.gold : COLORS.sidebarMuted,
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Backup */}
        <div className="p-3 border-t hidden sm:block" style={{ borderColor: COLORS.sidebarBorder }}>
          <div className="flex gap-2">
            <button
              onClick={exportData}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{ backgroundColor: '#FFFFFF0A', color: COLORS.sidebarMuted }}
              title="Download a JSON backup"
            >
              <Download size={14} /> Export
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{ backgroundColor: '#FFFFFF0A', color: COLORS.sidebarMuted }}
              title="Restore from a JSON backup"
            >
              <Upload size={14} /> Import
            </button>
            <input ref={fileRef} type="file" accept="application/json" onChange={importData} className="hidden" />
          </div>
        </div>

        <div className="p-4 text-xs hidden sm:block" style={{ color: COLORS.inkSoft }}>
          Grace Bible Fellowship Church
          <br />
          USO Show · America's 250th
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-5 sm:p-8 max-w-5xl">
        {page === 'dashboard' && (
          <Dashboard
            episodes={episodes}
            footage={footage}
            questions={questions}
            schedule={schedule}
            onOpenEpisode={openEpisode}
            onGoto={setPage}
          />
        )}
        {page === 'episodes' && (
          <EpisodesPage
            episodes={episodes}
            setEpisodes={setEpisodes}
            focusNum={focusEpisode}
            onFocusHandled={() => setFocusEpisode(null)}
          />
        )}
        {page === 'footage' && <FootageLog footage={footage} setFootage={setFootage} />}
        {page === 'schedule' && <SchedulePage schedule={schedule} setSchedule={setSchedule} />}
        {page === 'team' && <TeamPage team={team} setTeam={setTeam} />}
        {page === 'questions' && <OpenQuestionsPage questions={questions} setQuestions={setQuestions} />}
      </main>
    </div>
  );
}
