import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  updateCaregiver,
  deleteCaregiver,
  linkCaregiverToChild,
  unlinkCaregiverFromChild,
} from '../../services/api';
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

export const CaregiverProfilePage: React.FC = () => {
  const { caregiverId } = useParams<{ caregiverId: string }>();
  const navigate = useNavigate();

  const caregiver = useStore((s) => s.caregivers.find((cg) => cg.id === caregiverId));
  const allChildren = useStore((s) => s.children);
  const linkedChildren = allChildren.filter((c) => caregiver?.linkedChildIds.includes(c.id));
  const unlinkedChildren = allChildren.filter((c) => !caregiver?.linkedChildIds.includes(c.id));

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState<CaregiverRelation>('responsável legal');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [monitoringPreferences, setMonitoringPreferences] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [linkingChildId, setLinkingChildId] = useState<string | null>(null);
  const [showLinkPanel, setShowLinkPanel] = useState(false);

  useEffect(() => {
    if (!caregiver) navigate('/caregivers', { replace: true });
  }, [caregiver, navigate]);

  if (!caregiver) return null;

  const openEdit = () => {
    setName(caregiver.name);
    setRelation(caregiver.relation);
    setPhone(caregiver.phone ?? '');
    setEmail(caregiver.email ?? '');
    setNotes(caregiver.notes ?? '');
    setMonitoringPreferences([...caregiver.monitoringPreferences]);
    setSaveError('');
    setEditing(true);
  };

  const togglePref = (pref: string) => {
    setMonitoringPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) { setSaveError('O nome é obrigatório.'); return; }
    setSaving(true);
    setSaveError('');
    try {
      await updateCaregiver(caregiver.id, {
        name: name.trim(),
        relation,
        phone: phone || undefined,
        email: email || undefined,
        notes: notes || undefined,
        monitoringPreferences,
      });
      setEditing(false);
    } catch {
      setSaveError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCaregiver(caregiver.id);
      navigate('/caregivers', { replace: true });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLink = async (childId: string) => {
    setLinkingChildId(childId);
    try {
      await linkCaregiverToChild(caregiver.id, childId);
    } finally {
      setLinkingChildId(null);
      setShowLinkPanel(false);
    }
  };

  const handleUnlink = async (childId: string) => {
    setLinkingChildId(childId);
    try {
      await unlinkCaregiverFromChild(caregiver.id, childId);
    } finally {
      setLinkingChildId(null);
    }
  };

  return (
    <div className="page--caregivers">
      <AppNavBar />
      <div className="caregivers-shell">
        {/* ── DELETE CONFIRMATION ── */}
        {showDeleteConfirm && (
          <div
            className="modal-overlay"
            onClick={() => setShowDeleteConfirm(false)}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon">⚠️</div>
              <h3 className="modal-title">Excluir responsável?</h3>
              <p className="modal-body">
                Tem certeza que deseja excluir o perfil de <strong>{caregiver.name}</strong>?
                <br />
                <span className="modal-warning">Esta ação não pode ser desfeita.</span>
              </p>
              <div className="modal-actions">
                <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>Cancelar</Button>
                <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Excluindo...' : 'Excluir'}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="caregivers-back-row">
          <Link to="/caregivers" className="cg-back-link">← Todos os responsáveis</Link>
        </div>

        <div className="cg-page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="caregiver-profile-avatar">👤</div>
            <div>
              <h1 className="cg-page-title">{caregiver.name}</h1>
              <p className="cg-page-subtitle">{RELATION_LABELS[caregiver.relation]}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!editing && (
              <Button size="sm" variant="ghost" onClick={openEdit}>✏️ Editar</Button>
            )}
            <Button size="sm" variant="danger" onClick={() => setShowDeleteConfirm(true)}>
              🗑 Excluir
            </Button>
          </div>
        </div>

        {/* ── DADOS DO RESPONSÁVEL ── */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Informações do responsável</h2>
          </div>

          {editing ? (
            <Card className="form-card">
              <div className="form">
                <div className="form-row">
                  <div className="form-group form-group-flex">
                    <label className="form-label">Nome *</label>
                    <input
                      className="form-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="form-group form-group-flex">
                    <label className="form-label">Vínculo *</label>
                    <select
                      className="form-input"
                      value={relation}
                      onChange={(e) => setRelation(e.target.value as CaregiverRelation)}
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="form-group form-group-flex">
                    <label className="form-label">E-mail</label>
                    <input
                      className="form-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                        className={`pref-chip${monitoringPreferences.includes(opt) ? ' pref-chip--selected' : ''}`}
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
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Disponibilidade, notas gerais..."
                  />
                </div>
                {saveError && <p className="form-error">{saveError}</p>}
                <div className="form-actions">
                  <Button variant="success" onClick={handleSave} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="tp-card">
              <div className="tp-grid">
                <div className="tp-field">
                  <span className="tp-field-label">Vínculo</span>
                  <span className="tp-field-value">{RELATION_LABELS[caregiver.relation]}</span>
                </div>
                {caregiver.phone && (
                  <div className="tp-field">
                    <span className="tp-field-label">Telefone</span>
                    <span className="tp-field-value">📞 {caregiver.phone}</span>
                  </div>
                )}
                {caregiver.email && (
                  <div className="tp-field">
                    <span className="tp-field-label">E-mail</span>
                    <span className="tp-field-value">✉️ {caregiver.email}</span>
                  </div>
                )}
                {caregiver.monitoringPreferences.length > 0 && (
                  <div className="tp-field" style={{ gridColumn: '1 / -1' }}>
                    <span className="tp-field-label">Preferências de acompanhamento</span>
                    <div className="tp-chips">
                      {caregiver.monitoringPreferences.map((p) => (
                        <span key={p} className="tp-chip">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {caregiver.notes && (
                <div className="tp-notes">
                  <span className="tp-field-label">Observações</span>
                  <p className="tp-notes-text">{caregiver.notes}</p>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* ── CRIANÇAS VINCULADAS ── */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Crianças acompanhadas</h2>
            {unlinkedChildren.length > 0 && (
              <Button size="sm" variant="ghost" onClick={() => setShowLinkPanel((v) => !v)}>
                {showLinkPanel ? 'Fechar' : '+ Vincular criança'}
              </Button>
            )}
          </div>

          {showLinkPanel && unlinkedChildren.length > 0 && (
            <Card style={{ marginBottom: 12 }}>
              <p className="form-label" style={{ marginBottom: 8 }}>Selecione uma criança para vincular:</p>
              <div className="caregivers-link-list">
                {unlinkedChildren.map((ch) => (
                  <button
                    key={ch.id}
                    className="caregiver-link-child-btn"
                    onClick={() => handleLink(ch.id)}
                    disabled={linkingChildId === ch.id}
                  >
                    <span>{ch.avatar ?? '🧒'}</span>
                    <span>{ch.name}</span>
                    {linkingChildId === ch.id ? <span>...</span> : <span>Vincular +</span>}
                  </button>
                ))}
              </div>
            </Card>
          )}

          <Card>
            {linkedChildren.length === 0 ? (
              <p className="empty-stats">
                Nenhuma criança vinculada ainda.
                {unlinkedChildren.length > 0 && (
                  <> <button className="link-btn" onClick={() => setShowLinkPanel(true)}>Vincular agora →</button></>
                )}
              </p>
            ) : (
              <div className="caregivers-linked-list">
                {linkedChildren.map((ch) => (
                  <div key={ch.id} className="caregiver-linked-item">
                    <div className="caregiver-linked-avatar">{ch.avatar ?? '🧒'}</div>
                    <div>
                      <div className="caregiver-linked-name">{ch.name}</div>
                      {ch.birthdate && (
                        <div className="caregiver-linked-relation">
                          {(() => {
                            const diff = Date.now() - new Date(ch.birthdate).getTime();
                            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
                            return `${years} anos`;
                          })()}
                        </div>
                      )}
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                      <button
                        className="caregiver-linked-view"
                        onClick={() => navigate(`/children/${ch.id}/caregiver`)}
                      >
                        Painel →
                      </button>
                      <button
                        className="caregiver-unlink-btn"
                        onClick={() => handleUnlink(ch.id)}
                        disabled={linkingChildId === ch.id}
                      >
                        {linkingChildId === ch.id ? '...' : 'Desvincular'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
