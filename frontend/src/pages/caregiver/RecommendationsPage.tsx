import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { CaregiverCtx } from '../../layouts/CaregiverLayout';
import { RecommendationsPanel } from '../../components/dashboard/RecommendationsPanel';
import { ACTIVITY_CATALOG } from '../../mocks';
import { computeActivityRecommendations } from '../../utils/activityRecommender';
import { Card } from '../../components/common/Card';

export const RecommendationsPage: React.FC = () => {
  const { child, therapeuticProfile, goals, sessions } = useOutletContext<CaregiverCtx>();

  const recommendations = useMemo(() => {
    if (!therapeuticProfile) return null;
    return computeActivityRecommendations(therapeuticProfile, ACTIVITY_CATALOG, goals, sessions);
  }, [therapeuticProfile, goals, sessions]);

  return (
    <div className="cg-page">
      <div className="cg-page-header">
        <h1 className="cg-page-title">💡 Recomendações</h1>
        <p className="cg-page-subtitle">
          Atividades sugeridas com base no perfil de <strong>{child.name}</strong>
        </p>
      </div>
      {!therapeuticProfile ? (
        <Card>
          <p className="empty-stats">
            Configure o perfil terapêutico para ver recomendações personalizadas.
          </p>
        </Card>
      ) : recommendations ? (
        <RecommendationsPanel recommendations={recommendations} childId={child.id} />
      ) : (
        <Card>
          <p className="empty-stats">Nenhuma recomendação disponível no momento.</p>
        </Card>
      )}
    </div>
  );
};
