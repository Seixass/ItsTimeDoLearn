import React, { useState, useMemo } from 'react';
import type { GameResult, DifficultyLevel } from '../../types';

const ALL_EMOJIS = ['🐱', '🐶', '🐸', '🐰', '🌟', '🍎', '🦋', '🌈'];

const PAIR_COUNT: Record<DifficultyLevel, number> = {
  easy: 4,
  medium: 6,
  hard: 8,
};

interface CardState {
  id: number;
  emoji: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
}

function buildDeck(pairCount: number): CardState[] {
  const emojis = ALL_EMOJIS.slice(0, pairCount);
  const pairs = emojis.flatMap((emoji, pairId) => [
    { id: pairId * 2, emoji, pairId, flipped: false, matched: false },
    { id: pairId * 2 + 1, emoji, pairId, flipped: false, matched: false },
  ]);
  return pairs.sort(() => Math.random() - 0.5);
}

interface Props {
  onFinish: (result: GameResult) => void;
  difficulty?: DifficultyLevel;
}

export const MemoryCardsGame: React.FC<Props> = ({
  onFinish,
  difficulty = 'medium',
}) => {
  const pairCount = PAIR_COUNT[difficulty];
  const initialDeck = useMemo(() => buildDeck(pairCount), [difficulty]);
  const [cards, setCards] = useState<CardState[]>(initialDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);

  // Grid columns: easy (4 cards) → 2 cols, medium (6) → 3 cols, hard (8) → 4 cols
  const gridCols = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;

  const handleFlip = (id: number) => {
    if (locked || done) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (selected.length === 1 && selected[0] === id) return;

    const newSelected = [...selected, id];
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );

    if (newSelected.length === 2) {
      setAttempts((a) => a + 1);
      setLocked(true);

      const [firstId, secondId] = newSelected;
      const first = cards.find((c) => c.id === firstId)!;
      const secondCard = cards.find((c) => c.id === secondId)!;

      if (first.pairId === secondCard.pairId) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, matched: true, flipped: true }
              : c
          )
        );
        setSelected([]);
        setLocked(false);

        const totalMatched = cards.filter((c) => c.matched).length + 2;
        if (totalMatched === cards.length) {
          setDone(true);
          setTimeout(() => {
            onFinish({ success: true, meta: { attempts: attempts + 1 } });
          }, 1200);
        }
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, flipped: false }
                : c
            )
          );
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    } else {
      setSelected(newSelected);
    }
  };

  return (
    <div className="game-container">
      <div className="game-instruction">
        <span className="game-instruction-emoji">🃏</span>
        <h2>Encontre todos os pares!</h2>
        <p>Tentativas: {attempts}</p>
      </div>

      <div
        className="memory-grid"
        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            className={[
              'memory-card',
              card.flipped || card.matched ? 'memory-card--flipped' : '',
              card.matched ? 'memory-card--matched' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleFlip(card.id)}
          >
            <span className="memory-card-back">❓</span>
            <span className="memory-card-front">{card.emoji}</span>
          </button>
        ))}
      </div>

      {done && (
        <div className="game-success-overlay">
          <div className="game-success-box">
            <span className="game-success-emoji">🎉</span>
            <h2>Incrível!</h2>
            <p>Completou em {attempts} tentativas!</p>
          </div>
        </div>
      )}
    </div>
  );
};
