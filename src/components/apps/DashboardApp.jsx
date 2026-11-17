import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  Trophy, 
  Target, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Dumbbell, 
  Wallet, 
  Calendar, 
  Quote, 
  Smile, 
  ShieldAlert,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { calculateLevelInfo } from '../../services/gamification';
import { getContextualQuote } from '../../services/motivation';

export default function DashboardApp() {
  const { 
    state, 
    openWindow, 
    awardXP, 
    setHabits, 
    setGoals, 
    setDailyQuests, 
    setMoodHistory,
    setIsQuickCaptureOpen 
  } = useOS();

  const [currentQuote, setCurrentQuote] = useState(() => getContextualQuote('default'));
  const levelInfo = calculateLevelInfo(state.profile.totalXP, state.levelTiers);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Today's classes from timetable
  const todayClasses = state.timetable.filter(
    (c) => c.day.toLowerCase() === todayDayName.toLowerCase()
  );

  // Toggle habit directly on dashboard
  const handleToggleHabit = (habitId) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const isDone = h.completedDates?.includes(todayStr);
          const newDates = isDone
            ? h.completedDates.filter((d) => d !== todayStr)
            : [...(h.completedDates || []), todayStr];
          
          if (!isDone) {
            awardXP(h.xp || 35, `Habit completed: ${h.name}`);
          }

          return {
            ...h,
            completedDates: newDates,
            currentStreak: isDone ? Math.max(0, h.currentStreak - 1) : h.currentStreak + 1
          };
        }
        return h;
      })
    );
  };

  // Set today's mood
  const handleSetMood = (moodName, emoji) => {
    setMoodHistory((prev) => {
      const filtered = prev.filter((m) => m.date !== todayStr);
      return [{ date: todayStr, mood: moodName, emoji, notes: `Checked in on ${todayStr}` }, ...filtered];
    });
    awardXP(15, `Daily mood check-in: ${moodName}`);
  };

  const todayMood = state.moodHistory.find((m) => m.date === todayStr);

  // Next upcoming assignment/deadline
  const nextAssignment = state.assignments
    .filter((a) => a.status !== 'Completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

  const daysToDeadline = nextAssignment
    ? Math.ceil((new Date(nextAssignment.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* 1. Hero Command Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/80 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold">
                HQ COMMAND CENTER
              </span>
              <span className="text-xs text-os-text-muted font-mono">
                {todayDayName}, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-display text-white">
              {getGreeting()}, <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{state.profile.name}</span>
            </h1>

            <p className="text-sm text-os-text-muted mt-1.5 flex items-center gap-2">
              <span>Day {state.profile.streak} streak</span>
              <span>•</span>
              <span className="text-indigo-400 font-semibold">{levelInfo.title}</span>
              <span>•</span>
              <span>{levelInfo.totalXP} Total XP</span>
            </p>
          </div>

          {/* Quick Start Focus Sprint Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openWindow('focus')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start 25m Focus Sprint</span>
            </button>

            <button
              onClick={() => setIsQuickCaptureOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Capture</span>
            </button>
          </div>
        </div>

        {/* Level XP Progress Meter */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <div className="flex justify-between text-xs mb-1.5 font-medium">
              <span className="text-os-text">
                Level {levelInfo.level} Progress ({levelInfo.progressPercent}%)
              </span>
              <span className="text-indigo-300 font-mono">
                {levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForLevel} XP to Level {levelInfo.level + 1}
              </span>
            </div>
            <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
            <div className="text-right">
              <div className="text-os-text-muted text-[11px]">Next Milestone</div>
              <div className="font-semibold text-white">Level {levelInfo.level + 1} Unlock</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Grid: Main Quest + Next Deadline + Motivational Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main Daily Quest Card */}
        <div className="glass-panel p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                TODAY'S MAIN QUEST
              </span>
              <span className="text-xs font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                +150 XP
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {state.dailyQuests?.[0]?.text || "Complete 90 minutes of focused Machine Learning study"}
            </h3>
            <p className="text-xs text-os-text-muted">
              Focus is compounding. Nail your top priority before switching contexts.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-medium">
              {state.dailyQuests?.[0]?.completed ? "✓ Quest Completed" : "In Progress"}
            </span>
            <button
              onClick={() => openWindow('achievements')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>View All Quests</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Next Urgent Deadline Card */}
        <div className="glass-panel p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold text-pink-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                NEXT CRITICAL DEADLINE
              </span>
              {daysToDeadline !== null && (
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  daysToDeadline <= 2 
                    ? 'bg-red-500/20 text-red-300 border-red-500/30 font-bold animate-pulse'
                    : 'bg-pink-500/10 text-pink-300 border-pink-500/20'
                }`}>
                  {daysToDeadline <= 0 ? 'Due Today!' : `Due in ${daysToDeadline}d`}
                </span>
              )}
            </div>

            {nextAssignment ? (
              <>
                <div className="text-xs text-indigo-300 font-semibold mb-1 truncate">
                  {nextAssignment.subject}
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-2">
                  {nextAssignment.title}
                </h3>
              </>
            ) : (
              <p className="text-xs text-os-text-muted">No pending assignments. Clean slate!</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-os-text-muted">
              {nextAssignment ? `Progress: ${nextAssignment.progress}%` : 'All caught up'}
            </span>
            <button
              onClick={() => openWindow('academics')}
              className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Academics Hub</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Dynamic Motivation & Context Card */}
        <div className="glass-panel p-5 flex flex-col justify-between bg-gradient-to-br from-indigo-950/30 to-purple-950/20">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-purple-400 flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5" />
                DAILY STANDARD
              </span>
              <button
                onClick={() => setCurrentQuote(getContextualQuote('default'))}
                className="text-[10px] text-os-text-subtle hover:text-os-text cursor-pointer"
                title="Shuffle Quote"
              >
                ↻ Shuffle
              </button>
            </div>

            <blockquote className="text-xs italic text-slate-200 leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-os-text-muted text-right font-medium">
            — {currentQuote.author}
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Today's Habits + Active Goals & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Habits & Active Goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Habits Quick Checklist */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Daily Habit Protocols</h3>
              </div>
              <button
                onClick={() => openWindow('habits')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Manage Habits</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.habits.slice(0, 6).map((habit) => {
                const isCompleted = habit.completedDates?.includes(todayStr);

                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleHabit(habit.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-os-text'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-black'
                            : 'border-white/30 bg-black/20'
                        }`}
                      >
                        {isCompleted && <span className="text-xs font-bold">✓</span>}
                      </div>
                      <div>
                        <div className={`text-xs font-medium ${isCompleted ? 'line-through opacity-80' : ''}`}>
                          {habit.name}
                        </div>
                        <div className="text-[10px] text-os-text-muted flex items-center gap-1.5">
                          <Flame className="w-2.5 h-2.5 text-orange-400" />
                          <span>{habit.currentStreak || 0}d streak</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-indigo-400">
                      +{habit.xp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Goals Snapshot */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-pink-400" />
                <h3 className="font-bold text-sm text-white">Active Core Goals</h3>
              </div>
              <button
                onClick={() => openWindow('goals')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Goals Roadmap</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {state.goals.slice(0, 3).map((goal) => {
                const percent = Math.round((goal.currentValue / goal.targetValue) * 100);

                return (
                  <div
                    key={goal.id}
                    onClick={() => openWindow('goals')}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: goal.color || '#6366f1' }}
                        />
                        <span className="text-xs font-bold text-white">{goal.name}</span>
                      </div>
                      <span className="text-xs font-mono text-indigo-300 font-semibold">
                        {goal.currentValue} / {goal.targetValue} {goal.unit} ({percent}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: goal.color || '#6366f1'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Today's Schedule + Mood Check-In */}
        <div className="space-y-6">
          {/* Today's Timetable */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Today's Lectures</h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">
                {todayClasses.length} {todayClasses.length === 1 ? 'class' : 'classes'}
              </span>
            </div>

            {todayClasses.length > 0 ? (
              <div className="space-y-2.5">
                {todayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{cls.subject}</div>
                      <div className="text-[11px] text-os-text-muted mt-0.5">
                        {cls.room} • {cls.teacher}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {cls.startTime} - {cls.endTime}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-os-text-muted">
                🎉 No classes scheduled for {todayDayName}! Great day for deep work.
              </div>
            )}
          </div>

          {/* Daily Mood Check-In Widget */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Daily Mood & Energy</h3>
              </div>
              {todayMood && (
                <span className="text-xs font-semibold text-purple-300">
                  {todayMood.emoji} {todayMood.mood}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Locked In', emoji: '🔥' },
                { name: 'Great', emoji: '😀' },
                { name: 'Good', emoji: '🙂' },
                { name: 'Neutral', emoji: '😐' },
                { name: 'Low', emoji: '😔' },
                { name: 'Exhausted', emoji: '😴' },
                { name: 'Stressed', emoji: '⚡' },
                { name: 'Zen', emoji: '🧘' }
              ].map((m) => (
                <button
                  key={m.name}
                  onClick={() => handleSetMood(m.name, m.emoji)}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    todayMood?.mood === m.name
                      ? 'bg-purple-600/30 border-purple-500 text-white font-bold scale-105'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 text-os-text'
                  }`}
                >
                  <div className="text-lg">{m.emoji}</div>
                  <div className="text-[10px] mt-1 truncate">{m.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
