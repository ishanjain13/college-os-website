import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Target, 
  CheckCircle2, 
  GraduationCap, 
  Timer, 
  Menu, 
  X,
  Plus,
  Sparkles
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
      <nav className="fixed bottom-0 left-0 right-0 z-dock md:hidden bg-os-dock backdrop-blur-2xl border-t border-os-border px-2 py-1 flex items-center justify-around select-none shadow-dock">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeWindowId === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => openWindow(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-os-accent font-bold' : 'text-os-text-muted hover:text-os-text'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {isActive && (
                <motion.span
                  layoutId="mobileActiveTab"
                  className="absolute bottom-0 w-1 h-1 rounded-full bg-os-accent"
                />
              )}
            </button>
          );
        })}

        {/* Apps Drawer Menu Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-os-text-muted hover:text-os-text cursor-pointer"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">All Apps</span>
        </button>
      </nav>

      {/* Fullscreen Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed inset-0 z-modal md:hidden bg-black/90 backdrop-blur-2xl p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between pb-3 border-b border-os-border">
              <div>
                <span className="font-bold font-display text-white text-base">All 18 Applications</span>
                <p className="text-[11px] text-os-text-muted">Tap to launch full-screen</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 text-os-text-muted hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 my-auto py-4 overflow-y-auto max-h-[70vh] scrollbar-thin">
              {allApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    openWindow(app.id);
                    setDrawerOpen(false);
                  }}
                  className="p-3 rounded-2xl glass-panel border border-os-border flex flex-col items-center text-center gap-2 cursor-pointer active:scale-95 transition-transform"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: `${app.color}25`, border: `1px solid ${app.color}45` }}
                  >
                    <Sparkles className="w-5 h-5" style={{ color: app.color }} />
                  </div>
                  <span className="text-[11px] font-semibold text-white leading-tight truncate w-full">
                    {app.title}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setIsQuickCaptureOpen(true);
                setDrawerOpen(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-os-accent hover:bg-os-accent-hover text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-elevation-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Instant Quick Capture</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
