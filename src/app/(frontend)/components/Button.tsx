import React from 'react'
import Link from 'next/link'
import styles from './Button.module.css'

type ButtonProps = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  size?: 'small' | 'default'
  fill?: 'filled' | 'outlined'
  color?: 'primary' | 'accent'
  className?: string
  type?: 'submit' | 'button'
  style?: React.CSSProperties
  replace?: boolean
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  size = 'default',
  fill = 'filled',
  color = 'primary',
  className,
  style,
  type = 'button',
  replace,
  disabled,
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
      <Link href={href} replace={replace} className={buttonClasses} style={style}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={buttonClasses} style={style} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button