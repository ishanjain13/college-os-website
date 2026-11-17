import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Smile, 
  Moon, 
  Droplets, 
  Wind, 
  Play, 
  Pause, 
  Sparkles, 
  RotateCcw 
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

export default function WellbeingApp() {
  const { state, setMoodHistory, awardXP } = useOS();

  // Breathing Box state
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Hold
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);
  const [breathPattern, setBreathPattern] = useState('box'); // 'box' (4-4-4-4) | 'relax' (4-7-8)

  useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setBreathSecondsLeft((prev) => {
        if (prev <= 1) {
          // Switch phase
          if (breathPattern === 'box') {
            if (breathPhase === 'Inhale') { setBreathPhase('Hold'); return 4; }
            if (breathPhase === 'Hold') { setBreathPhase('Exhale'); return 4; }
            if (breathPhase === 'Exhale') { setBreathPhase('Hold '); return 4; }
            if (breathPhase === 'Hold ') { setBreathPhase('Inhale'); return 4; }
          } else {
            // 4-7-8
            if (breathPhase === 'Inhale') { setBreathPhase('Hold'); return 7; }
            if (breathPhase === 'Hold') { setBreathPhase('Exhale'); return 8; }
            if (breathPhase === 'Exhale') { setBreathPhase('Inhale'); return 4; }
          }
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingActive, breathPhase, breathPattern]);

  const toggleBreathing = () => {
    if (!breathingActive) {
      setBreathPhase('Inhale');
      setBreathSecondsLeft(4);
      awardXP(20, 'Mindfulness breathing reset session');
    }
    setBreathingActive(!breathingActive);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            <span>Wellbeing, Zen & Nervous System Reset</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Calibrate your nervous system with guided physiological sigh and box breathing.
          </p>
        </div>
      </div>

      {/* Guided Breathing Chamber */}
      <div className="glass-panel p-8 md:p-12 text-center relative overflow-hidden bg-gradient-to-b from-rose-950/20 via-slate-900/60 to-black/80 border border-rose-500/20 flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Pattern Switcher */}
        <div className="flex gap-2 mb-8 z-10">
          <button
            onClick={() => {
              setBreathPattern('box');
              setBreathingActive(false);
              setBreathPhase('Inhale');
              setBreathSecondsLeft(4);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              breathPattern === 'box'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-white/5 text-os-text-muted hover:text-white'
            }`}
          >
            Box Breathing (4-4-4-4)
          </button>
          <button
            onClick={() => {
              setBreathPattern('relax');
              setBreathingActive(false);
              setBreathPhase('Inhale');
              setBreathSecondsLeft(4);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              breathPattern === 'relax'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-white/5 text-os-text-muted hover:text-white'
            }`}
          >
            4-7-8 Relaxing Breath
          </button>
        </div>

        {/* Animated Breathing Circle */}
        <div className="relative w-64 h-64 flex items-center justify-center my-4">
          <div
            className={`absolute inset-0 rounded-full border-2 border-rose-500/30 transition-all duration-1000 ${
              breathingActive && breathPhase === 'Inhale'
                ? 'scale-125 bg-rose-500/20 border-rose-400 shadow-2xl shadow-rose-500/30'
                : breathingActive && breathPhase.startsWith('Hold')
                ? 'scale-125 bg-rose-500/30 border-rose-300 animate-pulse'
                : breathingActive && breathPhase === 'Exhale'
                ? 'scale-75 bg-rose-950/20 border-rose-600'
                : 'scale-100 bg-white/5'
            }`}
          />

          <div className="relative z-10 space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-rose-300 font-bold block">
              {breathingActive ? breathPhase : 'READY'}
            </span>
            <div className="text-4xl font-black font-mono text-white">
              {breathingActive ? breathSecondsLeft : '04'}
            </div>
            <span className="text-[11px] text-os-text-muted block">
              {breathingActive ? (breathPhase === 'Inhale' ? 'Fill your lungs slowly' : breathPhase.startsWith('Hold') ? 'Keep still & relax shoulders' : 'Release slowly through mouth') : 'Click Begin to start'}
            </span>
          </div>
        </div>

        {/* Control Button */}
        <div className="mt-8 z-10">
          <button
            onClick={toggleBreathing}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-sm shadow-xl shadow-rose-500/30 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            {breathingActive ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{breathingActive ? 'Pause Session' : 'Begin Breathing Session'}</span>
          </button>
        </div>
      </div>

      {/* Mood Trends Over Time */}
      <div className="glass-panel p-5 border border-white/10 space-y-3">
        <h4 className="text-xs font-bold uppercase text-white font-mono flex items-center gap-1.5">
          <Smile className="w-4 h-4 text-purple-400" />
          <span>Mood & Emotional Energy Trend</span>
        </h4>

        <div className="space-y-2">
          {state.moodHistory.map((m, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{m.emoji}</span>
                <div>
                  <span className="font-bold text-white">{m.mood}</span>
                  <span className="text-[10px] text-os-text-muted ml-2 font-mono">{m.date}</span>
                </div>
              </div>
              <span className="text-os-text-muted">{m.notes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
