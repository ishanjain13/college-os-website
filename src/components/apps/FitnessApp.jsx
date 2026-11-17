import React, { useState } from 'react';
import { 
  Dumbbell, 
  Plus, 
  Activity, 
  Flame, 
  TrendingUp, 
  Scale, 
  Footprints, 
  Droplets, 
  Moon, 
  Sparkles,
  Trash2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useOS } from '../../context/OSContext';

export default function FitnessApp() {
  const { state, setFitnessLogs, awardXP } = useOS();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    workout: 'Upper Body Hypertrophy',
    volume: 6500,
    weight: 74.2,
    steps: 10000,
    protein: 160,
    sleep: 7.5,
    water: 3.5
  });

  const handleSaveLog = (e) => {
    e.preventDefault();
    setFitnessLogs((prev) => [logForm, ...prev]);
    awardXP(state.xpConfig.workoutLogged || 90, `Logged workout: ${logForm.workout}`);
    setIsLogModalOpen(false);
  };

  const chartData = [...state.fitnessLogs].reverse();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-red-400" />
            <span>Iron Scholar Fitness & Biometrics</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Physical vitality is the hardware foundation of high-output cognitive work.
          </p>
        </div>

        <button
          onClick={() => setIsLogModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Workout / Metrics</span>
        </button>
      </div>

      {/* Quick Biometrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 border border-white/10">
          <div className="flex items-center justify-between text-xs text-os-text-muted mb-1">
            <span className="font-mono">BODY WEIGHT</span>
            <Scale className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {state.fitnessLogs[0]?.weight || '--'} <span className="text-xs font-normal text-os-text-muted">kg</span>
          </div>
        </div>

        <div className="glass-panel p-4 border border-white/10">
          <div className="flex items-center justify-between text-xs text-os-text-muted mb-1">
            <span className="font-mono">DAILY STEPS</span>
            <Footprints className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {state.fitnessLogs[0]?.steps?.toLocaleString() || '--'}
          </div>
        </div>

        <div className="glass-panel p-4 border border-white/10">
          <div className="flex items-center justify-between text-xs text-os-text-muted mb-1">
            <span className="font-mono">PROTEIN INTAKE</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {state.fitnessLogs[0]?.protein || '--'} <span className="text-xs font-normal text-os-text-muted">g</span>
          </div>
        </div>

        <div className="glass-panel p-4 border border-white/10">
          <div className="flex items-center justify-between text-xs text-os-text-muted mb-1">
            <span className="font-mono">SLEEP RECOVERY</span>
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {state.fitnessLogs[0]?.sleep || '--'} <span className="text-xs font-normal text-os-text-muted">hrs</span>
          </div>
        </div>
      </div>

      {/* Charts Section: Volume & Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-panel p-5 border border-white/10 space-y-3">
          <h4 className="text-xs font-bold uppercase text-red-300 font-mono flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-red-400" />
            <span>Workout Volume Trend (kg lifted)</span>
          </h4>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Bar dataKey="volume" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-5 border border-white/10 space-y-3">
          <h4 className="text-xs font-bold uppercase text-orange-300 font-mono flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span>Daily Step Count & Calorie Expenditure</span>
          </h4>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="steps" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Workout Logs History List */}
      <div className="glass-panel p-5 border border-white/10 space-y-3">
        <h4 className="text-xs font-bold uppercase text-white font-mono">Workout Sessions History</h4>
        <div className="space-y-2">
          {state.fitnessLogs.map((log, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">{log.workout}</span>
                <span className="text-[10px] text-os-text-muted ml-2 font-mono">{log.date}</span>
              </div>
              <div className="flex items-center gap-4 text-os-text-muted font-mono">
                <span>{log.volume} kg vol</span>
                <span>{log.protein}g protein</span>
                <span>{log.sleep}h sleep</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Workout Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Log Workout & Metrics</h3>
            <form onSubmit={handleSaveLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Workout Name / Routine</label>
                <input
                  type="text"
                  required
                  value={logForm.workout}
                  onChange={(e) => setLogForm({ ...logForm, workout: e.target.value })}
                  placeholder="e.g. Chest & Triceps Hypertrophy"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Total Volume (kg)</label>
                  <input
                    type="number"
                    value={logForm.volume}
                    onChange={(e) => setLogForm({ ...logForm, volume: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Body Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={logForm.weight}
                    onChange={(e) => setLogForm({ ...logForm, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Steps</label>
                  <input
                    type="number"
                    value={logForm.steps}
                    onChange={(e) => setLogForm({ ...logForm, steps: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={logForm.protein}
                    onChange={(e) => setLogForm({ ...logForm, protein: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Sleep (hrs)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={logForm.sleep}
                    onChange={(e) => setLogForm({ ...logForm, sleep: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-os-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold"
                >
                  Save Log (+90 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
