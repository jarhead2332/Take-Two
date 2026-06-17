import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { COLORS, FOOTAGE_CATEGORIES } from '../data/constants.js';
import { TopBar, TextInput, Select } from '../components/ui.jsx';
import { nextId } from '../data/seed.js';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'captured', label: 'Captured' },
  { id: 'needed', label: 'Needed' },
];
const EMPTY = { label: '', episode: 1, category: FOOTAGE_CATEGORIES[0], status: 'needed' };

export default function Footage({ footage, setFootage, episodes }) {
  const [filter, setFilter] = useState('all');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const colorOf = (num) => episodes.find((e) => e.num === num)?.colorHex || COLORS.muted;
  const filtered = filter === 'all' ? footage : footage.filter((f) => f.status === filter);

  const toggle = (id) =>
    setFootage((list) => list.map((f) => (f.id === id ? { ...f, status: f.status === 'captured' ? 'needed' : 'captured' } : f)));
  const remove = (id) => setFootage((list) => list.filter((f) => f.id !== id));

  const submit = (e) => {
    e.preventDefault();
    if (!form.label.trim()) return;
    setFootage((list) => [
      ...list,
      { id: nextId(list), label: form.label.trim(), episode: Number(form.episode), category: form.category, status: form.status },
    ]);
    setForm(EMPTY);
    setAdding(false);
  };

  return (
    <div>
      <TopBar eyebrow="B-roll" title="Footage Log" subtitle="Filming through Jun 27" />

      <div className="flex gap-2 mb-4">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="text-[12px] font-medium px-3 rounded-full"
              style={{
                height: 32,
                border: `0.5px solid ${active ? COLORS.ink : COLORS.border}`,
                backgroundColor: active ? COLORS.ink : '#fff',
                color: active ? '#fff' : COLORS.muted,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-[13px] py-6 text-center" style={{ color: COLORS.muted }}>No clips here.</div>
        )}
        {filtered.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-3 rounded-[10px] px-3"
            style={{ minHeight: 44, border: `0.5px solid ${COLORS.border}` }}
          >
            <span style={{ width: 5, height: 28, borderRadius: 3, backgroundColor: colorOf(f.episode) }} />
            <div className="flex-1 min-w-0 py-2">
              <div className="text-[14px] font-medium truncate" style={{ color: COLORS.ink }}>{f.label}</div>
              <div className="text-[11px]" style={{ color: COLORS.muted }}>Ep {f.episode} · {f.category}</div>
            </div>
            <button
              onClick={() => toggle(f.id)}
              className="text-[11px] font-semibold px-2 py-1 rounded-full"
              style={{
                backgroundColor: f.status === 'captured' ? '#dcfce7' : '#fee2e2',
                color: f.status === 'captured' ? '#16a34a' : COLORS.red,
              }}
            >
              {f.status === 'captured' ? 'Captured' : 'Needed'}
            </button>
            <button onClick={() => remove(f.id)} className="p-1" style={{ color: COLORS.muted }} aria-label="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => { setForm(EMPTY); setAdding(true); }}
        aria-label="Add clip"
        className="fixed z-30 flex items-center justify-center rounded-full"
        style={{
          right: 18,
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 92px)',
          width: 52, height: 52, backgroundColor: COLORS.red, color: '#fff',
          boxShadow: '0 6px 16px rgba(230,57,70,0.45)',
        }}
      >
        <Plus size={26} />
      </button>

      {/* Add sheet */}
      {adding && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setAdding(false)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="w-full bg-white rounded-t-2xl p-5 space-y-3"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold" style={{ color: COLORS.ink }}>Add footage</h2>
              <button type="button" onClick={() => setAdding(false)} style={{ color: COLORS.muted }}><X size={20} /></button>
            </div>
            <TextInput
              autoFocus
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="Clip name"
              className="w-full"
            />
            <div className="flex gap-2">
              <Select value={form.episode} onChange={(e) => setForm({ ...form, episode: e.target.value })} className="flex-1">
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>Episode {n}</option>)}
              </Select>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="flex-1">
                <option value="needed">Needed</option>
                <option value="captured">Captured</option>
              </Select>
            </div>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full">
              {FOOTAGE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <button
              type="submit"
              className="w-full rounded-[10px] text-[15px] font-semibold text-white"
              style={{ height: 48, backgroundColor: COLORS.red }}
            >
              Add clip
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
