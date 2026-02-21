import React from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  size?: 'mini';
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ children, href, onClick, size, className }) => {
  const buttonClasses = [
    size === 'mini' ? styles.mini : styles.button,
    className || ''
  ].join(' ');

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
