import React, { useState } from 'react';
import { 
  Plus, 
  Target, 
  CheckCircle2, 
  CheckSquare, 
  Wallet, 
  BookOpen, 
  Sparkles,
  FileText
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

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
    { id: 'note', label: 'Quick Note', icon: FileText }
  ];

  return (
    <Modal
      isOpen={isQuickCaptureOpen}
      onClose={() => setIsQuickCaptureOpen(false)}
      title="Instant Quick Capture"
      description="Quickly capture a task, goal, habit protocol, deadline, expense, or note."
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Type Selector Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {captureTypes.map((t) => {
            const Icon = t.icon;
            const isSelected = captureType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setCaptureType(t.id)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-[11px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-os-accent/20 border-os-accent text-white font-semibold shadow-sm'
                    : 'bg-white/5 border-os-border text-os-text-muted hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-os-accent' : 'text-os-text-subtle'}`} />
                <span className="truncate w-full text-center">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-os-text-muted mb-1 font-medium">Title / Description</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${captureType} description...`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-os-border focus:border-os-accent focus:outline-none text-white text-xs"
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-os-border focus:border-os-accent focus:outline-none text-white font-mono text-xs"
              />
            </div>
          ) : (
            <div>
              <label className="block text-os-text-muted mb-1 font-medium">Context / Notes (Optional)</label>
              <input
                type="text"
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                placeholder="Course, priority, or additional context..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-os-border focus:border-os-accent focus:outline-none text-white text-xs"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-os-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsQuickCaptureOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={Plus}
            >
              Capture Item
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
