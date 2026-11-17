// Dynamic Contextual Motivation Engine

export const QUOTE_STYLES = [
  { id: 'all', name: 'All Vibes' },
  { id: 'gentle', name: 'Gentle & Uplifting' },
  { id: 'tough_love', name: 'Tough Love' },
  { id: 'stoic', name: 'Stoic & Grounded' },
  { id: 'aggressive', name: 'Main Character / Savage' },
  { id: 'calm', name: 'Calm & Mindful' },
  { id: 'funny', name: 'Witty & Real' }
];

export const QUOTE_DATABASE = [
  {
    text: "Build the person you want to become, one small standard at a time.",
    author: "College OS",
    style: "stoic",
    context: "default"
  },
  {
    text: "You don't need motivation. You need one focused hour.",
    author: "Deep Work Principle",
    style: "tough_love",
    context: "exam"
  },
  {
    text: "One bad day doesn't erase the person you're becoming. Reset and show up.",
    author: "Marcus Aurelius inspired",
    style: "gentle",
    context: "missed_streak"
  },
  {
    text: "You said you would. Then you did. That is how self-respect is forged.",
    author: "Identity Protocol",
    style: "aggressive",
    context: "completed_goal"
  },
  {
    text: "Future you is going to look back at tonight and be endlessly thankful you stayed locked in.",
    author: "Midnight Focus",
    style: "gentle",
    context: "late_night"
  },
  {
    text: "Discipline compounds like high-yield interest. Every set, every rep, every page.",
    author: "Atomic Laws",
    style: "stoic",
    context: "workout"
  },
  {
    text: "The library is quiet because everyone else is dreaming while you are executing.",
    author: "Academic Warrior",
    style: "aggressive",
    context: "study"
  },
  {
    text: "Even if your code breaks 20 times, problem solver is your title.",
    author: "Software Mindset",
    style: "funny",
    context: "coding"
  },
  {
    text: "Stress is just energy with nowhere to go. Channel it into a 25-minute sprint.",
    author: "Focus Psychology",
    style: "calm",
    context: "stressed"
  },
  {
    text: "Stop waiting for the 'right time'. The clock is ticking anyway. Make it count.",
    author: "High Agency Protocol",
    style: "tough_love",
    context: "procrastination"
  },
  {
    text: "Small daily disciplines repeated consistently lead to staggering long-term mastery.",
    author: "Compounding Rules",
    style: "stoic",
    context: "default"
  },
  {
    text: "Nobody is coming to do your assignments, hit your PRs, or build your resume for you.",
    author: "Brutal Truth",
    style: "tough_love",
    context: "default"
  },
  {
    text: "Breathe in clarity, breathe out overwhelm. You are completely capable of handling today.",
    author: "Zen Academy",
    style: "calm",
    context: "low_mood"
  },
  {
    text: "Your potential doesn't care about your excuses. Level up.",
    author: "Main Character Arc",
    style: "aggressive",
    context: "default"
  },
  {
    text: "Drink some water, sit up straight, and conquer this next task. You got this.",
    author: "Study Buddy",
    style: "gentle",
    context: "default"
  }
];

export function getContextualQuote(contextType = 'default', preferredStyle = 'all') {
  let pool = QUOTE_DATABASE;

  if (preferredStyle && preferredStyle !== 'all') {
    const stylePool = pool.filter(q => q.style === preferredStyle);
    if (stylePool.length > 0) pool = stylePool;
  }

  const contextMatches = pool.filter(q => q.context === contextType);
  if (contextMatches.length > 0) {
    return contextMatches[Math.floor(Math.random() * contextMatches.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}
