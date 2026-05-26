import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { CaregiverCtx } from '../../layouts/CaregiverLayout';
import { ActivityHistory } from '../../components/caregiver/ActivityHistory';
import { Card } from '../../components/common/Card';

export const HistoryPage: React.FC = () => {
  const { sessions, loading } = useOutletContext<CaregiverCtx>();

  return (
    <div className="cg-page">
      <div className="cg-page-header">
        <h1 className="cg-page-title">📜 Histórico</h1>
        <p className="cg-page-subtitle">Todas as sessões realizadas</p>
      </div>
      {loading ? (
        <Card style={{ textAlign: 'center', padding: '32px' }}><p>Carregando...</p></Card>
      ) : (
        <ActivityHistory sessions={sessions} limit={100} />
      )}
    </div>
  );
};
