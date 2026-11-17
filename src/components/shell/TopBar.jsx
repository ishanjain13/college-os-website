import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Flame, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Search, 
  Plus, 
  Sparkles, 
  ShieldAlert, 
  Moon, 
  Sun, 
  Palette,
  Maximize2
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

  return (
    <header className="h-11 w-full bg-black/40 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between z-30 select-none text-xs text-os-text">
      {/* Left: OS Brand & Mode Badges */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => openWindow('dashboard')}
          className="flex items-center gap-2 font-bold font-display tracking-wider hover:text-indigo-400 transition-colors cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">COLLEGE OS</span>
        </button>

        <div className="h-4 w-px bg-white/15 hidden md:block" />

        {state.profile.examModeEnabled && (
          <button
            onClick={() => openWindow('academics')}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium animate-pulse cursor-pointer"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>EXAM MODE ACTIVE</span>
          </button>
        )}

        <div className="hidden lg:flex items-center gap-1 text-os-text-muted text-[11px]">
          <span className="text-os-text">{state.profile.college.split('/')[0]}</span>
          <span>•</span>
          <span className="truncate max-w-[140px]">{state.profile.course}</span>
        </div>
      </div>

      {/* Middle: Live Date & Time HUD */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => openWindow('planner')}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-os-text font-mono transition-colors cursor-pointer"
        >
          <span className="text-os-text-muted hidden sm:inline">{dateStr}</span>
          <span className="font-semibold text-white">{timeStr}</span>
        </button>
      </div>

      {/* Right: Gamification HUD & Actions */}
      <div className="flex items-center gap-2">
        {/* Streak HUD */}
        <button
          onClick={() => openWindow('habits')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 font-medium transition-colors cursor-pointer"
          title="Current Daily Streak"
        >
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
          <span>{state.profile.streak}d</span>
        </button>

        {/* Level & XP Bar */}
        <button
          onClick={() => openWindow('achievements')}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 cursor-pointer transition-colors"
          title={`Level ${levelInfo.level} — ${levelInfo.title}`}
        >
          <Trophy className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold">Lvl {levelInfo.level}</span>
          <div className="w-12 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-indigo-200/70">{levelInfo.totalXP} XP</span>
        </button>

        {/* Quick Capture Floating Action */}
        <button
          onClick={() => setIsQuickCaptureOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-sm transition-all cursor-pointer"
          title="Quick Capture (Goal, Task, Habit, Expense, Note)"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">Capture</span>
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-white transition-colors cursor-pointer"
          title="Open Command Palette (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <kbd className="hidden md:inline font-mono text-[10px] bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
            Ctrl+K
          </kbd>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-white transition-colors cursor-pointer"
          title={state.profile.soundEnabled ? "Mute Sounds" : "Enable Sounds"}
        >
          {state.profile.soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {/* Quick Theme Switcher */}
        <div className="relative">
          <button
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-white transition-colors cursor-pointer"
            title="Switch Theme"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          {themeMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 glass-window border border-white/10 p-1.5 shadow-2xl z-50 rounded-xl space-y-0.5">
              <div className="px-2 py-1 text-[10px] uppercase font-mono text-os-text-muted">
                Select Theme
              </div>
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    updateAppearance({ theme: th.id });
                    setThemeMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    state.appearance.theme === th.id
                      ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/30'
                      : 'text-os-text hover:bg-white/5'
                  }`}
                >
                  <span>{th.label}</span>
                  {state.appearance.theme === th.id && <span className="text-indigo-400">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Avatar / Settings Shortcut */}
        <button
          onClick={() => openWindow('settings')}
          className="flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          title="Open Settings"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-bold border border-white/20">
            {state.profile.avatar || state.profile.name?.[0] || 'A'}
          </div>
          <span className="hidden md:inline font-medium text-xs">{state.profile.name}</span>
        </button>
      </div>
    </header>
  );
}
