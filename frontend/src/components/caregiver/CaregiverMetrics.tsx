import React from 'react';
import type { GameSession, SessionObservation, TherapeuticGoal } from '../../types';

interface Props {
  sessions: GameSession[];
  observations: SessionObservation[];
  goals: TherapeuticGoal[];
}

export const CaregiverMetrics: React.FC<Props> = ({ sessions, observations, goals }) => {
  const totalSessions = sessions.length;
  const successCount = sessions.filter((s) => s.success).length;
  const successRate = totalSessions === 0 ? 0 : Math.round((successCount / totalSessions) * 100);
  const totalMinutes = Math.round(sessions.reduce((a, s) => a + s.durationSeconds, 0) / 60);
  const activeGoals = goals.filter((g) => g.active).length;
  const completedGoals = goals.filter((g) => !g.active && g.currentValue >= g.targetValue).length;

  const avgFocus = observations.length === 0
    ? 0
    : Math.round((observations.reduce((a, o) => a + o.focusLevel, 0) / observations.length) * 10) / 10;
  const avgEngagement = observations.length === 0
    ? 0
    : Math.round((observations.reduce((a, o) => a + o.engagementLevel, 0) / observations.length) * 10) / 10;

  const last7days = Date.now() - 7 * 86400000;
  const recentSessions = sessions.filter((s) => new Date(s.startedAt).getTime() > last7days);
  const activeDays = new Set(recentSessions.map((s) => new Date(s.startedAt).toDateString())).size;

  const metrics = [
    { label: 'Total de sessões', value: totalSessions, emoji: '🎮', color: '#dbeafe' },
    { label: 'Taxa de sucesso', value: `${successRate}%`, emoji: '✅', color: '#d1fae5' },
    { label: 'Tempo jogado', value: `${totalMinutes} min`, emoji: '⏱️', color: '#fef3c7' },
    { label: 'Dias ativos (7d)', value: activeDays, emoji: '📅', color: '#ede9fe' },
    { label: 'Foco médio', value: avgFocus > 0 ? `${avgFocus}/5` : '—', emoji: '🎯', color: '#fce7f3' },
    { label: 'Engajamento médio', value: avgEngagement > 0 ? `${avgEngagement}/5` : '—', emoji: '💡', color: '#ffedd5' },
    { label: 'Metas ativas', value: activeGoals, emoji: '🎖️', color: '#f0fdf4' },
    { label: 'Metas concluídas', value: completedGoals, emoji: '🏆', color: '#fefce8' },
  ];

  return (
    <section className="dashboard-section">
      <div className="section-label">
        <div className="section-label-icon section-label-icon--blue">📊</div>
        <span className="section-label-text">Visão geral</span>
      </div>
      <div className="caregiver-metrics-grid">
        {metrics.map((m) => (
          <div key={m.label} className="caregiver-metric-card" style={{ background: m.color }}>
            <span className="caregiver-metric-emoji">{m.emoji}</span>
            <span className="caregiver-metric-value">{m.value}</span>
            <span className="caregiver-metric-label">{m.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
