import React, { useState } from 'react';
import type {
  ChildTherapeuticProfile,
  SupportLevel,
  EngagementStyle,
  TherapeuticSkill,
} from '../../types';
import { saveTherapeuticProfile } from '../../services/api';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const SUPPORT_LABELS: Record<SupportLevel, string> = {
  independent: 'Independente',
  minimal: 'Apoio mínimo',
  moderate: 'Apoio moderado',
  full: 'Apoio total',
};

const ENGAGEMENT_LABELS: Record<EngagementStyle, string> = {
  visual: 'Visual',
  kinesthetic: 'Cinestésico',
  auditory: 'Auditivo',
  mixed: 'Misto',
};

const SKILL_LABELS: Record<TherapeuticSkill, string> = {
  sequencing: 'Sequenciamento',
  attention: 'Atenção',
  memory: 'Memória',
  impulse_control: 'Impulsividade',
  focus: 'Foco',
  routine_execution: 'Rotina',
  social_interaction: 'Interação social',
  emotional_regulation: 'Regulação emocional',
  sensory_regulation: 'Regulação sensorial',
  communication: 'Comunicação',
};

const ALL_SKILLS = Object.keys(SKILL_LABELS) as TherapeuticSkill[];

interface ChipProps {
  label: string;
  variant?: 'default' | 'warning' | 'difficulty';
}

function Chip({ label, variant = 'default' }: ChipProps) {
  return <span className={`tp-chip tp-chip--${variant}`}>{label}</span>;
}

interface Props {
  childId: string;
  profile: ChildTherapeuticProfile | undefined;
}

function splitTags(s: string): string[] {
  return s.split(',').map((t) => t.trim()).filter(Boolean);
}

