import React, { useState } from 'react';
import { Outlet, Navigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ChildSidebar } from '../components/layout/ChildSidebar';

export const ChildLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const child = useStore((s) => s.children.find((c) => c.id === id));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!child) return <Navigate to="/" replace />;

  return (
    <div className="child-area-shell">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <ChildSidebar
        childId={child.id}
        childName={child.name}
        childAvatar={child.avatar}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="child-area-content">
        <div className="sidebar-mobile-bar sidebar-mobile-bar--child">
          <button
            className="sidebar-toggle-btn sidebar-toggle-btn--child"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            ☰
          </button>
          <span className="sidebar-mobile-brand">⭐ {child.name}</span>
        </div>
        <div className="game-world-bg" aria-hidden="true">
          <div className="game-world-orb game-world-orb--1" />
          <div className="game-world-orb game-world-orb--2" />
          <div className="game-world-orb game-world-orb--3" />
          <div className="game-world-orb game-world-orb--4" />
          <div className="game-world-orb game-world-orb--5" />
        </div>
        <Outlet />
      </div>
    </div>
  );
};
