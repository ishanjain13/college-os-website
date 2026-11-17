import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Responsive mobile state
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dragging & Snapping State
  const [isDragging, setIsDragging] = useState(false);
  const [snapCandidate, setSnapCandidate] = useState(null); // 'left' | 'right' | 'top' | null
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleHeaderMouseDown = (e) => {
    if (isMobile || isMaximized || e.target.closest('button')) return;
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

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // Edge Snapping detection
      if (e.clientX <= 25) {
        setSnapCandidate('left');
      } else if (e.clientX >= screenW - 25) {
        setSnapCandidate('right');
      } else if (e.clientY <= 50) {
        setSnapCandidate('top');
      } else {
        setSnapCandidate(null);
      }

      const newX = Math.max(0, Math.min(screenW - 220, e.clientX - dragOffset.current.x));
      const newY = Math.max(44, Math.min(screenH - 100, e.clientY - dragOffset.current.y));
      updateWindowPosition(id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const topBarH = 44;
      const dockMargin = 68;
      const usableH = screenH - topBarH - dockMargin;

      if (snapCandidate === 'left') {
        updateWindowPosition(id, {
          x: 0,
          y: topBarH,
          w: Math.floor(screenW / 2),
          h: usableH
        });
      } else if (snapCandidate === 'right') {
        updateWindowPosition(id, {
          x: Math.floor(screenW / 2),
          y: topBarH,
          w: Math.floor(screenW / 2),
          h: usableH
        });
      } else if (snapCandidate === 'top') {
        toggleMaximizeWindow(id);
      }

      setSnapCandidate(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, snapCandidate, id, toggleMaximizeWindow, updateWindowPosition]);

  if (isMinimized) return null;

  return (
    <>
      {/* Visual Snap Guide Ghost */}
      <AnimatePresence>
        {isDragging && snapCandidate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed pointer-events-none z-[55] bg-os-accent/15 border-2 border-os-accent/40 backdrop-blur-sm rounded-3xl"
            style={{
              top: 44,
              left: snapCandidate === 'right' ? '50vw' : 0,
              width: snapCandidate === 'top' ? '100vw' : '50vw',
              height: 'calc(100vh - 44px - 68px)'
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={windowRef}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ type: 'spring', damping: 25, stiffness: 340 }}
        onMouseDown={() => focusWindow(id)}
        className={`fixed flex flex-col glass-window overflow-hidden transition-shadow duration-200 ${
          isFocused
            ? 'focused ring-1 ring-os-border-light shadow-window-focused opacity-100'
            : 'shadow-elevation-2 opacity-95 hover:opacity-100'
        }`}
        style={{
          zIndex,
          ...(isMobile || isMaximized
            ? {
                top: 44,
                left: 0,
                width: '100vw',
                height: isMobile ? 'calc(100vh - 44px - 58px)' : 'calc(100vh - 44px - 68px)',
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
          onDoubleClick={() => !isMobile && toggleMaximizeWindow(id)}
          className={`h-10 bg-os-bg/70 backdrop-blur-md border-b border-os-border px-3.5 flex items-center justify-between select-none shrink-0 ${isMobile ? 'cursor-default' : 'cursor-move'}`}
        >
          {/* Left: Window Traffic Light Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => closeWindow(id)}
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 active:brightness-90 flex items-center justify-center group/btn shadow-xs cursor-pointer transition-transform hover:scale-105"
              title="Close (Esc)"
              aria-label="Close Window"
            >
              <X className="w-2 h-2 text-black/75 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => minimizeWindow(id)}
              className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-110 active:brightness-90 flex items-center justify-center group/btn shadow-xs cursor-pointer transition-transform hover:scale-105"
              title="Minimize"
              aria-label="Minimize Window"
            >
              <Minus className="w-2 h-2 text-black/75 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => toggleMaximizeWindow(id)}
              className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-110 active:brightness-90 flex items-center justify-center group/btn shadow-xs cursor-pointer transition-transform hover:scale-105"
              title={isMaximized ? "Restore Window" : "Maximize Window"}
              aria-label={isMaximized ? "Restore Window" : "Maximize Window"}
            >
              {isMaximized ? (
                <Copy className="w-2 h-2 text-black/75 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              ) : (
                <Square className="w-2 h-2 text-black/75 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              )}
            </button>
          </div>

          {/* Middle: Title & App Icon */}
          <div className="flex items-center gap-2 text-xs font-semibold text-os-text tracking-wide pointer-events-none">
            <IconComponent className="w-3.5 h-3.5" style={{ color: meta.color }} />
            <span className="font-display">{meta.title}</span>
          </div>

          {/* Right Status Badge */}
          <div className="w-16 flex justify-end items-center">
            <span className="text-[10px] text-os-text-subtle font-mono uppercase tracking-wider">
              {isMaximized ? 'MAX' : 'WIN'}
            </span>
          </div>
        </div>

        {/* Window Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 text-os-text bg-os-window/95 scrollbar-thin">
          {children}
        </div>
      </motion.div>
    </>
  );
}
