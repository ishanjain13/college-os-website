import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, X } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { triggerConfetti } from '../../services/gamification';

export default function AchievementToast() {
  const { achievementToast, setAchievementToast } = useOS();
  const [toastList, setToastList] = useState([]);

  // When achievementToast changes, add to local toast queue
  useEffect(() => {
    if (!achievementToast) return;

    // Trigger celebratory confetti
    triggerConfetti(60);

    const toastId = `toast-${Date.now()}`;
    const newToast = {
      id: toastId,
      ...achievementToast
    };

    setToastList((prev) => [newToast, ...prev.slice(0, 2)]); // Keep up to 3 stacked toasts

    // Clear context toast
    setAchievementToast(null);

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      setToastList((prev) => prev.filter((t) => t.id !== toastId));
    }, 5200);

    return () => clearTimeout(timer);
  }, [achievementToast, setAchievementToast]);

  const removeToast = (id) => {
    setToastList((prev) => prev.filter((t) => t.id !== id));
  };

  if (toastList.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-toast flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
      <AnimatePresence>
        {toastList.map((toast, index) => (
          <motion.div
            key={toast.id}
            layout
            drag="x"
            dragConstraints={{ left: 0, right: 300 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > 80 || info.velocity.x > 400) {
                removeToast(toast.id);
              }
            }}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 120, scale: 0.9 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="pointer-events-auto relative glass-window p-4 border border-amber-500/40 shadow-elevation-4 rounded-2xl flex items-start gap-3.5 bg-gradient-to-r from-amber-950/80 via-slate-900/95 to-slate-950 text-white overflow-hidden cursor-grab active:cursor-grabbing group"
          >
            {/* Auto dismiss countdown progress line */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-300"
            />

            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/35 flex items-center justify-center text-amber-300 shrink-0 shadow-sm mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-amber-400">
                <Sparkles className="w-3 h-3" />
                <span>Achievement Unlocked</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-0.5 truncate">{toast.title}</h4>
              <p className="text-[11px] text-os-text-muted mt-0.5 leading-snug">{toast.description}</p>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-os-text-muted hover:text-white p-0.5 rounded cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-lg border border-amber-500/30">
                +{toast.xpReward || 100} XP
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
