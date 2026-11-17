import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  size = 'sm',
}) {
  const tabListRef = useRef(null);

  const handleKeyDown = (e, index) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    onChange(tabs[nextIndex].id);
    const buttons = tabListRef.current?.querySelectorAll('button[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  const sizeClasses = {
    sm: 'p-1 text-xs gap-1',
    md: 'p-1.5 text-sm gap-1.5',
  };

  const itemSizeClasses = {
    sm: 'px-3 py-1.5 rounded-lg text-xs',
    md: 'px-4 py-2 rounded-xl text-sm',
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label="Tabs"
      className={`inline-flex items-center bg-black/40 border border-os-border rounded-xl backdrop-blur-md select-none ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`relative flex items-center gap-2 font-medium cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent ${
              itemSizeClasses[size] || itemSizeClasses.sm
            } ${isActive ? 'text-white font-semibold' : 'text-os-text-muted hover:text-os-text hover:bg-white/5'}`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 bg-os-accent rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-os-text-muted'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
