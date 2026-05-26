import React from 'react';
import { TRAIL_PHASES } from '../../mocks';
import type { GameSession } from '../../types';

interface Props {
  sessions: GameSession[];
}

export const ProgressTrailPanel: React.FC<Props> = ({ sessions }) => {
  const total = sessions.length;
  const currentPhaseIdx = TRAIL_PHASES.reduce((acc, phase, i) => {
    return total >= phase.requiredSessions ? i : acc;
  }, 0);
  const currentPhase = TRAIL_PHASES[currentPhaseIdx];
  const nextPhase = TRAIL_PHASES[currentPhaseIdx + 1];
  const progressToNext = nextPhase
    ? Math.min(100, Math.round(((total - currentPhase.requiredSessions) / (nextPhase.requiredSessions - currentPhase.requiredSessions)) * 100))
    : 100;

  return (
    <section className="dashboard-section">
      <div className="section-label">
        <div className="section-label-icon section-label-icon--purple">🗺️</div>
        <span className="section-label-text">Jornada do Explorador</span>
      </div>
      <div className="trail-panel">
        <div className="trail-phases">
          {TRAIL_PHASES.map((phase, i) => {
            const unlocked = total >= phase.requiredSessions;
            const isCurrent = i === currentPhaseIdx;
            return (
              <div key={phase.id} className={`trail-phase ${unlocked ? 'trail-phase--unlocked' : ''} ${isCurrent ? 'trail-phase--current' : ''}`}>
                <div className="trail-phase-bubble" style={{ background: unlocked ? phase.color : 'var(--border)' }}>
                  <span className="trail-phase-emoji">{phase.emoji}</span>
                  {isCurrent && <div className="trail-phase-pulse" />}
                </div>
                <span className="trail-phase-name">{phase.name}</span>
                {!unlocked && (
                  <span className="trail-phase-req">{phase.requiredSessions} sessões</span>
                )}
                {i < TRAIL_PHASES.length - 1 && (
                  <div className={`trail-connector ${unlocked && total >= TRAIL_PHASES[i + 1].requiredSessions ? 'trail-connector--done' : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="trail-status">
          <div className="trail-current-badge" style={{ borderColor: currentPhase.color }}>
            <span className="trail-current-emoji">{currentPhase.emoji}</span>
            <div>
              <div className="trail-current-label">Fase atual</div>
              <div className="trail-current-name">{currentPhase.name}</div>
            </div>
          </div>
          {nextPhase ? (
            <div className="trail-next-info">
              <div className="trail-next-label">Próxima fase: {nextPhase.name} {nextPhase.emoji}</div>
              <div className="xp-bar-track" style={{ marginTop: 6 }}>
                <div className="xp-bar-fill" style={{ width: `${progressToNext}%`, background: nextPhase.color }} />
              </div>
              <div className="trail-next-sessions">
                {total} / {nextPhase.requiredSessions} sessões
              </div>
            </div>
          ) : (
            <div className="trail-max-reached">🏆 Fase máxima alcançada!</div>
          )}
        </div>
      </div>
    </section>
  );
};
