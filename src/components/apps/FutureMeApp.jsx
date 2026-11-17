import React, { useState } from 'react';
import { 
  Hourglass, 
  Plus, 
  Lock, 
  Unlock, 
  Calendar, 
  Sparkles, 
  Trash2, 
  Heart 
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { triggerConfetti } from '../../services/gamification';

export default function FutureMeApp() {
  const { state, setFutureLetters, awardXP } = useOS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    unlockDate: '2027-01-01',
    currentStruggles: '',
    predictions: '',
    letter: ''
  });

  const handleSaveLetter = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.letter.trim()) return;

    const newLetter = {
      id: `fl-${Date.now()}`,
      title: form.title,
      writeDate: new Date().toISOString().split('T')[0],
      unlockDate: form.unlockDate,
      currentStruggles: form.currentStruggles,
      predictions: form.predictions,
      letter: form.letter,
      unlocked: false
    };

    setFutureLetters((prev) => [newLetter, ...prev]);
    awardXP(50, `Time capsule letter sealed: ${form.title}`);
    setIsModalOpen(false);
  };

  const isLetterUnlocked = (letter) => {
    const today = new Date().toISOString().split('T')[0];
    return today >= letter.unlockDate;
  };

  const getDaysRemaining = (unlockDate) => {
    const diff = new Date(unlockDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Hourglass className="w-5 h-5 text-indigo-400" />
            <span>Future Me — Time-Capsule Letters</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Write unvarnished letters to your future self. Locked until your target date arrives.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write Future Letter</span>
        </button>
      </div>

      {/* Letters List */}
      <div className="space-y-5">
        {state.futureLetters.map((item) => {
          const unlocked = isLetterUnlocked(item);
          const daysLeft = getDaysRemaining(item.unlockDate);

          return (
            <div
              key={item.id}
              className={`glass-panel p-6 border transition-all ${
                unlocked
                  ? 'border-indigo-500/40 bg-indigo-950/20'
                  : 'border-white/10 bg-black/40'
              }`}
            >
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    unlocked ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                  }`}>
                    {unlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    <div className="text-xs text-os-text-muted mt-0.5 font-mono">
                      Penned on {item.writeDate} • Unlocks on {item.unlockDate}
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                  unlocked ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  {unlocked ? '🎉 Capsule Unlocked' : `Locked (${daysLeft}d remaining)`}
                </span>
              </div>

              {/* Locked vs Unlocked Content */}
              {unlocked ? (
                <div className="mt-4 space-y-4 text-xs select-text">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {item.letter}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-os-text-muted">
                    <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                      <strong>Past Struggles at time of writing:</strong>
                      <p className="mt-1 text-slate-300">{item.currentStruggles}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                      <strong>Predictions:</strong>
                      <p className="mt-1 text-slate-300">{item.predictions}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 py-10 text-center space-y-2">
                  <Lock className="w-8 h-8 text-indigo-400 mx-auto opacity-70 animate-pulse" />
                  <div className="text-sm font-bold text-white">
                    Locked. Future You has not arrived yet.
                  </div>
                  <p className="text-xs text-os-text-muted max-w-sm mx-auto">
                    This time-capsule is securely encrypted and will reveal its contents on <strong>{item.unlockDate}</strong>.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Write Letter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Seal Time-Capsule Letter</h3>
            <form onSubmit={handleSaveLetter} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Letter Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. To Alex after Graduation / Junior Year"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Unlock Date</label>
                <input
                  type="date"
                  required
                  value={form.unlockDate}
                  onChange={(e) => setForm({ ...form, unlockDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Current Battles & Struggles</label>
                <input
                  type="text"
                  value={form.currentStruggles}
                  onChange={(e) => setForm({ ...form, currentStruggles: e.target.value })}
                  placeholder="What is currently hard? What are you fighting through?"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Predictions & Goals</label>
                <input
                  type="text"
                  value={form.predictions}
                  onChange={(e) => setForm({ ...form, predictions: e.target.value })}
                  placeholder="Where do you expect to be when this unlocks?"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Letter to Future You</label>
                <textarea
                  rows={5}
                  required
                  value={form.letter}
                  onChange={(e) => setForm({ ...form, letter: e.target.value })}
                  placeholder="Dear Future Me..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-os-text">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                  Seal Time-Capsule (+50 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
