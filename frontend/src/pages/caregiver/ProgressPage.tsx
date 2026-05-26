import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { CaregiverCtx } from '../../layouts/CaregiverLayout';
import { DashboardMetrics } from '../../components/dashboard/DashboardMetrics';
import { ProgressTrailPanel } from '../../components/dashboard/ProgressTrailPanel';
import { Card } from '../../components/common/Card';
import { GAME_CATALOG } from '../../mocks';
import type { GameSession, GameCode } from '../../types';

function computeStats(sessions: GameSession[], gameCode: GameCode) {
  const filtered = sessions.filter((s) => s.gameCode === gameCode);
  if (filtered.length === 0) return null;
  const successes = filtered.filter((s) => s.success).length;
  return {
    total: filtered.length,
    successRate: Math.round((successes / filtered.length) * 100),
    avgDuration: Math.round(
      filtered.reduce((a, s) => a + s.durationSeconds, 0) / filtered.length
    ),
  };
}

export const ProgressPage: React.FC = () => {
  const { sessions, observations, loading } = useOutletContext<CaregiverCtx>();

  if (loading) {
    return (
      <div className="cg-page">
        <Card style={{ textAlign: 'center', padding: '32px' }}><p>Carregando...</p></Card>
      </div>
    );
  }

  return (
    <div className="cg-page">
      <div className="cg-page-header">
        <h1 className="cg-page-title">📈 Progresso</h1>
        <p className="cg-page-subtitle">Análise detalhada da evolução e desempenho</p>
      </div>

      <ProgressTrailPanel sessions={sessions} />
      <DashboardMetrics sessions={sessions} observations={observations} />

      <section className="dashboard-section">
        <div className="section-label">
          <div className="section-label-icon section-label-icon--mint">📊</div>
          <span className="section-label-text">Estatísticas por jogo</span>
        </div>
        {sessions.length === 0 ? (
          <Card>
            <p className="empty-stats">Nenhuma sessão registrada ainda.</p>
          </Card>
        ) : (
          <div className="stats-grid">
            {GAME_CATALOG.map((game) => {
              const stats = computeStats(sessions, game.code as GameCode);
              if (!stats) return null;
              return (
                <Card key={game.code} className="stat-card">
                  <div className="stat-card-header">
                    <span>{game.emoji}</span>
                    <h4 className="stat-game-name">{game.name}</h4>
                  </div>
                  <div className="stat-rows">
                    <div className="stat-row">
                      <span className="stat-label">Sessões</span>
                      <span className="stat-value">{stats.total}</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Taxa de sucesso</span>
                      <span className={`stat-value ${stats.successRate >= 70 ? 'stat-good' : 'stat-warn'}`}>
                        {stats.successRate}%
                      </span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Tempo médio</span>
                      <span className="stat-value">{stats.avgDuration}s</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
