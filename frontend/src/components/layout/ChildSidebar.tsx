import React from 'react';
import { NavLink } from 'react-router-dom';

const PLAYER_ICONS = ['🦊', '🐻', '🐨', '🐯', '🦁', '🐸', '🐼', '🦉', '🐬', '🦋'];

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

export const ChildSidebar: React.FC<Props> = ({ childId, childName, childAvatar, isOpen, onClose }) => {
  const ci = colorIndex(childId);
  const icon = childAvatar ?? PLAYER_ICONS[ci % PLAYER_ICONS.length];

  return (
    <aside className={`child-sidebar${isOpen ? ' child-sidebar--open' : ''}`}>
      <div className="child-sidebar-brand">
        <span className="child-sidebar-mascot">⭐</span>
        <div>
          <div className="child-sidebar-title">ItsTimeDoLearn</div>
          <div className="child-sidebar-subtitle">Aventuras de aprendizado</div>
        </div>
      </div>

      <div className="child-sidebar-player">
        <div className={`child-sidebar-avatar player-avatar--${ci}`}>{icon}</div>
        <div>
          <div className="child-sidebar-playername">{childName}</div>
          <div className="child-sidebar-playerdetail">Aventureiro ✨</div>
        </div>
      </div>

      <nav className="child-sidebar-nav">
        <NavLink to="/" end
          className={({ isActive }) => `child-nav-item${isActive ? ' child-nav-item--active' : ''}`}
          onClick={onClose}>
          <span className="child-nav-icon">🏠</span>
          <span className="child-nav-label">Início</span>
        </NavLink>

        <NavLink to={`/children/${childId}`} end
          className={({ isActive }) => `child-nav-item${isActive ? ' child-nav-item--active' : ''}`}
          onClick={onClose}>
          <span className="child-nav-icon">🎮</span>
          <span className="child-nav-label">Jogos</span>
        </NavLink>

        <NavLink to={`/children/${childId}/trail`}
          className={({ isActive }) => `child-nav-item${isActive ? ' child-nav-item--active' : ''}`}
          onClick={onClose}>
          <span className="child-nav-icon">🗺️</span>
          <span className="child-nav-label">Jornada</span>
        </NavLink>

        <NavLink to={`/children/${childId}/trail`}
          className="child-nav-item"
          onClick={onClose}>
          <span className="child-nav-icon">🏆</span>
          <span className="child-nav-label">Conquistas</span>
        </NavLink>
      </nav>

      <div className="child-sidebar-footer">
        <NavLink
          to={`/children/${childId}/caregiver`}
          className="child-caregiver-btn"
          onClick={onClose}
        >
          <span>👨‍👩‍👧</span>
          <span>Responsável</span>
        </NavLink>
      </div>
    </aside>
  );
};
