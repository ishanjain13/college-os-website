import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  CheckCircle2, 
  GraduationCap, 
  Timer, 
  Menu, 
  X,
  BookOpen,
  Dumbbell,
  Wallet,
  Briefcase,
  Trophy,
  Settings,
  Sparkles,
  Plus
} from 'lucide-react';
import { useOS, APP_METADATA } from '../../context/OSContext';

export default function MobileNav() {
  const { openWindow, setIsQuickCaptureOpen, activeWindowId } = useOS();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'habits', label: 'Habits', icon: CheckCircle2 },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'focus', label: 'Focus', icon: Timer }
  ];

  const allApps = Object.values(APP_METADATA);

  return (
    <>
      {/* Bottom Floating Mobile Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#090d16]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around select-none">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeWindowId === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => openWindow(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-indigo-400 font-bold' : 'text-os-text-muted hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* Apps Drawer Menu Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-os-text-muted hover:text-white cursor-pointer"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">All Apps</span>
        </button>
      </nav>

      {/* Fullscreen Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/85 backdrop-blur-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="font-bold font-display text-white text-base">COLLEGE OS APPLICATIONS</span>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 rounded-lg text-os-text-muted hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 my-auto py-4 overflow-y-auto max-h-[70vh] scrollbar-thin">
            {allApps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  openWindow(app.id);
                  setDrawerOpen(false);
                }}
                className="p-3.5 rounded-2xl glass-panel border border-white/10 flex flex-col items-center text-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: `${app.color}30`, border: `1px solid ${app.color}50` }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: app.color }} />
                </div>
                <span className="text-[11px] font-bold text-white leading-tight">{app.title}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setIsQuickCaptureOpen(true);
              setDrawerOpen(false);
            }}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Instant Quick Capture</span>
          </button>
        </div>
      )}
    </>
  );
}
