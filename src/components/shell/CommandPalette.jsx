import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Target, 
  CheckCircle2, 
  Timer, 
  BookOpen, 
  CalendarDays, 
  Dumbbell, 
  Wallet, 
  Briefcase, 
  Settings, 
  Sparkles, 
  Plus,
  Moon,
  Palette
} from 'lucide-react';
import { useOS, APP_METADATA } from '../../context/OSContext';

export default function CommandPalette() {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    openWindow, 
    setIsQuickCaptureOpen, 
    updateAppearance 
  } = useOS();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const COMMANDS = [
    { id: 'open_dashboard', title: 'Open Command Center', category: 'Navigation', icon: Sparkles, action: () => openWindow('dashboard') },
    { id: 'open_goals', title: 'Open Goals & Roadmap', category: 'Navigation', icon: Target, action: () => openWindow('goals') },
    { id: 'open_habits', title: 'Open Habit Tracker', category: 'Navigation', icon: CheckCircle2, action: () => openWindow('habits') },
    { id: 'open_academics', title: 'Open Academic Hub & Timetable', category: 'Navigation', icon: BookOpen, action: () => openWindow('academics') },
    { id: 'start_focus', title: 'Start 25m Pomodoro Focus Session', category: 'Action', icon: Timer, action: () => openWindow('focus') },
    { id: 'open_notes', title: 'Open Markdown Notes & Flashcards', category: 'Navigation', icon: BookOpen, action: () => openWindow('notes') },
    { id: 'open_planner', title: 'Open Planner & Kanban Board', category: 'Navigation', icon: CalendarDays, action: () => openWindow('planner') },
    { id: 'open_fitness', title: 'Open Fitness & Workout Tracker', category: 'Navigation', icon: Dumbbell, action: () => openWindow('fitness') },
    { id: 'open_money', title: 'Open Expense & Budget Manager', category: 'Navigation', icon: Wallet, action: () => openWindow('money') },
    { id: 'open_career', title: 'Open Career & Resume Builder', category: 'Navigation', icon: Briefcase, action: () => openWindow('career') },
    { id: 'open_settings', title: 'Open System Settings & Themes', category: 'Navigation', icon: Settings, action: () => openWindow('settings') },
    { id: 'quick_capture', title: 'Quick Capture Action Item (+)', category: 'Action', icon: Plus, action: () => setIsQuickCaptureOpen(true) },
    { id: 'theme_dark', title: 'Switch Theme: Dark Charcoal', category: 'Appearance', icon: Palette, action: () => updateAppearance({ theme: 'dark' }) },
    { id: 'theme_cyber', title: 'Switch Theme: Cyberpunk', category: 'Appearance', icon: Palette, action: () => updateAppearance({ theme: 'cyber' }) },
    { id: 'theme_lofi', title: 'Switch Theme: Warm Lo-Fi', category: 'Appearance', icon: Palette, action: () => updateAppearance({ theme: 'lofi' }) },
    { id: 'theme_light', title: 'Switch Theme: Clean Light', category: 'Appearance', icon: Palette, action: () => updateAppearance({ theme: 'light' }) }
  ];

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isCommandPaletteOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          setIsCommandPaletteOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, filteredCommands, selectedIndex, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      onClick={() => setIsCommandPaletteOpen(false)}
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl glass-window border border-white/20 p-3 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or jump to an application..."
            className="w-full bg-transparent text-sm text-white placeholder:text-os-text-subtle focus:outline-none"
          />
          <kbd className="text-[10px] font-mono text-os-text-muted bg-black/40 px-2 py-0.5 rounded border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div className="max-h-72 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    setIsCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-md'
                      : 'text-os-text hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                    <span>{cmd.title}</span>
                  </div>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-indigo-200' : 'text-os-text-muted'}`}>
                    {cmd.category}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-xs text-os-text-muted">
              No matching commands found.
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-3 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-os-text-muted font-mono">
          <span>↑↓ to navigate</span>
          <span>↵ to execute</span>
        </div>
      </div>
    </div>
  );
}
