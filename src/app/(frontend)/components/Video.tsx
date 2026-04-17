'use client'

import React, { useRef, useState } from 'react'
import styles from './Video.module.css'
import { Play } from 'lucide-react'

interface VideoProps {
  url?: string
  className?: string
  hasMedia?: boolean
}

export const Video: React.FC<VideoProps> = ({ url, className, hasMedia }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  if (!url && !hasMedia) {
    return (
      <div className={styles.mediaPlaceholder}>
        <div className={styles.playButton}>
          <Play fill="currentColor" />
        </div>
      </div>
    )
  }

  const combinedClassName = className ? `${styles.video} ${className}` : styles.video

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  return (
    <>
      {url && (
        <video
          ref={videoRef}
          className={combinedClassName}
          width="640"
          height="360"
          controls
          disablePictureInPicture
          loop
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={handlePause}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {(hasMedia || url) && !isPlaying && (
        <div className={styles.playOverlay}>
          <div className={styles.playButton} onClick={handlePlay}>
            <Play fill="currentColor" />
          </div>
        </div>
      )}
    </>
  )
}
