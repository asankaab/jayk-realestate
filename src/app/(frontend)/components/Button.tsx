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
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${size}`],
    styles[`button--${color}--${fill}`],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <Link href={href} className={buttonClasses} style={style}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={buttonClasses} style={style}>
      {children}
    </button>
  )
}

export default Button
