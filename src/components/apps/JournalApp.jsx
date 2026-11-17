import React, { useState } from 'react';
import { 
  Feather, 
  Plus, 
  Search, 
  Smile, 
  Zap, 
  Calendar, 
  Trash2, 
  Edit3, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

export default function JournalApp() {
  const { state, awardXP } = useOS();
  const [entries, setEntries] = useState([
    {
      id: 'j-1',
      date: '2026-10-06',
      title: 'Cracked the Attention Mechanism Code',
      mood: 'Locked In',
      energy: 9,
      tags: ['Breakthrough', 'AI', 'Focus'],
      entry: 'Spent 3 uninterrupted hours deriving self-attention matrix math and writing vectorized softmax in PyTorch. The feeling when all unit tests pass is unbeatable.',
      highlights: 'Clean 90m deep work sprint before 10 AM',
      lesson: 'Momentum is created by starting before you feel ready.',
      tomorrowPriority: 'Train mini-model on GPU cluster and run inference.'
    },
    {
      id: 'j-2',
      date: '2026-10-04',
      title: 'Sunday Weekly Reset & Systems Review',
      mood: 'Great',
      energy: 8,
      tags: ['Mindset', 'Planning'],
      entry: 'Prepped meal boxes for the week, audited all upcoming problem set deadlines, and cleaned up my desk space.',
      highlights: 'Organized timetable and syllabus roadmap',
      lesson: 'An organized physical space creates immediate cognitive clarity.',
      tomorrowPriority: 'Review Algorithms HW and start DP problems.'
    }
  ]);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    mood: 'Good',
    energy: 8,
    tags: 'Deep Work, College',
    entry: '',
    highlights: '',
    lesson: '',
    tomorrowPriority: ''
  });

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.entry.trim()) return;

    const newEntry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: form.title,
      mood: form.mood,
      energy: parseInt(form.energy) || 8,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      entry: form.entry,
      highlights: form.highlights,
      lesson: form.lesson,
      tomorrowPriority: form.tomorrowPriority
    };

    setEntries([newEntry, ...entries]);
    awardXP(state.xpConfig.journalEntry || 40, `Logged journal entry: ${form.title}`);
    setIsModalOpen(false);
  };

  const filteredEntries = entries.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.entry.toLowerCase().includes(q) ||
      e.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Feather className="w-5 h-5 text-purple-400" />
            <span>Daily Journal & Evening Reflection</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Log daily reflections, extract core lessons, and set tomorrow's non-negotiable target.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Reflection</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-os-text-muted absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search journal entries by keyword, tags, lessons..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-os-text-subtle focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Entries Feed */}
      <div className="space-y-4">
        {filteredEntries.map((item) => (
          <div key={item.id} className="glass-panel p-6 border border-white/10 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-purple-300 font-semibold">{item.date}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-purple-500/20 text-purple-200 border border-purple-500/30">
                    Mood: {item.mood}
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Energy: {item.energy}/10
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{item.entry}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="font-bold text-emerald-400 block mb-0.5">🌟 Highlight of the Day</span>
                <p className="text-os-text-muted text-[11px]">{item.highlights}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="font-bold text-indigo-300 block mb-0.5">💡 Core Lesson</span>
                <p className="text-os-text-muted text-[11px]">{item.lesson}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="font-bold text-pink-400 block mb-0.5">🎯 Tomorrow's Priority</span>
                <p className="text-os-text-muted text-[11px]">{item.tomorrowPriority}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Log Evening Reflection</h3>
            <form onSubmit={handleSaveEntry} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Entry Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Victorious focus sprint and library hours"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Reflection / Notes</label>
                <textarea
                  rows={4}
                  required
                  value={form.entry}
                  onChange={(e) => setForm({ ...form, entry: e.target.value })}
                  placeholder="How did the day go? What battles did you win?"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Highlight of the Day</label>
                  <input
                    type="text"
                    value={form.highlights}
                    onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                    placeholder="e.g. Smashed gym PR"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Core Lesson</label>
                  <input
                    type="text"
                    value={form.lesson}
                    onChange={(e) => setForm({ ...form, lesson: e.target.value })}
                    placeholder="e.g. Start earlier next time"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Tomorrow's #1 Non-Negotiable Priority</label>
                <input
                  type="text"
                  value={form.tomorrowPriority}
                  onChange={(e) => setForm({ ...form, tomorrowPriority: e.target.value })}
                  placeholder="e.g. Submit CS 229 Problem Set before 5 PM"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-os-text">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold">
                  Save Reflection (+40 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
