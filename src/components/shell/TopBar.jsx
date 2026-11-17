import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Search, 
  Plus, 
  Bell, 
  ShieldAlert, 
  Palette,
  CheckCircle2,
  Calendar,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Clock
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { calculateLevelInfo } from '../../services/gamification';

export default function TopBar() {
  const { 
    state, 
    openWindow, 
    setIsCommandPaletteOpen, 
    setIsQuickCaptureOpen, 
    updateProfile, 
    updateAppearance 
  } = useOS();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const themeRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifMenuOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setThemeMenuOpen(false);
        setNotifMenuOpen(false);
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const levelInfo = calculateLevelInfo(state.profile.totalXP, state.levelTiers);

  const toggleSound = () => {
    updateProfile({ soundEnabled: !state.profile.soundEnabled });
  };

  const themes = [
    { id: 'dark', label: 'Dark Charcoal' },
    { id: 'light', label: 'Clean Light' },
    { id: 'cyber', label: 'Cyberpunk' },
    { id: 'lofi', label: 'Warm Lo-Fi' },
    { id: 'anime', label: 'Neon Blossom' },
    { id: 'amoled', label: 'Pure AMOLED' },
    { id: 'study', label: 'Emerald Study' },
    { id: 'minimalist', label: 'Minimalist' }
  ];

  // Upcoming notifications summary
  const pendingAssignments = (state.assignments || []).filter(a => a.status !== 'Completed');
  const nextAssignment = pendingAssignments[0];
  const pendingQuests = (state.dailyQuests || []).filter(q => !q.completed);
  const notifCount = pendingAssignments.length + pendingQuests.length;

  // XP Progress Ring calculations
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (levelInfo.progressPercent / 100) * circumference;

  return (
    <header className="h-11 w-full bg-os-bg/75 backdrop-blur-xl border-b border-os-border px-3 md:px-5 flex items-center justify-between z-topbar select-none text-xs text-os-text relative shadow-elevation-1">
      {/* LEFT: Logo & Status Badge */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => openWindow('dashboard')}
          aria-label="Open College OS Command Center"
          className="flex items-center gap-2 font-bold font-display tracking-wider hover:text-os-accent transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent rounded-lg p-0.5"
        >
          <div className="w-6 h-6 rounded-lg bg-os-accent flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="hidden sm:inline font-bold tracking-tight">COLLEGE OS</span>
        </button>

        <span className="hidden xl:inline text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-os-border text-os-text-subtle">
          v2.0
        </span>

        {state.profile.examModeEnabled && (
          <button
            onClick={() => openWindow('academics')}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-semibold animate-pulse cursor-pointer"
          >
            <ShieldAlert className="w-3 h-3" />
            <span className="hidden sm:inline">EXAM MODE</span>
          </button>
        )}
      </div>

      {/* CENTER: Google-Style Centered Search Pill */}
      <div className="flex-1 max-w-md mx-3 flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full max-w-sm sm:max-w-md h-8 px-3 rounded-full bg-black/40 hover:bg-black/60 border border-os-border hover:border-os-border-light text-os-text-muted hover:text-os-text flex items-center justify-between gap-2 shadow-inner transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent"
          title="Search apps, notes, tasks (Ctrl+K)"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-os-text-subtle group-hover:text-os-accent transition-colors shrink-0" />
            <span className="text-xs truncate text-os-text-subtle group-hover:text-os-text">
              Search apps, commands, notes...
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <kbd className="font-mono text-[10px] bg-white/10 group-hover:bg-white/15 px-1.5 py-0.5 rounded text-os-text-muted border border-white/10 transition-colors">
              Ctrl+K
            </kbd>
          </div>
        </motion.button>
      </div>

      {/* RIGHT: HUD, Notifications, Theme, Profile */}
      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        {/* Streak HUD */}
        <button
          onClick={() => openWindow('habits')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 font-medium transition-colors cursor-pointer text-xs"
          title={`${state.profile.streak} Day Consistency Streak`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
          <span className="font-mono font-bold">{state.profile.streak}d</span>
        </button>

        {/* Quick Capture Floating Action */}
        <button
          onClick={() => setIsQuickCaptureOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-os-accent hover:bg-os-accent-hover text-white font-semibold shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent"
          title="Quick Capture (+)"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden md:inline text-[11px]">Capture</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="relative p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-os-text border border-transparent hover:border-os-border transition-colors cursor-pointer"
            title="Notifications & Action Items"
          >
            <Bell className="w-3.5 h-3.5" />
            {notifCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-os-accent shadow-sm" />
            )}
          </button>

          <AnimatePresence>
            {notifMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 glass-window border border-os-border p-3 shadow-elevation-4 rounded-2xl z-modal space-y-2 text-xs"
              >
                <div className="flex items-center justify-between border-b border-os-border pb-2 px-1">
                  <span className="font-bold font-display text-os-text">Daily Intel & Deadlines</span>
                  <span className="text-[10px] font-mono text-os-accent font-semibold">{notifCount} pending</span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1.5 scrollbar-thin py-1">
                  {nextAssignment && (
                    <div
                      onClick={() => {
                        openWindow('academics');
                        setNotifMenuOpen(false);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-rose-300">
                        <span>Assignment Due</span>
                        <span className="font-mono text-[10px]">{nextAssignment.subject}</span>
                      </div>
                      <div className="text-white text-xs truncate mt-0.5">{nextAssignment.title}</div>
                    </div>
                  )}

                  {pendingQuests.slice(0, 2).map((q) => (
                    <div
                      key={q.id}
                      onClick={() => {
                        openWindow('achievements');
                        setNotifMenuOpen(false);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-amber-300">
                        <span>Daily Quest</span>
                        <span className="font-mono text-[10px]">+{q.xp} XP</span>
                      </div>
                      <div className="text-white text-xs truncate mt-0.5">{q.text}</div>
                    </div>
                  ))}

                  {notifCount === 0 && (
                    <div className="py-4 text-center text-os-text-subtle text-xs">
                      All clear! No pending tasks or quest alerts.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-os-text border border-transparent hover:border-os-border transition-colors cursor-pointer"
          title={state.profile.soundEnabled ? "Mute Sounds" : "Enable Sounds"}
        >
          {state.profile.soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-os-accent" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-os-text-subtle" />
          )}
        </button>

        {/* Quick Theme Switcher */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-os-text border border-transparent hover:border-os-border transition-colors cursor-pointer"
            title="Switch Theme"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          <AnimatePresence>
            {themeMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 glass-window border border-os-border p-1.5 shadow-elevation-4 z-modal rounded-2xl space-y-0.5"
              >
                <div className="px-2.5 py-1 text-[10px] uppercase font-mono text-os-text-subtle font-bold tracking-wider">
                  Color Theme
                </div>
                {themes.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      updateAppearance({ theme: th.id });
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      state.appearance.theme === th.id
                        ? 'bg-os-accent/20 text-os-accent font-semibold border border-os-accent/30'
                        : 'text-os-text hover:bg-white/5'
                    }`}
                  >
                    <span>{th.label}</span>
                    {state.appearance.theme === th.id && <span className="text-os-accent">✓</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar with XP Progress Ring */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-full hover:bg-white/10 border border-transparent hover:border-os-border transition-colors cursor-pointer"
            title={`Level ${levelInfo.level} • ${state.profile.name}`}
          >
            {/* Circular XP Ring */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="w-7 h-7 -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  className="stroke-white/15 fill-transparent"
                  strokeWidth="2.5"
                />
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  className="stroke-indigo-500 fill-transparent transition-all duration-500 ease-out"
                  strokeWidth="2.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white font-mono">
                  {state.profile.avatar || state.profile.name?.[0] || 'A'}
                </span>
              </div>
            </div>
            <span className="hidden md:inline font-semibold text-xs text-os-text truncate max-w-[80px]">
              {state.profile.name}
            </span>
            <ChevronDown className="w-3 h-3 text-os-text-subtle hidden md:block" />
          </button>

          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 glass-window border border-os-border p-3.5 shadow-elevation-4 z-modal rounded-2xl space-y-3"
              >
                {/* Profile Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-os-border">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {state.profile.avatar || state.profile.name?.[0] || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{state.profile.name}</h4>
                    <p className="text-[10px] text-os-text-muted truncate">{state.profile.college}</p>
                    <span className="inline-block mt-0.5 text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      Lvl {levelInfo.level} • {levelInfo.title}
                    </span>
                  </div>
                </div>

                {/* Level XP Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-os-text-muted">
                    <span>Level Progress</span>
                    <span>{levelInfo.xpInCurrentLevel}/{levelInfo.xpNeededForLevel} XP</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                      style={{ width: `${levelInfo.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Shortcuts */}
                <div className="space-y-0.5 pt-1 border-t border-os-border text-xs">
                  <button
                    onClick={() => {
                      openWindow('settings');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/5 flex items-center gap-2 text-os-text text-left cursor-pointer transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-os-text-muted" />
                    <span>OS Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      openWindow('achievements');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-white/5 flex items-center gap-2 text-os-text text-left cursor-pointer transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Achievements & Boss</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
