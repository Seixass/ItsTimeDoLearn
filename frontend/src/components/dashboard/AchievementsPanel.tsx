import React from 'react';
import type { Achievement } from '../../types';

interface Props {
  achievements: Achievement[];
  newlyUnlocked?: Achievement[];
}

export const AchievementsPanel: React.FC<Props> = ({ achievements, newlyUnlocked = [] }) => {
  const unlocked = achievements.filter((a) => a.unlockedAt);
  const locked = achievements.filter((a) => !a.unlockedAt);
  const newCodes = new Set(newlyUnlocked.map((a) => a.code));

  return (
    <section className="dashboard-section">
      <div className="section-label">
        <div className="section-label-icon section-label-icon--yellow">🏅</div>
        <span className="section-label-text">Conquistas</span>
        <span className="section-label-count">{unlocked.length}/{achievements.length}</span>
      </div>

      {newlyUnlocked.length > 0 && (
        <div className="achievement-new-banner">
          🎉 Nova conquista desbloqueada!{' '}
          {newlyUnlocked.map((a) => `${a.emoji} ${a.name}`).join(', ')}
        </div>
      )}

      <div className="achievements-grid">
        {unlocked.map((a) => (
          <div key={a.code} className={`achievement-card achievement-card--unlocked ${newCodes.has(a.code) ? 'achievement-card--new' : ''}`}>
            <span className="achievement-emoji">{a.emoji}</span>
            <div className="achievement-info">
              <div className="achievement-name">{a.name}</div>
              <div className="achievement-desc">{a.description}</div>
            </div>
          </div>
        ))}
        {locked.map((a) => (
          <div key={a.code} className="achievement-card achievement-card--locked">
            <span className="achievement-emoji achievement-emoji--locked">🔒</span>
            <div className="achievement-info">
              <div className="achievement-name achievement-name--locked">{a.name}</div>
              <div className="achievement-desc">{a.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
