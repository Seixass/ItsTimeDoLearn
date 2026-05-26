import React from 'react';
import { Card } from '../common/Card';
import { GAME_CATALOG } from '../../mocks';
import type { SessionObservation } from '../../types';

interface Props {
  observations: SessionObservation[];
  limit?: number;
}

const LEVEL_EMOJI: Record<number, string> = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export const RecentObservations: React.FC<Props> = ({ observations, limit = 5 }) => {
  const sorted = [...observations].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)).slice(0, limit);

  if (sorted.length === 0) {
    return (
      <section className="dashboard-section">
        <div className="section-label">
          <div className="section-label-icon section-label-icon--pink">📝</div>
          <span className="section-label-text">Observações recentes</span>
        </div>
        <Card><p className="empty-stats">Nenhuma observação registrada ainda.</p></Card>
      </section>
    );
  }

  return (
    <section className="dashboard-section">
      <div className="section-label">
        <div className="section-label-icon section-label-icon--pink">📝</div>
        <span className="section-label-text">Observações recentes</span>
        <span className="section-label-count">últimas {sorted.length}</span>
      </div>
      <div className="observations-list">
        {sorted.map((obs) => {
          const game = GAME_CATALOG.find((g) => g.code === obs.gameCode);
          return (
            <Card key={obs.id} className="observation-card">
              <div className="observation-header">
                <span>{game?.emoji ?? '🎮'} {game?.name ?? obs.gameCode}</span>
                <span className="observation-date">{formatDate(obs.recordedAt)}</span>
              </div>
              <div className="observation-levels">
                <div className="obs-level-item">
                  <span className="obs-level-label">Foco</span>
                  <span className="obs-level-emoji">{LEVEL_EMOJI[obs.focusLevel]}</span>
                </div>
                <div className="obs-level-item">
                  <span className="obs-level-label">Engajamento</span>
                  <span className="obs-level-emoji">{LEVEL_EMOJI[obs.engagementLevel]}</span>
                </div>
                <div className="obs-level-item">
                  <span className="obs-level-label">Frustração</span>
                  <span className="obs-level-emoji">{LEVEL_EMOJI[obs.frustrationLevel]}</span>
                </div>
                {obs.neededHelp && (
                  <div className="obs-level-item">
                    <span className="obs-level-label">Ajuda</span>
                    <span className="obs-level-emoji">🤝</span>
                  </div>
                )}
              </div>
              {obs.notes && <p className="observation-notes">"{obs.notes}"</p>}
            </Card>
          );
        })}
      </div>
    </section>
  );
};
