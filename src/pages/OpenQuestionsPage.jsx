import React, { useState } from 'react';
import { Circle, CheckCircle2, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { COLORS } from '../theme.js';
import { Button, TextInput } from '../components/ui.jsx';
import { nextId } from '../utils.js';

export default function OpenQuestionsPage({ questions, setQuestions }) {
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const toggle = (id) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, done: !q.done } : q)));

  const remove = (id) => setQuestions((qs) => qs.filter((q) => q.id !== id));

  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setQuestions((qs) => [...qs, { id: nextId(qs), text: text.trim(), done: false }]);
    setText('');
  };

  const startEdit = (q) => {
    setEditingId(q.id);
    setEditText(q.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, text: editText.trim() } : q)));
    setEditingId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.ink, fontFamily: 'Georgia, serif' }}>
        Open Questions
      </h1>
      <p className="text-sm mb-6" style={{ color: COLORS.inkSoft }}>
        Pending decisions before editing locks in.
      </p>

      <form onSubmit={add} className="flex gap-2 mb-5">
        <TextInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a question or decision…"
          className="flex-1"
        />
        <Button type="submit">
          <Plus size={15} /> Add
        </Button>
      </form>

      <div className="space-y-2">
        {questions.map((q) => (
          <div
            key={q.id}
            className="flex items-start gap-3 rounded-lg border p-3"
            style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
          >
            <button
              onClick={() => toggle(q.id)}
              className="mt-0.5 shrink-0"
              style={{ color: q.done ? COLORS.green : COLORS.inkSoft }}
              title={q.done ? 'Reopen' : 'Mark resolved'}
            >
              {q.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            </button>

            {editingId === q.id ? (
              <>
                <TextInput
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(q.id)}
                  className="flex-1"
                  autoFocus
                />
                <button onClick={() => saveEdit(q.id)} className="p-1 rounded hover:bg-black/5" style={{ color: COLORS.green }} title="Save">
                  <Check size={16} />
                </button>
                <button onClick={() => setEditingId(null)} className="p-1 rounded hover:bg-black/5" style={{ color: COLORS.inkSoft }} title="Cancel">
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <span
                  className="text-sm flex-1"
                  style={{
                    color: q.done ? COLORS.inkSoft : COLORS.ink,
                    textDecoration: q.done ? 'line-through' : 'none',
                  }}
                >
                  {q.text}
                </span>
                <button onClick={() => startEdit(q)} className="p-1 rounded hover:bg-black/5 shrink-0" style={{ color: COLORS.inkSoft }} title="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => remove(q.id)} className="p-1 rounded hover:bg-black/5 shrink-0" style={{ color: COLORS.inkSoft }} title="Delete">
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}
        {questions.length === 0 && (
          <div className="text-sm py-8 text-center" style={{ color: COLORS.inkSoft }}>
            No open questions. 🎬
          </div>
        )}
      </div>
    </div>
  );
}
