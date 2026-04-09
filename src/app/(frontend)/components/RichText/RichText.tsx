import { RichText as RichTextConverter } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import styles from './RichText.module.css'

interface RichTextProps {
  data: SerializedEditorState
  className?: string
}

export function RichText({ data, className = '' }: RichTextProps) {
  if (!data) return null

  return <RichTextConverter data={data} className={`${styles.richText} ${className}`} />
}
