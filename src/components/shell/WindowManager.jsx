import React, { Suspense, lazy } from 'react';
import Window from './Window';
import { useOS } from '../../context/OSContext';
import { Skeleton } from '../ui/Skeleton';

// Code-split and lazy-load all 18 heavy application components for fast initial load & 60fps
const DashboardApp = lazy(() => import('../apps/DashboardApp'));
const GoalsApp = lazy(() => import('../apps/GoalsApp'));
const HabitsApp = lazy(() => import('../apps/HabitsApp'));
const AcademicsApp = lazy(() => import('../apps/AcademicsApp'));
const FocusApp = lazy(() => import('../apps/FocusApp'));
const PlannerApp = lazy(() => import('../apps/PlannerApp'));
const NotesApp = lazy(() => import('../apps/NotesApp'));
const FitnessApp = lazy(() => import('../apps/FitnessApp'));
const MoneyApp = lazy(() => import('../apps/MoneyApp'));
const CareerApp = lazy(() => import('../apps/CareerApp'));
const WellbeingApp = lazy(() => import('../apps/WellbeingApp'));
const JournalApp = lazy(() => import('../apps/JournalApp'));
const GamificationApp = lazy(() => import('../apps/GamificationApp'));
const VisionBoardApp = lazy(() => import('../apps/VisionBoardApp'));
const FutureMeApp = lazy(() => import('../apps/FutureMeApp'));
const CampusLifeApp = lazy(() => import('../apps/CampusLifeApp'));
const AIStudyBuddyApp = lazy(() => import('../apps/AIStudyBuddyApp'));
const SettingsApp = lazy(() => import('../apps/SettingsApp'));

const APP_COMPONENTS = {
  dashboard: DashboardApp,
  goals: GoalsApp,
  habits: HabitsApp,
  academics: AcademicsApp,
  focus: FocusApp,
  planner: PlannerApp,
  notes: NotesApp,
  fitness: FitnessApp,
  money: MoneyApp,
  career: CareerApp,
  wellbeing: WellbeingApp,
  journal: JournalApp,
  achievements: GamificationApp,
  vision: VisionBoardApp,
  future_me: FutureMeApp,
  campus: CampusLifeApp,
  ai_buddy: AIStudyBuddyApp,
  settings: SettingsApp
};

function WindowLoadingFallback() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="space-y-1.5 flex-1">
          <Skeleton variant="text" className="w-48 h-4" />
          <Skeleton variant="text" className="w-32 h-3" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <Skeleton variant="rectangular" className="h-32" />
        <Skeleton variant="rectangular" className="h-32" />
      </div>
    </div>
  );
}

export default function WindowManager() {
  const { openWindows } = useOS();

  return (
    <>
      {openWindows.map((win) => {
        const AppComponent = APP_COMPONENTS[win.id];
        if (!AppComponent) return null;

        return (
          <Window key={win.id} windowData={win}>
            <Suspense fallback={<WindowLoadingFallback />}>
              <AppComponent />
            </Suspense>
          </Window>
        );
      })}
    </>
  );
}
