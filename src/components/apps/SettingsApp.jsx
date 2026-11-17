import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Palette, 
  Volume2, 
  Zap, 
  Trophy, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { clearAllLocalData } from '../../services/storage';

export default function SettingsApp() {
  const { 
    state, 
    updateProfile, 
    updateAppearance, 
    setState, 
    handleExportBackup, 
    handleImportBackup 
  } = useOS();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'appearance' | 'sound' | 'gamification' | 'data'
  const [importFileText, setImportFileText] = useState('');

  const themes = [
    { id: 'dark', label: 'Dark Charcoal' },
    { id: 'light', label: 'Clean Light' },
    { id: 'cyber', label: 'Cyberpunk' },
    { id: 'lofi', label: 'Warm Lo-Fi' },
    { id: 'anime', label: 'Neon Blossom' },
    { id: 'amoled', label: 'Pure AMOLED' },
    { id: 'study', label: 'Emerald Study' },
    { id: 'minimalist', label: 'Minimalist' }
  ];

  const wallpapers = [
    { id: 'aurora', label: 'Aurora Glow' },
    { id: 'cyber_grid', label: 'Cyber Grid' },
    { id: 'lofi_room', label: 'Lo-Fi Ambient' },
    { id: 'deep_space', label: 'Deep Space' },
    { id: 'matrix', label: 'Matrix Code' },
    { id: 'minimal_gradient', label: 'Minimal Slate' },
    { id: 'custom', label: 'Custom URL' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (confirm("Importing this backup will replace current data. Continue?")) {
        handleImportBackup(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-os-text-muted" />
            <span>System Settings & Preferences</span>
          </h2>
          <p className="text-xs text-os-text-muted mt-0.5">
            Configure student profile, themes, custom wallpapers, sound FX, XP reward values, and full JSON data backups.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs overflow-x-auto scrollbar-none">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'sound', label: 'Audio & FX', icon: Volume2 },
            { id: 'gamification', label: 'XP & Levels', icon: Trophy },
            { id: 'data', label: 'Data & Backups', icon: Database }
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

      {/* 1. PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="glass-panel p-6 border border-white/10 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white font-mono uppercase">Student Identity</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-os-text-muted mb-1 font-medium">Your Name</label>
              <input
                type="text"
                value={state.profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="block text-os-text-muted mb-1 font-medium">Avatar Emoji / Letter</label>
              <input
                type="text"
                value={state.profile.avatar}
                onChange={(e) => updateProfile({ avatar: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-center font-bold"
              />
            </div>

            <div>
              <label className="block text-os-text-muted mb-1 font-medium">University / College</label>
              <input
                type="text"
                value={state.profile.college}
                onChange={(e) => updateProfile({ college: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="block text-os-text-muted mb-1 font-medium">Course / Major</label>
              <input
                type="text"
                value={state.profile.course}
                onChange={(e) => updateProfile({ course: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="block text-os-text-muted mb-1 font-medium">Academic Year</label>
              <input
                type="text"
                value={state.profile.year}
                onChange={(e) => updateProfile({ year: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white"
              />
            </div>

            <div>
              <label className="block text-os-text-muted mb-1 font-medium">Daily Streak Counter</label>
              <input
                type="number"
                value={state.profile.streak}
                onChange={(e) => updateProfile({ streak: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <label className="text-white font-medium flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={state.profile.bootSequenceEnabled}
                onChange={(e) => updateProfile({ bootSequenceEnabled: e.target.checked })}
                className="rounded border-white/20 text-indigo-500"
              />
              <span>Enable Animated Boot Sequence on App Launch</span>
            </label>
          </div>
        </div>
      )}

      {/* 2. APPEARANCE SETTINGS */}
      {activeTab === 'appearance' && (
        <div className="glass-panel p-6 border border-white/10 space-y-6 max-w-3xl">
          {/* Theme Selection */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white font-mono mb-3">Color Themes</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => updateAppearance({ theme: th.id })}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    state.appearance.theme === th.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                      : 'bg-white/5 border-white/5 text-os-text-muted hover:bg-white/10'
                  }`}
                >
                  <span>{th.label}</span>
                  {state.appearance.theme === th.id && <span className="text-indigo-400">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Picker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase text-white font-mono">Accent Color</h4>
              {state.appearance.accentColor && (
                <button
                  onClick={() => updateAppearance({ accentColor: null })}
                  className="text-[10px] text-os-text-subtle hover:text-white underline cursor-pointer"
                >
                  Reset to Theme Default
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {[
                { label: 'Indigo', value: '#6366f1' },
                { label: 'Violet', value: '#8b5cf6' },
                { label: 'Cyan', value: '#06b6d4' },
                { label: 'Emerald', value: '#10b981' },
                { label: 'Rose', value: '#f43f5e' },
                { label: 'Amber', value: '#f59e0b' },
                { label: 'Blue', value: '#3b82f6' },
                { label: 'Pink', value: '#ec4899' },
              ].map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => updateAppearance({ accentColor: c.value })}
                  className={`w-8 h-8 rounded-xl border-2 transition-transform cursor-pointer flex items-center justify-center ${
                    state.appearance.accentColor === c.value
                      ? 'scale-110 border-white shadow-elevation-2'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                >
                  {state.appearance.accentColor === c.value && (
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  )}
                </button>
              ))}
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <input
                  type="color"
                  value={state.appearance.accentColor || '#6366f1'}
                  onChange={(e) => updateAppearance({ accentColor: e.target.value })}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  title="Custom Hex Color"
                />
                <span className="text-[11px] font-mono text-os-text-muted">Custom Hex</span>
              </div>
            </div>
          </div>

          {/* Wallpaper Selection */}
          <div>
            <h4 className="text-xs font-bold uppercase text-white font-mono mb-3">Desktop Wallpapers</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {wallpapers.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => updateAppearance({ wallpaper: wp.id })}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    state.appearance.wallpaper === wp.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                      : 'bg-white/5 border-white/5 text-os-text-muted hover:bg-white/10'
                  }`}
                >
                  <span>{wp.label}</span>
                  {state.appearance.wallpaper === wp.id && <span className="text-indigo-400">✓</span>}
                </button>
              ))}
            </div>

            {state.appearance.wallpaper === 'custom' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={state.appearance.customWallpaperUrl || ''}
                  onChange={(e) => updateAppearance({ customWallpaperUrl: e.target.value })}
                  placeholder="Paste direct image URL (https://...)"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white"
                />
              </div>
            )}
          </div>

          {/* Background Animation Toggle */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-white font-medium">Animated Canvas Particle Effects</span>
            <input
              type="checkbox"
              checked={state.appearance.animatedBackground}
              onChange={(e) => updateAppearance({ animatedBackground: e.target.checked })}
              className="rounded border-white/20 text-indigo-500"
            />
          </div>
        </div>
      )}

      {/* 3. AUDIO SETTINGS */}
      {activeTab === 'sound' && (
        <div className="glass-panel p-6 border border-white/10 space-y-5 max-w-xl">
          <h3 className="text-sm font-bold text-white font-mono uppercase">Sound Synthesizer Engine</h3>

          <div className="flex items-center justify-between text-xs py-2 border-b border-white/10">
            <div>
              <div className="font-bold text-white">Enable UI Sound FX</div>
              <div className="text-os-text-muted text-[11px]">Procedural Web Audio chimes on task completion and level-ups.</div>
            </div>
            <input
              type="checkbox"
              checked={state.profile.soundEnabled}
              onChange={(e) => updateProfile({ soundEnabled: e.target.checked })}
              className="rounded border-white/20 text-indigo-500"
            />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-medium">
              <span className="text-white">Master Sound Volume</span>
              <span className="font-mono text-indigo-400">{Math.round((state.profile.soundVolume || 0.5) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.profile.soundVolume || 0.5}
              onChange={(e) => updateProfile({ soundVolume: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>
      )}

      {/* 4. GAMIFICATION CONFIG */}
      {activeTab === 'gamification' && (
        <div className="glass-panel p-6 border border-white/10 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white font-mono uppercase">Custom XP Reward Values</h3>
          <p className="text-xs text-os-text-muted">Adjust how much XP each productive action yields to fit your personal difficulty curve.</p>

          <div className="grid grid-cols-2 gap-4 text-xs">
            {Object.entries(state.xpConfig || {}).map(([key, val]) => (
              <div key={key}>
                <label className="block text-os-text-muted mb-1 font-mono uppercase text-[10px]">{key}</label>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value) || 0;
                    setState((prev) => ({
                      ...prev,
                      xpConfig: { ...prev.xpConfig, [key]: newVal }
                    }));
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DATA MANAGEMENT & JSON BACKUP */}
      {activeTab === 'data' && (
        <div className="glass-panel p-6 border border-white/10 space-y-6 max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase mb-1">Full State Backup & Restore</h3>
            <p className="text-xs text-os-text-muted leading-relaxed">
              College OS stores 100% of your data locally in your browser. Export full JSON backup snapshots to preserve your semester data or move between devices.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportBackup}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full JSON Backup</span>
            </button>

            <label className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-2 border border-white/15 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Restore Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Destructive Reset Actions */}
          <div className="pt-6 border-t border-red-500/20 space-y-3">
            <h4 className="text-xs font-bold text-red-400 font-mono uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Danger Zone</span>
            </h4>

            <button
              onClick={() => {
                if (confirm("Are you sure you want to completely erase all College OS stored data? This cannot be undone.")) {
                  clearAllLocalData();
                }
              }}
              className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset & Clear All Local Data</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
