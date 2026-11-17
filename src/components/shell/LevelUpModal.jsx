import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Sparkles, X, ArrowUpRight } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { triggerConfetti } from '../../services/gamification';
import { Button } from '../ui/Button';

export default function LevelUpModal() {
  const { levelUpData, setLevelUpData, openWindow } = useOS();

  useEffect(() => {
    if (levelUpData) {
      triggerConfetti(120);
    }
  }, [levelUpData]);

  if (!levelUpData) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        onClick={() => setLevelUpData(null)}
        className="fixed inset-0 z-modal bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
      >
        <motion.div
          initial={{ scale: 0.82, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md glass-window p-8 text-center border-2 border-amber-500/40 rounded-3xl shadow-elevation-5 space-y-5 relative overflow-hidden bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-black"
        >
          {/* Confetti Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={() => setLevelUpData(null)}
            className="absolute top-4 right-4 text-os-text-muted hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Celebratory Badge */}
          <motion.div
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
            className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-elevation-3 text-black"
          >
            <Crown className="w-10 h-10 fill-black stroke-black" />
          </motion.div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
              LEVEL UP ACHIEVED!
            </span>
            <h2 className="text-3xl font-black font-display text-white tracking-tight">
              LEVEL {levelUpData.level}
            </h2>
            <p className="text-sm font-bold text-indigo-300">
              Rank Title: "{levelUpData.title}"
            </p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            Your standards are compounding. You have unlocked new academic prestige and proved relentless consistency.
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold shadow-lg shadow-amber-500/25 border-none"
              onClick={() => {
                setLevelUpData(null);
                openWindow('achievements');
              }}
            >
              <span>View Achievement Hub</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
            <button
              type="button"
              onClick={() => setLevelUpData(null)}
              className="text-xs text-os-text-muted hover:text-white py-1 transition-colors cursor-pointer"
            >
              Dismiss & Continue
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
