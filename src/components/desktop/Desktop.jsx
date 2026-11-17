import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
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
  Pause,
  RotateCcw,
  ExternalLink,
  Plus,
  Minimize2,
  GripVertical,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Smile
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { calculateLevelInfo } from '../../services/gamification';
import { getContextualQuote } from '../../services/motivation';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { AnimatedCheckmark } from '../ui/AnimatedCheckmark';
import { Button } from '../ui/Button';

const DEFAULT_WIDGETS = [
  { id: 'xp_level', colSpan: '2' },
  { id: 'focus_timer', colSpan: '1' },
  { id: 'today_tasks', colSpan: '1' },
  { id: 'habits_streak', colSpan: '2' },
  { id: 'upcoming_deadlines', colSpan: '1' },
  { id: 'clock_campus', colSpan: '1' },
  { id: 'quote_mindset', colSpan: '2' },
  { id: 'fitness_vitality', colSpan: '2' },
];

export default function Desktop() {
  const { 
    state, 
    openWindow, 
    awardXP, 
    setHabits, 
    setKanbanCards, 
    setIsQuickCaptureOpen 
  } = useOS();

  const [quote, setQuote] = useState(() => getContextualQuote('default'));
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [greeting, setGreeting] = useState('Good day');
  const [quickInput, setQuickInput] = useState('');

  // Embedded Focus Timer State for dashboard
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [isFocusActive, setIsFocusActive] = useState(false);

  // Widget Layout & Resizing Persistence
  const [widgets, setWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem('college_os_desktop_widgets');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_WIDGETS;
  });

  const saveWidgets = (newWidgets) => {
    setWidgets(newWidgets);
    try {
      localStorage.setItem('college_os_desktop_widgets', JSON.stringify(newWidgets));
    } catch {}
  };

  const toggleWidgetSize = (widgetId) => {
    const updated = widgets.map((w) => {
      if (w.id === widgetId) {
        return {
          ...w,
          colSpan: w.colSpan === '2' ? '1' : '2'
        };
      }
      return w;
    });
    saveWidgets(updated);
  };

  const resetWidgetLayout = () => {
    saveWidgets(DEFAULT_WIDGETS);
  };

  // Live Clock & Time of Day Greeting
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }));

      const hour = now.getHours();
      if (hour >= 5 && hour < 12) setGreeting('Good morning');
      else if (hour >= 12 && hour < 17) setGreeting('Good afternoon');
      else if (hour >= 17 && hour < 22) setGreeting('Good evening');
      else setGreeting('Night grind active');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dashboard Focus Timer Tick
  useEffect(() => {
    let interval = null;
    if (isFocusActive && focusSeconds > 0) {
      interval = setInterval(() => {
        setFocusSeconds((prev) => prev - 1);
      }, 1000);
    } else if (focusSeconds === 0 && isFocusActive) {
      setIsFocusActive(false);
      awardXP(50, "Completed 25m Desktop Focus Session");
      setFocusSeconds(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isFocusActive, focusSeconds, awardXP]);

  const levelInfo = calculateLevelInfo(state.profile.totalXP, state.levelTiers);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = state.timetable.filter((c) => c.day.toLowerCase() === todayDay.toLowerCase());

  // Inline Quick Capture submit
  const handleQuickCaptureSubmit = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    setKanbanCards((prev) => [
      {
        id: `kc-${Date.now()}`,
        title: quickInput.trim(),
        column: 'To Do',
        priority: 'high',
        deadline: todayStr,
        labels: ['Quick Capture']
      },
      ...prev
    ]);
    awardXP(20, `Captured task: ${quickInput}`);
    setQuickInput('');
  };

  // Toggle Habit
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

  // Nearest deadline calculation
  const nextAssignment = state.assignments
    .filter((a) => a.status !== 'Completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

  const daysLeft = nextAssignment
    ? Math.ceil((new Date(nextAssignment.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  // Format Focus Timer MM:SS
  const timerMinutes = Math.floor(focusSeconds / 60);
  const timerSecondsRem = focusSeconds % 60;
  const timerDisplay = `${String(timerMinutes).padStart(2, '0')}:${String(timerSecondsRem).padStart(2, '0')}`;

  // Render Individual Widgets
  const renderWidgetContent = (widgetId) => {
    switch (widgetId) {
      case 'xp_level':
        return (
          <div
            onClick={() => openWindow('achievements')}
            className="flex flex-col justify-between h-full cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-orange-400 font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  <AnimatedCounter value={state.profile.streak} /> DAY STREAK
                </span>
                <span className="text-xs font-mono text-indigo-300 font-bold bg-indigo-500/15 px-2 py-0.5 rounded-lg border border-indigo-500/25">
                  Lvl {levelInfo.level}
                </span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {levelInfo.title}
              </h4>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden mt-3 mb-1.5 border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="text-[11px] text-os-text-muted font-mono flex justify-between pt-2 border-t border-os-border">
              <span><AnimatedCounter value={levelInfo.totalXP} /> Total XP</span>
              <span>{levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForLevel} XP</span>
            </div>
          </div>
        );

      case 'focus_timer':
        return (
          <div className="flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                FOCUS SPRINT
              </span>
              <button
                onClick={() => openWindow('focus')}
                className="text-[10px] text-os-text-subtle hover:text-white"
              >
                App ➔
              </button>
            </div>

            <div className="text-center my-auto py-2">
              <div className="text-3xl font-black font-mono tracking-tight text-white">
                {timerDisplay}
              </div>
              <p className="text-[10px] text-os-text-muted mt-0.5">25-min Deep Focus Cycle</p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 border-t border-os-border">
              <button
                type="button"
                onClick={() => setIsFocusActive(!isFocusActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isFocusActive
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {isFocusActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isFocusActive ? 'Pause' : 'Start'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFocusActive(false);
                  setFocusSeconds(25 * 60);
                }}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-white cursor-pointer"
                title="Reset Sprint"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'today_tasks':
        const pendingTasks = state.kanbanCards.filter((c) => c.column !== 'Done').slice(0, 3);
        return (
          <div className="flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-400 font-bold flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                TODAY'S TASKS
              </span>
              <button
                onClick={() => openWindow('planner')}
                className="text-[10px] text-os-text-subtle hover:text-white"
              >
                Kanban ➔
              </button>
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto max-h-36 scrollbar-none">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setKanbanCards((prev) =>
                        prev.map((c) => (c.id === t.id ? { ...c, column: 'Done' } : c))
                      );
                      awardXP(25, `Completed task: ${t.title}`);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-2 text-xs cursor-pointer group transition-colors"
                  >
                    <div className="w-4 h-4 rounded border border-white/25 flex items-center justify-center shrink-0 group-hover:border-purple-400">
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-purple-300">✓</span>
                    </div>
                    <span className="truncate text-white text-[11px]">{t.title}</span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-[11px] text-os-text-subtle">
                  All active tasks completed!
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-os-border flex justify-between text-[10px] font-mono text-os-text-muted">
              <span>{pendingTasks.length} pending items</span>
              <span className="text-purple-300 font-semibold">+25 XP / task</span>
            </div>
          </div>
        );

      case 'habits_streak':
        return (
          <div className="flex flex-col justify-between h-full space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Today's Habit Protocols</span>
              </span>
              <button
                onClick={() => openWindow('habits')}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                Expand ➔
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
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
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <AnimatedCheckmark size={18} checked={isDone} color="#10b981" />
                      <span className={`truncate text-xs ${isDone ? 'line-through opacity-70' : 'font-medium'}`}>
                        {h.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-orange-400 shrink-0">
                      {h.currentStreak || 0}d
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'upcoming_deadlines':
        return (
          <div className="flex flex-col justify-between h-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-pink-400 font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                NEXT DEADLINE
              </span>
              <button
                onClick={() => openWindow('academics')}
                className="text-[10px] text-os-text-subtle hover:text-white"
              >
                Academic Hub ➔
              </button>
            </div>

            {nextAssignment ? (
              <div className="my-auto space-y-1.5 py-1">
                <span className="text-[10px] font-mono text-pink-300 uppercase font-semibold">
                  {nextAssignment.subject}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-2">
                  {nextAssignment.title}
                </h4>
                <div className="inline-block mt-1 font-mono text-[10px] px-2 py-0.5 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-300 font-semibold">
                  {daysLeft <= 0 ? 'Due Today' : `In ${daysLeft} days`}
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-os-text-subtle">
                No active assignment deadlines!
              </div>
            )}

            <div className="pt-2 border-t border-os-border text-[10px] text-os-text-muted flex justify-between font-mono">
              <span>Target: First Class Honours</span>
              <span className="text-emerald-400">On Track</span>
            </div>
          </div>
        );

      case 'clock_campus':
        return (
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-mono text-os-text-muted uppercase font-bold">Standard Time</span>
              <div className="text-2xl font-black font-mono text-white mt-1">{timeStr}</div>
              <div className="text-xs text-indigo-300 font-medium mt-0.5">{dateStr}</div>
            </div>
            <div className="pt-3 border-t border-os-border text-[11px] text-os-text-muted flex items-center justify-between">
              <span>Semester Status</span>
              <span className="text-emerald-400 font-semibold">● Active</span>
            </div>
          </div>
        );

      case 'quote_mindset':
        return (
          <div className="flex flex-col justify-between h-full bg-gradient-to-r from-purple-950/25 to-indigo-950/25 p-1 rounded-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-purple-400 font-bold flex items-center gap-1">
                  <Quote className="w-3.5 h-3.5" />
                  MINDSET STANDARD
                </span>
                <button
                  type="button"
                  onClick={() => setQuote(getContextualQuote('default'))}
                  className="text-[10px] text-os-text-subtle hover:text-white cursor-pointer"
                >
                  ↻ Shuffle
                </button>
              </div>
              <blockquote className="text-xs italic text-slate-200 leading-relaxed">
                "{quote.text}"
              </blockquote>
            </div>
            <div className="text-[10px] text-right text-os-text-muted font-mono pt-2 border-t border-white/5">
              — {quote.author}
            </div>
          </div>
        );

      case 'fitness_vitality':
        return (
          <div
            onClick={() => openWindow('fitness')}
            className="flex items-center justify-between h-full cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                  Physical Vitality Engine
                </h4>
                <div className="text-[11px] text-os-text-muted mt-0.5 font-mono">
                  Steps: {state.fitnessLogs[0]?.steps?.toLocaleString() || '10,450'} • Weight: {state.fitnessLogs[0]?.weight || 74.2}kg
                </div>
              </div>
            </div>
            <span className="text-xs text-rose-400 font-mono font-semibold">Log Session ➔</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-44px)] overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-32 scrollbar-thin z-10 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Google-Home Style Hero Welcome & Inline Quick Capture Banner */}
        <div className="glass-panel p-6 border border-os-border-light shadow-elevation-2 rounded-3xl bg-gradient-to-r from-indigo-950/30 via-os-card to-purple-950/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-os-accent font-semibold tracking-wider uppercase mb-1">
                <span>{state.profile.college}</span>
                <span>•</span>
                <span>{state.profile.course}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
                {greeting}, {state.profile.name || 'Scholar'}
              </h1>
              <p className="text-xs text-os-text-muted mt-1 max-w-md">
                "Build the person you want to become." Compounding consistency across 18 integrated domains.
              </p>
            </div>

            {/* Inline Quick Capture Bar */}
            <div className="flex-1 max-w-lg">
              <form onSubmit={handleQuickCaptureSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Quick capture a task or thought (Enter ↵)..."
                  className="w-full bg-black/50 border border-os-border hover:border-os-border-light focus:border-os-accent rounded-2xl py-2.5 pl-4 pr-24 text-xs text-white placeholder:text-os-text-subtle focus:outline-none transition-all shadow-inner"
                />
                <div className="absolute right-1.5 flex items-center gap-1">
                  <Button
                    type="submit"
                    variant="primary"
                    size="xs"
                    className="rounded-xl px-2.5 py-1"
                  >
                    Add
                  </Button>
                </div>
              </form>

              <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-os-text-subtle font-mono">
                <span>Press <kbd className="bg-white/10 px-1 py-0.2 rounded text-os-text-muted">Ctrl+K</kbd> for Command Palette</span>
                <button
                  type="button"
                  onClick={resetWidgetLayout}
                  className="hover:text-os-text underline underline-offset-2 cursor-pointer"
                >
                  Reset Layout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Draggable & Resizable Widget Grid (Reorder.Group) */}
        <Reorder.Group
          axis="y"
          values={widgets}
          onReorder={saveWidgets}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {widgets.map((widget) => {
            const isDouble = widget.colSpan === '2';
            const colClass = isDouble ? 'col-span-1 md:col-span-2' : 'col-span-1';

            return (
              <Reorder.Item
                key={widget.id}
                value={widget}
                id={widget.id}
                className={`glass-panel p-5 border border-os-border hover:border-os-border-light shadow-elevation-1 hover:shadow-elevation-2 rounded-2xl transition-all duration-200 relative group flex flex-col justify-between min-h-[170px] ${colClass}`}
              >
                {/* Header Drag & Resize Controls */}
                <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-white/10 z-20">
                  <button
                    type="button"
                    onClick={() => toggleWidgetSize(widget.id)}
                    className="p-1 rounded text-os-text-subtle hover:text-white cursor-pointer"
                    title={isDouble ? "Compact Widget" : "Expand Widget"}
                  >
                    {isDouble ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  </button>
                  <div className="cursor-grab active:cursor-grabbing text-os-text-subtle hover:text-white p-0.5" title="Drag to reorder">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                </div>

                {renderWidgetContent(widget.id)}
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>
    </div>
  );
}
