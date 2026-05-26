import React from 'react';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'game';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  success:   'btn-success',
  danger:    'btn-danger',
  ghost:     'btn-ghost',
  game:      'btn-game',
};

const sizeClass: Record<Size, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const classes = [
    'btn',
    variantClass[variant],
    sizeClass[size],
    fullWidth ? 'btn-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
