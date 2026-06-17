import React, { useState } from 'react';
import { Circle, CheckCircle2, Pencil, Trash2, Check, X, Plus } from 'lucide-react';
import { COLORS } from '../data/constants.js';
import { TopBar, TextInput } from '../components/ui.jsx';
import { nextId } from '../data/seed.js';

export default function Questions({ questions, setQuestions }) {
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const toggle = (id) => setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, done: !q.done } : q)));
  const remove = (id) => setQuestions((qs) => qs.filter((q) => q.id !== id));
  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setQuestions((qs) => [...qs, { id: nextId(qs), text: text.trim(), done: false }]);
    setText('');
  };
  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, text: editText.trim() } : q)));
    setEditingId(null);
  };

  return (
    <div>
      <TopBar title="Open Questions" subtitle="Pending decisions" />

      <div className="space-y-2 mb-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="flex items-center gap-3 rounded-[10px] px-3"
            style={{ minHeight: 44, border: `0.5px solid ${COLORS.border}` }}
          >
            <button onClick={() => toggle(q.id)} aria-label="Toggle" className="shrink-0" style={{ color: q.done ? '#16a34a' : COLORS.muted }}>
              {q.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>

            {editingId === q.id ? (
              <>
                <TextInput
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(q.id)}
                  className="flex-1"
                />
                <button onClick={() => saveEdit(q.id)} className="p-1" style={{ color: '#16a34a' }}><Check size={18} /></button>
                <button onClick={() => setEditingId(null)} className="p-1" style={{ color: COLORS.muted }}><X size={18} /></button>
              </>
            ) : (
              <>
                <span
                  className="flex-1 text-[14px] py-2"
                  style={{ color: q.done ? COLORS.muted : COLORS.ink, textDecoration: q.done ? 'line-through' : 'none' }}
                >
                  {q.text}
                </span>
                <button onClick={() => { setEditingId(q.id); setEditText(q.text); }} className="p-1" style={{ color: COLORS.muted }}><Pencil size={15} /></button>
                <button onClick={() => remove(q.id)} className="p-1" style={{ color: COLORS.muted }}><Trash2 size={15} /></button>
              </>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={add} className="flex gap-2">
        <TextInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a question or decision…"
          className="flex-1"
        />
        <button
          type="submit"
          aria-label="Add"
          className="flex items-center justify-center rounded-[10px] text-white shrink-0"
          style={{ width: 44, height: 44, backgroundColor: COLORS.red }}
        >
          <Plus size={22} />
        </button>
      </form>
    </div>
  );
}
