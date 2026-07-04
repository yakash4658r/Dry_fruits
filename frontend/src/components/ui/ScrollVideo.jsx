import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollVideo({ 
  src, 
  triggerElement,
  endOffset = "+=4000",
  position = 'absolute',
  zIndex = -1
}) {
  const videoRef = useRef(null)

  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: triggerElement,
      start: "top top",
      end: endOffset,
      pin: true,
      onEnter: () => videoRef.current?.play().catch(() => {}),
      onEnterBack: () => videoRef.current?.play().catch(() => {}),
      onLeave: () => videoRef.current?.pause(),
      onLeaveBack: () => videoRef.current?.pause(),
    })

    ScrollTrigger.refresh()

    return () => {
      st.kill()
    }
  }, [triggerElement, endOffset])

  return (
    <video 
      ref={videoRef}
      src={src}
      preload="auto"
      muted
      loop
      playsInline
      style={{
        position: position,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: zIndex,
        pointerEvents: 'none',
        background: '#050D0B'
      }}
    />
  )
}
