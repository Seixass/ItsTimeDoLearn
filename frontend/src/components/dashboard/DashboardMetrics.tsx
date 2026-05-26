import React from 'react';
import type { GameSession, SessionObservation } from '../../types';
import { GAME_CATALOG } from '../../mocks';
import { Card } from '../common/Card';

interface Props {
  sessions: GameSession[];
  observations: SessionObservation[];
}

function daysBefore(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export const DashboardMetrics: React.FC<Props> = ({ sessions, observations }) => {
  const last7 = daysBefore(7);
  const last30 = daysBefore(30);

  const recentSessions = sessions.filter((s) => new Date(s.startedAt) >= last7);
  const monthlySessions = sessions.filter((s) => new Date(s.startedAt) >= last30);

  const totalMinutes = Math.round(
    sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
  );

  const successRate =
    sessions.length === 0
      ? 0
      : Math.round((sessions.filter((s) => s.success).length / sessions.length) * 100);

  const activeDays = new Set(monthlySessions.map((s) => s.startedAt.slice(0, 10))).size;

  const avgEngagement =
    observations.length === 0
      ? null
      : (
          observations.reduce((acc, o) => acc + o.engagementLevel, 0) /
          observations.length
        ).toFixed(1);

  const avgFocus =
    observations.length === 0
      ? null
      : (
          observations.reduce((acc, o) => acc + o.focusLevel, 0) /
          observations.length
        ).toFixed(1);

  const mostUsed = GAME_CATALOG.map((game) => ({
    game,
    count: sessions.filter((s) => s.gameCode === game.code).length,
  })).sort((a, b) => b.count - a.count)[0];

  if (sessions.length === 0) {
    return (
      <div className="dashboard-section">
        <h2 className="section-title">Indicadores</h2>
        <Card>
          <p className="empty-stats">Nenhuma sessão registrada ainda. Comece a jogar!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <h2 className="section-title">Indicadores</h2>
      <div className="metrics-grid">
        <Card className="metric-card">
          <span className="metric-value">{recentSessions.length}</span>
          <span className="metric-label">Sessões (7 dias)</span>
        </Card>
        <Card className="metric-card">
          <span className="metric-value">{totalMinutes}min</span>
          <span className="metric-label">Tempo total jogado</span>
        </Card>
        <Card className="metric-card">
          <span
            className={`metric-value ${successRate >= 70 ? 'stat-good' : 'stat-warn'}`}
          >
            {successRate}%
          </span>
          <span className="metric-label">Taxa de sucesso</span>
        </Card>
        <Card className="metric-card">
          <span className="metric-value">{activeDays}</span>
          <span className="metric-label">Dias ativos (30d)</span>
        </Card>
        {avgEngagement && (
          <Card className="metric-card">
            <span className="metric-value">{avgEngagement}/5</span>
            <span className="metric-label">Engajamento médio</span>
          </Card>
        )}
        {avgFocus && (
          <Card className="metric-card">
            <span className="metric-value">{avgFocus}/5</span>
            <span className="metric-label">Foco médio</span>
          </Card>
        )}
      </div>
      {mostUsed && mostUsed.count > 0 && (
        <p className="metric-most-used">
          Jogo mais usado: {mostUsed.game.emoji}{' '}
          <strong>{mostUsed.game.name}</strong> ({mostUsed.count}{' '}
          {mostUsed.count === 1 ? 'sessão' : 'sessões'})
        </p>
      )}
    </div>
  );
};
