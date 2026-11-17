import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Calculator, 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  Percent,
  Sparkles
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

export default function AcademicsApp() {
  const { 
    state, 
    setTimetable, 
    setAttendance, 
    setAssignments, 
    setExams, 
    setSyllabus, 
    updateProfile,
    awardXP 
  } = useOS();

  const [activeTab, setActiveTab] = useState('timetable'); // 'timetable' | 'attendance' | 'assignments' | 'exams' | 'gpa' | 'syllabus'

  // Timetable Add Modal
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [classForm, setClassForm] = useState({
    subject: '',
    teacher: '',
    room: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    color: '#6366f1'
  });

  // Assignment Add Modal
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    subject: '',
    title: '',
    description: '',
    deadline: '',
    priority: 'high',
    status: 'In progress',
    progress: 0,
    notes: ''
  });

  // Exam Add Modal
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examForm, setExamForm] = useState({
    subject: '',
    title: 'Midterm Exam',
    examDate: '',
    syllabus: '',
    preparationPercent: 50,
    priority: 'high'
  });

  // GPA Calculator State
  const [gpaCourses, setGpaCourses] = useState([
    { id: 'gpa-1', name: 'CS 229: Machine Learning', credits: 4, grade: 'A', gradePoint: 4.0 },
    { id: 'gpa-2', name: 'CS 161: Algorithms', credits: 4, grade: 'A-', gradePoint: 3.7 },
    { id: 'gpa-3', name: 'MATH 104: Linear Algebra', credits: 3, grade: 'A', gradePoint: 4.0 },
    { id: 'gpa-4', name: 'EE 108: Digital Systems', credits: 4, grade: 'B+', gradePoint: 3.3 }
  ]);
  const [targetGPA, setTargetGPA] = useState(3.85);

  const calculateCurrentGPA = () => {
    const totalCredits = gpaCourses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0);
    const totalPoints = gpaCourses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0) * (parseFloat(c.gradePoint) || 0), 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  // Timetable Handler
  const handleSaveClass = (e) => {
    e.preventDefault();
    if (!classForm.subject.trim()) return;
    const newClass = { id: `c-${Date.now()}`, ...classForm };
    setTimetable((prev) => [...prev, newClass]);
    awardXP(20, `Class added: ${classForm.subject}`);
    setIsClassModalOpen(false);
  };

  const handleDeleteClass = (id) => {
    setTimetable((prev) => prev.filter((c) => c.id !== id));
  };

  // Attendance Calculations (Mathematically Exact)
  const getAttendanceMath = (attended, total, requiredMin = 75) => {
    const currentPercent = total > 0 ? ((attended / total) * 100) : 100;
    const target = requiredMin / 100;

    // Consecutive classes needed to reach target if below: (target*total - attended) / (1 - target)
    let neededToCatchUp = 0;
    if (currentPercent < requiredMin) {
      neededToCatchUp = Math.ceil((target * total - attended) / (1 - target));
    }

    // Classes you can afford to miss: floor((attended - target*total) / target)
    let canMiss = 0;
    if (currentPercent >= requiredMin) {
      canMiss = Math.floor((attended - target * total) / target);
    }

    return {
      currentPercent: currentPercent.toFixed(1),
      neededToCatchUp: Math.max(0, neededToCatchUp),
      canMiss: Math.max(0, canMiss)
    };
  };

  const handleUpdateAttendance = (attId, deltaAttended, deltaTotal) => {
    setAttendance((prev) =>
      prev.map((item) => {
        if (item.id === attId) {
          const newAtt = Math.max(0, item.attended + deltaAttended);
          const newTot = Math.max(newAtt, item.totalClasses + deltaTotal);
          return { ...item, attended: newAtt, totalClasses: newTot };
        }
        return item;
      })
    );
  };

  // Assignment Handlers
  const handleSaveAssignment = (e) => {
    e.preventDefault();
    if (!assignmentForm.title.trim()) return;
    const newAsg = { id: `asg-${Date.now()}`, ...assignmentForm };
    setAssignments((prev) => [newAsg, ...prev]);
    awardXP(30, `Assignment created: ${assignmentForm.title}`);
    setIsAssignmentModalOpen(false);
  };

  const handleToggleAssignment = (id) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const isDone = a.status === 'Completed';
          if (!isDone) {
            awardXP(state.xpConfig.assignmentSubmit || 120, `Assignment completed: ${a.title}`);
          }
          return {
            ...a,
            status: isDone ? 'In progress' : 'Completed',
            progress: isDone ? 50 : 100
          };
        }
        return a;
      })
    );
  };

  // Exam Handlers
  const handleSaveExam = (e) => {
    e.preventDefault();
    if (!examForm.subject.trim()) return;
    const newExam = { id: `ex-${Date.now()}`, ...examForm };
    setExams((prev) => [newExam, ...prev]);
    awardXP(40, `Exam schedule logged: ${examForm.subject}`);
    setIsExamModalOpen(false);
  };

  // Syllabus Topic Toggle
  const handleToggleSyllabusTopic = (courseId, unitId, topicId) => {
    setSyllabus((prev) =>
      prev.map((course) => {
        if (course.id === courseId) {
          const updatedUnits = course.units.map((u) => {
            if (u.id === unitId) {
              return {
                ...u,
                topics: u.topics.map((t) => {
                  if (t.id === topicId) {
                    const next = !t.completed;
                    if (next) awardXP(25, `Syllabus topic mastered: ${t.title}`);
                    return { ...t, completed: next };
                  }
                  return t;
                })
              };
            }
            return u;
          });
          return { ...course, units: updatedUnits };
        }
        return course;
      })
    );
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <span>Academic Command Hub</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Manage timetable, attendance threshold math, coursework deadlines, exams, and GPA projections.
          </p>
        </div>

        {/* Exam Week Mode Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateProfile({ examModeEnabled: !state.profile.examModeEnabled })}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              state.profile.examModeEnabled
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-white/5 border-white/10 text-os-text-muted hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Exam Week Mode: {state.profile.examModeEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 overflow-x-auto text-xs scrollbar-none">
        {[
          { id: 'timetable', label: 'Timetable', icon: Calendar },
          { id: 'attendance', label: 'Attendance Tracker', icon: Percent },
          { id: 'assignments', label: 'Assignments', icon: CheckSquare },
          { id: 'exams', label: 'Exams & Preps', icon: Clock },
          { id: 'gpa', label: 'GPA & Projections', icon: Calculator },
          { id: 'syllabus', label: 'Syllabus Mastery', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-os-text-muted hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. TIMETABLE VIEW */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Weekly Class Schedule</h3>
            <button
              onClick={() => setIsClassModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Class</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {daysOfWeek.map((day) => {
              const dayClasses = state.timetable.filter(
                (c) => c.day.toLowerCase() === day.toLowerCase()
              );

              return (
                <div key={day} className="glass-panel p-3.5 flex flex-col min-h-[220px]">
                  <div className="text-xs font-bold font-mono uppercase pb-2 mb-2 border-b border-white/10 text-blue-300">
                    {day}
                  </div>

                  <div className="space-y-2 flex-1">
                    {dayClasses.length > 0 ? (
                      dayClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all text-xs group relative"
                        >
                          <div className="font-bold text-white leading-tight">{cls.subject}</div>
                          <div className="text-[10px] text-os-text-muted mt-1">
                            {cls.startTime} - {cls.endTime}
                          </div>
                          <div className="text-[10px] text-blue-300/80 mt-0.5">
                            {cls.room}
                          </div>

                          <button
                            onClick={() => handleDeleteClass(cls.id)}
                            className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-300 p-1 cursor-pointer"
                            title="Delete Class"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-[11px] text-os-text-muted/60 text-center py-8">
                        Free Slot
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. ATTENDANCE TRACKER WITH MATH CALCULATOR */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="glass-panel p-4 bg-gradient-to-r from-blue-950/40 to-slate-900/60 border border-blue-500/20">
            <h4 className="text-xs font-bold uppercase text-blue-400 font-mono mb-1">
              Precision Attendance Engine
            </h4>
            <p className="text-xs text-os-text-muted">
              Live mathematical margin-of-safety calculator. Shows exact classes you can afford to skip or must attend to remain compliant with university regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.attendance.map((sub) => {
              const math = getAttendanceMath(sub.attended, sub.totalClasses, sub.minimumRequired || 75);
              const isSafe = parseFloat(math.currentPercent) >= (sub.minimumRequired || 75);

              return (
                <div key={sub.id} className="glass-panel p-5 space-y-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{sub.subject}</h4>
                      <div className="text-xs text-os-text-muted mt-0.5">
                        Required Target: {sub.minimumRequired || 75}%
                      </div>
                    </div>

                    <div className={`text-right font-mono font-bold text-base ${
                      isSafe ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {math.currentPercent}%
                    </div>
                  </div>

                  {/* Attendance Bar */}
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isSafe ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, math.currentPercent)}%` }}
                    />
                  </div>

                  {/* Mathematical Diagnosis Alert */}
                  <div className={`p-3 rounded-xl text-xs border ${
                    isSafe
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/20 text-red-300'
                  }`}>
                    {isSafe ? (
                      <div className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>You can safely skip <strong>{math.canMiss}</strong> more class(es) without falling below {sub.minimumRequired || 75}%.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Warning! You must attend the next <strong>{math.neededToCatchUp}</strong> consecutive class(es) to restore compliance.</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Increment Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-os-text-muted font-mono">
                      {sub.attended} / {sub.totalClasses} Attended
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateAttendance(sub.id, 1, 1)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/30 font-semibold cursor-pointer"
                      >
                        + Attended
                      </button>
                      <button
                        onClick={() => handleUpdateAttendance(sub.id, 0, 1)}
                        className="px-2.5 py-1 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/30 font-semibold cursor-pointer"
                      >
                        + Missed
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ASSIGNMENTS VIEW */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Coursework & Problem Sets</h3>
            <button
              onClick={() => setIsAssignmentModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Assignment</span>
            </button>
          </div>

          <div className="space-y-3">
            {state.assignments.map((asg) => {
              const isDone = asg.status === 'Completed';
              const daysLeft = Math.ceil((new Date(asg.deadline) - new Date()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={asg.id}
                  className={`glass-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border transition-all ${
                    isDone
                      ? 'bg-emerald-950/10 border-emerald-500/20'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleAssignment(asg.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all mt-0.5 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'border-white/30 bg-black/20 text-transparent hover:border-blue-400'
                      }`}
                    >
                      ✓
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-blue-400">{asg.subject}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.2 rounded border ${
                          asg.priority === 'high' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-white/5 text-os-text-muted border-white/10'
                        }`}>
                          {asg.priority.toUpperCase()}
                        </span>
                      </div>
                      <h4 className={`text-sm font-bold text-white mt-0.5 ${isDone ? 'line-through opacity-70' : ''}`}>
                        {asg.title}
                      </h4>
                      <p className="text-xs text-os-text-muted mt-1">{asg.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 pl-9 md:pl-0">
                    <div className="text-right">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                        daysLeft <= 2 && !isDone
                          ? 'bg-red-500/20 text-red-300 border-red-500/30 font-bold animate-pulse'
                          : 'bg-white/5 text-os-text-muted border-white/10'
                      }`}>
                        {isDone ? 'Completed' : daysLeft <= 0 ? 'Due Today' : `Due in ${daysLeft}d`}
                      </span>
                    </div>

                    <button
                      onClick={() => setAssignments((prev) => prev.filter((a) => a.id !== asg.id))}
                      className="text-red-400 hover:text-red-300 p-1.5 cursor-pointer"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. EXAMS & COUNTDOWN VIEW */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Upcoming Examinations</h3>
            <button
              onClick={() => setIsExamModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Exam</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {state.exams.map((ex) => {
              const daysLeft = Math.ceil((new Date(ex.examDate) - new Date()) / (1000 * 60 * 60 * 24));

              return (
                <div key={ex.id} className="glass-panel p-5 space-y-3 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-semibold text-indigo-400">{ex.subject}</span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        daysLeft <= 7 ? 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse' : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                      }`}>
                        {daysLeft <= 0 ? 'Today!' : `${daysLeft} days left`}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{ex.title}</h4>
                    <p className="text-xs text-os-text-muted mt-1 line-clamp-3">
                      <strong>Syllabus:</strong> {ex.syllabus}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-os-text-muted">Preparation</span>
                      <span className="font-mono text-white font-semibold">{ex.preparationPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${ex.preparationPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. GPA / CGPA CALCULATOR & WHAT-IF PREDICTOR */}
      {activeTab === 'gpa' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-panel p-5 bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border border-blue-500/30 text-center flex flex-col justify-center">
              <span className="text-xs font-mono text-blue-300 uppercase font-semibold">Current Semester SGPA</span>
              <div className="text-4xl font-extrabold font-mono text-white my-1">
                {calculateCurrentGPA()}
              </div>
              <span className="text-[11px] text-os-text-muted">
                Based on {gpaCourses.reduce((sum, c) => sum + (parseFloat(c.credits) || 0), 0)} Total Credit Hours
              </span>
            </div>

            <div className="glass-panel p-5 col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase text-indigo-400 font-mono">
                "What Do I Need To Score?" Projection Tool
              </h4>
              <p className="text-xs text-os-text-muted">
                Set a target GPA to see the required grade point average needed across your upcoming semester credits.
              </p>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="4.0"
                  value={targetGPA}
                  onChange={(e) => setTargetGPA(parseFloat(e.target.value) || 3.0)}
                  className="w-24 px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono font-bold text-center"
                />
                <span className="text-xs text-slate-300">
                  Target GPA requires an average of <strong>{Math.min(4.0, (targetGPA * 1.02)).toFixed(2)}</strong> across final exams & labs.
                </span>
              </div>
            </div>
          </div>

          {/* Courses Table */}
          <div className="glass-panel p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase text-white font-mono">Graded Course Roster</h4>
            <div className="space-y-2">
              {gpaCourses.map((c, i) => (
                <div key={c.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 text-xs">
                  <span className="font-bold text-white flex-1">{c.name}</span>
                  <span className="text-os-text-muted font-mono">{c.credits} Credits</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold">{c.grade} ({c.gradePoint})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. SYLLABUS MASTERY TRACKER */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6">
          {state.syllabus.map((course) => (
            <div key={course.id} className="glass-panel p-5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>{course.subject}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {course.units.map((unit) => (
                  <div key={unit.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold text-blue-300 font-mono">{unit.title}</h4>
                    <div className="space-y-2">
                      {unit.topics.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleToggleSyllabusTopic(course.id, unit.id, t.id)}
                          className="flex items-center gap-2.5 text-xs text-os-text cursor-pointer hover:text-white"
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                            t.completed ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/30 bg-black/20'
                          }`}>
                            {t.completed && <span className="text-[10px] font-bold">✓</span>}
                          </div>
                          <span className={t.completed ? 'line-through opacity-60' : ''}>
                            {t.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Add Class Schedule</h3>
            <form onSubmit={handleSaveClass} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={classForm.subject}
                  onChange={(e) => setClassForm({ ...classForm, subject: e.target.value })}
                  placeholder="e.g. CS 229 Machine Learning"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Teacher / Professor</label>
                  <input
                    type="text"
                    value={classForm.teacher}
                    onChange={(e) => setClassForm({ ...classForm, teacher: e.target.value })}
                    placeholder="Prof. Andrew"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={classForm.room}
                    onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                    placeholder="Turing 101"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Day</label>
                  <select
                    value={classForm.day}
                    onChange={(e) => setClassForm({ ...classForm, day: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d} className="bg-slate-900">{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Start Time</label>
                  <input
                    type="time"
                    value={classForm.startTime}
                    onChange={(e) => setClassForm({ ...classForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">End Time</label>
                  <input
                    type="time"
                    value={classForm.endTime}
                    onChange={(e) => setClassForm({ ...classForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-os-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Add Assignment</h3>
            <form onSubmit={handleSaveAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={assignmentForm.subject}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                  placeholder="e.g. CS 161: Algorithms"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  placeholder="e.g. Problem Set 3 Dynamic Programming"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-os-text-muted mb-1">Deadline Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={assignmentForm.deadline}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  />
                </div>
                <div>
                  <label className="block text-os-text-muted mb-1">Priority</label>
                  <select
                    value={assignmentForm.priority}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                  >
                    <option value="high" className="bg-slate-900">High</option>
                    <option value="medium" className="bg-slate-900">Medium</option>
                    <option value="low" className="bg-slate-900">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAssignmentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-os-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exam Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-window p-6 border border-white/15 space-y-4">
            <h3 className="text-base font-bold text-white">Schedule Examination</h3>
            <form onSubmit={handleSaveExam} className="space-y-3 text-xs">
              <div>
                <label className="block text-os-text-muted mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={examForm.subject}
                  onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                  placeholder="CS 229: Machine Learning"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Exam Title</label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  placeholder="Midterm Exam 1"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Exam Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={examForm.examDate}
                  onChange={(e) => setExamForm({ ...examForm, examDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div>
                <label className="block text-os-text-muted mb-1">Syllabus Summary</label>
                <textarea
                  rows={2}
                  value={examForm.syllabus}
                  onChange={(e) => setExamForm({ ...examForm, syllabus: e.target.value })}
                  placeholder="Topics covered..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-os-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Schedule Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
