import React from 'react';
import { Outlet } from 'react-router-dom';

export const GameWorldLayout: React.FC = () => (
  <>
    <div className="game-world-bg" aria-hidden="true">
      <div className="game-world-orb game-world-orb--1" />
      <div className="game-world-orb game-world-orb--2" />
      <div className="game-world-orb game-world-orb--3" />
      <div className="game-world-orb game-world-orb--4" />
      <div className="game-world-orb game-world-orb--5" />
    </div>
    <Outlet />
  </>
);
