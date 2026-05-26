import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { fetchSessionsByChild, fetchObservationsByChild } from '../services/api';
import { computeAchievements } from '../mocks';
import { Button } from '../components/common/Button';
import { ProgressTrailPanel } from '../components/dashboard/ProgressTrailPanel';
import { AchievementsPanel } from '../components/dashboard/AchievementsPanel';
import type { GameSession, SessionObservation } from '../types';

const PLAYER_ICONS = ['🦊', '🐻', '🐨', '🐯', '🦁', '🐸'];
function colorIndex(id: string): number {
  return Math.abs(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 6;
}

export const ProgressTrailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const child = useStore((s) => s.children.find((c) => c.id === id));

  const [sessions, setSessions] = useState<GameSession[]>(
    () => id ? useStore.getState().sessions.filter((s) => s.childId === id) : []
  );
  const [observations, setObservations] = useState<SessionObservation[]>(
    () => id ? useStore.getState().observations.filter((o) => o.childId === id) : []
  );

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchSessionsByChild(id), fetchObservationsByChild(id)]).then(([s, o]) => {
      setSessions(s);
      setObservations(o);
    });
  }, [id]);

  if (!child) {
    return (
      <div className="page">
        <Button onClick={() => navigate('/')}>Voltar ao início</Button>
      </div>
    );
  }

  const ci = colorIndex(child.id);
  const icon = child.avatar ?? PLAYER_ICONS[ci];
  const achievements = computeAchievements(sessions, observations, useStore.getState().goals.filter((g) => g.childId === id));

  return (
    <div className="page">
      <div className="player-identity-bar">
        <button className="back-btn" onClick={() => navigate(`/children/${id}`)}>← Voltar</button>
        <div className={`pib-avatar player-avatar--${ci}`}>{icon}</div>
        <div className="pib-info">
          <div className="pib-name">{child.name}</div>
          <div className="pib-detail">Jornada e conquistas</div>
        </div>
      </div>

      <ProgressTrailPanel sessions={sessions} />
      <AchievementsPanel achievements={achievements} />
    </div>
  );
};
