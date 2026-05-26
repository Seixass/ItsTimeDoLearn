import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { CaregiverCtx } from '../../layouts/CaregiverLayout';
import { TherapeuticGoalsPanel } from '../../components/dashboard/TherapeuticGoalsPanel';
import { createGoal, toggleGoalActive, updateGoalProgress } from '../../services/api';

export const GoalsPage: React.FC = () => {
  const { child, goals, setGoals } = useOutletContext<CaregiverCtx>();

  return (
    <div className="cg-page">
      <div className="cg-page-header">
        <h1 className="cg-page-title">🎯 Metas terapêuticas</h1>
        <p className="cg-page-subtitle">
          Defina e acompanhe as metas de <strong>{child.name}</strong>
        </p>
      </div>
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
          setGoals((prev) =>
            prev.map((g) => (g.id === goalId ? { ...g, active: !g.active } : g))
          );
        }}
        onUpdateProgress={async (goalId, value) => {
          await updateGoalProgress(goalId, value);
          setGoals((prev) =>
            prev.map((g) => (g.id === goalId ? { ...g, currentValue: value } : g))
          );
        }}
      />
    </div>
  );
};
