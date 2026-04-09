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
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  size = 'default',
  fill = 'filled',
  color = 'primary',
  className,
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
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  )
}

export default Button
