import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { CaregiverSidebar } from '../components/layout/CaregiverSidebar';
import {
  fetchSessionsByChild,
  fetchGoalsByChild,
  fetchObservationsByChild,
  fetchWeeklyPlan,
} from '../services/api';
import type {
  Child,
  GameSession,
  TherapeuticGoal,
  SessionObservation,
  WeeklyPlan,
  ChildTherapeuticProfile,
} from '../types';

export interface CaregiverCtx {
  child: Child;
  sessions: GameSession[];
  goals: TherapeuticGoal[];
  observations: SessionObservation[];
  weeklyPlan: WeeklyPlan | undefined;
  therapeuticProfile: ChildTherapeuticProfile | undefined;
  loading: boolean;
  setGoals: React.Dispatch<React.SetStateAction<TherapeuticGoal[]>>;
  setWeeklyPlan: React.Dispatch<React.SetStateAction<WeeklyPlan | undefined>>;
}

export const CaregiverLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const child = useStore((s) => s.children.find((c) => c.id === id));
  const therapeuticProfile = useStore((s) =>
    s.therapeuticProfiles.find((p) => p.childId === id)
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [sessions, setSessions] = useState<GameSession[]>(
    () => (id ? useStore.getState().sessions.filter((s) => s.childId === id) : [])
  );
  const [goals, setGoals] = useState<TherapeuticGoal[]>(
    () => (id ? useStore.getState().goals.filter((g) => g.childId === id) : [])
  );
  const [observations, setObservations] = useState<SessionObservation[]>(
    () => (id ? useStore.getState().observations.filter((o) => o.childId === id) : [])
  );
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | undefined>(
    () => (id ? useStore.getState().weeklyPlans.find((p) => p.childId === id) : undefined)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchSessionsByChild(id),
      fetchGoalsByChild(id),
      fetchObservationsByChild(id),
      fetchWeeklyPlan(id),
    ])
      .then(([s, g, o, w]) => {
        setSessions(s);
        setGoals(g);
        setObservations(o);
        setWeeklyPlan(w);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!child) return <Navigate to="/" replace />;

  const ctx: CaregiverCtx = {
    child,
    sessions,
    goals,
    observations,
    weeklyPlan,
    therapeuticProfile,
    loading,
    setGoals,
    setWeeklyPlan,
  };

  return (
    <div className="caregiver-area-shell">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <CaregiverSidebar
        childId={child.id}
        childName={child.name}
        childAvatar={child.avatar}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="caregiver-area-content">
        <div className="sidebar-mobile-bar sidebar-mobile-bar--caregiver">
          <button
            className="sidebar-toggle-btn sidebar-toggle-btn--caregiver"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            ☰
          </button>
          <span className="sidebar-mobile-brand">👨‍👩‍👧 Responsável</span>
        </div>
        <Outlet context={ctx} />
      </div>
    </div>
  );
};
