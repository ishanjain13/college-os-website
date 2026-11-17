import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Clock, 
  Kanban, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Tag, 
  Sparkles,
  ArrowRight,
  MoveHorizontal
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

const KANBAN_COLUMNS = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];

export default function PlannerApp() {
  const { state, setPlannerBlocks, setKanbanCards, awardXP } = useOS();
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'timeblocks'

  // Timeblock Modal State
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    title: '',
    time: '14:00 - 16:00',
    category: 'study',
    color: '#8b5cf6'
  });

  // Kanban Card Modal State
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    title: '',
    column: 'To Do',
    priority: 'high',
    deadline: '',
    labels: 'Exams, CS'
  });

  // Add Timeblock
  const handleSaveBlock = (e) => {
    e.preventDefault();
    if (!blockForm.title.trim()) return;
    const newBlock = { id: `pb-${Date.now()}`, ...blockForm };
    setPlannerBlocks((prev) => [...prev, newBlock]);
    awardXP(15, `Timeblock created: ${blockForm.title}`);
    setIsBlockModalOpen(false);
  };

  const handleDeleteBlock = (id) => {
    setPlannerBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Add Kanban Card
  const handleSaveCard = (e) => {
    e.preventDefault();
    if (!cardForm.title.trim()) return;
    const labelsArray = cardForm.labels.split(',').map((l) => l.trim()).filter(Boolean);
    const newCard = {
      id: `kc-${Date.now()}`,
      title: cardForm.title,
      column: cardForm.column,
      priority: cardForm.priority,
      deadline: cardForm.deadline,
      labels: labelsArray
    };
    setKanbanCards((prev) => [...prev, newCard]);
    awardXP(20, `Kanban task created: ${cardForm.title}`);
    setIsCardModalOpen(false);
  };

  // Move Kanban Card
  const handleMoveCard = (cardId, newCol) => {
    setKanbanCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          if (newCol === 'Done' && c.column !== 'Done') {
            awardXP(40, `Completed task: ${c.title}`);
          }
          return { ...c, column: newCol };
        }
        return c;
      })
    );
  };

  const handleDeleteCard = (id) => {
    setKanbanCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-400" />
            <span>Execution Planner & Kanban Board</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Time-block your deep focus routines and track workflow throughput with 5-stage Kanban.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'kanban' ? 'bg-purple-600 text-white font-semibold' : 'text-os-text-muted hover:text-white'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban Pipeline</span>
          </button>
          <button
            onClick={() => setActiveTab('timeblocks')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'timeblocks' ? 'bg-purple-600 text-white font-semibold' : 'text-os-text-muted hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Daily Timeblocks</span>
          </button>
        </div>
      </div>

      {/* 1. KANBAN BOARD VIEW */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Project Action Items</h3>
            <button
              onClick={() => setIsCardModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {KANBAN_COLUMNS.map((col) => {
              const cardsInCol = state.kanbanCards.filter((c) => c.column === col);

              return (
                <div key={col} className="glass-panel p-3.5 flex flex-col min-h-[420px] bg-black/30 border border-white/10">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-xs font-bold font-mono text-purple-300 uppercase">
                    <span>{col}</span>
                    <span className="bg-purple-500/20 text-purple-200 px-2 py-0.2 rounded-full text-[10px]">
                      {cardsInCol.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto scrollbar-none">
                    {cardsInCol.map((card) => (
                      <div
                        key={card.id}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all space-y-2 group relative"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-white leading-tight">{card.title}</h4>
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-300 p-1 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {card.labels && card.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {card.labels.map((l, idx) => (
                              <span key={idx} className="text-[9px] font-mono bg-purple-500/10 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/20">
                                {l}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Quick Column Shift Selector */}
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-os-text-muted">
                          <span className="font-mono">{card.priority.toUpperCase()}</span>
                          <select
                            value={card.column}
                            onChange={(e) => handleMoveCard(card.id, e.target.value)}
                            className="bg-black/50 text-purple-300 text-[10px] rounded px-1.5 py-0.5 border border-white/10 focus:outline-none"
                          >
                            {KANBAN_COLUMNS.map((cName) => (
                              <option key={cName} value={cName} className="bg-slate-900">{cName}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}

                    {cardsInCol.length === 0 && (
                      <div className="text-[11px] text-os-text-muted/40 text-center py-12">
                        Empty Slot
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TIMEBLOCKS VIEW */}
      {activeTab === 'timeblocks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Today's Scheduled Time-Blocks</h3>
            <button
              onClick={() => setIsBlockModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Time-Block</span>
            </button>
          </div>

          <div className="space-y-3">
            {state.plannerBlocks.map((block) => (
              <div
                key={block.id}
                className="glass-panel p-4 flex items-center justify-between border border-white/10 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-8 rounded-full"
                    style={{ backgroundColor: block.color || '#8b5cf6' }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{block.title}</h4>
                    <span className="text-xs text-purple-300 font-mono">{block.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteBlock(block.id)}
                  className="text-red-400 hover:text-red-300 p-2 cursor-pointer"
                  title="Delete Block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeblock Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Add Time-Block</h3>
            <form onSubmit={handleSaveBlock} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Block Title</label>
                <input
                  type="text"
                  required
                  value={blockForm.title}
                  onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
                  placeholder="e.g. Deep Work: Transformer Coding"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Time Slot Range</label>
                <input
                  type="text"
                  required
                  value={blockForm.time}
                  onChange={(e) => setBlockForm({ ...blockForm, time: e.target.value })}
                  placeholder="e.g. 14:00 - 16:30"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-os-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Save Timeblock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Add Kanban Action Item</h3>
            <form onSubmit={handleSaveCard} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={cardForm.title}
                  onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                  placeholder="e.g. Implement hazard forwarding in Verilog"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Column</label>
                  <select
                    value={cardForm.column}
                    onChange={(e) => setCardForm({ ...cardForm, column: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    {KANBAN_COLUMNS.map((c) => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Priority</label>
                  <select
                    value={cardForm.priority}
                    onChange={(e) => setCardForm({ ...cardForm, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    <option value="high" className="bg-slate-900">High</option>
                    <option value="medium" className="bg-slate-900">Medium</option>
                    <option value="low" className="bg-slate-900">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Tags / Labels (comma separated)</label>
                <input
                  type="text"
                  value={cardForm.labels}
                  onChange={(e) => setCardForm({ ...cardForm, labels: e.target.value })}
                  placeholder="CS 229, Research, Coding"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-os-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
