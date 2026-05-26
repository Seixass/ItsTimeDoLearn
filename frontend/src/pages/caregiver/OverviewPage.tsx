import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { CaregiverCtx } from '../../layouts/CaregiverLayout';
import { CaregiverMetrics } from '../../components/caregiver/CaregiverMetrics';
import { ActivityHistory } from '../../components/caregiver/ActivityHistory';
import { Card } from '../../components/common/Card';

export const OverviewPage: React.FC = () => {
  const { child, sessions, goals, observations, loading } = useOutletContext<CaregiverCtx>();

  if (loading) {
    return (
      <div className="cg-page">
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p>Carregando dados...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="cg-page">
      <div className="cg-page-header">
        <h1 className="cg-page-title">📊 Painel do responsável</h1>
        <p className="cg-page-subtitle">
          Acompanhe o progresso e o desenvolvimento de{' '}
          <strong>{child.name}</strong>
        </p>
      </div>

      <CaregiverMetrics sessions={sessions} observations={observations} goals={goals} />

      {child.notes && (
        <Card className="notes-card" style={{ marginBottom: 32 }}>
          <p className="notes-text">📌 {child.notes}</p>
        </Card>
      )}

      <ActivityHistory sessions={sessions} limit={8} />
    </div>
  );
};
