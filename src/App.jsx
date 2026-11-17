import React from 'react';
import { OSProvider } from './context/OSContext';
import BootScreen from './components/shell/BootScreen';
import WallpaperBackground from './components/shell/WallpaperBackground';
import TopBar from './components/shell/TopBar';
import Desktop from './components/desktop/Desktop';
import WindowManager from './components/shell/WindowManager';
import Dock from './components/shell/Dock';
import MobileNav from './components/shell/MobileNav';
import CommandPalette from './components/shell/CommandPalette';
import QuickCaptureModal from './components/shell/QuickCaptureModal';
import LevelUpModal from './components/shell/LevelUpModal';
import AchievementToast from './components/shell/AchievementToast';
import OnboardingModal from './components/shell/OnboardingModal';

function OSWorkspace() {
  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-os-bg font-sans">
      {/* 1. Dynamic Wallpaper & Particle Canvas */}
      <WallpaperBackground />

      {/* 2. Top Navigation Bar */}
      <TopBar />

      {/* 3. Main Desktop Workspace (Interactive Widgets) */}
      <Desktop />

      {/* 4. Desktop Window Manager (Active Applications Stack) */}
      <WindowManager />

      {/* 5. Desktop Dock (Bottom Application Launcher) */}
      <Dock />

      {/* 6. Mobile Adaptive Navigation Drawer */}
      <MobileNav />

      {/* 7. Global Modals & Overlays */}
      <CommandPalette />
      <QuickCaptureModal />
      <LevelUpModal />
      <AchievementToast />
      <OnboardingModal />
      <BootScreen />
    </div>
  );
}

export default function App() {
  return (
    <OSProvider>
      <OSWorkspace />
    </OSProvider>
  );
}
