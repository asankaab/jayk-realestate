import React from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  size?: 'mini';
  variant?: 'default' | 'accent';
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  size,
  variant = 'default',
  className,
}) => {
  const buttonClasses = [
    size === 'mini' ? styles.mini : styles.button,
    variant === 'accent' && styles.accent,
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  );
};

export default Button;
