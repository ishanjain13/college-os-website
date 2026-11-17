// Centralized Storage Service with JSON Export/Import & Schema Migration
import {
  INITIAL_USER_PROFILE,
  INITIAL_APPEARANCE,
  INITIAL_WIDGETS,
  INITIAL_GOALS,
  INITIAL_HABITS,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMS,
  INITIAL_SYLLABUS,
  INITIAL_NOTES,
  INITIAL_FLASHCARDS,
  INITIAL_EXPENSES,
  INITIAL_BUDGETS,
  INITIAL_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_INTERNSHIPS,
  INITIAL_CODING_PRACTICE,
  INITIAL_REWARD_SHOP,
  INITIAL_FUTURE_LETTERS,
  INITIAL_VISION_ITEMS,
  INITIAL_DAILY_QUESTS,
  INITIAL_WEEKLY_BOSS
} from './initialData';
import { DEFAULT_ACHIEVEMENTS, DEFAULT_LEVEL_TIERS, DEFAULT_XP_CONFIG } from './gamification';

const STORAGE_KEY = 'COLLEGE_OS_STATE_V1';

export function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        profile: { ...INITIAL_USER_PROFILE, ...parsed.profile },
        appearance: { ...INITIAL_APPEARANCE, ...parsed.appearance },
        widgets: parsed.widgets || INITIAL_WIDGETS,
        goals: parsed.goals || INITIAL_GOALS,
        habits: parsed.habits || INITIAL_HABITS,
        timetable: parsed.timetable || INITIAL_TIMETABLE,
        attendance: parsed.attendance || INITIAL_ATTENDANCE,
        assignments: parsed.assignments || INITIAL_ASSIGNMENTS,
        exams: parsed.exams || INITIAL_EXAMS,
        syllabus: parsed.syllabus || INITIAL_SYLLABUS,
        notes: parsed.notes || INITIAL_NOTES,
        flashcards: parsed.flashcards || INITIAL_FLASHCARDS,
        expenses: parsed.expenses || INITIAL_EXPENSES,
        budgets: parsed.budgets || INITIAL_BUDGETS,
        skills: parsed.skills || INITIAL_SKILLS,
        projects: parsed.projects || INITIAL_PROJECTS,
        internships: parsed.internships || INITIAL_INTERNSHIPS,
        codingPractice: parsed.codingPractice || INITIAL_CODING_PRACTICE,
        rewards: parsed.rewards || INITIAL_REWARD_SHOP,
        futureLetters: parsed.futureLetters || INITIAL_FUTURE_LETTERS,
        visionItems: parsed.visionItems || INITIAL_VISION_ITEMS,
        dailyQuests: parsed.dailyQuests || INITIAL_DAILY_QUESTS,
        weeklyBoss: parsed.weeklyBoss || INITIAL_WEEKLY_BOSS,
        achievements: parsed.achievements || DEFAULT_ACHIEVEMENTS,
        levelTiers: parsed.levelTiers || DEFAULT_LEVEL_TIERS,
        xpConfig: parsed.xpConfig || DEFAULT_XP_CONFIG,
        focusHistory: parsed.focusHistory || [
          { date: "2026-10-06", minutes: 120, tag: "CS 229" },
          { date: "2026-10-05", minutes: 90, tag: "Algorithms" },
          { date: "2026-10-04", minutes: 150, tag: "Deep Work" },
          { date: "2026-10-03", minutes: 60, tag: "Math" }
        ],
        fitnessLogs: parsed.fitnessLogs || [
          { date: "2026-10-06", weight: 74.2, steps: 10450, workout: "Upper Body Hypertrophy", volume: 6400, protein: 165, sleep: 7.8, water: 3.5 },
          { date: "2026-10-05", weight: 74.4, steps: 9200, workout: "Legs & Core", volume: 7200, protein: 155, sleep: 7.2, water: 3.2 },
          { date: "2026-10-04", weight: 74.5, steps: 11800, workout: "Rest & Cardio Run", volume: 0, protein: 140, sleep: 8.0, water: 3.8 }
        ],
        plannerBlocks: parsed.plannerBlocks || [
          { id: 'pb-1', title: "CS 229 Lecture", time: "09:00 - 10:30", category: "class", color: "#6366f1" },
          { id: 'pb-2', title: "Algorithms Lecture", time: "11:00 - 12:30", category: "class", color: "#ec4899" },
          { id: 'pb-3', title: "Campus Gym Session", time: "16:00 - 17:30", category: "workout", color: "#10b981" },
          { id: 'pb-4', title: "Deep Work & Homework", time: "19:00 - 21:30", category: "study", color: "#06b6d4" }
        ],
        kanbanCards: parsed.kanbanCards || [
          { id: 'kc-1', title: "Finalize Midterm Study Guide", column: "In Progress", priority: "high", deadline: "2026-10-12", labels: ["Exams", "CS 229"] },
          { id: 'kc-2', title: "Submit Palantir Referral Form", column: "Done", priority: "high", deadline: "2026-09-25", labels: ["Career"] },
          { id: 'kc-3', title: "Draft Future Me 2027 Letter", column: "Done", priority: "medium", deadline: "2026-09-15", labels: ["Mindset"] },
          { id: 'kc-4', title: "Review Graph Algorithms with TA", column: "To Do", priority: "medium", deadline: "2026-10-11", labels: ["CS 161"] },
          { id: 'kc-5', title: "Build College OS React App", column: "Done", priority: "high", deadline: "2026-10-07", labels: ["Project"] }
        ],
        moodHistory: parsed.moodHistory || [
          { date: "2026-10-06", mood: "Locked In", emoji: "🔥", notes: "Smashed morning coding block and hit gym PR." },
          { date: "2026-10-05", mood: "Good", emoji: "🙂", notes: "Solid lectures and balanced study." },
          { date: "2026-10-04", mood: "Great", emoji: "😀", notes: "Productive Sunday sprint." }
        ]
      };
    }
  } catch (err) {
    console.error('Failed to load local state:', err);
  }

  return {
    profile: INITIAL_USER_PROFILE,
    appearance: INITIAL_APPEARANCE,
    widgets: INITIAL_WIDGETS,
    goals: INITIAL_GOALS,
    habits: INITIAL_HABITS,
    timetable: INITIAL_TIMETABLE,
    attendance: INITIAL_ATTENDANCE,
    assignments: INITIAL_ASSIGNMENTS,
    exams: INITIAL_EXAMS,
    syllabus: INITIAL_SYLLABUS,
    notes: INITIAL_NOTES,
    flashcards: INITIAL_FLASHCARDS,
    expenses: INITIAL_EXPENSES,
    budgets: INITIAL_BUDGETS,
    skills: INITIAL_SKILLS,
    projects: INITIAL_PROJECTS,
    internships: INITIAL_INTERNSHIPS,
    codingPractice: INITIAL_CODING_PRACTICE,
    rewards: INITIAL_REWARD_SHOP,
    futureLetters: INITIAL_FUTURE_LETTERS,
    visionItems: INITIAL_VISION_ITEMS,
    dailyQuests: INITIAL_DAILY_QUESTS,
    weeklyBoss: INITIAL_WEEKLY_BOSS,
    achievements: DEFAULT_ACHIEVEMENTS,
    levelTiers: DEFAULT_LEVEL_TIERS,
    xpConfig: DEFAULT_XP_CONFIG,
    focusHistory: [
      { date: "2026-10-06", minutes: 120, tag: "CS 229" },
      { date: "2026-10-05", minutes: 90, tag: "Algorithms" },
      { date: "2026-10-04", minutes: 150, tag: "Deep Work" },
      { date: "2026-10-03", minutes: 60, tag: "Math" }
    ],
    fitnessLogs: [
      { date: "2026-10-06", weight: 74.2, steps: 10450, workout: "Upper Body Hypertrophy", volume: 6400, protein: 165, sleep: 7.8, water: 3.5 },
      { date: "2026-10-05", weight: 74.4, steps: 9200, workout: "Legs & Core", volume: 7200, protein: 155, sleep: 7.2, water: 3.2 },
      { date: "2026-10-04", weight: 74.5, steps: 11800, workout: "Rest & Cardio Run", volume: 0, protein: 140, sleep: 8.0, water: 3.8 }
    ],
    plannerBlocks: [
      { id: 'pb-1', title: "CS 229 Lecture", time: "09:00 - 10:30", category: "class", color: "#6366f1" },
      { id: 'pb-2', title: "Algorithms Lecture", time: "11:00 - 12:30", category: "class", color: "#ec4899" },
      { id: 'pb-3', title: "Campus Gym Session", time: "16:00 - 17:30", category: "workout", color: "#10b981" },
      { id: 'pb-4', title: "Deep Work & Homework", time: "19:00 - 21:30", category: "study", color: "#06b6d4" }
    ],
    kanbanCards: [
      { id: 'kc-1', title: "Finalize Midterm Study Guide", column: "In Progress", priority: "high", deadline: "2026-10-12", labels: ["Exams", "CS 229"] },
      { id: 'kc-2', title: "Submit Palantir Referral Form", column: "Done", priority: "high", deadline: "2026-09-25", labels: ["Career"] },
      { id: 'kc-3', title: "Draft Future Me 2027 Letter", column: "Done", priority: "medium", deadline: "2026-09-15", labels: ["Mindset"] },
      { id: 'kc-4', title: "Review Graph Algorithms with TA", column: "To Do", priority: "medium", deadline: "2026-10-11", labels: ["CS 161"] },
      { id: 'kc-5', title: "Build College OS React App", column: "Done", priority: "high", deadline: "2026-10-07", labels: ["Project"] }
    ],
    moodHistory: [
      { date: "2026-10-06", mood: "Locked In", emoji: "🔥", notes: "Smashed morning coding block and hit gym PR." },
      { date: "2026-10-05", mood: "Good", emoji: "🙂", notes: "Solid lectures and balanced study." },
      { date: "2026-10-04", mood: "Great", emoji: "😀", notes: "Productive Sunday sprint." }
    ]
  };
}

export function saveStateToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function exportBackupJSON(state) {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `college-os-backup-${dateStr}.json`;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function validateBackupJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') return null;
    // Check key requirements
    if (data.profile && data.goals && data.habits) {
      return data;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export function clearAllLocalData() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
