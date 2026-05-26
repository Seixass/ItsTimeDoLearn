import React, { useState } from 'react';
import type { ObservationFormData, ObservationLevel } from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface LevelOption {
  value: ObservationLevel;
  label: string;
}

const LEVELS: LevelOption[] = [
  { value: 1, label: '😞 Muito baixo' },
  { value: 2, label: '😕 Baixo' },
  { value: 3, label: '😐 Médio' },
  { value: 4, label: '🙂 Alto' },
  { value: 5, label: '😄 Muito alto' },
];

function LevelSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ObservationLevel;
  onChange: (v: ObservationLevel) => void;
}) {
  return (
    <div className="obs-level-group">
      <label className="form-label">{label}</label>
      <div className="obs-level-options">
        {LEVELS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`obs-level-btn ${value === opt.value ? 'obs-level-btn--selected' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Props {
  childName: string;
  gameName: string;
  gameEmoji: string;
  onSubmit: (data: ObservationFormData) => void;
  onSkip: () => void;
}

export const SessionObservationForm: React.FC<Props> = ({
  childName,
  gameName,
  gameEmoji,
  onSubmit,
  onSkip,
}) => {
  const [neededHelp, setNeededHelp] = useState(false);
  const [focusLevel, setFocusLevel] = useState<ObservationLevel>(3);
  const [frustrationLevel, setFrustrationLevel] = useState<ObservationLevel>(2);
  const [engagementLevel, setEngagementLevel] = useState<ObservationLevel>(3);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ neededHelp, focusLevel, frustrationLevel, engagementLevel, notes });
  };

  return (
    <div className="obs-form-wrapper">
      <div className="obs-form-header">
        <span className="obs-form-emoji">{gameEmoji}</span>
        <div>
          <h2 className="obs-form-title">Observação da sessão</h2>
          <p className="obs-form-subtitle">
            {childName} — {gameName}
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="form">
          <div className="obs-help-row">
            <label className="obs-checkbox-label">
              <input
                type="checkbox"
                checked={neededHelp}
                onChange={(e) => setNeededHelp(e.target.checked)}
                className="obs-checkbox"
              />
              <span>A criança precisou de ajuda durante a sessão</span>
            </label>
          </div>

          <LevelSelector
            label="Nível de foco"
            value={focusLevel}
            onChange={setFocusLevel}
          />
          <LevelSelector
            label="Nível de frustração"
            value={frustrationLevel}
            onChange={setFrustrationLevel}
          />
          <LevelSelector
            label="Nível de engajamento"
            value={engagementLevel}
            onChange={setEngagementLevel}
          />

          <div className="form-group">
            <label className="form-label">Observações livres</label>
            <textarea
              className="form-input form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: A criança ficou agitada no meio do jogo, pediu para pausar..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <Button type="submit" variant="success">
              Salvar observação
            </Button>
            <Button type="button" variant="ghost" onClick={onSkip}>
              Pular
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
