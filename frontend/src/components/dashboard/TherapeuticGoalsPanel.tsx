import React, { useRef, useState } from 'react';
import type { TherapeuticGoal, TherapeuticSkill } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const SKILL_LABELS: Record<TherapeuticSkill, string> = {
  sequencing: 'Sequenciamento',
  attention: 'Atenção',
  memory: 'Memória',
  impulse_control: 'Controle de Impulsividade',
  focus: 'Foco',
  routine_execution: 'Execução de Rotina',
  social_interaction: 'Interação Social',
  emotional_regulation: 'Regulação Emocional',
  sensory_regulation: 'Regulação Sensorial',
  communication: 'Comunicação',
};

const SKILL_EMOJIS: Record<TherapeuticSkill, string> = {
  sequencing: '📋',
  attention: '🎯',
  memory: '🧠',
  impulse_control: '🧘',
  focus: '🔍',
  routine_execution: '📅',
  social_interaction: '🤝',
  emotional_regulation: '💛',
  sensory_regulation: '🌿',
  communication: '💬',
};

interface Props {
  childId: string;
  goals: TherapeuticGoal[];
  onAddGoal: (data: Omit<TherapeuticGoal, 'id' | 'createdAt'>) => void;
  onToggleGoal: (id: string) => void;
  onUpdateProgress?: (id: string, value: number) => void;
}

export const TherapeuticGoalsPanel: React.FC<Props> = ({
  childId,
  goals,
  onAddGoal,
  onToggleGoal,
  onUpdateProgress,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [skill, setSkill] = useState<TherapeuticSkill>('sequencing');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [unit, setUnit] = useState('');

  const [editingProgress, setEditingProgress] = useState<string | null>(null);
  const progressInputRef = useRef<HTMLInputElement>(null);

  const activeGoals = goals.filter((g) => g.active);
  const archivedGoals = goals.filter((g) => !g.active);

  // Reset progress edit if the goal being edited is no longer active
  React.useEffect(() => {
    if (editingProgress && !activeGoals.some((g) => g.id === editingProgress)) {
      setEditingProgress(null);
    }
  }, [activeGoals, editingProgress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onAddGoal({
      childId,
      skill,
      description: description.trim(),
      targetValue: Number(targetValue) || 0,
      currentValue: Number(currentValue) || 0,
      unit: unit.trim(),
      active: true,
    });
    setDescription('');
    setTargetValue('');
    setCurrentValue('');
    setUnit('');
    setShowForm(false);
  };

  const getProgress = (goal: TherapeuticGoal): number => {
    if (!goal.targetValue) return 0;
    return Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Metas terapêuticas</h2>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancelar' : '+ Meta'}
        </Button>
      </div>

      {showForm && (
        <Card className="form-card">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="form-label">Habilidade</label>
              <select
                className="form-input"
                value={skill}
                onChange={(e) => setSkill(e.target.value as TherapeuticSkill)}
              >
                {(Object.keys(SKILL_LABELS) as TherapeuticSkill[]).map((s) => (
                  <option key={s} value={s}>
                    {SKILL_EMOJIS[s]} {SKILL_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Descrição da meta</label>
              <input
                className="form-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Completar sequência sem ajuda"
                required
                autoFocus
              />
            </div>
            <div className="form-row">
              <div className="form-group form-group-flex">
                <label className="form-label">Valor atual</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="form-group form-group-flex">
                <label className="form-label">Meta</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="5"
                />
              </div>
              <div className="form-group form-group-flex">
                <label className="form-label">Unidade</label>
                <input
                  className="form-input"
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="etapas"
                />
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" variant="success" size="sm">
                Salvar meta
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeGoals.length === 0 && !showForm && (
        <Card>
          <p className="empty-stats">
            Nenhuma meta ativa. Adicione a primeira meta terapêutica!
          </p>
        </Card>
      )}

      {activeGoals.length > 0 && (
        <div className="goals-list">
          {activeGoals.map((goal) => {
            const progress = getProgress(goal);
            return (
              <Card key={goal.id} className="goal-card">
                <div className="goal-card-header">
                  <span className="goal-skill-badge">
                    {SKILL_EMOJIS[goal.skill]} {SKILL_LABELS[goal.skill]}
                  </span>
                  <button
                    className="goal-archive-btn"
                    onClick={() => onToggleGoal(goal.id)}
                    title="Arquivar meta"
                  >
                    ✓ Concluir
                  </button>
                </div>
                <p className="goal-description">{goal.description}</p>
                {goal.targetValue > 0 && (
                  <div className="goal-progress">
                    <div className="goal-progress-bar">
                      <div
                        className="goal-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {onUpdateProgress && editingProgress === goal.id ? (
                        <form
                          style={{ display: 'flex', gap: 6, alignItems: 'center' }}
                          onSubmit={(e) => {
                            e.preventDefault();
                            const val = Number(progressInputRef.current?.value ?? goal.currentValue);
                            onUpdateProgress(goal.id, Math.min(goal.targetValue, Math.max(0, val)));
                            setEditingProgress(null);
                          }}
                        >
                          <input
                            ref={progressInputRef}
                            type="number"
                            defaultValue={goal.currentValue}
                            min={0}
                            max={goal.targetValue}
                            className="form-input"
                            style={{ width: 64, padding: '2px 6px', fontSize: '0.85rem' }}
                            autoFocus
                          />
                          <span className="goal-progress-label">/ {goal.targetValue} {goal.unit}</span>
                          <button type="submit" className="goal-archive-btn" style={{ color: 'var(--success)' }}>✓</button>
                          <button type="button" className="goal-archive-btn" onClick={() => setEditingProgress(null)}>✕</button>
                        </form>
                      ) : (
                        <>
                          <span className="goal-progress-label">
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </span>
                          {onUpdateProgress && (
                            <button
                              className="goal-archive-btn"
                              style={{ fontSize: '0.75rem', opacity: 0.7 }}
                              onClick={() => setEditingProgress(goal.id)}
                              title="Atualizar progresso"
                            >
                              ✏️
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {archivedGoals.length > 0 && (
        <details className="goals-archived">
          <summary className="goals-archived-summary">
            {archivedGoals.length} meta{archivedGoals.length > 1 ? 's' : ''} arquivada
            {archivedGoals.length > 1 ? 's' : ''}
          </summary>
          <div className="goals-list goals-list--archived">
            {archivedGoals.map((goal) => (
              <Card key={goal.id} className="goal-card goal-card--archived">
                <div className="goal-card-header">
                  <span className="goal-skill-badge goal-skill-badge--muted">
                    {SKILL_EMOJIS[goal.skill]} {SKILL_LABELS[goal.skill]}
                  </span>
                  <button
                    className="goal-archive-btn"
                    onClick={() => onToggleGoal(goal.id)}
                    title="Reativar meta"
                  >
                    ↩ Reativar
                  </button>
                </div>
                <p className="goal-description goal-description--muted">
                  {goal.description}
                </p>
              </Card>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};
