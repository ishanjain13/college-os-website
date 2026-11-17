import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Terminal, CheckCircle2 } from 'lucide-react';
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

  const handleSkip = useCallback(() => {
    try {
      sessionStorage.setItem('college_os_session_booted', 'true');
    } catch {}
    setIsBooting(false);
  }, [setIsBooting]);

  // Check once-per-session boot status
  useEffect(() => {
    try {
      const alreadyBooted = sessionStorage.getItem('college_os_session_booted');
      if (alreadyBooted === 'true') {
        setIsBooting(false);
        return;
      }
    } catch {}
  }, [setIsBooting]);

  useEffect(() => {
    if (!isBooting) return;

    const interval = setInterval(() => {
      setBootStep((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            handleSkip();
          }, 500);
          return prev;
        }
      });
    }, 380);

    return () => clearInterval(interval);
  }, [isBooting, messages.length, handleSkip]);

  // Keyboard shortcut (Space, Enter, Escape) to skip immediately
  useEffect(() => {
    if (!isBooting) return;

    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBooting, handleSkip]);

  if (!isBooting) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.03 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        onClick={handleSkip}
        className="fixed inset-0 z-boot bg-[#050811] flex flex-col items-center justify-center text-white select-none px-6 cursor-pointer"
      >
        {/* Glow backdrop */}
        <div className="absolute w-96 h-96 rounded-full bg-os-accent/20 blur-[120px] pointer-events-none" />

        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md p-8 glass-panel border border-os-border-light rounded-2xl shadow-elevation-5 flex flex-col items-center cursor-default"
        >
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-neon">
              <Zap className="w-8 h-8 text-white animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-wider font-display mb-1 bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            COLLEGE OS
          </h1>
          <p className="text-xs text-indigo-400/90 uppercase tracking-widest font-mono mb-5">
            Personal Digital Workspace
          </p>

          <div className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 font-mono text-xs text-slate-300 space-y-2 mb-5 min-h-[110px]">
            {messages.slice(0, bootStep + 1).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-os-accent">➜</span>
                <span className={i === bootStep ? "text-white font-semibold" : "text-slate-400"}>
                  {msg}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-4 border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((bootStep + 1) / messages.length) * 100}%` }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
            />
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1 px-3 rounded hover:bg-white/10 flex items-center gap-1.5"
          >
            <span>Skip Boot Sequence</span>
            <kbd className="font-mono text-[10px] bg-white/10 px-1 rounded text-slate-300">Space</kbd>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
