import React from 'react';
import { NavLink } from 'react-router-dom';

const AVATAR_OPTIONS = ['🦊', '🐻', '🐨', '🐯', '🦁', '🐸', '🐼', '🦉', '🐬', '🦋'];

function colorIndex(id: string) {
  return Math.abs(id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 6;
}

interface Props {
  childId: string;
  childName: string;
  childAvatar?: string;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = (id: string) => [
  { icon: '📊', label: 'Visão Geral',     to: `/children/${id}/caregiver`,                  end: true  },
  { icon: '👤', label: 'Perfil',          to: `/children/${id}/caregiver/profile` },
  { icon: '🎯', label: 'Metas',           to: `/children/${id}/caregiver/goals` },
  { icon: '📅', label: 'Plano Semanal',   to: `/children/${id}/caregiver/weekly-plan` },
  { icon: '💡', label: 'Recomendações',   to: `/children/${id}/caregiver/recommendations` },
  { icon: '📋', label: 'Observações',     to: `/children/${id}/caregiver/observations` },
  { icon: '📜', label: 'Histórico',       to: `/children/${id}/caregiver/history` },
  { icon: '🧩', label: 'Atividades',      to: `/children/${id}/caregiver/activities` },
  { icon: '📈', label: 'Progresso',       to: `/children/${id}/caregiver/progress` },
];

export const CaregiverSidebar: React.FC<Props> = ({ childId, childName, childAvatar, isOpen, onClose }) => {
  const ci = colorIndex(childId);
  const icon = childAvatar ?? AVATAR_OPTIONS[ci % AVATAR_OPTIONS.length];

  return (
    <aside className={`caregiver-sidebar${isOpen ? ' caregiver-sidebar--open' : ''}`}>
      <div className="caregiver-sidebar-header">
        <div className="caregiver-sidebar-brand-text">👨‍👩‍👧 Área do Responsável</div>
        <div className="caregiver-sidebar-child">
          <div className={`caregiver-sidebar-avatar player-avatar--${ci}`}>{icon}</div>
          <div>
            <div className="caregiver-sidebar-childname">{childName}</div>
            <div className="caregiver-sidebar-role">Painel terapêutico</div>
          </div>
        </div>
      </div>

      <nav className="caregiver-sidebar-nav">
        {navItems(childId).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `caregiver-nav-item${isActive ? ' caregiver-nav-item--active' : ''}`
            }
            onClick={onClose}
          >
            <span className="caregiver-nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="caregiver-sidebar-footer">
        <NavLink
          to={`/children/${childId}`}
          className="caregiver-back-btn"
          onClick={onClose}
        >
          🎮 Área da Criança
        </NavLink>
        <NavLink
          to="/caregivers"
          className="caregiver-back-btn"
          style={{ marginTop: 4 }}
          onClick={onClose}
        >
          👥 Responsáveis
        </NavLink>
      </div>
    </aside>
  );
};
