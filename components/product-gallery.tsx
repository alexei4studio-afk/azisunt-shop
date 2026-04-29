'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-6">
      {/* Thumbnails - Hidden on small mobile, visible on lg */}
      <div className="hidden lg:flex lg:flex-col gap-3 flex-shrink-0">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`relative w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 ${
              selectedIndex === index 
                ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105' 
                : 'opacity-40 hover:opacity-100'
            }`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Carousel Area */}
      <div className="flex-1 relative group">
        <div className="overflow-hidden rounded-[2.5rem] bg-[#1A1A1A] aspect-[4/5] lg:aspect-square" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((image, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full relative">
                <Image
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Indicators (Dots) */}
        <div className="flex lg:hidden justify-center gap-2 mt-6">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                selectedIndex === index ? 'w-8 bg-white' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Badge Overlay */}
        <div className="absolute top-6 left-6">
           <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full border border-white/10 uppercase">
             High Fidelity Gallery
           </span>
        </div>
      </div>
    </div>
  )
}
