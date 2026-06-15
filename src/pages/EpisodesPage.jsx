import React from 'react';
import { COLORS } from '../theme.js';
import { StatusBadge } from '../components/ui.jsx';
import EpisodeControls from '../components/EpisodeControls.jsx';

export default function EpisodesPage({ episodes, setEpisodes }) {
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
            className="rounded-xl border p-5"
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
              <StatusBadge status={ep.status} />
            </div>

            <EpisodeControls episode={ep} setEpisodes={setEpisodes} />
          </div>
        ))}
      </div>
    </div>
  );
}
