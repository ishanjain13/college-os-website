import React from 'react';
import Window from './Window';
import { useOS } from '../../context/OSContext';

// Application Component Imports
import DashboardApp from '../apps/DashboardApp';
import GoalsApp from '../apps/GoalsApp';
import HabitsApp from '../apps/HabitsApp';
import AcademicsApp from '../apps/AcademicsApp';
import FocusApp from '../apps/FocusApp';
import PlannerApp from '../apps/PlannerApp';
import NotesApp from '../apps/NotesApp';
import FitnessApp from '../apps/FitnessApp';
import MoneyApp from '../apps/MoneyApp';
import CareerApp from '../apps/CareerApp';
import WellbeingApp from '../apps/WellbeingApp';
import JournalApp from '../apps/JournalApp';
import GamificationApp from '../apps/GamificationApp';
import VisionBoardApp from '../apps/VisionBoardApp';
import FutureMeApp from '../apps/FutureMeApp';
import CampusLifeApp from '../apps/CampusLifeApp';
import AIStudyBuddyApp from '../apps/AIStudyBuddyApp';
import SettingsApp from '../apps/SettingsApp';

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

export default function WindowManager() {
  const { openWindows } = useOS();

  return (
    <>
      {openWindows.map((win) => {
        const AppComponent = APP_COMPONENTS[win.id];
        if (!AppComponent) return null;

        return (
          <Window key={win.id} windowData={win}>
            <AppComponent />
          </Window>
        );
      })}
    </>
  );
}
