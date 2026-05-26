import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  ActivityCategory,
  ActivityStatus,
  GameCode,
} from '../../types';
import type { RecommendationResult, AnnotatedActivity } from '../../utils/activityRecommender';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  executive_functions: 'Funções Executivas',
  sensory_regulation: 'Regulação Sensorial',
  social_emotional: 'Socioemocional',
  attention_focus: 'Atenção e Foco',
  language_communication: 'Linguagem',
  routine_organization: 'Organização de Rotina',
  motor_skills: 'Habilidades Motoras',
};

const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  executive_functions: 'badge--purple',
  sensory_regulation: 'badge--green',
  social_emotional: 'badge--orange',
  attention_focus: 'badge--blue',
  language_communication: 'badge--teal',
  routine_organization: 'badge--indigo',
  motor_skills: 'badge--pink',
};

const STATUS_LABELS: Record<ActivityStatus, string> = {
  interactive_game: 'Jogo interativo',
  guided_activity: 'Atividade guiada',
  offline_assisted: 'Atividade offline',
};

const GAME_CODES = new Set<string>(['sequence_routine', 'find_object', 'memory_cards']);

function isGameCode(code: string): code is GameCode {
  return GAME_CODES.has(code);
}

interface ActivityCardProps {
  item: AnnotatedActivity;
  childId: string;
  showCaution?: boolean;
}

function ActivityCard({ item, childId, showCaution = false }: ActivityCardProps) {
  const navigate = useNavigate();
  const { activity, reason, cautionNote } = item;

  return (
    <Card className={`rec-card ${showCaution ? 'rec-card--caution' : ''}`}>
      <div className="rec-card-header">
        <span className="rec-card-emoji">{activity.emoji}</span>
        <div className="rec-card-meta">
          <h4 className="rec-card-name">{activity.name}</h4>
          <div className="rec-card-badges">
            <span className={`activity-badge ${CATEGORY_COLORS[activity.category]}`}>
              {CATEGORY_LABELS[activity.category]}
            </span>
            {activity.status !== 'interactive_game' && (
              <span className="activity-badge badge--neutral">
                {STATUS_LABELS[activity.status]}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="rec-card-reason">{reason}</p>

      {showCaution && cautionNote && (
        <p className="rec-card-caution-note">⚠ {cautionNote}</p>
      )}

      <div className="rec-card-footer">
        <span className="rec-card-duration">
          ⏱ {activity.suggestedDurationMinutes}min
          {activity.requiresMediation && ' · com mediador'}
        </span>
        {activity.status === 'interactive_game' && isGameCode(activity.code) && (
          <Button
            size="sm"
            variant="game"
            onClick={() => navigate(`/children/${childId}/play/${activity.code}`)}
          >
            ▶ Jogar
          </Button>
        )}
        {(activity.status === 'guided_activity' || activity.status === 'offline_assisted') && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/children/${childId}/activity/${activity.code}`)}
          >
            Ver atividade
          </Button>
        )}
      </div>
    </Card>
  );
}

interface Props {
  recommendations: RecommendationResult;
  childId: string;
}

export const RecommendationsPanel: React.FC<Props> = ({
  recommendations,
  childId,
}) => {
  const [showCaution, setShowCaution] = useState(false);

  const { recommended, withCaution } = recommendations;

  if (recommended.length === 0 && withCaution.length === 0) {
    return (
      <div className="dashboard-section">
        <h2 className="section-title">Atividades recomendadas</h2>
        <Card>
          <p className="empty-stats">
            Configure o perfil terapêutico para ver recomendações personalizadas.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Atividades recomendadas</h2>
        {withCaution.length > 0 && (
          <button
            className="rec-caution-toggle"
            onClick={() => setShowCaution((v) => !v)}
          >
            {showCaution
              ? 'Ocultar atividades com cautela'
              : `${withCaution.length} com cautela`}
          </button>
        )}
      </div>

      <div className="rec-grid">
        {recommended.map((item) => (
          <ActivityCard
            key={item.activity.id}
            item={item}
            childId={childId}
          />
        ))}
      </div>

      {showCaution && withCaution.length > 0 && (
        <>
          <p className="rec-caution-label">
            Com adaptações recomendadas
          </p>
          <div className="rec-grid">
            {withCaution.map((item) => (
              <ActivityCard
                key={item.activity.id}
                item={item}
                childId={childId}
                showCaution
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
