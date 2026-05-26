import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  saveGameSession,
  saveSessionObservation,
  computeAndUpdateAdaptiveDifficulty,
} from '../services/api';
import { GAME_CATALOG, computeAchievements } from '../mocks';
import { SequenceRoutineGame } from '../components/games/SequenceRoutineGame';
import { FindObjectGame } from '../components/games/FindObjectGame';
import { MemoryCardsGame } from '../components/games/MemoryCardsGame';
import { SessionObservationForm } from '../components/session/SessionObservationForm';
import { Button } from '../components/common/Button';
import { PageHeader } from '../components/common/PageHeader';
import type { GameCode, GameResult, ObservationFormData, DifficultyLevel, Achievement } from '../types';

type PageState = 'playing' | 'observing' | 'complete';

interface CompletedSession {
  sessionId: string;
  durationSeconds: number;
  success: boolean;
  newLevel?: DifficultyLevel;
  observation?: ObservationFormData;
  newAchievements: Achievement[];
}

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };

const LEVEL_EMOJI: Record<ObservationFormData['focusLevel'], string> = {
  1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😄',
};

export const PlayGamePage: React.FC = () => {
  const { id, gameCode } = useParams<{ id: string; gameCode: string }>();
  const navigate = useNavigate();
  const child = useStore((s) => s.children.find((c) => c.id === id));
  const adaptiveProfile = useStore((s) =>
    s.adaptiveProfiles.find((p) => p.childId === id && p.gameCode === gameCode)
  );

  const startedAt = useRef<string>(new Date().toISOString());
  const [pageState, setPageState] = useState<PageState>('playing');
  const [completed, setCompleted] = useState<CompletedSession | null>(null);

  const game = GAME_CATALOG.find((g) => g.code === gameCode);
  const rawLevel = adaptiveProfile?.currentLevel;
  const difficulty: DifficultyLevel =
    rawLevel === 'easy' || rawLevel === 'medium' || rawLevel === 'hard' ? rawLevel : 'medium';

  if (!child || !game) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-state-emoji">❓</span>
          <p>Jogo ou criança não encontrados.</p>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const handleFinish = async (result: GameResult) => {
    const endedAt = new Date().toISOString();
    const durationSeconds = Math.round(
      (new Date(endedAt).getTime() - new Date(startedAt.current).getTime()) / 1000
    );
    const prevSessions = useStore.getState().getSessionsByChildId(child.id);
    const prevGoals = useStore.getState().getGoalsByChildId(child.id);
    const prevAchievements = computeAchievements(prevSessions, useStore.getState().getObservationsByChildId(child.id), prevGoals);
    const sessionId = await saveGameSession(child.id, game.code as GameCode, startedAt.current, result);
    await computeAndUpdateAdaptiveDifficulty(child.id, game.code as GameCode);
    const newLevel = useStore.getState().adaptiveProfiles.find(
      (p) => p.childId === id && p.gameCode === gameCode
    )?.currentLevel;
    const nextSessions = useStore.getState().getSessionsByChildId(child.id);
    const nextGoals = useStore.getState().getGoalsByChildId(child.id);
    const nextAchievements = computeAchievements(nextSessions, useStore.getState().getObservationsByChildId(child.id), nextGoals);
    const prevUnlocked = new Set(prevAchievements.filter((a) => a.unlockedAt).map((a) => a.code));
    const newAchievements = nextAchievements.filter((a) => a.unlockedAt && !prevUnlocked.has(a.code));
    setCompleted({ sessionId, durationSeconds, success: result.success, newLevel, newAchievements });
    setPageState('observing');
  };

  const handleObservationSubmit = (data: ObservationFormData) => {
    if (completed) {
      saveSessionObservation(completed.sessionId, child.id, game.code as GameCode, data);
      setCompleted((prev) => prev && { ...prev, observation: data });
    }
    setPageState('complete');
  };

  const handleObservationSkip = () => setPageState('complete');

  const handleReplay = () => {
    startedAt.current = new Date().toISOString();
    setCompleted(null);
    setPageState('playing');
  };

  if (pageState === 'observing') {
    return (
      <div className="page">
        <PageHeader title="Registrar observação" subtitle="Opcional — você pode pular" backTo={`/children/${id}`} />
        <SessionObservationForm
          childName={child.name}
          gameName={game.name}
          gameEmoji={game.emoji}
          onSubmit={handleObservationSubmit}
          onSkip={handleObservationSkip}
        />
      </div>
    );
  }

  if (pageState === 'complete' && completed) {
    return (
      <div className="page page--game">
        <div className={`result-screen ${completed.success ? 'result-screen--success' : ''}`}>
          <span className="result-emoji">{completed.success ? '🏆' : '💪'}</span>
          <h1 className="result-title">
            {completed.success ? 'Incrível!' : 'Boa tentativa!'}
          </h1>
          <p className="result-subtitle">{game.emoji} {game.name}</p>

          {completed.success && (
            <div className="result-xp-gain">
              ⭐ +{Math.max(10, completed.durationSeconds)} pontos de aventura!
            </div>
          )}

          <div className="result-stats">
            <div className="result-stat">
              <span className="result-stat-label">Duração</span>
              <span className="result-stat-value">{completed.durationSeconds}s</span>
            </div>
            <div className="result-stat">
              <span className="result-stat-label">Resultado</span>
              <span className={`result-stat-value ${completed.success ? 'stat-good' : 'stat-warn'}`}>
                {completed.success ? '✅' : '🔄'}
              </span>
            </div>
          </div>

          {completed.observation && (
            <div className="result-observation-summary">
              <div className="result-obs-item">
                <span className="result-obs-label">Foco</span>
                <span className="result-obs-value">{LEVEL_EMOJI[completed.observation.focusLevel]}</span>
              </div>
              <div className="result-obs-item">
                <span className="result-obs-label">Engajamento</span>
                <span className="result-obs-value">{LEVEL_EMOJI[completed.observation.engagementLevel]}</span>
              </div>
              <div className="result-obs-item">
                <span className="result-obs-label">Frustração</span>
                <span className="result-obs-value">{LEVEL_EMOJI[completed.observation.frustrationLevel]}</span>
              </div>
              {completed.observation.neededHelp && (
                <div className="result-obs-item">
                  <span className="result-obs-label">Ajuda</span>
                  <span className="result-obs-value">🤝</span>
                </div>
              )}
            </div>
          )}

          {completed.newLevel && completed.newLevel !== difficulty && (
            <p className="result-difficulty-change">
              Nível adaptado para:{' '}
              <span className={`difficulty-badge difficulty-badge--${completed.newLevel}`}>
                {DIFFICULTY_LABELS[completed.newLevel]}
              </span>
            </p>
          )}

          {completed.newAchievements.length > 0 && (
            <div className="achievement-new-banner">
              {completed.newAchievements.map((a) => (
                <span key={a.code}>{a.emoji} {a.name} desbloqueado!</span>
              ))}
            </div>
          )}

          <p className="result-saved-msg">✅ Sessão salva com sucesso!</p>

          <div className="result-actions">
            <Button variant="game" size="lg" onClick={handleReplay}>▶ Jogar novamente</Button>
            <Button variant="ghost" onClick={() => navigate(`/children/${id}`)}>← Voltar ao hub</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--game">
      {/* Level Header */}
      <div className="level-header">
        <button className="level-header-back" onClick={() => navigate(`/children/${id}`)}>← Sair</button>
        <span className="level-header-emoji">{game.emoji}</span>
        <div className="level-header-info">
          <div className="level-header-name">{game.name}</div>
          <div className="level-header-meta">
            <span>{child.name}</span>
            <span className="level-header-dot" />
            <span className={`level-badge`}>{DIFFICULTY_LABELS[difficulty]}</span>
          </div>
        </div>
      </div>

      {/* Game Stage */}
      <div className="game-stage">
        {game.code === 'sequence_routine' && <SequenceRoutineGame onFinish={handleFinish} difficulty={difficulty} />}
        {game.code === 'find_object' && <FindObjectGame onFinish={handleFinish} difficulty={difficulty} />}
        {game.code === 'memory_cards' && <MemoryCardsGame onFinish={handleFinish} difficulty={difficulty} />}
      </div>
    </div>
  );
};
