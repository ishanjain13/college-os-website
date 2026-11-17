import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trophy, 
  Target, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Quote, 
  Dumbbell, 
  Sun, 
  Sparkles, 
  Maximize2, 
  Play, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { calculateLevelInfo } from '../../services/gamification';
import { getContextualQuote } from '../../services/motivation';

export default function Desktop() {
  const { state, openWindow, awardXP, setHabits } = useOS();
  const [quote, setQuote] = useState(() => getContextualQuote('default'));
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const levelInfo = calculateLevelInfo(state.profile.totalXP, state.levelTiers);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = state.timetable.filter((c) => c.day.toLowerCase() === todayDay.toLowerCase());

  const handleToggleHabit = (habitId) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const isDone = h.completedDates?.includes(todayStr);
          const newDates = isDone
            ? h.completedDates.filter((d) => d !== todayStr)
            : [...(h.completedDates || []), todayStr];
          if (!isDone) awardXP(h.xp || 35, `Habit: ${h.name}`);
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

  const nextAssignment = state.assignments
    .filter((a) => a.status !== 'Completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

  const daysLeft = nextAssignment
    ? Math.ceil((new Date(nextAssignment.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="relative w-full h-[calc(100vh-44px)] overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-28 scrollbar-thin z-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Desktop Welcome Banner & Quick Launcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
              COLLEGE OS WORKSPACE
            </h1>
            <p className="text-xs text-os-text-muted font-mono mt-0.5">
              Identity Protocol Active • {state.profile.college}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openWindow('dashboard')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Command Center</span>
            </button>
            <button
              onClick={() => openWindow('focus')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Focus Sprint</span>
            </button>
          </div>
        </div>

        {/* Desktop Interactive Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* Widget 1: Clock & Live HUD */}
          <div className="glass-panel p-5 border border-white/10 flex flex-col justify-between group hover:border-white/20 transition-all">
            <div>
              <span className="text-[10px] font-mono text-os-text-muted uppercase font-bold">Standard Time</span>
              <div className="text-2xl md:text-3xl font-black font-mono text-white mt-1">{timeStr}</div>
              <div className="text-xs text-indigo-300 font-medium mt-0.5">{dateStr}</div>
            </div>
            <div className="pt-3 border-t border-white/10 text-[11px] text-os-text-muted flex items-center justify-between">
              <span>Semester Status: Active</span>
              <span className="text-emerald-400">● Live</span>
            </div>
          </div>

          {/* Widget 2: Streak & Level XP */}
          <div
            onClick={() => openWindow('achievements')}
            className="glass-panel p-5 border border-white/10 flex flex-col justify-between cursor-pointer hover:border-indigo-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-orange-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  {state.profile.streak} DAY STREAK
                </span>
                <span className="text-xs font-mono text-indigo-300 font-bold">Lvl {levelInfo.level}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{levelInfo.title}</h4>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mt-3 mb-1 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="text-[10px] text-os-text-muted font-mono flex justify-between">
              <span>{levelInfo.totalXP} Total XP</span>
              <span>{levelInfo.xpInCurrentLevel}/{levelInfo.xpNeededForLevel} XP</span>
            </div>
          </div>

          {/* Widget 3: Today's Main Daily Quest */}
          <div
            onClick={() => openWindow('achievements')}
            className="glass-panel p-5 border border-white/10 flex flex-col justify-between cursor-pointer hover:border-amber-500/40 transition-all"
          >
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                DAILY QUEST
              </span>
              <h4 className="text-xs font-bold text-white leading-tight">
                {state.dailyQuests?.[0]?.text || "Complete 3 Daily Habit Protocols"}
              </h4>
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-medium">
                {state.dailyQuests?.[0]?.completed ? "✓ Quest Completed" : "In Progress"}
              </span>
              <span className="text-amber-300 font-mono">+{state.dailyQuests?.[0]?.xp || 100} XP</span>
            </div>
          </div>

          {/* Widget 4: Campus Weather Placeholder */}
          <div className="glass-panel p-5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">CAMPUS WEATHER</span>
                <div className="text-2xl font-black font-mono text-white mt-0.5">68°F</div>
                <div className="text-xs text-os-text-muted">Partly Cloudy • Optimal Study Air</div>
              </div>
              <Sun className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-os-text-muted font-mono pt-2 border-t border-white/10">
              Campus HQ Station
            </div>
          </div>

          {/* Widget 5: Habit Checklist */}
          <div className="glass-panel p-5 col-span-1 md:col-span-2 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Today's Habit Protocols</span>
              </span>
              <button
                onClick={() => openWindow('habits')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                Expand ➔
              </button>
            </div>

            <div className="space-y-2">
              {state.habits.slice(0, 4).map((h) => {
                const isDone = h.completedDates?.includes(todayStr);

                return (
                  <div
                    key={h.id}
                    onClick={() => handleToggleHabit(h.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-os-text'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isDone ? 'bg-emerald-500 border-emerald-400 text-black font-bold' : 'border-white/30'
                      }`}>
                        {isDone && '✓'}
                      </div>
                      <span className={isDone ? 'line-through opacity-75' : ''}>{h.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-orange-400">{h.currentStreak || 0}d streak</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 6: Today's Classes & Next Deadline */}
          <div className="glass-panel p-5 col-span-1 md:col-span-2 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>Today's Classes & Next Deadline</span>
              </span>
              <button
                onClick={() => openWindow('academics')}
                className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                Hub ➔
              </button>
            </div>

            {todayClasses.length > 0 ? (
              <div className="space-y-2">
                {todayClasses.slice(0, 2).map((c) => (
                  <div key={c.id} className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{c.subject}</div>
                      <div className="text-[10px] text-os-text-muted">{c.room} • {c.teacher}</div>
                    </div>
                    <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
                      {c.startTime}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-os-text-muted py-2">
                No classes today. Focus on coursework deadlines.
              </div>
            )}

            {nextAssignment && (
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-pink-300 font-semibold truncate max-w-[200px]">
                  📌 {nextAssignment.title}
                </span>
                <span className="text-[10px] font-mono font-bold bg-pink-500/10 text-pink-300 px-2 py-0.5 rounded">
                  {daysLeft <= 0 ? 'Due Today' : `In ${daysLeft}d`}
                </span>
              </div>
            )}
          </div>

          {/* Widget 7: Motivational Quote Card */}
          <div className="glass-panel p-5 col-span-1 md:col-span-2 border border-white/10 flex flex-col justify-between bg-gradient-to-r from-purple-950/30 to-indigo-950/30">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-purple-400 font-bold flex items-center gap-1">
                  <Quote className="w-3.5 h-3.5" />
                  MINDSET STANDARD
                </span>
                <button
                  onClick={() => setQuote(getContextualQuote('default'))}
                  className="text-[10px] text-os-text-subtle hover:text-white cursor-pointer"
                >
                  ↻ Shuffle
                </button>
              </div>
              <blockquote className="text-xs italic text-slate-200">
                "{quote.text}"
              </blockquote>
            </div>
            <div className="text-[10px] text-right text-os-text-muted font-mono mt-2">
              — {quote.author}
            </div>
          </div>

          {/* Widget 8: Fitness Summary */}
          <div
            onClick={() => openWindow('fitness')}
            className="glass-panel p-5 col-span-1 md:col-span-2 border border-white/10 flex items-center justify-between cursor-pointer hover:border-red-500/30 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Physical Vitality Engine</h4>
                <div className="text-[11px] text-os-text-muted mt-0.5">
                  Weight: {state.fitnessLogs[0]?.weight || 74.2}kg • Steps: {state.fitnessLogs[0]?.steps?.toLocaleString() || 10450}
                </div>
              </div>
            </div>
            <span className="text-xs text-red-400 font-mono font-semibold">Log Session ➔</span>
          </div>
        </div>
      </div>
    </div>
  );
}
