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
import BottomNav from './components/BottomNav.jsx';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', short: 'Home', icon: Clapperboard },
  { id: 'episodes', label: 'Episodes', short: 'Episodes', icon: Film },
  { id: 'footage', label: 'Footage Log', short: 'Footage', icon: Camera },
  { id: 'schedule', label: 'Interview Schedule', short: 'Schedule', icon: CalendarDays },
  { id: 'team', label: 'Team', short: 'Team', icon: Users },
  { id: 'questions', label: 'Open Questions', short: 'Q&A', icon: ListChecks },
];

export default function App() {
  const [page, setPage] = useState('dashboard');

  const [episodes, setEpisodes] = useLocalStorage('episodes', SEED_EPISODES);
  const [footage, setFootage] = useLocalStorage('footage', SEED_FOOTAGE);
  const [schedule, setSchedule] = useLocalStorage('schedule', SEED_SCHEDULE);
  const [team, setTeam] = useLocalStorage('team', SEED_TEAM);
  const [questions, setQuestions] = useLocalStorage('questions', SEED_QUESTIONS);

  const fileRef = useRef(null);

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
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>
      {/* Content — top padding clears the iPhone status bar; bottom padding
          clears the fixed tab bar. */}
      <main
        className="w-full max-w-3xl mx-auto px-5 sm:px-8 pb-28"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.5rem)' }}
      >
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

        {/* Backup tools live at the bottom of the Dashboard */}
        {page === 'dashboard' && (
        <div className="mt-10 pt-5 border-t flex items-center gap-2" style={{ borderColor: COLORS.border }}>
          <span className="text-xs mr-auto" style={{ color: COLORS.inkSoft }}>
            Data is saved on this device.
          </span>
          <button
            onClick={exportData}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border"
            style={{ borderColor: COLORS.border, color: COLORS.inkSoft }}
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border"
            style={{ borderColor: COLORS.border, color: COLORS.inkSoft }}
          >
            <Upload size={14} /> Import
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={importData} className="hidden" />
        </div>
        )}
      </main>

      <BottomNav items={NAV} current={page} onSelect={setPage} />
    </div>
  );
}
