'use client'
import React, { useState } from 'react'
import type { Media } from '@/payload-types'

interface ImageGalleryProps {
  images: Media[]
  title: string
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    images?.[0]?.url || null,
  )

  return (
    <div>
      <div className="mb-4">
        <img
          src={selectedImage || '/placeholder.jpg'}
          alt={title}
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto">
        {images?.map((image) => (
          <img
            key={image.id}
            src={image.url || '/placeholder.jpg'}
            alt={image.alt}
            className={`w-24 h-24 object-cover rounded-lg cursor-pointer ${
              selectedImage === image.url ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => setSelectedImage(image.url || null)}
          />
        ))}
      </div>
    </div>
  )
}
