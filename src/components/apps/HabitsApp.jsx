import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Plus, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Snowflake, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Zap, 
  TrendingUp, 
  Sliders,
  Award
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { triggerConfetti } from '../../services/gamification';

const HABIT_CATEGORIES = ['All', 'Academic', 'Skills', 'Fitness', 'Health', 'Personal'];

export default function HabitsApp() {
  const { state, setHabits, awardXP } = useOS();
  const [selectedCat, setSelectedCat] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Academic',
    type: 'checkbox',
    target: 1,
    unit: 'session',
    xp: 35,
    frequency: 'daily',
    color: '#6366f1',
    mandatory: true,
    freezeDaysAvailable: 2
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Generate list of the past 14 days for the calendar matrix
  const pastDays = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    pastDays.push(d.toISOString().split('T')[0]);
  }

  const filteredHabits = state.habits.filter(
    (h) => selectedCat === 'All' || h.category === selectedCat
  );

  // Toggle habit on a specific date
  const handleToggleHabitDate = (habitId, dateStr) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const isDone = h.completedDates?.includes(dateStr);
          const newDates = isDone
            ? h.completedDates.filter((d) => d !== dateStr)
            : [...(h.completedDates || []), dateStr];

          if (!isDone) {
            awardXP(h.xp || 35, `Habit completed: ${h.name}`);
            if (h.currentStreak + 1 === 7 || h.currentStreak + 1 === 30) {
              triggerConfetti(70);
            }
          }

          const streakChange = isDone ? -1 : 1;
          const newStreak = Math.max(0, (h.currentStreak || 0) + streakChange);
          const newLongest = Math.max(h.longestStreak || 0, newStreak);

          return {
            ...h,
            completedDates: newDates,
            currentStreak: newStreak,
            longestStreak: newLongest
          };
        }
        return h;
      })
    );
  };

  // Open creation modal
  const openNewModal = () => {
    setEditingHabit(null);
    setFormData({
      name: '',
      category: 'Academic',
      type: 'checkbox',
      target: 1,
      unit: 'session',
      xp: 35,
      frequency: 'daily',
      color: '#6366f1',
      mandatory: true,
      freezeDaysAvailable: 2
    });
    setIsModalOpen(true);
  };

  const openEditModal = (h) => {
    setEditingHabit(h);
    setFormData({
      name: h.name,
      category: h.category,
      type: h.type,
      target: h.target,
      unit: h.unit,
      xp: h.xp,
      frequency: h.frequency,
      color: h.color || '#6366f1',
      mandatory: h.mandatory,
      freezeDaysAvailable: h.freezeDaysAvailable || 2
    });
    setIsModalOpen(true);
  };

  const handleSaveHabit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingHabit) {
      setHabits((prev) =>
        prev.map((h) => (h.id === editingHabit.id ? { ...h, ...formData } : h))
      );
    } else {
      const newHabit = {
        id: `h-${Date.now()}`,
        ...formData,
        currentStreak: 0,
        longestStreak: 0,
        active: true,
        completedDates: []
      };
      setHabits((prev) => [newHabit, ...prev]);
      awardXP(30, `Habit protocol defined: ${formData.name}`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteHabit = (id) => {
    if (confirm("Delete this habit tracker?")) {
      setHabits((prev) => prev.filter((h) => h.id !== id));
    }
  };

  // Freeze Day logic (uses a streak freeze day so streak is maintained)
  const handleUseFreezeDay = (habitId) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId && (h.freezeDaysAvailable || 0) > 0) {
          alert(`Used 1 Streak Freeze for "${h.name}". Streak protected!`);
          return {
            ...h,
            freezeDaysAvailable: h.freezeDaysAvailable - 1
          };
        }
        return h;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Habit Protocols & Streaks</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            You do not rise to the level of your goals; you fall to the level of your systems.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openNewModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {HABIT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedCat === cat
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'bg-white/5 text-os-text-muted hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Habits Matrix View */}
      <div className="space-y-4">
        {filteredHabits.length > 0 ? (
          filteredHabits.map((habit) => {
            const isTodayCompleted = habit.completedDates?.includes(todayStr);

            return (
              <div
                key={habit.id}
                className="glass-panel p-4 md:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 border border-white/10 hover:border-white/20 transition-all"
              >
                {/* Left: Info & Streak */}
                <div className="flex items-start gap-3.5 min-w-[240px]">
                  <button
                    onClick={() => handleToggleHabitDate(habit.id, todayStr)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                      isTodayCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/30'
                        : 'bg-white/5 border-white/15 text-white/40 hover:border-emerald-500/50'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{habit.name}</span>
                      {habit.mandatory && (
                        <span className="text-[10px] font-mono text-red-300 bg-red-500/10 px-1.5 py-0.2 rounded border border-red-500/20">
                          CORE
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-os-text-muted mt-1">
                      <span className="flex items-center gap-1 text-orange-400 font-semibold font-mono">
                        <Flame className="w-3.5 h-3.5 fill-orange-500" />
                        {habit.currentStreak || 0}d streak
                      </span>
                      <span>Best: {habit.longestStreak || 0}d</span>
                      <span className="text-indigo-400 font-mono">+{habit.xp} XP</span>
                    </div>
                  </div>
                </div>

                {/* Middle: 14-Day Calendar Heatmap Grid */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {pastDays.map((dStr) => {
                    const isDone = habit.completedDates?.includes(dStr);
                    const isCurrentDay = dStr === todayStr;
                    const dateObj = new Date(dStr);
                    const dayLetter = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' });
                    const dayNum = dateObj.getDate();

                    return (
                      <button
                        key={dStr}
                        onClick={() => handleToggleHabitDate(habit.id, dStr)}
                        className={`w-7 h-10 rounded-lg flex flex-col items-center justify-center text-[10px] font-mono border transition-all cursor-pointer ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-black font-bold shadow-xs'
                            : isCurrentDay
                            ? 'bg-white/10 border-indigo-400 text-white'
                            : 'bg-black/30 border-white/5 text-os-text-subtle hover:bg-white/5'
                        }`}
                        title={`${dStr}: ${isDone ? 'Completed' : 'Missed'}`}
                      >
                        <span className="opacity-70 text-[8px]">{dayLetter}</span>
                        <span>{dayNum}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Freeze Days & Actions */}
                <div className="flex items-center justify-end gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/10">
                  <button
                    onClick={() => handleUseFreezeDay(habit.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-xs flex items-center gap-1 cursor-pointer"
                    title="Use Streak Freeze"
                  >
                    <Snowflake className="w-3.5 h-3.5" />
                    <span>{habit.freezeDaysAvailable || 0} Freezes</span>
                  </button>

                  <button
                    onClick={() => openEditModal(habit)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-white cursor-pointer"
                    title="Edit Habit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                    title="Delete Habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 glass-panel p-8">
            <CheckCircle2 className="w-10 h-10 text-os-text-muted mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-bold text-white mb-1">No habits defined</h3>
            <p className="text-xs text-os-text-muted mb-4">
              Add daily routines to start racking up consistency XP and compounding momentum.
            </p>
            <button
              onClick={openNewModal}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
            >
              + Define Habit Protocol
            </button>
          </div>
        )}
      </div>

      {/* Habit Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingHabit ? 'Edit Habit' : 'Define Habit Protocol'}
            </h3>

            <form onSubmit={handleSaveHabit} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 90m Deep Focus, 3.5L Water, Solve LeetCode"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {HABIT_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-os-text-muted mb-1">Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="daily" className="bg-slate-900">Daily</option>
                    <option value="weekdays" className="bg-slate-900">Weekdays (Mon-Fri)</option>
                    <option value="weekends" className="bg-slate-900">Weekends</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">XP Reward</label>
                  <input
                    type="number"
                    value={formData.xp}
                    onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 35 })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-os-text-muted mb-1">Initial Freeze Days</label>
                  <input
                    type="number"
                    value={formData.freezeDaysAvailable}
                    onChange={(e) => setFormData({ ...formData, freezeDaysAvailable: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mandatoryCheck"
                  checked={formData.mandatory}
                  onChange={(e) => setFormData({ ...formData, mandatory: e.target.checked })}
                  className="rounded border-white/20 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="mandatoryCheck" className="text-os-text text-xs cursor-pointer">
                  Mandatory Core Habit (influences daily streak)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-os-text cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
