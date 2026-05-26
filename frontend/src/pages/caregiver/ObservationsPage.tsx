import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { CaregiverCtx } from '../../layouts/CaregiverLayout';
import { RecentObservations } from '../../components/caregiver/RecentObservations';
import { Card } from '../../components/common/Card';

export const ObservationsPage: React.FC = () => {
  const { observations, loading } = useOutletContext<CaregiverCtx>();

  return (
    <div className="cg-page">
      <div className="cg-page-header">
        <h1 className="cg-page-title">📋 Observações</h1>
        <p className="cg-page-subtitle">Registros de comportamento durante as sessões</p>
      </div>
      {loading ? (
        <Card style={{ textAlign: 'center', padding: '32px' }}><p>Carregando...</p></Card>
      ) : (
        <RecentObservations observations={observations} limit={50} />
      )}
    </div>
  );
};
