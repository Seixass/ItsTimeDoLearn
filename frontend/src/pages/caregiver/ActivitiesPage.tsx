import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import type { CaregiverCtx } from '../../layouts/CaregiverLayout';
import { ACTIVITY_CATALOG } from '../../mocks';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

const CATEGORY_LABELS: Record<string, string> = {
  executive_functions: 'Funções Executivas',
  sensory_regulation: 'Regulação Sensorial',
  social_emotional: 'Social e Emocional',
  attention_focus: 'Atenção e Foco',
  language_communication: 'Linguagem e Comunicação',
  routine_organization: 'Organização de Rotina',
  motor_skills: 'Habilidades Motoras',
};

export const ActivitiesPage: React.FC = () => {
  const { child } = useOutletContext<CaregiverCtx>();
  const navigate = useNavigate();

  return (
    <div className="cg-page">
      <div className="cg-page-header">
        <h1 className="cg-page-title">🧩 Atividades Guiadas</h1>
        <p className="cg-page-subtitle">
          Atividades terapêuticas para realizar com <strong>{child.name}</strong>
        </p>
      </div>
      <div className="activities-grid">
        {ACTIVITY_CATALOG.map((activity) => (
          <Card key={activity.code} className="activity-catalog-card">
            <div className="activity-catalog-header">
              <span className="activity-catalog-emoji">{activity.emoji}</span>
              <div>
                <div className="activity-catalog-name">{activity.name}</div>
                <div className="activity-catalog-category">
                  {CATEGORY_LABELS[activity.category] ?? activity.category}
                </div>
              </div>
            </div>
            <p className="activity-catalog-desc">{activity.description}</p>
            <div className="activity-catalog-meta">
              <span>⏱️ {activity.suggestedDurationMinutes} min</span>
              {activity.requiresMediation && <span>🤝 Requer mediação</span>}
            </div>
            <Button
              variant="primary"
              size="sm"
              style={{ marginTop: 14, width: '100%' }}
              onClick={() => navigate(`/children/${child.id}/activity/${activity.code}`)}
            >
              ▶ Iniciar atividade
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
