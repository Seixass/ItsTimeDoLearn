import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  fetchSessionsByChild,
  fetchGoalsByChild,
  fetchObservationsByChild,
  fetchWeeklyPlan,
} from '../services/api';
import { computeActivityRecommendations } from '../utils/activityRecommender';
import { ACTIVITY_CATALOG } from '../mocks';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { CaregiverMetrics } from '../components/caregiver/CaregiverMetrics';
import { ActivityHistory } from '../components/caregiver/ActivityHistory';
import { RecentObservations } from '../components/caregiver/RecentObservations';
import { TherapeuticGoalsPanel } from '../components/dashboard/TherapeuticGoalsPanel';
import { WeeklyPlanPanel } from '../components/dashboard/WeeklyPlanPanel';
import { RecommendationsPanel } from '../components/dashboard/RecommendationsPanel';
import { createGoal, toggleGoalActive, updateGoalProgress, saveWeeklyPlan } from '../services/api';
import type { GameSession, TherapeuticGoal, SessionObservation, WeeklyPlan } from '../types';

const PLAYER_ICONS = ['🦊', '🐻', '🐨', '🐯', '🦁', '🐸'];

function colorIndex(id: string): number {
  return Math.abs(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 6;
}

export const CaregiverDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const child = useStore((s) => s.children.find((c) => c.id === id));
  const therapeuticProfile = useStore((s) => s.therapeuticProfiles.find((p) => p.childId === id));

  const [sessions, setSessions] = useState<GameSession[]>(
    () => id ? useStore.getState().sessions.filter((s) => s.childId === id) : []
  );
  const [goals, setGoals] = useState<TherapeuticGoal[]>(
    () => id ? useStore.getState().goals.filter((g) => g.childId === id) : []
  );
  const [observations, setObservations] = useState<SessionObservation[]>(
    () => id ? useStore.getState().observations.filter((o) => o.childId === id) : []
  );
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | undefined>(
    () => id ? useStore.getState().weeklyPlans.find((p) => p.childId === id) : undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchSessionsByChild(id),
      fetchGoalsByChild(id),
      fetchObservationsByChild(id),
      fetchWeeklyPlan(id),
    ]).then(([s, g, o, w]) => {
      setSessions(s);
      setGoals(g);
      setObservations(o);
      setWeeklyPlan(w);
    }).finally(() => setLoading(false));
  }, [id]);

  const recommendations = therapeuticProfile
    ? computeActivityRecommendations(therapeuticProfile, ACTIVITY_CATALOG, goals, sessions)
    : null;

  if (!child) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-state-emoji">❓</span>
          <p>Criança não encontrada.</p>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const ci = colorIndex(child.id);
  const icon = child.avatar ?? PLAYER_ICONS[ci];

  return (
    <div className="page">
      {/* Header do cuidador */}
      <div className="caregiver-header">
        <button className="back-btn" onClick={() => navigate(`/children/${id}`)}>← Voltar ao painel</button>
        <div className={`pib-avatar player-avatar--${ci}`}>{icon}</div>
        <div className="pib-info">
          <div className="pib-name">{child.name}</div>
          <div className="pib-detail">Painel do responsável</div>
        </div>
        <div className="caregiver-header-badge">👨‍👩‍👧 Responsável</div>
      </div>

      {loading ? (
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p>Carregando dados...</p>
        </Card>
      ) : (
        <>
          <CaregiverMetrics sessions={sessions} observations={observations} goals={goals} />

          <TherapeuticGoalsPanel
            childId={child.id}
            goals={goals}
            onAddGoal={async (data) => {
              const goal = await createGoal(data);
              setGoals((prev) => [...prev, goal]);
              return goal;
            }}
            onToggleGoal={async (goalId) => {
              await toggleGoalActive(goalId);
              setGoals((prev) => prev.map((g) => g.id === goalId ? { ...g, active: !g.active } : g));
            }}
            onUpdateProgress={async (goalId, value) => {
              await updateGoalProgress(goalId, value);
              setGoals((prev) => prev.map((g) => g.id === goalId ? { ...g, currentValue: value } : g));
            }}
          />

          <WeeklyPlanPanel
            weeklyPlan={weeklyPlan}
            onSave={async (entries) => {
              await saveWeeklyPlan(child.id, entries);
            }}
          />

          {recommendations && (
            <RecommendationsPanel recommendations={recommendations} childId={child.id} />
          )}

          <ActivityHistory sessions={sessions} limit={15} />

          <RecentObservations observations={observations} limit={8} />

          {child.notes && (
            <Card className="notes-card">
              <p className="notes-text">📌 {child.notes}</p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
