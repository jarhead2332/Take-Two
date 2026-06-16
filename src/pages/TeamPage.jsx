import React, { useState } from 'react';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import { COLORS } from '../theme.js';
import { Button, TextInput, PageTitle } from '../components/ui.jsx';

export default function TeamPage({ team, setTeam }) {
  const [editing, setEditing] = useState(null); // index being edited
  const [adding, setAdding] = useState(false);

  const updatePerson = (idx, person) =>
    setTeam((list) => list.map((p, i) => (i === idx ? person : p)));

  const deletePerson = (idx) => setTeam((list) => list.filter((_, i) => i !== idx));

  const addPerson = (person) => {
    setTeam((list) => [...list, person]);
    setAdding(false);
  };

  return (
    <div>
      <PageTitle
        title="Team"
        subtitle={`${team.length} people, one production.`}
        onAdd={adding ? undefined : () => setAdding(true)}
        addLabel="Add person"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {adding && (
          <PersonEditor
            initial={{ name: '', roles: [], episodes: [] }}
            onSave={addPerson}
            onCancel={() => setAdding(false)}
          />
        )}
        {team.map((person, idx) =>
          editing === idx ? (
            <PersonEditor
              key={idx}
              initial={person}
              onSave={(p) => {
                updatePerson(idx, p);
                setEditing(null);
              }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <PersonCard
              key={idx}
              person={person}
              onEdit={() => setEditing(idx)}
              onDelete={() => deletePerson(idx)}
            />
          ),
        )}
      </div>
    </div>
  );
}

function PersonCard({ person, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border p-4 relative group" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
      <div className="absolute top-3 right-3 flex gap-1">
        <button onClick={onEdit} className="p-1 rounded hover:bg-black/5" style={{ color: COLORS.inkSoft }} title="Edit">
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} className="p-1 rounded hover:bg-black/5" style={{ color: COLORS.inkSoft }} title="Delete">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="text-base font-bold pr-12" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>
        {person.name}
      </div>
      <div className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>
        {person.roles.join(' · ')}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {person.episodes.map((e) => (
          <span
            key={e}
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#B8935A22', color: COLORS.gold }}
          >
            Ep {e}
          </span>
        ))}
      </div>
    </div>
  );
}

function PersonEditor({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial.name);
  const [roles, setRoles] = useState(initial.roles.join(', '));
  const [episodes, setEpisodes] = useState(initial.episodes);

  const toggleEpisode = (n) =>
    setEpisodes((eps) => (eps.includes(n) ? eps.filter((e) => e !== n) : [...eps, n].sort((a, b) => a - b)));

  const save = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      roles: roles
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean),
      episodes,
    });
  };

  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: '#FFFDF9', borderColor: COLORS.ink }}>
      <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full mb-2" />
      <TextInput
        value={roles}
        onChange={(e) => setRoles(e.target.value)}
        placeholder="Roles (comma-separated)"
        className="w-full mb-2"
      />
      <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: COLORS.inkSoft }}>
        Episodes
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const on = episodes.includes(n);
          return (
            <button
              key={n}
              onClick={() => toggleEpisode(n)}
              className="text-xs font-mono px-2 py-0.5 rounded-full border transition-colors"
              style={{
                borderColor: on ? COLORS.gold : COLORS.border,
                backgroundColor: on ? '#B8935A22' : 'transparent',
                color: on ? COLORS.gold : COLORS.inkSoft,
              }}
            >
              Ep {n}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <Button onClick={save}>
          <Check size={15} /> Save
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          <X size={15} /> Cancel
        </Button>
      </div>
    </div>
  );
}
