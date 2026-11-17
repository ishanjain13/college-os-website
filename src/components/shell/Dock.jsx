import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Target,
  CheckCircle2,
  GraduationCap,
  Timer,
  CalendarDays,
  BookOpen,
  Dumbbell,
  Wallet,
  Briefcase,
  HeartPulse,
  Feather,
  Trophy,
  Sparkles,
  Hourglass,
  Users,
  Bot,
  Settings
} from 'lucide-react';
import { useOS, APP_METADATA } from '../../context/OSContext';

const DOCK_APPS = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, color: '#6366f1' },
  { id: 'goals', label: 'Goals & Milestones', icon: Target, color: '#ec4899' },
  { id: 'habits', label: 'Habits & Streaks', icon: CheckCircle2, color: '#10b981' },
  { id: 'academics', label: 'Academic Hub', icon: GraduationCap, color: '#3b82f6' },
  { id: 'focus', label: 'Focus & Deep Work', icon: Timer, color: '#f59e0b' },
  { id: 'planner', label: 'Planner & Kanban', icon: CalendarDays, color: '#8b5cf6' },
  { id: 'notes', label: 'Notes & Flashcards', icon: BookOpen, color: '#06b6d4' },
  { id: 'fitness', label: 'Fitness & Health', icon: Dumbbell, color: '#ef4444' },
  { id: 'money', label: 'Expenses & Budget', icon: Wallet, color: '#14b8a6' },
  { id: 'career', label: 'Career & Projects', icon: Briefcase, color: '#6366f1' },
  { id: 'wellbeing', label: 'Wellbeing & Zen', icon: HeartPulse, color: '#f43f5e' },
  { id: 'journal', label: 'Journal', icon: Feather, color: '#a855f7' },
  { id: 'achievements', label: 'Achievements & Boss', icon: Trophy, color: '#eab308' },
  { id: 'vision', label: 'Vision Board', icon: Sparkles, color: '#ec4899' },
  { id: 'future_me', label: 'Future Me Letters', icon: Hourglass, color: '#6366f1' },
  { id: 'campus', label: 'Campus & Study Room', icon: Users, color: '#10b981' },
  { id: 'ai_buddy', label: 'AI Study Buddy', icon: Bot, color: '#06b6d4' },
  { id: 'settings', label: 'Settings', icon: Settings, color: '#94a3b8' }
];

export default function Dock() {
  const { openWindow, openWindows, activeWindowId } = useOS();

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center justify-center max-w-[95vw]">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="glass-dock px-3 py-2 flex items-center gap-1.5 shadow-2xl border border-white/15 overflow-x-auto max-w-full scrollbar-none"
      >
        {DOCK_APPS.map((app) => {
          const Icon = app.icon;
          const isOpen = openWindows.some((w) => w.id === app.id);
          const isActive = activeWindowId === app.id;

          return (
            <div key={app.id} className="relative group flex flex-col items-center">
              {/* Tooltip */}
              <div className="absolute -top-9 px-2.5 py-1 rounded-lg bg-black/90 text-white text-[11px] font-medium whitespace-nowrap border border-white/10 shadow-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none -translate-y-1 group-hover:translate-y-0">
                {app.label}
              </div>

              {/* Icon button */}
              <motion.button
                whileHover={{ scale: 1.22, y: -4 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => openWindow(app.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                  isActive
                    ? 'bg-white/20 shadow-md border border-white/30 text-white'
                    : isOpen
                    ? 'bg-white/10 hover:bg-white/15 text-white/90'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
                style={{
                  boxShadow: isActive ? `0 0 15px ${app.color}60` : undefined
                }}
              >
                <Icon
                  className="w-5 h-5 transition-transform"
                  style={{ color: isActive || isOpen ? app.color : 'currentColor' }}
                />
              </motion.button>

              {/* Running indicator dot */}
              <div
                className={`w-1.5 h-1.5 rounded-full mt-1 transition-all ${
                  isActive
                    ? 'bg-white scale-125'
                    : isOpen
                    ? 'bg-indigo-400'
                    : 'opacity-0'
                }`}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
