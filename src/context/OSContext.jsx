import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadStoredState, saveStateToStorage, exportBackupJSON, validateBackupJSON } from '../services/storage';
import soundService from '../services/sound';
import { calculateLevelInfo, triggerConfetti } from '../services/gamification';

const OSContext = createContext(null);

export const APP_METADATA = {
  dashboard: { id: 'dashboard', title: 'Command Center', icon: 'LayoutDashboard', color: '#6366f1' },
  goals: { id: 'goals', title: 'Goals & Roadmap', icon: 'Target', color: '#ec4899' },
  habits: { id: 'habits', title: 'Habit Tracker', icon: 'CheckCircle2', color: '#10b981' },
  academics: { id: 'academics', title: 'Academic Hub', icon: 'GraduationCap', color: '#3b82f6' },
  focus: { id: 'focus', title: 'Focus & Pomodoro', icon: 'Timer', color: '#f59e0b' },
  planner: { id: 'planner', title: 'Daily Planner & Kanban', icon: 'CalendarDays', color: '#8b5cf6' },
  notes: { id: 'notes', title: 'Notes & Flashcards', icon: 'BookOpen', color: '#06b6d4' },
  fitness: { id: 'fitness', title: 'Fitness & Health', icon: 'Dumbbell', color: '#ef4444' },
  money: { id: 'money', title: 'Expenses & Budget', icon: 'Wallet', color: '#14b8a6' },
  career: { id: 'career', title: 'Career & Projects', icon: 'Briefcase', color: '#6366f1' },
  wellbeing: { id: 'wellbeing', title: 'Wellbeing & Breathing', icon: 'HeartPulse', color: '#f43f5e' },
  journal: { id: 'journal', title: 'Personal Journal', icon: 'Feather', color: '#a855f7' },
  achievements: { id: 'achievements', title: 'Gamification & Boss', icon: 'Trophy', color: '#eab308' },
  vision: { id: 'vision', title: 'Vision Board', icon: 'Sparkles', color: '#ec4899' },
  future_me: { id: 'future_me', title: 'Future Me Letters', icon: 'Hourglass', color: '#6366f1' },
  campus: { id: 'campus', title: 'Campus Life & Room', icon: 'Users', color: '#10b981' },
  ai_buddy: { id: 'ai_buddy', title: 'AI Study Buddy & Coach', icon: 'Bot', color: '#06b6d4' },
  settings: { id: 'settings', title: 'Settings & Themes', icon: 'Settings', color: '#94a3b8' }
};

