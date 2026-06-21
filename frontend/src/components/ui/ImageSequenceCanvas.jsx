import React, { useRef, useLayoutEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ImageSequenceCanvas({
  folder = '/animations',
  prefix = '',
  padCount = 4,
  extension = '.jpg',
  frameCount = 299,
  triggerElement = '#dusk-section',
  endOffset = '+=4000',
  position = 'fixed',
  zIndex = 0
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  
  // Sequence configuration
  const currentFrame = (index) => `${folder}/${prefix}${index.toString().padStart(padCount, '0')}${extension}`

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const images = []
    
    // Create an object to hold the tweened value
    const sequence = { frame: 0 }

    // Preload images
    let loadedCount = 0
    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.src = currentFrame(i + 1)
      images.push(img)
      img.onload = () => {
        loadedCount++
        if (loadedCount === frameCount) {
          setLoaded(true)
          render()
        }
      }
    }

    // Function to render the current frame to the canvas
    const render = () => {
      const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.round(sequence.frame)))
      const img = images[frameIndex]
      
      if (img && img.complete) {
        // Draw image covering the canvas (like object-fit: cover)
        const canvasRatio = canvas.width / canvas.height
        const imgRatio = img.width / img.height
        
        let drawWidth = canvas.width
        let drawHeight = canvas.height
        let offsetX = 0
        let offsetY = 0

        if (canvasRatio > imgRatio) {
          // Canvas is wider than image (crop top/bottom)
          drawHeight = canvas.width / imgRatio
          offsetY = (canvas.height - drawHeight) / 2
        } else {
          // Canvas is taller than image (Mobile portrait or narrow desktop)
          if (window.innerWidth <= 768) {
            // For mobile, we don't want to crop the sides massively.
            // Match the heroVideo 55% height / 15% top logic.
            drawHeight = canvas.height * 0.55
            drawWidth = drawHeight * imgRatio
            offsetX = (canvas.width - drawWidth) / 2
            offsetY = canvas.height * 0.15
          } else {
            // Normal desktop narrow
            drawWidth = canvas.height * imgRatio
            offsetX = (canvas.width - drawWidth) / 2
          }
        }

        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
      }
    }

    // Handle resizing to keep canvas crisp
    const resizeCanvas = () => {
      // Use window innerWidth/Height for full screen
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      render()
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas() // Initial sizing

    // Set up GSAP ScrollTrigger
    // We want the animation to scrub while the DUSK section is pinned
    const trigger = ScrollTrigger.create({
      trigger: triggerElement,
      start: "top top",
      end: endOffset,
      pin: true,
      scrub: 1, // Smooth scrubbing
      animation: gsap.to(sequence, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render // Use requestAnimationFrame internally in GSAP
      })
    })

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      trigger.kill()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      style={{
        position: position,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: zIndex, // Behind the content
        pointerEvents: 'none', // Don't block clicks on buttons
        background: '#050D0B',
        opacity: loaded ? 1 : 0, // Fully opaque when loaded
        transition: 'opacity 1s ease'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}
