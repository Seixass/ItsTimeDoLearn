import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, backTo }) => {
  const navigate = useNavigate();
  return (
    <div className="page-header">
      {backTo && (
        <button className="back-btn" onClick={() => navigate(backTo)} aria-label="Voltar">
          ← Voltar
        </button>
      )}
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};
