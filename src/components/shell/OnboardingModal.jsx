import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, ArrowRight, Check, X } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { triggerConfetti } from '../../services/gamification';
import { Button } from '../ui/Button';

export default function OnboardingModal() {
  const { isOnboardingOpen, setIsOnboardingOpen, updateProfile, updateAppearance, awardXP } = useOS();
  const [step, setStep] = useState(1);

  const [name, setName] = useState('Alex');
  const [college, setCollege] = useState('Stanford University');
  const [course, setCourse] = useState('Computer Science & AI');
  const [topGoal, setTopGoal] = useState('Master Deep Learning & Land AI Internship');
  const [selectedTheme, setSelectedTheme] = useState('dark');

  if (!isOnboardingOpen) return null;

  const handleSkip = () => {
    updateProfile({ onboardingCompleted: true });
    setIsOnboardingOpen(false);
  };

  const handleFinish = () => {
    updateProfile({
      name: name.trim() || 'Alex',
      college: college.trim() || 'Stanford University',
      course: course.trim() || 'Computer Science',
      onboardingCompleted: true
    });
    updateAppearance({ theme: selectedTheme });
    awardXP(100, "Completed College OS Onboarding");
    triggerConfetti(100);
    setIsOnboardingOpen(false);
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-modal bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 select-none"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-lg glass-window p-7 md:p-8 border border-os-border-light rounded-3xl shadow-elevation-5 space-y-5 relative overflow-hidden bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-black"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-os-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-os-accent flex items-center justify-center text-white font-bold shadow-sm">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="font-bold text-sm font-display text-white">COLLEGE OS SETUP</span>
                <p className="text-[10px] text-os-text-muted">3-minute initial configuration</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-os-accent font-semibold">
                Step {step} of 3
              </span>
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-os-text-subtle hover:text-os-text underline-offset-2 hover:underline cursor-pointer"
                title="Skip onboarding"
              >
                Skip
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-os-accent rounded-full"
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.25 }}
            />
          </div>

          {/* STEP 1: Personal Profile */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Who is stepping into the driver's seat?</h3>
                  <p className="text-xs text-os-text-muted mt-0.5">Set up your academic identity and university profile.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-os-text-muted mb-1 font-medium">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-os-border focus:border-os-accent focus:outline-none text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-os-text-muted mb-1 font-medium">University / College</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="Stanford University"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-os-border focus:border-os-accent focus:outline-none text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-os-text-muted mb-1 font-medium">Course / Major</label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="Computer Science & AI"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-os-border focus:border-os-accent focus:outline-none text-white text-xs"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Top Vision */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-white font-display">What is your #1 defining ambition?</h3>
                  <p className="text-xs text-os-text-muted mt-0.5">"Build the person you want to become."</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-os-text-muted mb-1 font-medium">Top Priority Goal for this Semester</label>
                    <textarea
                      rows={3}
                      value={topGoal}
                      onChange={(e) => setTopGoal(e.target.value)}
                      placeholder="Master machine learning fundamentals and land summer internship..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-os-border focus:border-os-accent focus:outline-none text-white resize-none text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Theme */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Select Your OS Visual Theme</h3>
                  <p className="text-xs text-os-text-muted mt-0.5">You can switch themes anytime from the top bar or settings.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { id: 'dark', name: 'Dark Charcoal' },
                    { id: 'light', name: 'Clean Light' },
                    { id: 'cyber', name: 'Cyberpunk' },
                    { id: 'study', name: 'Emerald Study' }
                  ].map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setSelectedTheme(th.id)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedTheme === th.id
                          ? 'bg-os-accent/20 border-os-accent text-white font-bold shadow-md'
                          : 'bg-white/5 border-os-border text-os-text-muted hover:bg-white/10'
                      }`}
                    >
                      <span>{th.name}</span>
                      {selectedTheme === th.id && <Check className="w-4 h-4 text-os-accent" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-os-border">
            {step > 1 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-os-text-subtle"
              >
                Skip for now
              </Button>
            )}

            {step < 3 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(step + 1)}
                rightIcon={ArrowRight}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleFinish}
                leftIcon={Sparkles}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 font-bold"
              >
                Launch College OS (+100 XP)
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
