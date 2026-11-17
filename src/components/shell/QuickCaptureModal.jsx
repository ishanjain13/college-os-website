import React, { useState } from 'react';
import { 
  Plus, 
  Target, 
  CheckCircle2, 
  CheckSquare, 
  Wallet, 
  Feather, 
  BookOpen, 
  X, 
  Sparkles 
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

export default function QuickCaptureModal() {
  const { 
    isQuickCaptureOpen, 
    setIsQuickCaptureOpen, 
    setGoals, 
    setHabits, 
    setKanbanCards, 
    setAssignments, 
    setExpenses, 
    setNotes, 
    awardXP 
  } = useOS();

  const [captureType, setCaptureType] = useState('task'); // 'task' | 'goal' | 'habit' | 'assignment' | 'expense' | 'note'
  const [title, setTitle] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [amount, setAmount] = useState('');

  if (!isQuickCaptureOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (captureType === 'task') {
      setKanbanCards((prev) => [
        {
          id: `kc-${Date.now()}`,
          title: title.trim(),
          column: 'To Do',
          priority: 'high',
          deadline: new Date().toISOString().split('T')[0],
          labels: ['Quick Capture']
        },
        ...prev
      ]);
      awardXP(20, `Task captured: ${title}`);
    } else if (captureType === 'goal') {
      setGoals((prev) => [
        {
          id: `g-${Date.now()}`,
          name: title.trim(),
          description: extraInfo || 'Core focus target',
          category: 'Academic',
          priority: 'high',
          startDate: new Date().toISOString().split('T')[0],
          deadline: '',
          status: 'Active',
          currentValue: 0,
          targetValue: 5,
          unit: 'steps',
          xpReward: 300,
          color: '#6366f1',
          milestones: [],
          reviews: []
        },
        ...prev
      ]);
      awardXP(50, `Goal defined: ${title}`);
    } else if (captureType === 'habit') {
      setHabits((prev) => [
        {
          id: `h-${Date.now()}`,
          name: title.trim(),
          category: 'Academic',
          type: 'checkbox',
          target: 1,
          unit: 'session',
          xp: 35,
          frequency: 'daily',
          color: '#10b981',
          currentStreak: 0,
          longestStreak: 0,
          freezeDaysAvailable: 2,
          active: true,
          mandatory: true,
          completedDates: []
        },
        ...prev
      ]);
      awardXP(30, `Habit protocol created: ${title}`);
    } else if (captureType === 'assignment') {
      setAssignments((prev) => [
        {
          id: `asg-${Date.now()}`,
          subject: extraInfo || 'General Coursework',
          title: title.trim(),
          description: 'Captured via Quick Action',
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          status: 'In progress',
          progress: 0,
          notes: ''
        },
        ...prev
      ]);
      awardXP(30, `Assignment logged: ${title}`);
    } else if (captureType === 'expense') {
      setExpenses((prev) => [
        {
          id: `exp-${Date.now()}`,
          title: title.trim(),
          amount: parseFloat(amount) || 10,
          category: 'Food',
          type: 'expense',
          date: new Date().toISOString().split('T')[0]
        },
        ...prev
      ]);
      awardXP(15, `Expense recorded: ${title}`);
    } else if (captureType === 'note') {
      setNotes((prev) => [
        {
          id: `n-${Date.now()}`,
          title: title.trim(),
          subject: 'Quick Capture',
          pinned: true,
          tags: ['Quick'],
          content: `# ${title}\n\n${extraInfo}`,
          updatedAt: new Date().toISOString()
        },
        ...prev
      ]);
      awardXP(20, `Note captured: ${title}`);
    }

    setTitle('');
    setExtraInfo('');
    setAmount('');
    setIsQuickCaptureOpen(false);
  };

  const captureTypes = [
    { id: 'task', label: 'Kanban Task', icon: CheckSquare },
    { id: 'goal', label: 'Core Goal', icon: Target },
    { id: 'habit', label: 'Habit Protocol', icon: CheckCircle2 },
    { id: 'assignment', label: 'Assignment', icon: Sparkles },
    { id: 'expense', label: 'Expense', icon: Wallet },
    { id: 'note', label: 'Quick Note', icon: BookOpen }
  ];

  return (
    <div
      onClick={() => setIsQuickCaptureOpen(false)}
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg glass-window border border-white/20 p-6 shadow-2xl rounded-2xl animate-in zoom-in-95 duration-150 space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" />
            <span>Instant Quick Capture</span>
          </h3>
          <button
            onClick={() => setIsQuickCaptureOpen(false)}
            className="text-os-text-muted hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Capture Type Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {captureTypes.map((t) => {
            const Icon = t.icon;
            const isSelected = captureType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setCaptureType(t.id)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-[11px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold shadow-md'
                    : 'bg-white/5 border-white/5 text-os-text-muted hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-300' : 'text-os-text-subtle'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-os-text-muted mb-1 font-medium">Title / Action Item</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${captureType} description...`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {captureType === 'expense' ? (
            <div>
              <label className="block text-os-text-muted mb-1 font-medium">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="15.50"
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white font-mono text-xs"
              />
            </div>
          ) : (
            <div>
              <label className="block text-os-text-muted mb-1 font-medium">Additional Context / Details</label>
              <input
                type="text"
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                placeholder="Course code, subject, or details..."
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsQuickCaptureOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-os-text hover:bg-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-md cursor-pointer"
            >
              Capture & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
