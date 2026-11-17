import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Smile, 
  Target, 
  Quote, 
  Move 
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

export default function VisionBoardApp() {
  const { state, setVisionItems, awardXP } = useOS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    text: '',
    type: 'goal',
    emoji: '🎯',
    color: '#6366f1'
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;

    const newItem = {
      id: `vi-${Date.now()}`,
      text: form.text,
      type: form.type,
      emoji: form.emoji,
      color: form.color,
      x: Math.floor(Math.random() * 200) + 20,
      y: Math.floor(Math.random() * 150) + 20
    };

    setVisionItems((prev) => [...prev, newItem]);
    awardXP(25, `Added vision affirmation: ${form.text}`);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    setVisionItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span>Interactive Vision & Affirmations Board</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Visualize your ideal future state, identity standards, and long-term dream outcomes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-pink-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vision Card</span>
        </button>
      </div>

      {/* Board Canvas Grid */}
      <div className="min-h-[480px] glass-panel p-6 border border-white/10 rounded-2xl relative overflow-hidden bg-grid-pattern bg-black/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {state.visionItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl glass-window border border-white/15 shadow-xl relative group flex flex-col justify-between min-h-[160px] transition-transform hover:scale-102"
              style={{
                borderLeft: `4px solid ${item.color || '#6366f1'}`
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.emoji || '✨'}</span>
                  <span className="text-[10px] font-mono uppercase text-os-text-muted">
                    {item.type}
                  </span>
                </div>
                <p className="text-sm font-bold text-white leading-relaxed">
                  "{item.text}"
                </p>
              </div>

              <div className="flex justify-end pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                  title="Remove card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Add Vision Affirmation</h3>
            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Affirmation / Vision Text</label>
                <textarea
                  rows={3}
                  required
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="e.g. Lead AI Systems Research & Build with Unstoppable Agency"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={form.emoji}
                    onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-center text-lg"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    <option value="goal" className="bg-slate-900">Goal Vision</option>
                    <option value="affirmation" className="bg-slate-900">Affirmation</option>
                    <option value="quote" className="bg-slate-900">Standard Quote</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-os-text">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold">
                  Pin to Vision Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
