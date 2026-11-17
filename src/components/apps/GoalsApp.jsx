import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Flag, 
  Sparkles, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronRight, 
  GitBranch, 
  Layers, 
  ListOrdered, 
  History, 
  Clock,
  Award,
  Filter
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { triggerConfetti } from '../../services/gamification';

const GOAL_CATEGORIES = [
  'All',
  'Academic',
  'Skills',
  'Career',
  'Fitness',
  'Money',
  'Health',
  'Personal',
  'Other'
];

export default function GoalsApp() {
  const { state, setGoals, awardXP } = useOS();
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'roadmap' | 'tree' | 'reviews'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [expandedGoalId, setExpandedGoalId] = useState(state.goals[0]?.id || null);

  // Goal Creation & Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Academic',
    priority: 'high',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    currentValue: 0,
    targetValue: 10,
    unit: 'tasks',
    xpReward: 500,
    color: '#6366f1'
  });

  // Review Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewGoalId, setReviewGoalId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    type: 'weekly',
    worked: '',
    didntWork: '',
    nextWeekPriority: ''
  });

  // Filtered Goals
  const filteredGoals = state.goals.filter((g) => {
    const matchesCat = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || g.status === selectedStatus;
    return matchesCat && matchesStatus;
  });

  const openNewGoalModal = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      description: '',
      category: 'Academic',
      priority: 'high',
      startDate: new Date().toISOString().split('T')[0],
      deadline: '',
      currentValue: 0,
      targetValue: 10,
      unit: 'tasks',
      xpReward: 500,
      color: '#6366f1'
    });
    setIsModalOpen(true);
  };

  const openEditGoalModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description,
      category: goal.category,
      priority: goal.priority,
      startDate: goal.startDate,
      deadline: goal.deadline,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      unit: goal.unit,
      xpReward: goal.xpReward,
      color: goal.color || '#6366f1'
    });
    setIsModalOpen(true);
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id
            ? { ...g, ...formData }
            : g
        )
      );
    } else {
      const newGoal = {
        id: `g-${Date.now()}`,
        ...formData,
        status: 'Active',
        milestones: [],
        reviews: []
      };
      setGoals((prev) => [newGoal, ...prev]);
      awardXP(50, `Goal created: ${formData.name}`);
      setExpandedGoalId(newGoal.id);
    }
    setIsModalOpen(false);
  };

  const handleDeleteGoal = (goalId) => {
    if (confirm("Are you sure you want to delete this goal and its milestones?")) {
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    }
  };

  // Milestone & Task Handlers
  const handleAddMilestone = (goalId) => {
    const title = prompt("Enter new milestone title:");
    if (!title || !title.trim()) return;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newMilestone = {
            id: `m-${Date.now()}`,
            title: title.trim(),
            completed: false,
            tasks: []
          };
          return {
            ...g,
            milestones: [...(g.milestones || []), newMilestone]
          };
        }
        return g;
      })
    );
  };

  const handleToggleMilestone = (goalId, milestoneId) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updatedMilestones = (g.milestones || []).map((m) => {
            if (m.id === milestoneId) {
              const nextState = !m.completed;
              if (nextState) {
                awardXP(state.xpConfig.goalMilestone || 150, `Milestone completed: ${m.title}`);
                triggerConfetti(60);
              }
              return { ...m, completed: nextState };
            }
            return m;
          });

          // Recalculate goal progress based on milestones
          const compCount = updatedMilestones.filter((m) => m.completed).length;
          const totalCount = updatedMilestones.length;

          return {
            ...g,
            milestones: updatedMilestones,
            currentValue: compCount,
            targetValue: Math.max(1, totalCount)
          };
        }
        return g;
      })
    );
  };

  const handleAddTask = (goalId, milestoneId) => {
    const taskTitle = prompt("Enter new task item:");
    if (!taskTitle || !taskTitle.trim()) return;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updatedMilestones = (g.milestones || []).map((m) => {
            if (m.id === milestoneId) {
              return {
                ...m,
                tasks: [...(m.tasks || []), { id: `t-${Date.now()}`, title: taskTitle.trim(), completed: false }]
              };
            }
            return m;
          });
          return { ...g, milestones: updatedMilestones };
        }
        return g;
      })
    );
  };

  const handleToggleTask = (goalId, milestoneId, taskId) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updatedMilestones = (g.milestones || []).map((m) => {
            if (m.id === milestoneId) {
              const updatedTasks = (m.tasks || []).map((t) => {
                if (t.id === taskId) {
                  const nextComp = !t.completed;
                  if (nextComp) {
                    awardXP(state.xpConfig.goalTask || 50, `Task completed: ${t.title}`);
                  }
                  return { ...t, completed: nextComp };
                }
                return t;
              });

              // Check if all tasks in milestone are completed
              const allDone = updatedTasks.length > 0 && updatedTasks.every((t) => t.completed);
              if (allDone && !m.completed) {
                awardXP(state.xpConfig.goalMilestone || 150, `Milestone achieved: ${m.title}`);
                triggerConfetti(50);
              }

              return {
                ...m,
                completed: allDone,
                tasks: updatedTasks
              };
            }
            return m;
          });

          // Recalculate goal progress
          const compMilestones = updatedMilestones.filter((m) => m.completed).length;
          return {
            ...g,
            milestones: updatedMilestones,
            currentValue: compMilestones,
            targetValue: Math.max(1, updatedMilestones.length)
          };
        }
        return g;
      })
    );
  };

  // Goal Review Submission
  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!reviewForm.worked.trim()) return;

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === reviewGoalId) {
          const newReview = {
            date: new Date().toISOString().split('T')[0],
            ...reviewForm
          };
          return {
            ...g,
            reviews: [newReview, ...(g.reviews || [])]
          };
        }
        return g;
      })
    );
    awardXP(60, "Completed Goal Review reflection");
    setIsReviewModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header & View Switchers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-pink-500" />
            <span>Master Goal Architecture</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Break macro ambitions into executable milestones and tasks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Buttons */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'list' ? 'bg-indigo-600 text-white font-semibold' : 'text-os-text-muted hover:text-white'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'roadmap' ? 'bg-indigo-600 text-white font-semibold' : 'text-os-text-muted hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Roadmap</span>
            </button>
            <button
              onClick={() => setActiveTab('tree')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'tree' ? 'bg-indigo-600 text-white font-semibold' : 'text-os-text-muted hover:text-white'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Tree</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'reviews' ? 'bg-indigo-600 text-white font-semibold' : 'text-os-text-muted hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Reviews</span>
            </button>
          </div>

          <button
            onClick={openNewGoalModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-pink-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {GOAL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 font-semibold'
                : 'bg-white/5 text-os-text-muted hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* VIEW 1: LIST VIEW (Interactive Cards with Milestones & Tasks) */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {filteredGoals.length > 0 ? (
            filteredGoals.map((goal) => {
              const isExpanded = expandedGoalId === goal.id;
              const totalMilestones = goal.milestones?.length || 0;
              const completedMilestones = goal.milestones?.filter((m) => m.completed).length || 0;
              const percent = totalMilestones > 0
                ? Math.round((completedMilestones / totalMilestones) * 100)
                : Math.round((goal.currentValue / Math.max(1, goal.targetValue)) * 100);

              return (
                <div
                  key={goal.id}
                  className="glass-panel overflow-hidden border border-white/10 transition-all hover:border-white/20"
                >
                  {/* Goal Card Header */}
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                        className="p-1 rounded-lg hover:bg-white/10 text-os-text-muted hover:text-white cursor-pointer mt-0.5"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold"
                            style={{
                              backgroundColor: `${goal.color || '#6366f1'}25`,
                              color: goal.color || '#6366f1',
                              border: `1px solid ${goal.color || '#6366f1'}40`
                            }}
                          >
                            {goal.category}
                          </span>
                          <span className="text-[10px] font-mono text-os-text-muted">
                            Priority: {goal.priority.toUpperCase()}
                          </span>
                          {goal.deadline && (
                            <span className="text-[10px] font-mono text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due: {goal.deadline}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white">{goal.name}</h3>
                        <p className="text-xs text-os-text-muted mt-0.5 line-clamp-2">
                          {goal.description}
                        </p>
                      </div>
                    </div>

                    {/* Right side stats & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-4 pl-8 md:pl-0">
                      <div className="text-right">
                        <div className="text-sm font-bold text-white font-mono">{percent}%</div>
                        <div className="text-[10px] text-os-text-muted">
                          {completedMilestones} / {totalMilestones} Milestones
                        </div>
                      </div>

                      {/* Progress circle bar */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center relative bg-black/40 border border-white/10">
                        <span className="text-[10px] font-bold font-mono text-indigo-300">
                          {percent}%
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setReviewGoalId(goal.id);
                            setIsReviewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-white cursor-pointer"
                          title="Add Weekly Review"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditGoalModal(goal)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-os-text-muted hover:text-white cursor-pointer"
                          title="Edit Goal"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Section: Milestones & Nested Tasks */}
                  {isExpanded && (
                    <div className="p-4 md:p-6 bg-black/30 border-t border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-os-text-muted font-mono">
                          Milestones & Actionable Tasks
                        </h4>
                        <button
                          onClick={() => handleAddMilestone(goal.id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Milestone</span>
                        </button>
                      </div>

                      {goal.milestones && goal.milestones.length > 0 ? (
                        <div className="space-y-3">
                          {goal.milestones.map((milestone, mIdx) => (
                            <div
                              key={milestone.id}
                              className={`p-3.5 rounded-xl border transition-all ${
                                milestone.completed
                                  ? 'bg-indigo-950/20 border-indigo-500/30'
                                  : 'bg-white/5 border-white/5'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div
                                  onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                                  className="flex items-center gap-2.5 cursor-pointer"
                                >
                                  {milestone.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-white/30" />
                                  )}
                                  <span className={`text-xs font-semibold ${
                                    milestone.completed ? 'line-through text-indigo-300' : 'text-white'
                                  }`}>
                                    Milestone {mIdx + 1}: {milestone.title}
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleAddTask(goal.id, milestone.id)}
                                  className="text-[11px] text-os-text-muted hover:text-white flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Task</span>
                                </button>
                              </div>

                              {/* Nested Tasks */}
                              {milestone.tasks && milestone.tasks.length > 0 && (
                                <div className="mt-2.5 pl-6 space-y-1.5 border-l border-white/10 ml-2">
                                  {milestone.tasks.map((task) => (
                                    <div
                                      key={task.id}
                                      onClick={() => handleToggleTask(goal.id, milestone.id, task.id)}
                                      className="flex items-center gap-2 text-xs py-0.5 cursor-pointer text-os-text hover:text-white group"
                                    >
                                      {task.completed ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                      ) : (
                                        <Circle className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40" />
                                      )}
                                      <span className={task.completed ? 'line-through opacity-60' : ''}>
                                        {task.title}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-xs text-os-text-muted">
                          No milestones added yet. Click "+ Add Milestone" to structure your roadmap.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 glass-panel p-8">
              <Target className="w-10 h-10 text-os-text-muted mx-auto mb-3 opacity-50" />
              <h3 className="text-base font-bold text-white mb-1">No goals found</h3>
              <p className="text-xs text-os-text-muted mb-4">
                Define your vision and start compounding your academic and personal skills.
              </p>
              <button
                onClick={openNewGoalModal}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                + Create First Goal
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ROADMAP VIEW */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {filteredGoals.map((goal) => (
            <div key={goal.id} className="glass-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">
                    {goal.category}
                  </span>
                  <h3 className="text-base font-bold text-white">{goal.name}</h3>
                </div>
                <span className="text-xs font-mono text-os-text-muted">
                  {goal.startDate} ➔ {goal.deadline || 'No Deadline'}
                </span>
              </div>

              {/* Horizontal Roadmap Track */}
              <div className="relative pt-4 pb-2">
                <div className="absolute top-7 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 z-0" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                  <div className="bg-os-card p-3 rounded-xl border border-indigo-500/40 text-center">
                    <span className="text-[10px] font-mono text-indigo-300 font-bold">START</span>
                    <div className="text-xs font-semibold text-white mt-1">Foundations</div>
                  </div>

                  {(goal.milestones || []).map((m, idx) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        m.completed
                          ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200'
                          : 'bg-os-card border-white/10 text-os-text-muted'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold">
                        MILESTONE {idx + 1}
                      </span>
                      <div className="text-xs font-semibold mt-1 truncate">{m.title}</div>
                      <span className="text-[10px] mt-1 block">
                        {m.completed ? '✓ Done' : 'Pending'}
                      </span>
                    </div>
                  ))}

                  <div className="bg-os-card p-3 rounded-xl border border-pink-500/40 text-center">
                    <span className="text-[10px] font-mono text-pink-400 font-bold">TARGET</span>
                    <div className="text-xs font-semibold text-white mt-1">Goal Mastery</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: GOAL TREE VIEW */}
      {activeTab === 'tree' && (
        <div className="space-y-6">
          {filteredGoals.map((goal) => (
            <div key={goal.id} className="glass-panel p-6">
              <div className="flex items-center gap-2 mb-4">
                <GitBranch className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">{goal.name}</h3>
              </div>

              {/* Tree Diagram */}
              <div className="pl-4 border-l-2 border-indigo-500/40 space-y-4">
                {(goal.milestones || []).map((m) => (
                  <div key={m.id} className="relative pl-6">
                    <div className="absolute top-3 left-0 w-4 h-0.5 bg-indigo-500/40" />
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 font-semibold text-xs text-white">
                        {m.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-white/40" />
                        )}
                        <span>{m.title}</span>
                      </div>

                      {m.tasks && m.tasks.length > 0 && (
                        <div className="mt-2 pl-4 border-l border-white/10 space-y-1">
                          {m.tasks.map((t) => (
                            <div key={t.id} className="text-xs text-os-text-muted flex items-center gap-2">
                              <span>↳</span>
                              <span className={t.completed ? 'line-through text-emerald-300/80' : ''}>
                                {t.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 4: REVIEWS VIEW */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {state.goals.flatMap((g) => (g.reviews || []).map((r, idx) => ({ ...r, goalName: g.name, key: `${g.id}-${idx}` }))).length > 0 ? (
            state.goals.flatMap((g) => (g.reviews || []).map((r, idx) => (
              <div key={`${g.id}-${idx}`} className="glass-panel p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-indigo-400 font-semibold">
                    {r.type.toUpperCase()} REVIEW • {g.name}
                  </div>
                  <span className="text-xs text-os-text-muted font-mono">{r.date}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="font-bold text-emerald-300 block mb-1">What Worked</span>
                    <p className="text-slate-200">{r.worked}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="font-bold text-red-300 block mb-1">What Didn't Work</span>
                    <p className="text-slate-200">{r.didntWork || 'None noted'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <span className="font-bold text-indigo-300 block mb-1">Next Priority</span>
                    <p className="text-slate-200">{r.nextWeekPriority}</p>
                  </div>
                </div>
              </div>
            )))
          ) : (
            <div className="text-center py-10 glass-panel p-6 text-xs text-os-text-muted">
              No reviews logged yet. Click the review icon (clock/history) on any goal to log weekly or monthly reflections.
            </div>
          )}
        </div>
      )}

      {/* Goal Modal (Create / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingGoal ? 'Edit Goal' : 'Create New Core Goal'}
            </h3>

            <form onSubmit={handleSaveGoal} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Master Neural Networks with PyTorch"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Description & Target Standard</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Why this matters and how mastery will be measured..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {GOAL_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-os-text-muted mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="high" className="bg-slate-900">High</option>
                    <option value="medium" className="bg-slate-900">Medium</option>
                    <option value="low" className="bg-slate-900">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-os-text-muted mb-1">XP Reward on Completion</label>
                  <input
                    type="number"
                    value={formData.xpReward}
                    onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 100 })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-os-text cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              <span>Log Goal Reflection Review</span>
            </h3>

            <form onSubmit={handleSaveReview} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Review Scope</label>
                <select
                  value={reviewForm.type}
                  onChange={(e) => setReviewForm({ ...reviewForm, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="weekly" className="bg-slate-900">Weekly Review</option>
                  <option value="monthly" className="bg-slate-900">Monthly Review</option>
                  <option value="semester" className="bg-slate-900">Semester Reflection</option>
                </select>
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">What worked this week/month?</label>
                <textarea
                  rows={2}
                  required
                  value={reviewForm.worked}
                  onChange={(e) => setReviewForm({ ...reviewForm, worked: e.target.value })}
                  placeholder="e.g. 2-hour morning coding blocks, studying in quiet library floor..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">What didn't work / Where did friction occur?</label>
                <textarea
                  rows={2}
                  value={reviewForm.didntWork}
                  onChange={(e) => setReviewForm({ ...reviewForm, didntWork: e.target.value })}
                  placeholder="e.g. Phone notifications, staying up past 1 AM..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">What is my biggest priority next week?</label>
                <input
                  type="text"
                  required
                  value={reviewForm.nextWeekPriority}
                  onChange={(e) => setReviewForm({ ...reviewForm, nextWeekPriority: e.target.value })}
                  placeholder="e.g. Finish Transformer attention layer implementation"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-os-text cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  Save Reflection (+60 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
