import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, ArrowRight, Check, Target, BookOpen, CheckCircle2 } from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { triggerConfetti } from '../../services/gamification';

export default function OnboardingModal() {
  const { isOnboardingOpen, setIsOnboardingOpen, updateProfile, updateAppearance, awardXP } = useOS();
  const [step, setStep] = useState(1);

  const [name, setName] = useState('Alex');
  const [college, setCollege] = useState('Stanford University');
  const [course, setCourse] = useState('Computer Science & AI');
  const [year, setYear] = useState('Sophomore (Year 2)');
  const [topGoal, setTopGoal] = useState('Master Deep Learning & Land AI Internship');
  const [selectedTheme, setSelectedTheme] = useState('dark');

  if (!isOnboardingOpen) return null;

  const handleFinish = () => {
    updateProfile({
      name,
      college,
      course,
      year,
      onboardingCompleted: true
    });
    updateAppearance({ theme: selectedTheme });
    awardXP(100, "Completed College OS Onboarding");
    triggerConfetti(100);
    setIsOnboardingOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-xl glass-window p-8 border border-white/20 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-black"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm font-display text-white">COLLEGE OS ONBOARDING</span>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-semibold">
              Step {step} of 3
            </span>
          </div>

          {/* STEP 1: Personal Profile */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white font-display">Who is stepping into the driver's seat?</h3>
                <p className="text-xs text-os-text-muted mt-1">Set up your academic identity and university profile.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-os-text-muted mb-1 font-medium">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1 font-medium">University / College</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1 font-medium">Course / Major</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Top Vision */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white font-display">What is your #1 defining ambition?</h3>
                <p className="text-xs text-os-text-muted mt-1">"Build the person you want to become."</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-os-text-muted mb-1 font-medium">Top Priority Goal for this Semester</label>
                  <textarea
                    rows={3}
                    value={topGoal}
                    onChange={(e) => setTopGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white resize-none text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Theme */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white font-display">Select Your OS Visual Vibe</h3>
                <p className="text-xs text-os-text-muted mt-1">Can be changed anytime from Settings or Top Bar.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { id: 'dark', name: 'Dark Charcoal' },
                  { id: 'cyber', name: 'Cyberpunk' },
                  { id: 'lofi', name: 'Warm Lo-Fi' },
                  { id: 'study', name: 'Emerald Study' }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setSelectedTheme(th.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedTheme === th.id
                        ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold shadow-lg'
                        : 'bg-white/5 border-white/10 text-os-text-muted hover:bg-white/10'
                    }`}
                  >
                    <span>{th.name}</span>
                    {selectedTheme === th.id && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl bg-white/5 text-os-text text-xs cursor-pointer"
              >
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch My College OS (+100 XP)</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
