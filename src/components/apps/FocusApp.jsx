import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Headphones, 
  BarChart2,
  Tag
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import soundService from '../../services/sound';
import { triggerConfetti } from '../../services/gamification';

export default function FocusApp() {
  const { state, setFocusHistory, awardXP } = useOS();

  // Focus Timer Modes: 25/5, 50/10, Custom
  const [timerMode, setTimerMode] = useState('25_5'); // '25_5' | '50_10' | 'custom'
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [selectedTask, setSelectedTask] = useState('CS 229: Machine Learning Study');
  const [ambientSound, setAmbientSound] = useState('rain'); // 'rain' | 'cafe' | 'forest' | 'white_noise' | 'silence'
  const [isDeepWorkFullscreen, setIsDeepWorkFullscreen] = useState(false);

  const timerRef = useRef(null);

  // Switch modes
  const handleSelectMode = (mode) => {
    setIsRunning(false);
    setIsBreak(false);
    setTimerMode(mode);
    if (mode === '25_5') {
      setWorkDuration(25 * 60);
      setBreakDuration(5 * 60);
      setTimeLeft(25 * 60);
    } else if (mode === '50_10') {
      setWorkDuration(50 * 60);
      setBreakDuration(10 * 60);
      setTimeLeft(50 * 60);
    }
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            soundService.playTimerEnd();

            if (!isBreak) {
              // Completed a work session
              const minutes = Math.round(workDuration / 60);
              const todayStr = new Date().toISOString().split('T')[0];

              setFocusHistory((history) => [
                { date: todayStr, minutes, tag: selectedTask },
                ...history
              ]);

              awardXP(Math.round((minutes / 25) * 45), `Focus session completed: ${selectedTask}`);
              triggerConfetti(60);

              alert(`Focus Session Completed! Take a ${Math.round(breakDuration / 60)}-minute restorative break.`);
              setIsBreak(true);
              return breakDuration;
            } else {
              alert("Break is over! Ready for the next sprint?");
              setIsBreak(false);
              return workDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, isBreak, workDuration, breakDuration, selectedTask, setFocusHistory, awardXP]);

  // Ambient sound synthesizer handler
  const handleToggleAmbient = (soundType) => {
    setAmbientSound(soundType);
    if (soundType === 'silence') {
      soundService.stopAmbient();
    } else {
      soundService.startAmbient(soundType);
    }
  };

  const handleStartPause = () => {
    soundService.playClick();
    if (!isRunning && ambientSound !== 'silence') {
      soundService.startAmbient(ambientSound);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    soundService.playClick();
    setIsRunning(false);
    setTimeLeft(isBreak ? breakDuration : workDuration);
    soundService.stopAmbient();
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSeconds = isBreak ? breakDuration : workDuration;
  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);

  // Total study minutes calculation
  const totalStudyMins = state.focusHistory.reduce((sum, h) => sum + (h.minutes || 0), 0);
  const totalHours = (totalStudyMins / 60).toFixed(1);

  return (
    <div className={`space-y-6 max-w-5xl mx-auto pb-10 ${
      isDeepWorkFullscreen ? 'fixed inset-0 z-[9999] bg-[#060913] p-8 flex flex-col justify-between' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Deep Work & Pomodoro Chamber</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Zero distraction zone. Pure execution and cognitive compounding.
          </p>
        </div>

        <button
          onClick={() => setIsDeepWorkFullscreen(!isDeepWorkFullscreen)}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 cursor-pointer"
        >
          {isDeepWorkFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span>{isDeepWorkFullscreen ? 'Exit Deep Work' : 'Deep Work Mode'}</span>
        </button>
      </div>

      {/* Main Focus Dial Card */}
      <div className="glass-panel p-8 md:p-12 text-center relative overflow-hidden bg-gradient-to-b from-amber-950/20 via-slate-900/60 to-black/80 border border-amber-500/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Mode Selector Buttons */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => handleSelectMode('25_5')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              timerMode === '25_5'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'bg-white/5 text-os-text-muted hover:text-white'
            }`}
          >
            Classic 25 / 5
          </button>
          <button
            onClick={() => handleSelectMode('50_10')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              timerMode === '50_10'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'bg-white/5 text-os-text-muted hover:text-white'
            }`}
          >
            Ultradian 50 / 10
          </button>
        </div>

        {/* Task Tag Selection */}
        <div className="max-w-xs mx-auto mb-6">
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-os-text">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <input
              type="text"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              placeholder="Tag task or goal..."
              className="bg-transparent text-white focus:outline-none w-full text-xs font-medium"
            />
          </div>
        </div>

        {/* Huge Digital Clock Display */}
        <div className="my-6">
          <div className="text-6xl md:text-8xl font-black font-mono tracking-tight text-white drop-shadow-2xl">
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-amber-400/80 mt-2">
            {isBreak ? '☕ Restorative Break' : '⚡ Deep Focus Sprint'} • {progressPercent}% Elapsed
          </div>
        </div>

        {/* Linear Progress Indicator */}
        <div className="max-w-md mx-auto h-2 bg-black/50 rounded-full overflow-hidden border border-white/10 mb-8">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-white transition-all cursor-pointer border border-white/10"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleStartPause}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-base shadow-xl shadow-amber-500/30 flex items-center gap-2.5 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-black" />
                <span>Pause Sprint</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-black" />
                <span>Begin Focus</span>
              </>
            )}
          </button>
        </div>

        {/* Ambient Noise Selector (Powered by Web Audio Synth) */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center items-center gap-2 text-xs">
          <span className="text-os-text-muted flex items-center gap-1.5 mr-2 font-mono">
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            Ambient Engine:
          </span>
          {[
            { id: 'rain', label: 'Rain' },
            { id: 'cafe', label: 'Cafe' },
            { id: 'forest', label: 'Forest' },
            { id: 'white_noise', label: 'White Noise' },
            { id: 'silence', label: 'Muted' }
          ].map((snd) => (
            <button
              key={snd.id}
              onClick={() => handleToggleAmbient(snd.id)}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                ambientSound === snd.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                  : 'bg-white/5 border-white/5 text-os-text-muted hover:text-white'
              }`}
            >
              {snd.label}
            </button>
          ))}
        </div>
      </div>

      {/* Focus History & Study Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 text-center flex flex-col justify-center">
          <span className="text-xs text-os-text-muted font-mono uppercase">Total Study Logged</span>
          <div className="text-3xl font-extrabold font-mono text-white my-1">{totalHours} Hours</div>
          <span className="text-[11px] text-amber-400 font-semibold">{totalStudyMins} total minutes clocked</span>
        </div>

        <div className="glass-panel p-5 col-span-2 space-y-3">
          <h4 className="text-xs font-bold uppercase text-white font-mono flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-amber-400" />
            <span>Recent Focus Sprints</span>
          </h4>

          <div className="space-y-2">
            {state.focusHistory.slice(0, 4).map((h, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{h.tag || 'Focused Study'}</span>
                  <span className="text-[10px] text-os-text-muted ml-2 font-mono">{h.date}</span>
                </div>
                <span className="font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  +{h.minutes} min
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
