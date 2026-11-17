import React, { useState } from 'react';
import { 
  Briefcase, 
  Code2, 
  FileText, 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  Award,
  Layers,
  Printer
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

const INTERNSHIP_STATUSES = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];

export default function CareerApp() {
  const { state, setSkills, setProjects, setInternships, setCodingPractice, awardXP } = useOS();
  const [activeTab, setActiveTab] = useState('skills'); // 'skills' | 'projects' | 'resume' | 'internships' | 'leetcode'

  // Skill Add Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillForm, setSkillForm] = useState({
    name: '',
    level: 3,
    xp: 1500,
    hours: 80,
    category: 'Software & AI',
    notes: ''
  });

  // Project Add Modal
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    technology: '',
    github: '',
    demo: '',
    status: 'In Progress',
    progress: 50,
    startDate: new Date().toISOString().split('T')[0]
  });

  // Internship Add Modal
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [internshipForm, setInternshipForm] = useState({
    company: '',
    role: 'Software Engineer Intern',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    interviewDate: '',
    stipend: '$50/hr',
    notes: ''
  });

  // LeetCode Problem Modal
  const [isCodingModalOpen, setIsCodingModalOpen] = useState(false);
  const [codingForm, setCodingForm] = useState({
    platform: 'LeetCode',
    problem: '',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    date: new Date().toISOString().split('T')[0],
    solved: true,
    attempts: 1,
    notes: ''
  });

  // Handlers
  const handleSaveSkill = (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    setSkills((prev) => [...prev, { id: `sk-${Date.now()}`, ...skillForm }]);
    awardXP(30, `Skill added: ${skillForm.name}`);
    setIsSkillModalOpen(false);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;
    setProjects((prev) => [ { id: `prj-${Date.now()}`, ...projectForm }, ...prev]);
    awardXP(50, `Project initiated: ${projectForm.name}`);
    setIsProjectModalOpen(false);
  };

  const handleSaveInternship = (e) => {
    e.preventDefault();
    if (!internshipForm.company.trim()) return;
    setInternships((prev) => [{ id: `int-${Date.now()}`, ...internshipForm }, ...prev]);
    awardXP(35, `Internship tracked: ${internshipForm.company}`);
    setIsInternshipModalOpen(false);
  };

  const handleSaveCodingProblem = (e) => {
    e.preventDefault();
    if (!codingForm.problem.trim()) return;
    setCodingPractice((prev) => [{ id: `cp-${Date.now()}`, ...codingForm }, ...prev]);
    awardXP(state.xpConfig.codingProblemSolved || 75, `Coding problem solved: ${codingForm.problem}`);
    setIsCodingModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>Career, Resume & Engineering Mastery</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Skills progression tree, portfolio showcase, ATS resume builder, and internship application tracker.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs overflow-x-auto scrollbar-none">
          {[
            { id: 'skills', label: 'Skills Tree', icon: Layers },
            { id: 'projects', label: 'Projects & Portfolio', icon: FolderGit2 },
            { id: 'resume', label: 'ATS Resume Builder', icon: FileText },
            { id: 'internships', label: 'Internship Pipeline', icon: Briefcase },
            { id: 'leetcode', label: 'Coding Practice', icon: Code2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-os-text-muted hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. SKILLS TREE */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Mastery Competency Matrix</h3>
            <button
              onClick={() => setIsSkillModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.skills.map((skill) => (
              <div key={skill.id} className="glass-panel p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{skill.name}</h4>
                    <span className="text-[10px] font-mono text-indigo-300">{skill.category}</span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                    Level {skill.level} / 5
                  </span>
                </div>

                <p className="text-xs text-os-text-muted">{skill.notes}</p>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-os-text-muted">
                  <span>{skill.hours} Total Hours Invested</span>
                  <span className="text-indigo-400">+{skill.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PROJECTS & PORTFOLIO */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Shipped Projects Showcase</h3>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {state.projects.map((proj) => (
              <div key={proj.id} className="glass-panel p-5 border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                    }`}>
                      {proj.status.toUpperCase()} ({proj.progress}%)
                    </span>
                    <span className="text-[10px] text-os-text-muted font-mono">{proj.startDate}</span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-1">{proj.name}</h4>
                  <p className="text-xs text-os-text-muted leading-relaxed">{proj.description}</p>

                  <div className="mt-3">
                    <span className="text-[10px] font-mono text-indigo-300 font-semibold block mb-1">TECH STACK</span>
                    <p className="text-xs font-mono text-slate-300">{proj.technology}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-os-text-muted hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Code Repository</span>
                    </a>
                  )}

                  {proj.demo && (
                    <a
                      href={proj.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ATS RESUME BUILDER & PREVIEW */}
      {activeTab === 'resume' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">ATS-Optimized Resume Preview</h3>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/15 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* Clean LaTeX-style Document Sheet */}
          <div className="bg-white text-slate-900 p-8 md:p-12 rounded-xl shadow-2xl max-w-3xl mx-auto font-sans leading-normal space-y-5 select-text border border-slate-300">
            <div className="text-center border-b border-slate-300 pb-4">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{state.profile.name}</h1>
              <p className="text-xs text-slate-600 mt-1">
                {state.profile.course} • {state.profile.college} • portfolio.college-os.app
              </p>
            </div>

            {/* Education */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Education
              </h4>
              <div className="flex justify-between text-xs">
                <div>
                  <strong>{state.profile.college}</strong> — B.S. in {state.profile.course}
                </div>
                <div className="font-mono text-slate-600">Expected 2028 • GPA: 3.92</div>
              </div>
            </div>

            {/* Technical Skills */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Technical Proficiencies
              </h4>
              <p className="text-xs text-slate-700">
                <strong>Languages & Frameworks:</strong> {state.skills.map((s) => s.name).join(', ')}
              </p>
            </div>

            {/* Featured Projects */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Engineering Projects
              </h4>
              <div className="space-y-3">
                {state.projects.map((p) => (
                  <div key={p.id} className="text-xs space-y-0.5">
                    <div className="flex justify-between">
                      <strong className="text-slate-900">{p.name}</strong>
                      <span className="font-mono text-slate-500">{p.technology}</span>
                    </div>
                    <p className="text-slate-700">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
                Honors & Achievements
              </h4>
              <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                {state.achievements.filter((a) => a.unlocked).map((a) => (
                  <li key={a.id}>
                    <strong>{a.title}:</strong> {a.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. INTERNSHIP TRACKER PIPELINE */}
      {activeTab === 'internships' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Internship Applications Pipeline</h3>
            <button
              onClick={() => setIsInternshipModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track Company</span>
            </button>
          </div>

          <div className="space-y-3">
            {state.internships.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/10"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{item.company}</h4>
                    <span className={`text-[10px] font-mono px-2 py-0.2 rounded border ${
                      item.status === 'Offer' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-os-text-muted mt-0.5">
                    {item.role} • {item.stipend}
                  </div>
                  <p className="text-[11px] text-os-text-muted mt-1">{item.notes}</p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
                  <span className="font-mono text-os-text-muted">Applied: {item.appliedDate}</span>
                  <select
                    value={item.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setInternships((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, status: newStatus } : i))
                      );
                    }}
                    className="bg-black/50 text-indigo-300 text-xs rounded-xl px-2.5 py-1 border border-white/15 focus:outline-none"
                  >
                    {INTERNSHIP_STATUSES.map((st) => (
                      <option key={st} value={st} className="bg-slate-900">{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. LEETCODE / CODING PRACTICE TRACKER */}
      {activeTab === 'leetcode' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Algorithms & LeetCode Practice Log</h3>
            <button
              onClick={() => setIsCodingModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Problem Solved</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 text-center">
              <span className="text-xs font-mono text-os-text-muted">TOTAL SOLVED</span>
              <div className="text-3xl font-black font-mono text-white my-1">{state.codingPractice.length}</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <span className="text-xs font-mono text-emerald-400">EASY</span>
              <div className="text-3xl font-black font-mono text-emerald-400 my-1">
                {state.codingPractice.filter((c) => c.difficulty === 'Easy').length}
              </div>
            </div>
            <div className="glass-panel p-4 text-center">
              <span className="text-xs font-mono text-amber-400">MEDIUM</span>
              <div className="text-3xl font-black font-mono text-amber-400 my-1">
                {state.codingPractice.filter((c) => c.difficulty === 'Medium').length}
              </div>
            </div>
            <div className="glass-panel p-4 text-center">
              <span className="text-xs font-mono text-red-400">HARD</span>
              <div className="text-3xl font-black font-mono text-red-400 my-1">
                {state.codingPractice.filter((c) => c.difficulty === 'Hard').length}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {state.codingPractice.map((cp) => (
              <div key={cp.id} className="p-3.5 rounded-xl glass-panel border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    cp.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' : cp.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {cp.difficulty}
                  </span>
                  <div>
                    <h5 className="font-bold text-white">{cp.problem}</h5>
                    <span className="text-[10px] text-os-text-muted">{cp.platform} • {cp.topic}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-os-text-muted text-[11px]">{cp.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Add Technical Competency</h3>
            <form onSubmit={handleSaveSkill} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Skill / Technology Name</label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. PyTorch, Rust, System Design"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Proficiency Level (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={skillForm.level}
                    onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Total Hours</label>
                  <input
                    type="number"
                    value={skillForm.hours}
                    onChange={(e) => setSkillForm({ ...skillForm, hours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Notes & Scope</label>
                <textarea
                  rows={2}
                  value={skillForm.notes}
                  onChange={(e) => setSkillForm({ ...skillForm, notes: e.target.value })}
                  placeholder="Projects built, papers read..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setIsSkillModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-os-text">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Add Project to Portfolio</h3>
            <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="e.g. College OS"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Description</label>
                <textarea
                  rows={2}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Key features and technical architecture..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Tech Stack</label>
                <input
                  type="text"
                  value={projectForm.technology}
                  onChange={(e) => setProjectForm({ ...projectForm, technology: e.target.value })}
                  placeholder="React, PyTorch, Tailwind CSS"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={projectForm.github}
                    onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Live Demo URL</label>
                  <input
                    type="text"
                    value={projectForm.demo}
                    onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-os-text">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Internship Modal */}
      {isInternshipModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Track Internship Application</h3>
            <form onSubmit={handleSaveInternship} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={internshipForm.company}
                  onChange={(e) => setInternshipForm({ ...internshipForm, company: e.target.value })}
                  placeholder="OpenAI, Apple, Google"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={internshipForm.role}
                  onChange={(e) => setInternshipForm({ ...internshipForm, role: e.target.value })}
                  placeholder="Machine Learning Engineer Intern"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Status</label>
                  <select
                    value={internshipForm.status}
                    onChange={(e) => setInternshipForm({ ...internshipForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    {INTERNSHIP_STATUSES.map((st) => (
                      <option key={st} value={st} className="bg-slate-900">{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Stipend / Comp</label>
                  <input
                    type="text"
                    value={internshipForm.stipend}
                    onChange={(e) => setInternshipForm({ ...internshipForm, stipend: e.target.value })}
                    placeholder="$60/hr"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setIsInternshipModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-os-text">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                  Track Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coding Modal */}
      {isCodingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Log Solved Coding Problem</h3>
            <form onSubmit={handleSaveCodingProblem} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  value={codingForm.problem}
                  onChange={(e) => setCodingForm({ ...codingForm, problem: e.target.value })}
                  placeholder="e.g. 3Sum, Course Schedule, Coin Change"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Difficulty</label>
                  <select
                    value={codingForm.difficulty}
                    onChange={(e) => setCodingForm({ ...codingForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    <option value="Easy" className="bg-slate-900">Easy</option>
                    <option value="Medium" className="bg-slate-900">Medium</option>
                    <option value="Hard" className="bg-slate-900">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Algorithm Topic</label>
                  <input
                    type="text"
                    value={codingForm.topic}
                    onChange={(e) => setCodingForm({ ...codingForm, topic: e.target.value })}
                    placeholder="e.g. Graphs / BFS"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Solution / Complexity Notes</label>
                <input
                  type="text"
                  value={codingForm.notes}
                  onChange={(e) => setCodingForm({ ...codingForm, notes: e.target.value })}
                  placeholder="O(V+E) topological sort with Kahn's algorithm"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setIsCodingModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-os-text">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                  Log Problem (+75 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
