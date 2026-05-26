import React, { useState, useMemo } from 'react';
import type { GameResult, DifficultyLevel } from '../../types';

interface Step {
  id: number;
  label: string;
  emoji: string;
}

const ALL_STEPS: Step[] = [
  { id: 1, label: 'Escovar os dentes', emoji: '🪥' },
  { id: 2, label: 'Lavar o rosto', emoji: '🚿' },
  { id: 3, label: 'Tomar café', emoji: '☕' },
  { id: 4, label: 'Pegar a mochila', emoji: '🎒' },
  { id: 5, label: 'Calçar o sapato', emoji: '👟' },
  { id: 6, label: 'Dizer tchau', emoji: '👋' },
];

const STEP_COUNT: Record<DifficultyLevel, number> = {
  easy: 3,
  medium: 4,
  hard: 6,
};

interface Props {
  onFinish: (result: GameResult) => void;
  difficulty?: DifficultyLevel;
}

export const SequenceRoutineGame: React.FC<Props> = ({
  onFinish,
  difficulty = 'medium',
}) => {
  const steps = useMemo(
    () => ALL_STEPS.slice(0, STEP_COUNT[difficulty]),
    [difficulty]
  );

  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);

  const toggle = (id: number) => {
    if (done) return;

    const next = new Set(completed);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setCompleted(next);

    if (next.size === steps.length) {
      setDone(true);
      setTimeout(() => {
        onFinish({ success: true, meta: { steps: steps.length } });
      }, 1200);
    }
  };

  return (
    <div className="game-container">
      <div className="game-instruction">
        <span className="game-instruction-emoji">📋</span>
        <h2>Complete todos os passos da rotina!</h2>
        <p>Clique em cada passo quando terminar</p>
      </div>

      <div className="sequence-steps">
        {steps.map((step) => {
          const isCompleted = completed.has(step.id);
          return (
            <button
              key={step.id}
              className={`sequence-step ${isCompleted ? 'sequence-step--done' : ''}`}
              onClick={() => toggle(step.id)}
            >
              <span className="sequence-step-emoji">{step.emoji}</span>
              <span className="sequence-step-label">{step.label}</span>
              <span className="sequence-step-check">{isCompleted ? '✅' : '⬜'}</span>
            </button>
          );
        })}
      </div>

      {done && (
        <div className="game-success-overlay">
          <div className="game-success-box">
            <span className="game-success-emoji">🎉</span>
            <h2>Parabéns!</h2>
            <p>Você completou todos os passos!</p>
          </div>
        </div>
      )}

      <div className="game-progress">
        {completed.size} de {steps.length} passos concluídos
      </div>
    </div>
  );
};
