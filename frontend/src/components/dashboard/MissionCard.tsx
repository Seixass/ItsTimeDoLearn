import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { WeeklyPlan, WeekDay } from '../../types';
import { GAME_CATALOG } from '../../mocks';

const DAY_MAP: Record<number, WeekDay> = {
  0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
  4: 'thursday', 5: 'friday', 6: 'saturday',
};

interface Props {
  childId: string;
  weeklyPlan?: WeeklyPlan;
}

export const MissionCard: React.FC<Props> = ({ childId, weeklyPlan }) => {
  const navigate = useNavigate();
  const today: WeekDay = DAY_MAP[new Date().getDay()];
  const todayEntry = weeklyPlan?.entries.find((e) => e.day === today);
  const todayGame = todayEntry ? GAME_CATALOG.find((g) => g.code === todayEntry.gameCode) : null;

  if (!todayGame) return null;

  return (
    <div className="mission-card">
      <div className="mission-card-label">
        <span className="mission-card-label-pill">⭐ Missão de hoje</span>
      </div>
      <div className="mission-card-body">
        <span className="mission-card-emoji">{todayGame.emoji}</span>
        <div className="mission-card-info">
          <h3 className="mission-card-name">{todayGame.name}</h3>
          <p className="mission-card-desc">{todayGame.description}</p>
        </div>
      </div>
      <button
        className="mission-card-btn"
        onClick={() => navigate(`/children/${childId}/play/${todayGame.code}`)}
      >
        ▶ Começar missão
      </button>
    </div>
  );
};
