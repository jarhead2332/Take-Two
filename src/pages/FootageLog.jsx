import React, { useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { COLORS } from '../theme.js';
import { FOOTAGE_CATEGORIES } from '../data/seed.js';
import { Button, Select, TextInput, PageTitle } from '../components/ui.jsx';
import { nextId } from '../utils.js';

const EMPTY = { label: '', episode: 1, category: FOOTAGE_CATEGORIES[0], status: 'needed' };

export default function FootageLog({ footage, setFootage }) {
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState(EMPTY);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = filter === 'all' ? footage : footage.filter((f) => f.status === filter);

  const addClip = (e) => {
    e.preventDefault();
    if (!form.label.trim()) return;
    setFootage((list) => [
      ...list,
      {
        id: nextId(list),
        label: form.label.trim(),
        episode: Number(form.episode),
        category: form.category,
        status: form.status,
      },
    ]);
    setForm(EMPTY);
    setShowAdd(false);
  };

  const toggleStatus = (id) =>
    setFootage((list) =>
      list.map((f) =>
        f.id === id ? { ...f, status: f.status === 'captured' ? 'needed' : 'captured' } : f,
      ),
    );

  const deleteClip = (id) => setFootage((list) => list.filter((f) => f.id !== id));

  return (
    <div>
      <PageTitle
        title="Footage Log"
        subtitle="B-roll status — filming runs through June 27."
        onAdd={() => setShowAdd((s) => !s)}
        addLabel="Add clip"
      />

      {/* Add clip */}
      {showAdd && (
      <form
        onSubmit={addClip}
        className="rounded-xl border p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 items-end"
        style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
      >
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: COLORS.inkSoft }}>
            Clip
          </label>
          <TextInput
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            placeholder="e.g. Costume check day"
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: COLORS.inkSoft }}>
            Episode
          </label>
          <Select
            value={form.episode}
            onChange={(e) => setForm({ ...form, episode: e.target.value })}
            className="w-full"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                Episode {n}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: COLORS.inkSoft }}>
            Category
          </label>
          <Select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full"
          >
            {FOOTAGE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex gap-2">
          <Select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="flex-1"
          >
            <option value="needed">Needed</option>
            <option value="captured">Captured</option>
          </Select>
          <Button type="submit" title="Add clip">
            <Plus size={16} />
          </Button>
        </div>
      </form>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {['all', 'captured', 'needed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors"
            style={{
              borderColor: filter === f ? COLORS.ink : COLORS.border,
              backgroundColor: filter === f ? COLORS.ink : 'transparent',
              color: filter === f ? COLORS.card : COLORS.inkSoft,
            }}
          >
            {f === 'all' ? 'All clips' : f === 'captured' ? 'Captured' : 'Still needed'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-sm py-8 text-center" style={{ color: COLORS.inkSoft }}>
            No clips here yet.
          </div>
        )}
        {filtered.map((f) => (
          <div
            key={f.id}
            className="flex items-center justify-between rounded-lg border p-3 gap-3"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: COLORS.ink }}>
                {f.label}
              </div>
              <div className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>
                Episode {f.episode} · {f.category}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleStatus(f.id)}
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: f.status === 'captured' ? '#8A9B7E22' : '#C9472B22',
                  color: f.status === 'captured' ? COLORS.green : COLORS.red,
                }}
                title="Toggle status"
              >
                <RefreshCw size={11} />
                {f.status === 'captured' ? 'Captured' : 'Still needed'}
              </button>
              <button
                onClick={() => deleteClip(f.id)}
                className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
                style={{ color: COLORS.inkSoft }}
                title="Delete clip"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
