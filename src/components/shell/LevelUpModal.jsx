import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Sparkles, X } from 'lucide-react';
import { useOS } from '../../context/OSContext';

export default function LevelUpModal() {
  const { levelUpData, setLevelUpData } = useOS();

  if (!levelUpData) return null;

  return (
    <AnimatePresence>
      <div
        onClick={() => setLevelUpData(null)}
        className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md glass-window p-8 text-center border-2 border-amber-500/50 rounded-3xl shadow-2xl space-y-5 relative overflow-hidden bg-gradient-to-b from-amber-950/40 via-purple-950/40 to-black"
        >
          {/* Confetti Glow Backdrop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={() => setLevelUpData(null)}
            className="absolute top-4 right-4 text-os-text-muted hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-xl shadow-amber-500/40 text-black">
            <Crown className="w-10 h-10 fill-black" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              LEVEL UP ACHIEVED!
            </span>
            <h2 className="text-3xl font-black font-display text-white">
              LEVEL {levelUpData.level}
            </h2>
            <p className="text-sm font-bold text-indigo-300">
              Rank Title: "{levelUpData.title}"
            </p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            Your standards are compounding. You have unlocked new academic prestige and proved unstoppable consistency.
          </p>

          <button
            onClick={() => setLevelUpData(null)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold text-sm shadow-xl shadow-amber-500/30 cursor-pointer transition-transform active:scale-95"
          >
            Claim Glory & Continue Grind
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