export function OSProvider({ children }) {
  // Load state from local storage or defaults
  const [state, setState] = useState(() => loadStoredState());

  // Window management state
  const [openWindows, setOpenWindows] = useState([
    { id: 'dashboard', isMinimized: false, isMaximized: false, zIndex: 10, x: 80, y: 40, w: 1040, h: 680 }
  ]);
  const [activeWindowId, setActiveWindowId] = useState('dashboard');
  const [topZIndex, setTopZIndex] = useState(20);

  // Modals & Overlay States
  const [isBooting, setIsBooting] = useState(() => state.profile.bootSequenceEnabled);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !state.profile.onboardingCompleted);
  const [levelUpData, setLevelUpData] = useState(null); // { newLevel, newTitle, xp }
  const [achievementToast, setAchievementToast] = useState(null);
  const [activeTabMobile, setActiveTabMobile] = useState('dashboard');

  // Save to localStorage automatically on state change
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  // Apply theme and accent color to document element with smooth transition
  useEffect(() => {
    const theme = state.appearance.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    if (state.appearance.accentColor) {
      document.documentElement.style.setProperty('--color-accent', state.appearance.accentColor);
      document.documentElement.style.setProperty('--color-accent-glow', `${state.appearance.accentColor}55`);
    } else {
      document.documentElement.style.removeProperty('--color-accent');
      document.documentElement.style.removeProperty('--color-accent-glow');
    }
  }, [state.appearance.theme, state.appearance.accentColor]);

  // Sync sound settings with sound service
  useEffect(() => {
    soundService.setEnabled(state.profile.soundEnabled);
    soundService.setVolume(state.profile.soundVolume);
  }, [state.profile.soundEnabled, state.profile.soundVolume]);

  // Global Keyboard Shortcuts (Ctrl+K, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundService.playClick();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsQuickCaptureOpen(false);
        setLevelUpData(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Window Manager Actions
  const openWindow = useCallback((appId) => {
    soundService.playClick();
    setActiveTabMobile(appId);

    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === appId);
      const nextZ = topZIndex + 1;
      setTopZIndex(nextZ);
      setActiveWindowId(appId);

      if (existing) {
        return prev.map((w) =>
          w.id === appId ? { ...w, isMinimized: false, zIndex: nextZ } : w
        );
      }

      // Calculate staggered offset
      const offset = (prev.length % 5) * 30;
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      
      const width = Math.min(1060, Math.max(780, screenWidth - 140));
      const height = Math.min(720, Math.max(540, screenHeight - 160));
      const posX = Math.max(40, (screenWidth - width) / 2 + offset);
      const posY = Math.max(30, (screenHeight - height) / 2 - 30 + offset);

      return [
        ...prev,
        {
          id: appId,
          isMinimized: false,
          isMaximized: false,
          zIndex: nextZ,
          x: posX,
          y: posY,
          w: width,
          h: height
        }
      ];
    });
  }, [topZIndex]);

  const closeWindow = useCallback((appId) => {
    soundService.playClick();
    setOpenWindows((prev) => prev.filter((w) => w.id !== appId));
    if (activeWindowId === appId) {
      setOpenWindows((prev) => {
        const remaining = prev.filter((w) => w.id !== appId);
        if (remaining.length > 0) {
          const top = [...remaining].sort((a, b) => b.zIndex - a.zIndex)[0];
          setActiveWindowId(top.id);
        } else {
          setActiveWindowId(null);
        }
        return remaining;
      });
    }
  }, [activeWindowId]);

  const minimizeWindow = useCallback((appId) => {
    soundService.playClick();
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === appId ? { ...w, isMinimized: true } : w))
    );
  }, []);

  const toggleMaximizeWindow = useCallback((appId) => {
    soundService.playClick();
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === appId ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  }, []);

  const focusWindow = useCallback((appId) => {
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setActiveWindowId(appId);
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === appId ? { ...w, isMinimized: false, zIndex: nextZ } : w))
    );
  }, [topZIndex]);

  const updateWindowPosition = useCallback((appId, { x, y, w, h }) => {
    setOpenWindows((prev) =>
      prev.map((win) => (win.id === appId ? { ...win, ...(x !== undefined && { x }), ...(y !== undefined && { y }), ...(w !== undefined && { w }), ...(h !== undefined && { h }) } : win))
    );
  }, []);

  // Gamification Engine: Award XP, Check Level Up & Achievements
  const awardXP = useCallback((amount, reason = 'Action Completed') => {
    if (!amount || amount <= 0) return;

    soundService.playComplete();
    setState((prevState) => {
      const oldXP = prevState.profile.totalXP;
      const newXP = oldXP + amount;
      const oldLvlInfo = calculateLevelInfo(oldXP, prevState.levelTiers);
      const newLvlInfo = calculateLevelInfo(newXP, prevState.levelTiers);

      // Check level up
      if (newLvlInfo.level > oldLvlInfo.level) {
        soundService.playLevelUp();
        triggerConfetti(100);
        setLevelUpData({
          level: newLvlInfo.level,
          title: newLvlInfo.title,
          xp: newXP
        });
      }

      return {
        ...prevState,
        profile: {
          ...prevState.profile,
          totalXP: newXP
        }
      };
    });
  }, []);

  const unlockAchievement = useCallback((achievementId) => {
    setState((prevState) => {
      const exists = prevState.achievements.find((a) => a.id === achievementId);
      if (exists && !exists.unlocked) {
        soundService.playAchievement();
        triggerConfetti(80);
        setAchievementToast(exists);
        setTimeout(() => setAchievementToast(null), 5000);

        return {
          ...prevState,
          profile: {
            ...prevState.profile,
            totalXP: prevState.profile.totalXP + exists.xpReward
          },
          achievements: prevState.achievements.map((a) =>
            a.id === achievementId
              ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
              : a
          )
        };
      }
      return prevState;
    });
  }, []);

  // Central State Mutators
  const updateProfile = useCallback((profileUpdates) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdates }
    }));
  }, []);

  const updateAppearance = useCallback((appearanceUpdates) => {
    setState((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, ...appearanceUpdates }
    }));
  }, []);

  const updateWidgets = useCallback((newWidgets) => {
    setState((prev) => ({ ...prev, widgets: newWidgets }));
  }, []);

  // Domain CRUD Helpers
  const setGoals = useCallback((updater) => {
    setState((prev) => ({ ...prev, goals: typeof updater === 'function' ? updater(prev.goals) : updater }));
  }, []);

  const setHabits = useCallback((updater) => {
    setState((prev) => ({ ...prev, habits: typeof updater === 'function' ? updater(prev.habits) : updater }));
  }, []);

  const setAssignments = useCallback((updater) => {
    setState((prev) => ({ ...prev, assignments: typeof updater === 'function' ? updater(prev.assignments) : updater }));
  }, []);

  const setExams = useCallback((updater) => {
    setState((prev) => ({ ...prev, exams: typeof updater === 'function' ? updater(prev.exams) : updater }));
  }, []);

  const setTimetable = useCallback((updater) => {
    setState((prev) => ({ ...prev, timetable: typeof updater === 'function' ? updater(prev.timetable) : updater }));
  }, []);

  const setAttendance = useCallback((updater) => {
    setState((prev) => ({ ...prev, attendance: typeof updater === 'function' ? updater(prev.attendance) : updater }));
  }, []);

  const setNotes = useCallback((updater) => {
    setState((prev) => ({ ...prev, notes: typeof updater === 'function' ? updater(prev.notes) : updater }));
  }, []);

  const setFlashcards = useCallback((updater) => {
    setState((prev) => ({ ...prev, flashcards: typeof updater === 'function' ? updater(prev.flashcards) : updater }));
  }, []);

  const setExpenses = useCallback((updater) => {
    setState((prev) => ({ ...prev, expenses: typeof updater === 'function' ? updater(prev.expenses) : updater }));
  }, []);

  const setBudgets = useCallback((updater) => {
    setState((prev) => ({ ...prev, budgets: typeof updater === 'function' ? updater(prev.budgets) : updater }));
  }, []);

  const setSkills = useCallback((updater) => {
    setState((prev) => ({ ...prev, skills: typeof updater === 'function' ? updater(prev.skills) : updater }));
  }, []);

  const setProjects = useCallback((updater) => {
    setState((prev) => ({ ...prev, projects: typeof updater === 'function' ? updater(prev.projects) : updater }));
  }, []);

  const setInternships = useCallback((updater) => {
    setState((prev) => ({ ...prev, internships: typeof updater === 'function' ? updater(prev.internships) : updater }));
  }, []);

  const setCodingPractice = useCallback((updater) => {
    setState((prev) => ({ ...prev, codingPractice: typeof updater === 'function' ? updater(prev.codingPractice) : updater }));
  }, []);

  const setRewards = useCallback((updater) => {
    setState((prev) => ({ ...prev, rewards: typeof updater === 'function' ? updater(prev.rewards) : updater }));
  }, []);

  const setFutureLetters = useCallback((updater) => {
    setState((prev) => ({ ...prev, futureLetters: typeof updater === 'function' ? updater(prev.futureLetters) : updater }));
  }, []);

  const setVisionItems = useCallback((updater) => {
    setState((prev) => ({ ...prev, visionItems: typeof updater === 'function' ? updater(prev.visionItems) : updater }));
  }, []);

  const setDailyQuests = useCallback((updater) => {
    setState((prev) => ({ ...prev, dailyQuests: typeof updater === 'function' ? updater(prev.dailyQuests) : updater }));
  }, []);

  const setWeeklyBoss = useCallback((updater) => {
    setState((prev) => ({ ...prev, weeklyBoss: typeof updater === 'function' ? updater(prev.weeklyBoss) : updater }));
  }, []);

  const setFocusHistory = useCallback((updater) => {
    setState((prev) => ({ ...prev, focusHistory: typeof updater === 'function' ? updater(prev.focusHistory) : updater }));
  }, []);

  const setFitnessLogs = useCallback((updater) => {
    setState((prev) => ({ ...prev, fitnessLogs: typeof updater === 'function' ? updater(prev.fitnessLogs) : updater }));
  }, []);

  const setPlannerBlocks = useCallback((updater) => {
    setState((prev) => ({ ...prev, plannerBlocks: typeof updater === 'function' ? updater(prev.plannerBlocks) : updater }));
  }, []);

  const setKanbanCards = useCallback((updater) => {
    setState((prev) => ({ ...prev, kanbanCards: typeof updater === 'function' ? updater(prev.kanbanCards) : updater }));
  }, []);

  const setMoodHistory = useCallback((updater) => {
    setState((prev) => ({ ...prev, moodHistory: typeof updater === 'function' ? updater(prev.moodHistory) : updater }));
  }, []);

  const setSyllabus = useCallback((updater) => {
    setState((prev) => ({ ...prev, syllabus: typeof updater === 'function' ? updater(prev.syllabus) : updater }));
  }, []);

  const handleImportBackup = useCallback((jsonString) => {
    const validated = validateBackupJSON(jsonString);
    if (!validated) {
      alert("Invalid College OS backup file format.");
      return false;
    }
    setState(validated);
    saveStateToStorage(validated);
    soundService.playAchievement();
    alert("Backup successfully restored!");
    return true;
  }, []);

  const handleExportBackup = useCallback(() => {
    soundService.playClick();
    exportBackupJSON(state);
  }, [state]);

  const value = {
    state,
    setState,
    openWindows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    focusWindow,
    updateWindowPosition,
    awardXP,
    unlockAchievement,
    levelUpData,
    setLevelUpData,
    achievementToast,
    isBooting,
    setIsBooting,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    isQuickCaptureOpen,
    setIsQuickCaptureOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
    activeTabMobile,
    setActiveTabMobile,
    updateProfile,
    updateAppearance,
    updateWidgets,
    setGoals,
    setHabits,
    setAssignments,
    setExams,
    setTimetable,
    setAttendance,
    setNotes,
    setFlashcards,
    setExpenses,
    setBudgets,
    setSkills,
    setProjects,
    setInternships,
    setCodingPractice,
    setRewards,
    setFutureLetters,
    setVisionItems,
    setDailyQuests,
    setWeeklyBoss,
    setFocusHistory,
    setFitnessLogs,
    setPlannerBlocks,
    setKanbanCards,
    setMoodHistory,
    setSyllabus,
    handleImportBackup,
    handleExportBackup
  };

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useOS() {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
}
