import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { SEED_EPISODES, SEED_FOOTAGE, SEED_QUESTIONS, SEED_SCHEDULE } from './data/seed.js';
import { COLORS } from './data/constants.js';
import BottomNav from './components/BottomNav.jsx';
import Dashboard from './screens/Dashboard.jsx';
import Episodes from './screens/Episodes.jsx';
import EpisodeDetail from './screens/EpisodeDetail.jsx';
import Footage from './screens/Footage.jsx';
import Schedule from './screens/Schedule.jsx';
import Questions from './screens/Questions.jsx';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [detailNum, setDetailNum] = useState(null);

  const [episodes, setEpisodes] = useLocalStorage('episodes', SEED_EPISODES);
  const [footage, setFootage] = useLocalStorage('footage', SEED_FOOTAGE);
  const [questions, setQuestions] = useLocalStorage('questions', SEED_QUESTIONS);
  const [schedule, setSchedule] = useLocalStorage('schedule', SEED_SCHEDULE);

  const selectTab = (id) => {
    setDetailNum(null);
    setTab(id);
  };

  const detailEpisode = detailNum != null ? episodes.find((e) => e.num === detailNum) : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.white, color: COLORS.ink }}>
      <main
        className="mx-auto w-full max-w-2xl px-4"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 100px)',
        }}
      >
        {detailEpisode ? (
          <EpisodeDetail episode={detailEpisode} setEpisodes={setEpisodes} onBack={() => setDetailNum(null)} />
        ) : (
          <>
            {tab === 'dashboard' && (
              <Dashboard episodes={episodes} footage={footage} questions={questions} schedule={schedule} />
            )}
            {tab === 'episodes' && <Episodes episodes={episodes} onOpen={setDetailNum} />}
            {tab === 'footage' && <Footage footage={footage} setFootage={setFootage} episodes={episodes} />}
            {tab === 'schedule' && <Schedule schedule={schedule} setSchedule={setSchedule} episodes={episodes} />}
            {tab === 'questions' && <Questions questions={questions} setQuestions={setQuestions} />}
          </>
        )}
      </main>

      <BottomNav current={tab} onSelect={selectTab} />
    </div>
  );
}
