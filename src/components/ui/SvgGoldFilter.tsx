"use client"
import React from 'react'

interface SvgGoldFilterProps {
  image: string;
  alt?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const SvgGoldFilter = ({
  image,
  alt = "gold filtered image",
  className = "",
  width = "100%",
  height = "100%"
}: SvgGoldFilterProps) => {
  return (
    <div
      className={`svg-gold-filter ${className}`}
      style={{
        WebkitMask: `url(${image}) no-repeat center`,
        mask: `url(${image}) no-repeat center`,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'inline-block'
      }}
      aria-label={alt}
    />
  )
}

export default SvgGoldFilter
