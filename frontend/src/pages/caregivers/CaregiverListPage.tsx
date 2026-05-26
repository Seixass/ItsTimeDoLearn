import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { createCaregiver } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { AppNavBar } from '../../components/layout/AppNavBar';
import type { CaregiverRelation } from '../../types';

const RELATION_LABELS: Record<CaregiverRelation, string> = {
  'mãe': 'Mãe',
  'pai': 'Pai',
  'responsável legal': 'Responsável legal',
  'terapeuta': 'Terapeuta',
  'professor': 'Professor(a)',
  'outro': 'Outro',
};

const MONITORING_OPTIONS = [
  'Receber alertas de progresso',
  'Acompanhar metas',
  'Ver histórico de sessões',
  'Receber recomendações',
  'Relatório semanal',
];

interface FormState {
  name: string;
  relation: CaregiverRelation;
  phone: string;
  email: string;
  notes: string;
  monitoringPreferences: string[];
}

const EMPTY_FORM: FormState = {
  name: '',
  relation: 'responsável legal',
  phone: '',
  email: '',
  notes: '',
  monitoringPreferences: [],
};

export const CaregiverListPage: React.FC = () => {
  const caregivers = useStore((s) => s.caregivers);
  const children = useStore((s) => s.children);
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const togglePref = (pref: string) => {
    setForm((f) => ({
      ...f,
      monitoringPreferences: f.monitoringPreferences.includes(pref)
        ? f.monitoringPreferences.filter((p) => p !== pref)
        : [...f.monitoringPreferences, pref],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('O nome é obrigatório.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const cg = await createCaregiver({
        name: form.name.trim(),
        relation: form.relation,
        phone: form.phone || undefined,
        email: form.email || undefined,
        notes: form.notes || undefined,
        linkedChildIds: [],
        monitoringPreferences: form.monitoringPreferences,
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      navigate(`/caregivers/${cg.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page--caregivers">
      <AppNavBar />
      <div className="caregivers-shell">
        <div className="cg-page-header">
          <div>
            <h1 className="cg-page-title">👥 Responsáveis</h1>
            <p className="cg-page-subtitle">
              Gerencie quem acompanha cada criança
            </p>
          </div>
          <Button variant="success" onClick={() => { setShowForm(true); setError(''); }}>
            + Novo responsável
          </Button>
        </div>

        <div className="caregivers-back-row">
          <Link to="/" className="cg-back-link">← Voltar ao início</Link>
        </div>

        {showForm && (
          <Card className="form-card" style={{ marginBottom: 28 }}>
            <h3 className="form-title">✨ Novo responsável</h3>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group form-group-flex">
                  <label className="form-label">Nome *</label>
                  <input
                    className="form-input"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Nome completo"
                    autoFocus
                  />
                </div>
                <div className="form-group form-group-flex">
                  <label className="form-label">Vínculo *</label>
                  <select
                    className="form-input"
                    value={form.relation}
                    onChange={(e) => setForm((f) => ({ ...f, relation: e.target.value as CaregiverRelation }))}
                  >
                    {(Object.keys(RELATION_LABELS) as CaregiverRelation[]).map((k) => (
                      <option key={k} value={k}>{RELATION_LABELS[k]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group form-group-flex">
                  <label className="form-label">Telefone</label>
                  <input
                    className="form-input"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="form-group form-group-flex">
                  <label className="form-label">E-mail</label>
                  <input
                    className="form-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Preferências de acompanhamento</label>
                <div className="pref-chips">
                  {MONITORING_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`pref-chip${form.monitoringPreferences.includes(opt) ? ' pref-chip--selected' : ''}`}
                      onClick={() => togglePref(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea
                  className="form-input form-textarea"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Disponibilidade, informações de contato, notas..."
                  rows={2}
                />
              </div>
              {error && <p className="form-error">{error}</p>}
              <div className="form-actions">
                <Button type="submit" variant="success" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar responsável'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setError(''); }}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {caregivers.length === 0 && !showForm ? (
          <div className="home-empty">
            <span className="empty-state-emoji">👤</span>
            <p>Nenhum responsável cadastrado ainda.</p>
            <Button size="lg" onClick={() => setShowForm(true)}>+ Cadastrar primeiro responsável</Button>
          </div>
        ) : (
          <div className="caregivers-grid">
            {caregivers.map((cg) => {
              const linked = children.filter((c) => cg.linkedChildIds.includes(c.id));
              return (
                <Card
                  key={cg.id}
                  className="caregiver-list-card"
                  onClick={() => navigate(`/caregivers/${cg.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="caregiver-list-card-header">
                    <div className="caregiver-list-avatar">👤</div>
                    <div className="caregiver-list-info">
                      <div className="caregiver-list-name">{cg.name}</div>
                      <div className="caregiver-list-relation">{RELATION_LABELS[cg.relation]}</div>
                    </div>
                  </div>
                  {(cg.phone || cg.email) && (
                    <div className="caregiver-list-contact">
                      {cg.phone && <span>📞 {cg.phone}</span>}
                      {cg.email && <span>✉️ {cg.email}</span>}
                    </div>
                  )}
                  <div className="caregiver-list-children">
                    {linked.length === 0 ? (
                      <span className="caregiver-no-children">Nenhuma criança vinculada</span>
                    ) : (
                      linked.map((ch) => (
                        <span key={ch.id} className="caregiver-child-chip">
                          {ch.avatar ?? '🧒'} {ch.name}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="caregiver-list-footer">
                    <span className="caregiver-view-link">Ver perfil →</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
