'use client'
import React, { useState } from 'react'
import type { Media } from '@/payload-types'
import Image from 'next/image'

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
      <div className="mb-4 relative h-96">
        <Image
          src={selectedImage || '/placeholder.jpg'}
          alt={title}
          className="object-cover rounded-lg"
          fill
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto">
        {images?.map((image) => (
          <Image
            key={image.id}
            src={image.url || '/placeholder.jpg'}
            alt={image.alt}
            width={96}
            height={96}
            className={`object-cover rounded-lg cursor-pointer ${
              selectedImage === image.url ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => setSelectedImage(image.url || null)}
          />
        ))}
      </div>
    </div>
  )
}
