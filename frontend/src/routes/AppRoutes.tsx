import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ChildLayout } from '../layouts/ChildLayout';
import { CaregiverLayout } from '../layouts/CaregiverLayout';
import { GameWorldLayout } from '../components/layout/GameWorldLayout';
import { ChildrenListPage } from '../pages/ChildrenListPage';
import { ChildDashboardPage } from '../pages/ChildDashboardPage';
import { PlayGamePage } from '../pages/PlayGamePage';
import { ReferencesPage } from '../pages/ReferencesPage';
import { ProgressTrailPage } from '../pages/ProgressTrailPage';
import { GuidedActivityPage } from '../pages/GuidedActivityPage';
import { OverviewPage } from '../pages/caregiver/OverviewPage';
import { ProfilePage } from '../pages/caregiver/ProfilePage';
import { GoalsPage } from '../pages/caregiver/GoalsPage';
import { WeeklyPlanPage } from '../pages/caregiver/WeeklyPlanPage';
import { RecommendationsPage } from '../pages/caregiver/RecommendationsPage';
import { ObservationsPage } from '../pages/caregiver/ObservationsPage';
import { HistoryPage } from '../pages/caregiver/HistoryPage';
import { ActivitiesPage } from '../pages/caregiver/ActivitiesPage';
import { ProgressPage } from '../pages/caregiver/ProgressPage';
import { CaregiverListPage } from '../pages/caregivers/CaregiverListPage';
import { CaregiverProfilePage } from '../pages/caregivers/CaregiverProfilePage';

export const AppRoutes: React.FC = () => (
  <Routes>
    {/* ── Standalone pages ── */}
    <Route path="/" element={<ChildrenListPage />} />
    <Route path="/references" element={<ReferencesPage />} />

    {/* ── Caregivers management ── */}
    <Route path="/caregivers" element={<CaregiverListPage />} />
    <Route path="/caregivers/:caregiverId" element={<CaregiverProfilePage />} />

    {/* ── Game / activity full-screen (no sidebar) ── */}
    <Route element={<GameWorldLayout />}>
      <Route path="/children/:id/play/:gameCode" element={<PlayGamePage />} />
      <Route path="/children/:id/activity/:activityCode" element={<GuidedActivityPage />} />
    </Route>

    {/* ── ÁREA DA CRIANÇA — with ChildSidebar ── */}
    <Route element={<ChildLayout />}>
      <Route path="/children/:id" element={<ChildDashboardPage />} />
      <Route path="/children/:id/trail" element={<ProgressTrailPage />} />
    </Route>

    {/* ── ÁREA DO RESPONSÁVEL — with CaregiverSidebar + shared data ── */}
    <Route element={<CaregiverLayout />}>
      <Route path="/children/:id/caregiver" element={<OverviewPage />} />
      <Route path="/children/:id/caregiver/profile" element={<ProfilePage />} />
      <Route path="/children/:id/caregiver/goals" element={<GoalsPage />} />
      <Route path="/children/:id/caregiver/weekly-plan" element={<WeeklyPlanPage />} />
      <Route path="/children/:id/caregiver/recommendations" element={<RecommendationsPage />} />
      <Route path="/children/:id/caregiver/observations" element={<ObservationsPage />} />
      <Route path="/children/:id/caregiver/history" element={<HistoryPage />} />
      <Route path="/children/:id/caregiver/activities" element={<ActivitiesPage />} />
      <Route path="/children/:id/caregiver/progress" element={<ProgressPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
