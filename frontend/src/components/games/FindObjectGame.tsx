import React, { useState, useMemo } from 'react';
import type { GameResult, DifficultyLevel } from '../../types';

interface GridItem {
  id: number;
  emoji: string;
  isTarget: boolean;
  found: boolean;
  wrong: boolean;
}

const TARGET_EMOJI = '🐱';
const TARGET_LABEL = 'gato';
const DISTRACTORS = ['🐶', '🐸', '🐰', '🐻', '🦊', '🐼', '🐨', '🦁', '🐯', '🦝', '🦔'];

interface DifficultyConfig {
  targets: number;
  total: number;
  cols: number;
}

const DIFFICULTY_CONFIG: Record<DifficultyLevel, DifficultyConfig> = {
  easy: { targets: 2, total: 9, cols: 3 },
  medium: { targets: 3, total: 12, cols: 4 },
  hard: { targets: 5, total: 16, cols: 4 },
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildGrid(config: DifficultyConfig): Omit<GridItem, 'found' | 'wrong'>[] {
  const targets = Array.from({ length: config.targets }, (_, i) => ({
    id: i,
    emoji: TARGET_EMOJI,
    isTarget: true,
  }));
  const distractorCount = config.total - config.targets;
  const distractors = Array.from({ length: distractorCount }, (_, i) => ({
    id: config.targets + i,
    emoji: DISTRACTORS[i % DISTRACTORS.length],
    isTarget: false,
  }));
  return shuffle([...targets, ...distractors]);
}

interface Props {
  onFinish: (result: GameResult) => void;
  difficulty?: DifficultyLevel;
}

export const FindObjectGame: React.FC<Props> = ({
  onFinish,
  difficulty = 'medium',
}) => {
  const config = DIFFICULTY_CONFIG[difficulty] ?? DIFFICULTY_CONFIG.medium;
  const baseGrid = useMemo(() => buildGrid(config), [difficulty]);
  const [grid, setGrid] = useState<GridItem[]>(
    baseGrid.map((item) => ({ ...item, found: false, wrong: false }))
  );
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);

  const handleClick = (id: number) => {
    if (done) return;

    const clickedItem = grid.find((item) => item.id === id);
    if (!clickedItem || clickedItem.found || clickedItem.wrong) return;

    if (clickedItem.isTarget) {
      const newHits = hits + 1;
      setHits(newHits);
      setGrid((prev) =>
        prev.map((item) => (item.id === id ? { ...item, found: true } : item))
      );
      if (newHits === config.targets) {
        setDone(true);
        setTimeout(() => {
          onFinish({ success: true, meta: { hits: newHits, misses } });
        }, 1200);
      }
    } else {
      setMisses((m) => m + 1);
      setGrid((prev) =>
        prev.map((item) => (item.id === id ? { ...item, wrong: true } : item))
      );
      setTimeout(() => {
        setGrid((g) =>
          g.map((item) => (item.id === id ? { ...item, wrong: false } : item))
        );
      }, 600);
    }
  };

  return (
    <div className="game-container">
      <div className="game-instruction">
        <span className="game-instruction-emoji">🔍</span>
        <h2>
          Ache todos os <strong>{TARGET_LABEL}</strong> {TARGET_EMOJI}
        </h2>
        <p>
          Encontrados: {hits}/{config.targets} &nbsp;|&nbsp; Erros: {misses}
        </p>
      </div>

      <div
        className="find-object-grid"
        style={{ gridTemplateColumns: `repeat(${config.cols}, 1fr)` }}
      >
        {grid.map((item) => (
          <button
            key={item.id}
            className={[
              'find-object-cell',
              item.found ? 'find-object-cell--found' : '',
              item.wrong ? 'find-object-cell--wrong' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleClick(item.id)}
            disabled={item.found}
          >
            <span className="find-object-emoji">{item.emoji}</span>
          </button>
        ))}
      </div>

      {done && (
        <div className="game-success-overlay">
          <div className="game-success-box">
            <span className="game-success-emoji">🎉</span>
            <h2>Muito bem!</h2>
            <p>
              Encontrou todos os {TARGET_LABEL}s com {misses} erro
              {misses !== 1 ? 's' : ''}!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
