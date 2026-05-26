import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import type { CaregiverCtx } from '../../layouts/CaregiverLayout';
import { TherapeuticProfilePanel } from '../../components/dashboard/TherapeuticProfilePanel';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { updateChild, deleteChild } from '../../services/api';
import { useStore } from '../../store/useStore';

const AVATAR_OPTIONS = ['🦊', '🐻', '🐨', '🐯', '🦁', '🐸', '🐼', '🦉', '🐬', '🦋'];

function calcAge(birthdate?: string): string {
  if (!birthdate) return 'Não informada';
  const diff = Date.now() - new Date(birthdate).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return `${years} anos`;
}

export const ProfilePage: React.FC = () => {
  const { child, therapeuticProfile } = useOutletContext<CaregiverCtx>();
  const navigate = useNavigate();
  const allCaregivers = useStore((s) => s.caregivers);
  const caregivers = allCaregivers.filter((cg) => cg.linkedChildIds.includes(child.id));

  const [editingBasic, setEditingBasic] = useState(false);
  const [name, setName] = useState(child.name);
  const [avatar, setAvatar] = useState(child.avatar ?? '🦊');
  const [birthdate, setBirthdate] = useState(child.birthdate ?? '');
  const [notes, setNotes] = useState(child.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openEdit = () => {
    setName(child.name);
    setAvatar(child.avatar ?? '🦊');
    setBirthdate(child.birthdate ?? '');
    setNotes(child.notes ?? '');
    setSaveError('');
    setEditingBasic(true);
  };

  const handleSaveBasic = async () => {
    if (!name.trim()) { setSaveError('O nome é obrigatório.'); return; }
    setSaving(true);
    setSaveError('');
    try {
      await updateChild(child.id, {
        name: name.trim(),
        avatar: avatar || undefined,
        birthdate: birthdate || undefined,
        notes: notes || undefined,
      });
      setEditingBasic(false);
    } catch {
      setSaveError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteChild(child.id);
      navigate('/', { replace: true });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="cg-page">
      {/* ── DELETE CONFIRMATION MODAL ── */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteConfirm(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Excluir perfil?</h3>
            <p className="modal-body">
              Tem certeza que deseja excluir o perfil de <strong>{child.name}</strong>?
              <br />
              <span className="modal-warning">Todos os dados, metas, histórico e observações serão apagados.</span>
            </p>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>Cancelar</Button>
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Excluindo...' : 'Excluir perfil'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="cg-page-header">
        <div>
          <h1 className="cg-page-title">👤 Perfil da Criança</h1>
          <p className="cg-page-subtitle">
            Gerencie as informações de <strong>{child.name}</strong>
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
        >
          🗑 Excluir perfil
        </Button>
      </div>

      {/* ── INFORMAÇÕES BÁSICAS ── */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Informações básicas</h2>
          {!editingBasic && (
            <Button size="sm" variant="ghost" onClick={openEdit}>Editar</Button>
          )}
        </div>

        {editingBasic ? (
          <Card className="form-card">
            <div className="form">
              <div className="form-group">
                <label className="form-label">Avatar</label>
                <div className="avatar-picker">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`avatar-option${avatar === emoji ? ' avatar-option--selected' : ''}`}
                      onClick={() => setAvatar(emoji)}
                      aria-label={`Selecionar avatar ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input
                  className="form-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Data de nascimento</label>
                <input
                  className="form-input"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Observações gerais</label>
                <textarea
                  className="form-input form-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Ex: preferências, alergias, informações importantes..."
                />
              </div>
              {saveError && <p className="form-error">{saveError}</p>}
              <div className="form-actions">
                <Button variant="success" onClick={handleSaveBasic} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button variant="ghost" onClick={() => setEditingBasic(false)} disabled={saving}>
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="tp-card">
            <div className="tp-grid">
              <div className="tp-field">
                <span className="tp-field-label">Avatar</span>
                <span className="tp-field-value" style={{ fontSize: '1.8rem' }}>
                  {child.avatar ?? '🧒'}
                </span>
              </div>
              <div className="tp-field">
                <span className="tp-field-label">Nome</span>
                <span className="tp-field-value">{child.name}</span>
              </div>
              <div className="tp-field">
                <span className="tp-field-label">Idade</span>
                <span className="tp-field-value">{calcAge(child.birthdate)}</span>
              </div>
              {child.notes && (
                <div className="tp-field" style={{ gridColumn: '1 / -1' }}>
                  <span className="tp-field-label">Observações</span>
                  <span className="tp-field-value">{child.notes}</span>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* ── RESPONSÁVEIS VINCULADOS ── */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Responsáveis vinculados</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/caregivers')}
          >
            Gerenciar →
          </Button>
        </div>
        <Card>
          {caregivers.length === 0 ? (
            <p className="empty-stats">
              Nenhum responsável vinculado.{' '}
              <button
                className="link-btn"
                onClick={() => navigate('/caregivers')}
              >
                Cadastrar responsável →
              </button>
            </p>
          ) : (
            <div className="caregivers-linked-list">
              {caregivers.map((cg) => (
                <div key={cg.id} className="caregiver-linked-item">
                  <div className="caregiver-linked-avatar">👤</div>
                  <div>
                    <div className="caregiver-linked-name">{cg.name}</div>
                    <div className="caregiver-linked-relation">{cg.relation}</div>
                  </div>
                  <button
                    className="caregiver-linked-view"
                    onClick={() => navigate(`/caregivers/${cg.id}`)}
                  >
                    Ver →
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ── PERFIL TERAPÊUTICO ── */}
      <TherapeuticProfilePanel childId={child.id} profile={therapeuticProfile} />
    </div>
  );
};
