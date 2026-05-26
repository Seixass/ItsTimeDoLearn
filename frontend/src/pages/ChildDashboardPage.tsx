import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { GAME_CATALOG, computeAchievements } from '../mocks';
import {
  fetchSessionsByChild,
  fetchGoalsByChild,
  fetchObservationsByChild,
  fetchWeeklyPlan,
} from '../services/api';
import { Button } from '../components/common/Button';
import { MissionCard } from '../components/dashboard/MissionCard';
import { AchievementsPanel } from '../components/dashboard/AchievementsPanel';
import type {
  GameCode,
  GameSession,
  DifficultyLevel,
  TherapeuticGoal,
  SessionObservation,
  WeeklyPlan,
} from '../types';

const PLAYER_ICONS = ['🦊', '🐻', '🐨', '🐯', '🦁', '🐸'];

function calcAge(birthdate?: string): string {
  if (!birthdate) return '';
  const diff = Date.now() - new Date(birthdate).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return `${years} anos`;
}

function colorIndex(id: string): number {
  return Math.abs(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 6;
}

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
};

const GAME_COLORS = [
  { wrap: '#fef3c7', shadow: 'rgba(245,194,64,0.28)' },
  { wrap: '#dbeafe', shadow: 'rgba(58,123,213,0.28)' },
  { wrap: '#d1fae5', shadow: 'rgba(60,179,113,0.28)' },
];

export const ChildDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const child = useStore((s) => s.children.find((c) => c.id === id));
  const adaptiveProfiles = useStore(
    useShallow((s) => s.adaptiveProfiles.filter((p) => p.childId === id))
  );

  const [sessions, setSessions] = useState<GameSession[]>(
    () => (id ? useStore.getState().sessions.filter((s) => s.childId === id) : [])
  );
  const [goals, setGoals] = useState<TherapeuticGoal[]>(
    () => (id ? useStore.getState().goals.filter((g) => g.childId === id) : [])
  );
  const [observations, setObservations] = useState<SessionObservation[]>(
    () => (id ? useStore.getState().observations.filter((o) => o.childId === id) : [])
  );
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | undefined>(
    () => (id ? useStore.getState().weeklyPlans.find((p) => p.childId === id) : undefined)
  );

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchSessionsByChild(id),
      fetchGoalsByChild(id),
      fetchObservationsByChild(id),
      fetchWeeklyPlan(id),
    ]).then(([s, g, o, w]) => {
      setSessions(s);
      setGoals(g);
      setObservations(o);
      setWeeklyPlan(w);
    });
  }, [id]);

  const achievements = useMemo(
    () => computeAchievements(sessions, observations, goals),
    [sessions, observations, goals]
  );

  if (!child) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-state-emoji">❓</span>
          <p>Criança não encontrada.</p>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const ci = colorIndex(child.id);
  const icon = child.avatar ?? PLAYER_ICONS[ci];
  const totalSessions = sessions.length;
  const successCount = sessions.filter((s) => s.success).length;
  const successRate =
    totalSessions === 0 ? 0 : Math.round((successCount / totalSessions) * 100);

  return (
    <div className="page">
      {/* ── PLAYER IDENTITY BAR ── */}
      <div className="player-identity-bar">
        <div className={`pib-avatar player-avatar--${ci}`}>{icon}</div>
        <div className="pib-info">
          <div className="pib-name">{child.name}</div>
          <div className="pib-detail">
            {child.birthdate ? calcAge(child.birthdate) : 'Jogador'}
            {totalSessions > 0 && ` · ${totalSessions} sessões`}
          </div>
        </div>
      </div>

      {/* ── MISSÃO DE HOJE ── */}
      <MissionCard childId={child.id} weeklyPlan={weeklyPlan} />

      {/* ── PROGRESSO ── */}
      {totalSessions > 0 && (
        <div className="xp-bar-wrap" style={{ marginBottom: 36 }}>
          <div className="xp-bar-header">
            <span className="xp-bar-label">Progresso geral</span>
            <span className="xp-bar-value">{successRate}% de sucesso</span>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${successRate}%` }} />
          </div>
          <div className="xp-stats">
            <div className="xp-stat">
              <span className="xp-stat-value">{totalSessions}</span>
              <span className="xp-stat-label">Sessões</span>
            </div>
            <div className="xp-stat">
              <span className="xp-stat-value">{successCount}</span>
              <span className="xp-stat-label">Vitórias</span>
            </div>
            <div className="xp-stat">
              <span className="xp-stat-value">
                {Math.round(sessions.reduce((a, s) => a + s.durationSeconds, 0) / 60)}min
              </span>
              <span className="xp-stat-label">Tempo total</span>
            </div>
          </div>
        </div>
      )}

      {/* ── MINI-JOGOS ── */}
      <section className="dashboard-section">
        <div className="section-label">
          <div className="section-label-icon section-label-icon--yellow">🎮</div>
          <span className="section-label-text">Missões disponíveis</span>
          <span className="section-label-count">{GAME_CATALOG.length} jogos</span>
        </div>
        <div className="games-hub">
          {GAME_CATALOG.map((game, idx) => {
            const profile = adaptiveProfiles.find((p) => p.gameCode === game.code);
            const level = profile?.currentLevel;
            const gc = GAME_COLORS[idx % GAME_COLORS.length];
            return (
              <div
                key={game.code}
                className="game-mission-card"
                onClick={() => navigate(`/children/${id}/play/${game.code}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' && navigate(`/children/${id}/play/${game.code}`)
                }
                aria-label={`Jogar ${game.name}`}
              >
                <div className="game-mission-header">
                  <div
                    className="game-mission-emoji-wrap"
                    style={{ background: gc.wrap, boxShadow: `0 4px 12px ${gc.shadow}` }}
                  >
                    {game.emoji}
                  </div>
                  <div className="game-mission-name">{game.name}</div>
                  <div className="game-mission-desc">{game.description}</div>
                </div>
                <div className="game-mission-footer">
                  {level ? (
                    <span className={`difficulty-badge difficulty-badge--${level}`}>
                      {DIFFICULTY_LABELS[level]}
                    </span>
                  ) : (
                    <span
                      className="difficulty-badge"
                      style={{ background: 'var(--border)', color: 'var(--text-muted)' }}
                    >
                      Novo
                    </span>
                  )}
                  <Button
                    variant="game"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/children/${id}/play/${game.code}`);
                    }}
                  >
                    ▶ Jogar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CONQUISTAS ── */}
      <AchievementsPanel achievements={achievements} />
    </div>
  );
};
