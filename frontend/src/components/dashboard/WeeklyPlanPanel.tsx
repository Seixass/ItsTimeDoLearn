import React, { useEffect, useState } from 'react';
import type { WeekDay, GameCode, WeeklyPlan, SessionPlanEntry } from '../../types';
import { GAME_CATALOG } from '../../mocks';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const WEEK_DAYS: { key: WeekDay; label: string; short: string }[] = [
  { key: 'monday', label: 'Segunda', short: 'Seg' },
  { key: 'tuesday', label: 'Terça', short: 'Ter' },
  { key: 'wednesday', label: 'Quarta', short: 'Qua' },
  { key: 'thursday', label: 'Quinta', short: 'Qui' },
  { key: 'friday', label: 'Sexta', short: 'Sex' },
  { key: 'saturday', label: 'Sábado', short: 'Sáb' },
  { key: 'sunday', label: 'Domingo', short: 'Dom' },
];

interface Props {
  weeklyPlan?: WeeklyPlan;
  onSave: (entries: SessionPlanEntry[]) => void;
}

export const WeeklyPlanPanel: React.FC<Props> = ({ weeklyPlan, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<Record<WeekDay, GameCode>>>(
    () =>
      Object.fromEntries(
        (weeklyPlan?.entries ?? []).map((e) => [e.day, e.gameCode])
      ) as Partial<Record<WeekDay, GameCode>>
  );

  useEffect(() => {
    if (!editing) {
      setDraft(
        Object.fromEntries(
          (weeklyPlan?.entries ?? []).map((e) => [e.day, e.gameCode])
        ) as Partial<Record<WeekDay, GameCode>>
      );
    }
  }, [weeklyPlan, editing]);

  const getGameForDay = (day: WeekDay): GameCode | undefined =>
    weeklyPlan?.entries.find((e) => e.day === day)?.gameCode;

  const selectGame = (day: WeekDay, gameCode: GameCode | undefined) => {
    setDraft((prev) => {
      const next = { ...prev };
      if (gameCode === undefined) {
        delete next[day];
      } else {
        next[day] = gameCode;
      }
      return next;
    });
  };

  const handleSave = () => {
    const entries: SessionPlanEntry[] = (
      Object.entries(draft) as [WeekDay, GameCode][]
    ).map(([day, gameCode]) => ({ day, gameCode }));
    onSave(entries);
    setEditing(false);
  };

  const handleEdit = () => {
    setDraft(
      Object.fromEntries(
        (weeklyPlan?.entries ?? []).map((e) => [e.day, e.gameCode])
      ) as Partial<Record<WeekDay, GameCode>>
    );
    setEditing(true);
  };

  if (!editing) {
    const hasAnyEntry = WEEK_DAYS.some((d) => getGameForDay(d.key));

    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Plano semanal</h2>
          <Button size="sm" variant="ghost" onClick={handleEdit}>
            {hasAnyEntry ? 'Editar' : 'Configurar'}
          </Button>
        </div>
        {!hasAnyEntry ? (
          <Card>
            <p className="empty-stats">
              Nenhum plano configurado. Defina os jogos para cada dia da semana!
            </p>
          </Card>
        ) : (
          <div className="weekly-plan-grid">
            {WEEK_DAYS.map(({ key, short }) => {
              const gameCode = getGameForDay(key);
              const game = gameCode
                ? GAME_CATALOG.find((g) => g.code === gameCode)
                : undefined;
              return (
                <div
                  key={key}
                  className={`weekly-day ${game ? 'weekly-day--scheduled' : ''}`}
                >
                  <span className="weekly-day-label">{short}</span>
                  {game ? (
                    <span className="weekly-day-game" title={game.name}>
                      {game.emoji}
                    </span>
                  ) : (
                    <span className="weekly-day-empty">—</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Plano semanal</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="success" onClick={handleSave}>
            Salvar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
            Cancelar
          </Button>
        </div>
      </div>
      <Card>
        <div className="weekly-plan-editor">
          {WEEK_DAYS.map(({ key, label }) => (
            <div key={key} className="weekly-editor-day">
              <span className="weekly-editor-day-label">{label}</span>
              <div className="weekly-editor-games">
                <button
                  type="button"
                  className={`weekly-editor-game-btn ${!draft[key] ? 'weekly-editor-game-btn--selected' : ''}`}
                  onClick={() => selectGame(key, undefined)}
                >
                  Livre
                </button>
                {GAME_CATALOG.map((game) => (
                  <button
                    key={game.code}
                    type="button"
                    className={`weekly-editor-game-btn ${draft[key] === game.code ? 'weekly-editor-game-btn--selected' : ''}`}
                    onClick={() => selectGame(key, game.code)}
                  >
                    {game.emoji} {game.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
