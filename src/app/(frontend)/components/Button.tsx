import React from 'react'
import Link from 'next/link'
import styles from './Button.module.css'

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'color' | 'onClick'
> {
  href?: string
  size?: 'small' | 'default'
  fill?: 'filled' | 'outlined'
  color?: 'primary' | 'accent'
  replace?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  size = 'default',
  fill = 'filled',
  color = 'primary',
  className,
  style,
  type = 'button',
  replace,
  disabled,
  onClick,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${size}`],
    styles[`button--${color}--${fill}`],
    disabled ? styles['button--disabled'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <Link href={href} replace={replace} className={buttonClasses} style={style} onClick={onClick}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      style={style}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
