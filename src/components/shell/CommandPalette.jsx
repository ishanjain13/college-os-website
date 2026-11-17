import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Palette, 
  Clock, 
  CheckSquare, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useOS, APP_METADATA } from '../../context/OSContext';

// Simple fast fuzzy score
function fuzzyMatch(text, query) {
  if (!text || !query) return false;
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t.includes(q)) return true;
  // Subsequence match
  let qIdx = 0;
  for (let i = 0; i < t.length && qIdx < q.length; i++) {
    if (t[i] === q[qIdx]) qIdx++;
  }
  return qIdx === q.length;
}

export default function CommandPalette() {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    openWindow, 
    setIsQuickCaptureOpen, 
    updateAppearance,
    state 
  } = useOS();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentIds, setRecentIds] = useState(() => {
    try {
      const saved = localStorage.getItem('college_os_recent_commands');
      return saved ? JSON.parse(saved) : ['app_dashboard', 'app_planner', 'app_notes', 'act_quick_capture'];
    } catch {
      return ['app_dashboard', 'app_planner', 'app_notes', 'act_quick_capture'];
    }
  });

  const inputRef = useRef(null);
  const listRef = useRef(null);

  const saveRecent = (id) => {
    setRecentIds((prev) => {
      const updated = [id, ...prev.filter((item) => item !== id)].slice(0, 5);
      try {
        localStorage.setItem('college_os_recent_commands', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Compile full search catalog
  const allCommands = useMemo(() => {
    const list = [];

    // 1. Applications (18 apps)
    Object.values(APP_METADATA).forEach((app) => {
      list.push({
        id: `app_${app.id}`,
        title: app.title,
        subtitle: `Launch ${app.title}`,
        category: 'Applications',
        icon: Sparkles,
        color: app.color,
        action: () => {
          openWindow(app.id);
          saveRecent(`app_${app.id}`);
        }
      });
    });

    // 2. Tasks / Kanban Cards
    (state.kanbanCards || []).slice(0, 15).forEach((card) => {
      list.push({
        id: `task_${card.id}`,
        title: card.title,
        subtitle: `Column: ${card.column} • Priority: ${card.priority}`,
        category: 'Tasks & Deadlines',
        icon: CheckSquare,
        color: '#8b5cf6',
        action: () => {
          openWindow('planner');
          saveRecent(`task_${card.id}`);
        }
      });
    });

    // 3. Assignments
    (state.assignments || []).slice(0, 10).forEach((asg) => {
      list.push({
        id: `asg_${asg.id}`,
        title: asg.title,
        subtitle: `${asg.subject} • Status: ${asg.status}`,
        category: 'Tasks & Deadlines',
        icon: Target,
        color: '#ec4899',
        action: () => {
          openWindow('academics');
          saveRecent(`asg_${asg.id}`);
        }
      });
    });

    // 4. Notes
    (state.notes || []).slice(0, 15).forEach((note) => {
      list.push({
        id: `note_${note.id}`,
        title: note.title,
        subtitle: `Subject: ${note.subject} • Tags: ${(note.tags || []).join(', ')}`,
        category: 'Notes & Study',
        icon: FileText,
        color: '#06b6d4',
        action: () => {
          openWindow('notes');
          saveRecent(`note_${note.id}`);
        }
      });
    });

    // 5. Actions
    list.push(
      {
        id: 'act_quick_capture',
        title: 'Quick Capture Action Item (+)',
        subtitle: 'Capture a task, goal, note, habit or expense',
        category: 'Actions',
        icon: Plus,
        color: '#6366f1',
        action: () => {
          setIsQuickCaptureOpen(true);
          saveRecent('act_quick_capture');
        }
      },
      {
        id: 'act_focus_pomodoro',
        title: 'Start 25m Pomodoro Focus Sprint',
        subtitle: 'Enter deep work study mode',
        category: 'Actions',
        icon: Timer,
        color: '#f59e0b',
        action: () => {
          openWindow('focus');
          saveRecent('act_focus_pomodoro');
        }
      }
    );

    // 6. Themes & Appearance
    const themeOptions = [
      { id: 'dark', name: 'Dark Charcoal' },
      { id: 'light', name: 'Clean Light' },
      { id: 'cyber', name: 'Cyberpunk' },
      { id: 'lofi', name: 'Warm Lo-Fi' },
      { id: 'anime', name: 'Neon Blossom' },
      { id: 'amoled', name: 'Pure AMOLED' },
      { id: 'study', name: 'Emerald Study' },
      { id: 'minimalist', name: 'Minimalist' }
    ];

    themeOptions.forEach((th) => {
      list.push({
        id: `theme_${th.id}`,
        title: `Switch Theme: ${th.name}`,
        subtitle: 'Change desktop color scheme',
        category: 'Appearance',
        icon: Palette,
        color: '#a855f7',
        action: () => {
          updateAppearance({ theme: th.id });
          saveRecent(`theme_${th.id}`);
        }
      });
    });

    return list;
  }, [state.kanbanCards, state.assignments, state.notes, openWindow, setIsQuickCaptureOpen, updateAppearance]);

  // Filter commands
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      // Return recent items first, then popular navigation
      const recent = recentIds
        .map((id) => allCommands.find((c) => c.id === id))
        .filter(Boolean);
      const others = allCommands.filter(
        (c) => !recentIds.includes(c.id) && (c.category === 'Applications' || c.category === 'Actions')
      ).slice(0, 10);
      return [...recent, ...others];
    }

    return allCommands.filter(
      (cmd) =>
        fuzzyMatch(cmd.title, query) ||
        fuzzyMatch(cmd.subtitle, query) ||
        fuzzyMatch(cmd.category, query)
    );
  }, [allCommands, query, recentIds]);

  // Group commands by category
  const groupedResults = useMemo(() => {
    const groups = {};
    filteredCommands.forEach((cmd, index) => {
      const cat = !query.trim() && recentIds.includes(cmd.id) ? 'Recent & Suggested' : cmd.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ ...cmd, globalIndex: index });
    });
    return groups;
  }, [filteredCommands, query, recentIds]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Keyboard navigation
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

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    selectedElement?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        onClick={() => setIsCommandPaletteOpen(false)}
        className="fixed inset-0 z-modal bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 md:pt-28 px-4 select-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl glass-window border border-os-border-light shadow-elevation-5 rounded-2xl overflow-hidden flex flex-col"
        >
          {/* Top Search Input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-os-border bg-os-card/50">
            <Search className="w-5 h-5 text-os-accent shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search apps, notes, tasks, or actions..."
              className="w-full bg-transparent text-sm text-os-text placeholder:text-os-text-subtle focus:outline-none font-medium"
            />
            <kbd className="text-[10px] font-mono text-os-text-muted bg-white/10 px-2 py-0.5 rounded border border-white/10 shrink-0">
              ESC
            </kbd>
          </div>

          {/* Grouped Results List */}
          <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 scrollbar-thin space-y-3">
            {filteredCommands.length > 0 ? (
              Object.entries(groupedResults).map(([category, items]) => (
                <div key={category} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-os-text-subtle font-bold">
                    {category}
                  </div>
                  {items.map((cmd) => {
                    const isSelected = selectedIndex === cmd.globalIndex;
                    const Icon = cmd.icon;

                    return (
                      <div
                        key={cmd.id}
                        data-index={cmd.globalIndex}
                        onClick={() => {
                          cmd.action();
                          setIsCommandPaletteOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(cmd.globalIndex)}
                        className={`px-3 py-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-all duration-100 ${
                          isSelected
                            ? 'bg-os-accent text-white font-semibold shadow-elevation-1'
                            : 'text-os-text hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-white/10'
                            }`}
                            style={{ color: isSelected ? '#ffffff' : cmd.color }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs truncate">{cmd.title}</div>
                            {cmd.subtitle && (
                              <div
                                className={`text-[11px] truncate ${
                                  isSelected ? 'text-white/80' : 'text-os-text-muted'
                                }`}
                              >
                                {cmd.subtitle}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-os-text-subtle'
                            }`}
                          >
                            {cmd.category}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-os-text-subtle'}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-os-text-muted space-y-1">
                <Search className="w-8 h-8 mx-auto text-os-text-subtle opacity-50 mb-2" />
                <p className="font-semibold text-os-text">No matching items found</p>
                <p className="text-[11px] text-os-text-subtle">
                  Try searching with a different term, or press <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded">ESC</kbd> to exit.
                </p>
              </div>
            )}
          </div>

          {/* Footer Shortcuts Guide */}
          <div className="px-4 py-2.5 border-t border-os-border bg-os-card/30 flex items-center justify-between text-[11px] text-os-text-muted font-mono">
            <div className="flex items-center gap-3">
              <span><kbd className="bg-white/10 px-1 rounded text-white">↑↓</kbd> navigate</span>
              <span><kbd className="bg-white/10 px-1 rounded text-white">↵</kbd> select</span>
              <span><kbd className="bg-white/10 px-1 rounded text-white">ESC</kbd> close</span>
            </div>
            <span className="text-os-text-subtle">College OS Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
