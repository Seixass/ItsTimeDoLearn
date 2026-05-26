import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { CaregiverCtx } from '../../layouts/CaregiverLayout';
import { WeeklyPlanPanel } from '../../components/dashboard/WeeklyPlanPanel';
import { saveWeeklyPlan } from '../../services/api';

export const WeeklyPlanPage: React.FC = () => {
  const { child, weeklyPlan } = useOutletContext<CaregiverCtx>();

  return (
    <div className="cg-page">
      <div className="cg-page-header">
        <h1 className="cg-page-title">📅 Plano Semanal</h1>
        <p className="cg-page-subtitle">Configure a rotina de sessões de {child.name}</p>
      </div>
      <WeeklyPlanPanel
        weeklyPlan={weeklyPlan}
        onSave={async (entries) => {
          await saveWeeklyPlan(child.id, entries);
        }}
      />
    </div>
  );
};