export const TherapeuticProfilePanel: React.FC<Props> = ({ childId, profile }) => {
  const [editing, setEditing] = useState(false);

  const [conditions, setConditions] = useState('');
  const [interests, setInterests] = useState('');
  const [sensitivities, setSensitivities] = useState('');
  const [mainDifficulties, setMainDifficulties] = useState<TherapeuticSkill[]>([]);
  const [idealMinutes, setIdealMinutes] = useState('10');
  const [supportLevel, setSupportLevel] = useState<SupportLevel>('moderate');
  const [engagementStyle, setEngagementStyle] = useState<EngagementStyle>('visual');
  const [notes, setNotes] = useState('');

  const openEdit = () => {
    setConditions((profile?.conditions ?? []).join(', '));
    setInterests((profile?.interests ?? []).join(', '));
    setSensitivities((profile?.sensorySensitivities ?? []).join(', '));
    setMainDifficulties(profile?.mainDifficulties ?? []);
    setIdealMinutes(String(profile?.idealSessionMinutes ?? 10));
    setSupportLevel(profile?.supportLevel ?? 'moderate');
    setEngagementStyle(profile?.engagementStyle ?? 'visual');
    setNotes(profile?.therapeuticNotes ?? '');
    setEditing(true);
  };

  const handleSave = () => {
    saveTherapeuticProfile({
      childId,
      conditions: splitTags(conditions),
      interests: splitTags(interests),
      sensorySensitivities: splitTags(sensitivities),
      mainDifficulties,
      idealSessionMinutes: Math.max(1, Number(idealMinutes) || 10),
      supportLevel,
      engagementStyle,
      therapeuticNotes: notes.trim(),
    });
    setEditing(false);
  };

  const toggleDifficulty = (skill: TherapeuticSkill) => {
    setMainDifficulties((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  if (editing) {
    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Perfil terapêutico</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" variant="success" onClick={handleSave}>Salvar</Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
          </div>
        </div>
        <Card className="form-card">
          <div className="form">
            <div className="form-group">
              <label className="form-label">Condições (separadas por vírgula)</label>
              <input className="form-input" type="text" value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="Ex: TEA, TDAH, Dislexia" />
            </div>
            <div className="form-group">
              <label className="form-label">Interesses (separados por vírgula)</label>
              <input className="form-input" type="text" value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Ex: dinossauros, música, animais" />
            </div>
            <div className="form-group">
              <label className="form-label">Sensibilidades sensoriais (separadas por vírgula)</label>
              <input className="form-input" type="text" value={sensitivities}
                onChange={(e) => setSensitivities(e.target.value)}
                placeholder="Ex: sons altos, luzes intensas" />
            </div>
            <div className="form-group">
              <label className="form-label">Dificuldades principais</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {ALL_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleDifficulty(skill)}
                    className={`weekly-editor-game-btn ${mainDifficulties.includes(skill) ? 'weekly-editor-game-btn--selected' : ''}`}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {SKILL_LABELS[skill]}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group form-group-flex">
                <label className="form-label">Duração ideal (min)</label>
                <input className="form-input" type="number" min={1} max={60} value={idealMinutes}
                  onChange={(e) => setIdealMinutes(e.target.value)} />
              </div>
              <div className="form-group form-group-flex">
                <label className="form-label">Nível de suporte</label>
                <select className="form-input" value={supportLevel}
                  onChange={(e) => setSupportLevel(e.target.value as SupportLevel)}>
                  {(Object.keys(SUPPORT_LABELS) as SupportLevel[]).map((k) => (
                    <option key={k} value={k}>{SUPPORT_LABELS[k]}</option>
                  ))}
                </select>
              </div>
              <div className="form-group form-group-flex">
                <label className="form-label">Estilo de engajamento</label>
                <select className="form-input" value={engagementStyle}
                  onChange={(e) => setEngagementStyle(e.target.value as EngagementStyle)}>
                  {(Object.keys(ENGAGEMENT_LABELS) as EngagementStyle[]).map((k) => (
                    <option key={k} value={k}>{ENGAGEMENT_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Observações terapêuticas</label>
              <textarea className="form-input form-textarea" value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas sobre comportamento, estratégias que funcionam..." rows={3} />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Perfil terapêutico</h2>
          <Button size="sm" onClick={openEdit}>+ Configurar</Button>
        </div>
        <Card>
          <p className="empty-stats">
            Sem perfil terapêutico. Configure para receber recomendações personalizadas de atividades!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Perfil terapêutico</h2>
        <Button size="sm" variant="ghost" onClick={openEdit}>Editar</Button>
      </div>
      <Card className="tp-card">
        <div className="tp-grid">
          {profile.conditions.length > 0 && (
            <div className="tp-field">
              <span className="tp-field-label">Condições</span>
              <div className="tp-chips">
                {profile.conditions.map((c) => <Chip key={c} label={c} />)}
              </div>
            </div>
          )}
          {profile.interests.length > 0 && (
            <div className="tp-field">
              <span className="tp-field-label">Interesses</span>
              <div className="tp-chips">
                {profile.interests.map((i) => <Chip key={i} label={i} />)}
              </div>
            </div>
          )}
          {profile.sensorySensitivities.length > 0 && (
            <div className="tp-field">
              <span className="tp-field-label">Sensibilidades sensoriais</span>
              <div className="tp-chips">
                {profile.sensorySensitivities.map((s) => <Chip key={s} label={`⚠ ${s}`} variant="warning" />)}
              </div>
            </div>
          )}
          {profile.mainDifficulties.length > 0 && (
            <div className="tp-field">
              <span className="tp-field-label">Dificuldades principais</span>
              <div className="tp-chips">
                {profile.mainDifficulties.map((d) => <Chip key={d} label={SKILL_LABELS[d]} variant="difficulty" />)}
              </div>
            </div>
          )}
          <div className="tp-field">
            <span className="tp-field-label">Sessão ideal</span>
            <span className="tp-field-value">{profile.idealSessionMinutes} minutos</span>
          </div>
          <div className="tp-field">
            <span className="tp-field-label">Nível de suporte</span>
            <span className="tp-field-value">{SUPPORT_LABELS[profile.supportLevel]}</span>
          </div>
          <div className="tp-field">
            <span className="tp-field-label">Estilo de engajamento</span>
            <span className="tp-field-value">{ENGAGEMENT_LABELS[profile.engagementStyle]}</span>
          </div>
        </div>
        {profile.therapeuticNotes && (
          <div className="tp-notes">
            <span className="tp-field-label">Observações terapêuticas</span>
            <p className="tp-notes-text">{profile.therapeuticNotes}</p>
          </div>
        )}
      </Card>
    </div>
  );
};
