import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence, Reorder } from 'framer-motion';
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
import { useOS } from '../../context/OSContext';

const INITIAL_DOCK_APPS = [
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

function DockItem({ app, mouseX, isLaunching, onLaunch, isOpen, isActive }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Distance from mouse to center of this icon
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current ? ref.current.getBoundingClientRect() : { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // macOS Magnification curve
  const widthSync = useTransform(distance, [-120, 0, 120], [42, 60, 42]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 15 });

  const Icon = app.icon;

  return (
    <Reorder.Item
      value={app}
      id={app.id}
      className="relative flex flex-col items-center select-none"
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute -top-10 px-2.5 py-1 rounded-xl bg-black/90 text-white text-[11px] font-medium whitespace-nowrap border border-white/15 shadow-elevation-3 pointer-events-none z-50 backdrop-blur-md"
          >
            {app.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magnified & Bouncing Icon */}
      <motion.div
        ref={ref}
        style={{ width }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={
          isLaunching
            ? {
                y: [0, -18, 0, -9, 0],
                transition: { duration: 0.65, ease: 'easeInOut' }
              }
            : { y: 0 }
        }
        className="aspect-square flex items-center justify-center"
      >
        <button
          type="button"
          onClick={() => onLaunch(app.id)}
          aria-label={app.label}
          className={`w-full h-full rounded-2xl flex items-center justify-center transition-all cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent ${
            isActive
              ? 'bg-white/20 border border-white/35 text-white shadow-elevation-2'
              : isOpen
              ? 'bg-white/10 hover:bg-white/18 text-white/95 border border-white/10'
              : 'bg-white/5 hover:bg-white/12 text-white/75 hover:text-white border border-transparent'
          }`}
          style={{
            boxShadow: isActive ? `0 0 16px ${app.color}50` : undefined
          }}
        >
          <Icon
            className="w-5 h-5 transition-transform group-hover:scale-105 pointer-events-none"
            style={{ color: isActive || isOpen ? app.color : 'currentColor' }}
          />
        </button>
      </motion.div>

      {/* Running indicator dot */}
      <div className="h-1.5 flex items-center justify-center mt-1">
        <span
          className={`rounded-full transition-all duration-300 ${
            isActive
              ? 'w-1.5 h-1.5 bg-white shadow-sm'
              : isOpen
              ? 'w-1 h-1 bg-os-accent/90'
              : 'w-0 h-0 opacity-0'
          }`}
        />
      </div>
    </Reorder.Item>
  );
}

export default function Dock() {
  const { openWindow, openWindows, activeWindowId } = useOS();
  const [apps, setApps] = useState(() => {
    try {
      const saved = localStorage.getItem('college_os_dock_order');
      if (saved) {
        const orderIds = JSON.parse(saved);
        const ordered = orderIds
          .map((id) => INITIAL_DOCK_APPS.find((a) => a.id === id))
          .filter(Boolean);
        if (ordered.length === INITIAL_DOCK_APPS.length) return ordered;
      }
    } catch {}
    return INITIAL_DOCK_APPS;
  });

  const [launchingAppId, setLaunchingAppId] = useState(null);
  const mouseX = useMotionValue(Infinity);

  const handleLaunch = (appId) => {
    setLaunchingAppId(appId);
    openWindow(appId);
    setTimeout(() => {
      setLaunchingAppId((current) => (current === appId ? null : current));
    }, 700);
  };

  const handleReorder = (newOrder) => {
    setApps(newOrder);
    try {
      localStorage.setItem('college_os_dock_order', JSON.stringify(newOrder.map((a) => a.id)));
    } catch {}
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-dock hidden md:flex items-center justify-center max-w-[95vw]">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 220 }}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass-dock px-3.5 py-2.5 flex items-end gap-1.5 shadow-dock border border-os-border-light overflow-x-auto max-w-full scrollbar-none"
      >
        <Reorder.Group
          axis="x"
          values={apps}
          onReorder={handleReorder}
          className="flex items-end gap-1.5"
        >
          {apps.map((app) => {
            const isOpen = openWindows.some((w) => w.id === app.id);
            const isActive = activeWindowId === app.id;
            const isLaunching = launchingAppId === app.id;

            return (
              <DockItem
                key={app.id}
                app={app}
                mouseX={mouseX}
                isOpen={isOpen}
                isActive={isActive}
                isLaunching={isLaunching}
                onLaunch={handleLaunch}
              />
            );
          })}
        </Reorder.Group>
      </motion.div>
    </div>
  );
}
