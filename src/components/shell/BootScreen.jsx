import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Zap, Sparkles } from 'lucide-react';
import { useOS } from '../../context/OSContext';

export default function BootScreen() {
  const { isBooting, setIsBooting, state } = useOS();
  const [bootStep, setBootStep] = useState(0);

  const messages = [
    "Initializing College OS kernel...",
    "Mounting academic databases & habit modules...",
    "Syncing goal milestones and gamification engine...",
    `Verifying user profile: ${state.profile.name || 'Scholar'}`,
    `Day ${state.profile.streak} of your unstoppable streak.`
  ];

  useEffect(() => {
    if (!isBooting) return;

    const interval = setInterval(() => {
      setBootStep((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsBooting(false);
          }, 650);
          return prev;
        }
      });
    }, 420);

    return () => clearInterval(interval);
  }, [isBooting, messages.length, setIsBooting]);

  if (!isBooting) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[99999] bg-[#050811] flex flex-col items-center justify-center text-white select-none px-6"
      >
        {/* Glow backdrop */}
        <div className="absolute w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md p-8 glass-panel border border-white/10 rounded-2xl shadow-2xl flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-neon">
              <Zap className="w-8 h-8 text-white animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-wider font-display mb-1 bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            COLLEGE OS
          </h1>
          <p className="text-xs text-indigo-400/80 uppercase tracking-widest font-mono mb-6">
            v1.0 • Personal Digital HQ
          </p>

          <div className="w-full bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 mb-6 min-h-[110px]">
            {messages.slice(0, bootStep + 1).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-indigo-400">➜</span>
                <span className={i === bootStep ? "text-white font-semibold" : "text-slate-400"}>
                  {msg}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ width: '0%' }}
              animate={{ width: `${((bootStep + 1) / messages.length) * 100}%` }}
              transition={{ ease: "easeInOut", duration: 0.35 }}
            />
          </div>

          <button
            onClick={() => setIsBooting(false)}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1 px-3 rounded hover:bg-white/5"
          >
            Skip Boot Sequence (Space)
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
