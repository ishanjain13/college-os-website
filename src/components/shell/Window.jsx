import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Minus, 
  Square, 
  Copy,
  LayoutDashboard,
  Target,
  CheckCircle2,
  GraduationCap,
  Timer,
  CalendarDays,
  BookOpen,
  Dumbbell,
  Wallet,
  Briefcase,
  HeartPulse,
  Feather,
  Trophy,
  Sparkles,
  Hourglass,
  Users,
  Bot,
  Settings
} from 'lucide-react';
import { useOS, APP_METADATA } from '../../context/OSContext';

const ICON_MAP = {
  LayoutDashboard,
  Target,
  CheckCircle2,
  GraduationCap,
  Timer,
  CalendarDays,
  BookOpen,
  Dumbbell,
  Wallet,
  Briefcase,
  HeartPulse,
  Feather,
  Trophy,
  Sparkles,
  Hourglass,
  Users,
  Bot,
  Settings
};

export default function Window({ windowData, children }) {
  const { 
    closeWindow, 
    minimizeWindow, 
    toggleMaximizeWindow, 
    focusWindow, 
    updateWindowPosition,
    activeWindowId 
  } = useOS();

  const { id, isMinimized, isMaximized, zIndex, x, y, w, h } = windowData;
  const meta = APP_METADATA[id] || { title: id, icon: 'LayoutDashboard', color: '#6366f1' };
  const IconComponent = ICON_MAP[meta.icon] || LayoutDashboard;

  const isFocused = activeWindowId === id;
  const windowRef = useRef(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleHeaderMouseDown = (e) => {
    if (isMaximized || e.target.closest('button')) return;
    setIsDragging(true);
    focusWindow(id);
    dragOffset.current = {
      x: e.clientX - x,
      y: e.clientY - y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffset.current.x));
      const newY = Math.max(44, Math.min(window.innerHeight - 100, e.clientY - dragOffset.current.y));
      updateWindowPosition(id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, id, updateWindowPosition]);

  if (isMinimized) return null;

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onMouseDown={() => focusWindow(id)}
      className={`fixed flex flex-col glass-window overflow-hidden ${
        isFocused ? 'ring-1 ring-white/20 shadow-2xl' : 'opacity-95 shadow-lg'
      }`}
      style={{
        zIndex,
        ...(isMaximized
          ? {
              top: 44,
              left: 0,
              width: '100vw',
              height: 'calc(100vh - 44px - 68px)',
              borderRadius: 0
            }
          : {
              top: y,
              left: x,
              width: w,
              height: h,
              maxWidth: '96vw',
              maxHeight: 'calc(92vh - 44px)'
            })
      }}
    >
      {/* Window Titlebar */}
      <div
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={() => toggleMaximizeWindow(id)}
        className="h-10 bg-black/40 backdrop-blur-md border-b border-white/10 px-3.5 flex items-center justify-between select-none cursor-move shrink-0"
      >
        {/* Left: Window Traffic Light Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => closeWindow(id)}
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 flex items-center justify-center group/btn shadow-xs cursor-pointer"
            title="Close Window"
          >
            <X className="w-2 h-2 text-black/70 opacity-0 group-hover/btn:opacity-100" />
          </button>
          <button
            onClick={() => minimizeWindow(id)}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 flex items-center justify-center group/btn shadow-xs cursor-pointer"
            title="Minimize Window"
          >
            <Minus className="w-2 h-2 text-black/70 opacity-0 group-hover/btn:opacity-100" />
          </button>
          <button
            onClick={() => toggleMaximizeWindow(id)}
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 flex items-center justify-center group/btn shadow-xs cursor-pointer"
            title={isMaximized ? "Restore Window" : "Maximize Window"}
          >
            {isMaximized ? (
              <Copy className="w-2 h-2 text-black/70 opacity-0 group-hover/btn:opacity-100" />
            ) : (
              <Square className="w-2 h-2 text-black/70 opacity-0 group-hover/btn:opacity-100" />
            )}
          </button>
        </div>

        {/* Middle: Title & App Icon */}
        <div className="flex items-center gap-2 text-xs font-semibold text-os-text tracking-wide pointer-events-none">
          <IconComponent className="w-3.5 h-3.5" style={{ color: meta.color }} />
          <span>{meta.title}</span>
        </div>

        {/* Right placeholder */}
        <div className="w-12 flex justify-end items-center">
          <span className="text-[10px] text-os-text-subtle font-mono uppercase">
            OS Window
          </span>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 text-os-text bg-os-window/90 scrollbar-thin">
        {children}
      </div>
    </motion.div>
  );
}
