import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  style,
  onClick,
  hoverable = false,
}) => {
  const classes = ['card', hoverable ? 'card-hoverable' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style} onClick={onClick} role={onClick ? 'button' : undefined}>
      {children}
    </div>
  );
};
