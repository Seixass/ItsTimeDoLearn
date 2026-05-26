import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const AppNavBar: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <nav className="app-navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-mascot">⭐</span>
        <span className="navbar-brand-text">
          <span className="navbar-brand-name">ItsTimeDoLearn</span>
          <span className="navbar-brand-sub">Aventuras de aprendizado</span>
        </span>
      </Link>
      <div className="navbar-links">
        <Link
          to="/caregivers"
          className={`navbar-link ${pathname.startsWith('/caregivers') ? 'navbar-link--active' : ''}`}
        >
          👥 Responsáveis
        </Link>
        <Link
          to="/references"
          className={`navbar-link ${pathname === '/references' ? 'navbar-link--active' : ''}`}
        >
          📚 Referências
        </Link>
      </div>
    </nav>
  );
};
