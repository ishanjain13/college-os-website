import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Bus, 
  Utensils, 
  Plus, 
  MapPin, 
  Clock, 
  Radio, 
  CheckCircle2 
} from 'lucide-react';
import { useOS } from '../../context/OSContext';

export default function CampusLifeApp() {
  const { awardXP } = useOS();
  const [activeTab, setActiveTab] = useState('study_room'); // 'study_room' | 'events' | 'clubs' | 'bus' | 'mess'

  // Simulated Study Room State
  const [studyRoomStudents, setStudyRoomStudents] = useState([
    { name: 'Alex (You)', goal: 'CS 229 Midterm Prep', status: 'Focusing', time: '42m' },
    { name: 'Marcus T.', goal: 'Algorithms HW4 Dynamic Programming', status: 'Focusing', time: '1h 15m' },
    { name: 'Elena R.', goal: 'PyTorch Vision Classifier', status: 'Focusing', time: '28m' },
    { name: 'Dave K.', goal: 'RISC-V Verilog Pipeline', status: 'Focusing', time: '55m' },
    { name: 'Sarah L.', goal: 'Linear Algebra SVD Exercises', status: 'Focusing', time: '35m' }
  ]);

  const [campusEvents, setCampusEvents] = useState([
    { id: 'ev-1', title: 'Stanford AI Symposium & Hackathon', date: '2026-10-25', location: 'Gates Hall Auditorium', organizer: 'AI Student Society' },
    { id: 'ev-2', title: 'FAANG Career & Networking Expo', date: '2026-11-02', location: 'Tressider Union', organizer: 'Career Development Center' },
    { id: 'ev-3', title: 'Robotics Demo & Drone Race', date: '2026-11-12', location: 'Packard Quad', organizer: 'Robotics Club' }
  ]);

  const [busTimings, setBusTimings] = useState([
    { route: 'Campus Line A (West Campus ➔ Library)', freq: 'Every 10 mins', next: '09:15 AM' },
    { route: 'North Line B (Engineering Quad ➔ Student Dorms)', freq: 'Every 15 mins', next: '09:20 AM' },
    { route: 'Metro Express (Campus Center ➔ Downtown Caltrain)', freq: 'Every 20 mins', next: '09:30 AM' }
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Campus Life & Collaborative Study Room</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Campus directory, study room presence simulation, club events, and shuttle timings.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('study_room')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'study_room' ? 'bg-emerald-600 text-white font-semibold' : 'text-os-text-muted hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Virtual Study Room ({studyRoomStudents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'events' ? 'bg-emerald-600 text-white font-semibold' : 'text-os-text-muted hover:text-white'
            }`}
          >
            Campus Events
          </button>
          <button
            onClick={() => setActiveTab('bus')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'bus' ? 'bg-emerald-600 text-white font-semibold' : 'text-os-text-muted hover:text-white'
            }`}
          >
            Shuttle Bus Timings
          </button>
        </div>
      </div>

      {/* 1. VIRTUAL STUDY ROOM PROTOTYPE */}
      {activeTab === 'study_room' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 bg-gradient-to-r from-emerald-950/40 to-slate-900/60 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <h4 className="text-sm font-bold text-white">Silent Focus Library Room #4</h4>
                <p className="text-xs text-os-text-muted">5 ambitious scholars locked in deep work right now.</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Live Room Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyRoomStudents.map((st, i) => (
              <div key={i} className="glass-panel p-4 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-xs text-white">
                    {st.name[0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{st.name}</h5>
                    <p className="text-[11px] text-os-text-muted">{st.goal}</p>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-emerald-400 font-semibold block">{st.status}</span>
                  <span className="text-[10px] text-os-text-muted">{st.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CAMPUS EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-3">
          {campusEvents.map((ev) => (
            <div key={ev.id} className="glass-panel p-5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-semibold text-emerald-400">{ev.date}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{ev.title}</h4>
                <div className="text-xs text-os-text-muted mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-os-text-subtle" />
                  <span>{ev.location} • Organised by {ev.organizer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. BUS TIMINGS */}
      {activeTab === 'bus' && (
        <div className="space-y-3">
          {busTimings.map((b, i) => (
            <div key={i} className="glass-panel p-4 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bus className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">{b.route}</h4>
                  <span className="text-[10px] text-os-text-muted font-mono">{b.freq}</span>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Next: {b.next}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
