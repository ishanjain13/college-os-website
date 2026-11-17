import confetti from 'canvas-confetti';
import soundService from './sound';

export const DEFAULT_LEVEL_TIERS = [
  { level: 1, title: 'Freshman Trainee', minXP: 0 },
  { level: 5, title: 'Getting Serious', minXP: 1000 },
  { level: 10, title: 'Locked In', minXP: 3000 },
  { level: 20, title: 'Machine Mode', minXP: 8000 },
  { level: 30, title: 'Main Character', minXP: 16000 },
  { level: 40, title: 'Elite Scholar', minXP: 28000 },
  { level: 50, title: 'Unstoppable Legend', minXP: 45000 }
];

export const DEFAULT_XP_CONFIG = {
  habitCheck: 35,
  goalTask: 50,
  goalMilestone: 150,
  goalComplete: 500,
  assignmentSubmit: 120,
  examStudySession: 80,
  pomodoroHour: 100,
  workoutLogged: 90,
  codingProblemSolved: 75,
  journalEntry: 40,
  dailyQuestComplete: 150,
  weeklyBossVictory: 800
};

export const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Completed your very first task or habit on College OS',
    icon: 'Sparkles',
    xpReward: 100,
    unlocked: true,
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'streak_7',
    title: '7-Day Momentum',
    description: 'Maintained a 7-day active daily streak',
    icon: 'Flame',
    xpReward: 300,
    unlocked: false
  },
  {
    id: 'streak_30',
    title: 'Discipline Master',
    description: 'Maintained a 30-day legendary streak',
    icon: 'Zap',
    xpReward: 1000,
    unlocked: false
  },
  {
    id: 'deadline_slayer',
    title: 'Deadline Slayer',
    description: 'Completed 5 assignments ahead of schedule',
    icon: 'ShieldCheck',
    xpReward: 400,
    unlocked: false
  },
  {
    id: 'deep_diver',
    title: 'Deep Work Pioneer',
    description: 'Clocked over 10 hours of focused Pomodoro study',
    icon: 'Clock',
    xpReward: 500,
    unlocked: false
  },
  {
    id: 'boss_slayer',
    title: 'First Boss Slayed',
    description: 'Conquered your first Weekly Boss Battle challenge',
    icon: 'Crown',
    xpReward: 800,
    unlocked: false
  },
  {
    id: 'code_warrior',
    title: 'Algorithm Apprentice',
    description: 'Logged 10 solved coding practice problems',
    icon: 'Code',
    xpReward: 350,
    unlocked: false
  },
  {
    id: 'body_and_mind',
    title: 'Iron Scholar',
    description: 'Logged 10 intense workouts and balanced wellness',
    icon: 'Dumbbell',
    xpReward: 450,
    unlocked: false
  }
];

export function calculateLevelInfo(totalXP, customTiers = DEFAULT_LEVEL_TIERS) {
  // Linear / Tier-based level calculator
  let currentLevel = 1;
  let currentTitle = customTiers[0].title;
  let nextLevelXP = 500;
  let prevLevelXP = 0;

  // Formula: Level N requires ~ 250 * N^1.3 XP
  for (let lvl = 1; lvl <= 100; lvl++) {
    const requiredXP = Math.floor(250 * Math.pow(lvl, 1.35));
    if (totalXP >= requiredXP) {
      currentLevel = lvl + 1;
      prevLevelXP = requiredXP;
    } else {
      nextLevelXP = requiredXP;
      break;
    }
  }

  // Find matching title from tiers
  for (let i = customTiers.length - 1; i >= 0; i--) {
    if (currentLevel >= customTiers[i].level) {
      currentTitle = customTiers[i].title;
      break;
    }
  }

  const xpInCurrentLevel = totalXP - prevLevelXP;
  const xpNeededForLevel = Math.max(1, nextLevelXP - prevLevelXP);
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)));

  return {
    level: currentLevel,
    title: currentTitle,
    totalXP,
    xpInCurrentLevel,
    xpNeededForLevel,
    progressPercent,
    nextLevelXP
  };
}

export function triggerConfetti(particleCount = 70) {
  try {
    confetti({
      particleCount,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
    });
  } catch (e) {}
}
