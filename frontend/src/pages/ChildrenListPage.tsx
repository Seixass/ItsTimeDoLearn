import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { createChild, updateChild, deleteChild } from '../services/api';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import type { Child } from '../types';

const AVATAR_OPTIONS = ['🦊', '🐻', '🐨', '🐯', '🦁', '🐸', '🐼', '🦉', '🐬', '🦋'];

function calcAge(birthdate?: string): string {
  if (!birthdate) return '';
  const diff = Date.now() - new Date(birthdate).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return `${years} anos`;
}

function colorIndex(id: string): number {
  return Math.abs(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 6;
}

function getAvatar(child: Child): string {
  if (child.avatar) return child.avatar;
  return AVATAR_OPTIONS[colorIndex(child.id) % AVATAR_OPTIONS.length];
}

type FormMode = 'create' | 'edit';

interface ChildFormState {
  name: string;
  avatar: string;
  birthdate: string;
  notes: string;
}

const EMPTY_FORM: ChildFormState = { name: '', avatar: '🦊', birthdate: '', notes: '' };

export const ChildrenListPage: React.FC = () => {
  const children = useStore((s) => s.children);
  const navigate = useNavigate();

  const [formMode, setFormMode] = useState<FormMode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ChildFormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Child | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const openCreate = () => {
    setFormMode('create');
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
    setMenuOpenId(null);
  };

  const openEdit = (child: Child) => {
    setFormMode('edit');
    setEditingId(child.id);
    setForm({
      name: child.name,
      avatar: child.avatar ?? '🦊',
      birthdate: child.birthdate ?? '',
      notes: child.notes ?? '',
    });
    setError('');
    setShowForm(true);
    setMenuOpenId(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setError('');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('O nome é obrigatório.'); return; }
    setSubmitting(true);
    setError('');
    try {
      if (formMode === 'create') {
        const child = await createChild({
          name: form.name.trim(),
          avatar: form.avatar || undefined,
          birthdate: form.birthdate || undefined,
          notes: form.notes || undefined,
        });
        closeForm();
        navigate(`/children/${child.id}`);
      } else if (editingId) {
        await updateChild(editingId, {
          name: form.name.trim(),
          avatar: form.avatar || undefined,
          birthdate: form.birthdate || undefined,
          notes: form.notes || undefined,
        });
        closeForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await deleteChild(deleteTarget.id);
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="page--home">
      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteTarget && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteTarget(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">Excluir perfil?</h3>
            <p className="modal-body">
              Tem certeza que deseja excluir o perfil de <strong>{deleteTarget.name}</strong>?
              <br />
              <span className="modal-warning">Isso apagará também histórico, metas e observações.</span>
            </p>
            <div className="modal-actions">
              <Button
                variant="ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={!!deletingId}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                disabled={!!deletingId}
              >
                {deletingId ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero-decor" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        <span className="home-hero-mascot" aria-hidden="true">⭐</span>
        <h1 className="home-hero-title">
          Its Time Do<br />
          <span>Learn</span>
        </h1>
        <p className="home-hero-subtitle">
          Aventuras de aprendizado feitas para cada criança — do jeitinho que ela precisa.
        </p>
        <div className="home-hero-cta">
          {children.length === 0 && (
            <Button variant="game" size="lg" onClick={openCreate}>
              ✨ Começar agora
            </Button>
          )}
          {children.length > 0 && (
            <Button variant="game" size="lg" onClick={() => document.getElementById('players')?.scrollIntoView({ behavior: 'smooth' })}>
              Escolher jogador ↓
            </Button>
          )}
        </div>
      </section>

      {/* ── PLAYER SELECTION ── */}
      <section className="home-players" id="players">
        <div className="home-players-header">
          <h2 className="home-players-title">🎮 Quem vai jogar hoje?</h2>
          <Link to="/caregivers" className="caregivers-link">
            👥 Responsáveis
          </Link>
        </div>

        {showForm && (
          <div className="home-form-card" style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 28 }}>
            <Card className="form-card" style={{ marginBottom: 0 }}>
              <h3 className="form-title">
                {formMode === 'create' ? '✨ Novo jogador' : `✏️ Editar: ${editingId ? children.find((c) => c.id === editingId)?.name : ''}`}
              </h3>
              <form onSubmit={handleSubmit} className="form">
                {/* Avatar picker */}
                <div className="form-group">
                  <label className="form-label">Avatar</label>
                  <div className="avatar-picker">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={`avatar-option${form.avatar === emoji ? ' avatar-option--selected' : ''}`}
                        onClick={() => setForm((f) => ({ ...f, avatar: emoji }))}
                        aria-label={`Selecionar avatar ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nome *</label>
                  <input className="form-input" type="text" value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Nome da criança" autoFocus />
                </div>
                <div className="form-row">
                  <div className="form-group form-group-flex">
                    <label className="form-label">Data de nascimento</label>
                    <input className="form-input" type="date" value={form.birthdate}
                      onChange={(e) => setForm((f) => ({ ...f, birthdate: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea className="form-input form-textarea" value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Ex: preferências, informações importantes..." rows={3} />
                </div>
                {error && <p className="form-error">{error}</p>}
                <div className="form-actions">
                  <Button type="submit" variant="success" disabled={submitting}>
                    {submitting ? 'Salvando...' : formMode === 'create' ? 'Salvar jogador' : 'Salvar alterações'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={closeForm}>Cancelar</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {children.length === 0 && !showForm ? (
          <div className="home-empty">
            <span className="empty-state-emoji">🌟</span>
            <p>Nenhum jogador cadastrado ainda.</p>
            <Button size="lg" onClick={openCreate}>✨ Cadastrar primeiro jogador</Button>
          </div>
        ) : (
          <div className="home-players-grid">
            {children.map((child) => {
              const ci = colorIndex(child.id);
              const avatar = getAvatar(child);
              const isMenuOpen = menuOpenId === child.id;
              return (
                <div
                  key={child.id}
                  className={`player-card player-card--${ci}`}
                  role="group"
                  aria-label={child.name}
                >
                  {/* Card menu */}
                  <div className="player-card-actions">
                    <button
                      className="player-card-menu-btn"
                      aria-label="Opções"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(isMenuOpen ? null : child.id);
                      }}
                    >
                      ⋮
                    </button>
                    {isMenuOpen && (
                      <div
                        className="player-card-menu"
                        role="menu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="player-card-menu-item"
                          role="menuitem"
                          onClick={() => openEdit(child)}
                        >
                          ✏️ Editar perfil
                        </button>
                        <button
                          className="player-card-menu-item player-card-menu-item--danger"
                          role="menuitem"
                          onClick={() => { setDeleteTarget(child); setMenuOpenId(null); }}
                        >
                          🗑 Excluir
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card content — clickable area */}
                  <div
                    className="player-card-clickable"
                    onClick={() => { setMenuOpenId(null); navigate(`/children/${child.id}`); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/children/${child.id}`)}
                    aria-label={`Jogar como ${child.name}`}
                  >
                    <div className={`player-avatar player-avatar--${ci}`}>{avatar}</div>
                    <div>
                      <div className="player-name">{child.name}</div>
                      {child.birthdate && <div className="player-age">{calcAge(child.birthdate)}</div>}
                    </div>
                    {child.notes && (
                      <div className="player-tag">
                        🏷 {child.notes.slice(0, 22)}{child.notes.length > 22 ? '…' : ''}
                      </div>
                    )}
                    <div className="player-play-hint">▶ Entrar na aventura</div>
                  </div>
                </div>
              );
            })}

            {/* Add Player */}
            {!showForm && (
              <div
                className="player-card player-card--add"
                onClick={openCreate}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openCreate()}
                aria-label="Adicionar novo jogador"
              >
                <div className="player-add-icon">+</div>
                <div className="player-name" style={{ color: 'var(--primary)' }}>Novo jogador</div>
                <div className="player-age">Adicionar criança</div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* click-outside to close menu */}
      {menuOpenId && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9 }}
          onClick={() => setMenuOpenId(null)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
