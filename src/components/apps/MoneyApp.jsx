import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PieChart as PieIcon, 
  DollarSign, 
  TrendingDown, 
  Trash2, 
  Edit3 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { useOS } from '../../context/OSContext';

const EXPENSE_CATEGORIES = [
  'Food',
  'Hostel',
  'Travel',
  'College',
  'Shopping',
  'Entertainment',
  'Fitness',
  'Other'
];

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Hostel: '#6366f1',
  Travel: '#06b6d4',
  College: '#3b82f6',
  Shopping: '#ec4899',
  Entertainment: '#8b5cf6',
  Fitness: '#10b981',
  Other: '#64748b'
};

export default function MoneyApp() {
  const { state, setExpenses, setBudgets, awardXP } = useOS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    type: 'expense', // 'expense' | 'income'
    date: new Date().toISOString().split('T')[0]
  });

  const totalIncome = state.expenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const totalExpense = state.expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const netSavings = totalIncome - totalExpense;

  const totalBudget = Object.values(state.budgets || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0);
  const budgetUsagePercent = totalBudget > 0 ? Math.min(100, Math.round((totalExpense / totalBudget) * 100)) : 0;

  // Pie chart breakdown by category
  const categoryData = EXPENSE_CATEGORIES.map((cat) => {
    const sum = state.expenses
      .filter((e) => e.type === 'expense' && e.category === cat)
      .reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
    return { name: cat, value: sum };
  }).filter((item) => item.value > 0);

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.amount) return;

    const newTx = {
      id: `exp-${Date.now()}`,
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date
    };

    setExpenses((prev) => [newTx, ...prev]);
    awardXP(15, `Logged transaction: ${formData.title}`);
    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-teal-400" />
            <span>Student Expense & Budget Manager</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Keep track of allowances, college textbooks, food expenses, and savings goals.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-teal-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Transaction</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 border border-white/10">
          <div className="flex items-center justify-between text-xs text-os-text-muted mb-1">
            <span className="font-mono">TOTAL INCOME</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            ${totalIncome.toFixed(2)}
          </div>
        </div>

        <div className="glass-panel p-5 border border-white/10">
          <div className="flex items-center justify-between text-xs text-os-text-muted mb-1">
            <span className="font-mono">TOTAL SPENT</span>
            <ArrowUpRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-400">
            ${totalExpense.toFixed(2)}
          </div>
        </div>

        <div className="glass-panel p-5 border border-white/10">
          <div className="flex items-center justify-between text-xs text-os-text-muted mb-1">
            <span className="font-mono">NET BALANCE</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className={`text-2xl font-black font-mono ${netSavings >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
            ${netSavings.toFixed(2)}
          </div>
        </div>

        <div className="glass-panel p-5 border border-white/10">
          <div className="flex items-center justify-between text-xs text-os-text-muted mb-1">
            <span className="font-mono">MONTHLY BUDGET</span>
            <span className="font-mono text-xs text-white">{budgetUsagePercent}%</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mt-3 mb-1">
            <div
              className={`h-full rounded-full ${
                budgetUsagePercent > 90 ? 'bg-red-500' : 'bg-teal-500'
              }`}
              style={{ width: `${budgetUsagePercent}%` }}
            />
          </div>
          <div className="text-[10px] text-os-text-muted text-right font-mono">
            ${totalExpense.toFixed(0)} / ${totalBudget.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 border border-white/10 flex flex-col justify-between">
          <h4 className="text-xs font-bold uppercase text-white font-mono flex items-center gap-1.5">
            <PieIcon className="w-4 h-4 text-teal-400" />
            <span>Category Breakdown</span>
          </h4>

          <div className="h-44 w-full my-2">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-xs text-os-text-muted">No expense data</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[c.name] }} />
                <span className="text-os-text truncate">{c.name}: ${c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="glass-panel p-5 col-span-2 border border-white/10 space-y-3">
          <h4 className="text-xs font-bold uppercase text-white font-mono">Recent Transactions</h4>

          <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin">
            {state.expenses.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    item.type === 'income' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {item.type === 'income' ? '+' : '-'}
                  </div>
                  <div>
                    <h5 className="font-bold text-white">{item.title}</h5>
                    <span className="text-[10px] text-os-text-muted font-mono">{item.category} • {item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold text-sm ${
                    item.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {item.type === 'income' ? '+' : '-'}${parseFloat(item.amount).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDeleteTransaction(item.id)}
                    className="text-red-400 opacity-0 group-hover:opacity-100 p-1 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Log Expense / Income</h3>
            <form onSubmit={handleSaveTransaction} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Transaction Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Dining Hall Meal, O'Reilly Book"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    <option value="expense" className="bg-slate-900">Expense (-)</option>
                    <option value="income" className="bg-slate-900">Income (+)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-os-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
