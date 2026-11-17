import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, X } from 'lucide-react';
import { useOS } from '../../context/OSContext';

export default function AchievementToast() {
  const { achievementToast } = useOS();

  if (!achievementToast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-20 right-6 z-[99999] glass-window p-4 border border-amber-500/50 shadow-2xl rounded-2xl flex items-center gap-3.5 max-w-sm bg-gradient-to-r from-amber-950/80 to-slate-900/90 text-white"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-amber-400">
            <Sparkles className="w-3 h-3" />
            <span>ACHIEVEMENT UNLOCKED!</span>
          </div>
          <h4 className="text-xs font-bold text-white mt-0.5">{achievementToast.title}</h4>
          <p className="text-[11px] text-os-text-muted">{achievementToast.description}</p>
        </div>

        <span className="text-xs font-mono font-bold text-amber-300 ml-auto shrink-0 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          +{achievementToast.xpReward} XP
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
