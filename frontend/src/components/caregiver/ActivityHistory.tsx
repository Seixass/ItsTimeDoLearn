import React from 'react';
import { Card } from '../common/Card';
import { GAME_CATALOG } from '../../mocks';
import type { GameSession } from '../../types';

interface Props {
  sessions: GameSession[];
  limit?: number;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}min${seconds % 60 > 0 ? ` ${seconds % 60}s` : ''}`;
}

export const ActivityHistory: React.FC<Props> = ({ sessions, limit = 10 }) => {
  const sorted = [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, limit);

  if (sorted.length === 0) {
    return (
      <section className="dashboard-section">
        <div className="section-label">
          <div className="section-label-icon section-label-icon--mint">📋</div>
          <span className="section-label-text">Histórico de atividades</span>
        </div>
        <Card><p className="empty-stats">Nenhuma sessão registrada ainda.</p></Card>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="section-label">
        <div className="section-label-icon section-label-icon--mint">📋</div>
        <span className="section-label-text">Histórico de atividades</span>
        <span className="section-label-count">últimas {sorted.length}</span>
      </div>
      <div className="activity-history-list">
        {sorted.map((session) => {
          const game = GAME_CATALOG.find((g) => g.code === session.gameCode);
          return (
            <div key={session.id} className={`history-item ${session.success ? 'history-item--success' : 'history-item--fail'}`}>
              <span className="history-emoji">{game?.emoji ?? '🎮'}</span>
              <div className="history-info">
                <div className="history-game">{game?.name ?? session.gameCode}</div>
                <div className="history-meta">
                  {formatDate(session.startedAt)} · {formatDuration(session.durationSeconds)}
                </div>
              </div>
              <span className={`history-result ${session.success ? 'stat-good' : 'stat-warn'}`}>
                {session.success ? '✅ Sucesso' : '🔄 Tentativa'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
