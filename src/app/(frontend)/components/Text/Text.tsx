import React from 'react'
import styles from './Text.module.css'

type TextColor = 'black' | 'primary'
type TextProps = {
  children: React.ReactNode
  color?: TextColor
  className?: string
}

const createTextComponent = (Component: React.ElementType, defaultClassName: string) => {
  const TextComponent: React.FC<TextProps> = ({ children, className = '' }) => {
    return <Component className={`${defaultClassName} ${className}`}>{children}</Component>
  }
  return TextComponent
}

export const Heading1 = createTextComponent('h1', styles.heading1)
export const Heading2 = createTextComponent('h2', styles.heading2)
export const Heading3 = createTextComponent('h3', styles.heading3)
export const Heading4 = createTextComponent('h4', styles.heading4)
export const Body = createTextComponent('p', styles.body)
export const Small = createTextComponent('small', styles.small)
export const SectionTitle = createTextComponent('h2', styles.sectionTitle)
