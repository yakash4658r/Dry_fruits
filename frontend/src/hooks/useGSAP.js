import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Animate elements with class "reveal-up/left/right/scale"
 * inside the given container ref when they enter viewport.
 */
export function useScrollReveal(containerRef) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = ['.reveal-up', '.reveal-left', '.reveal-right', '.reveal-scale']
      targets.forEach((sel) => {
        gsap.utils.toArray(sel).forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          })
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [containerRef])
}

/**
 * Horizontal pinned scroll rail (RUBRA-style)
 * Pins the section and scrolls children horizontally
 */
export function useHorizontalScroll(sectionRef, trackRef) {
  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return

    const track   = trackRef.current
    const section = sectionRef.current
    const totalScroll = track.scrollWidth - window.innerWidth

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [sectionRef, trackRef])
}

/**
 * Stacking cards effect (RUBRA-style cards that layer on scroll)
 */
export function useStackingCards(containerRef) {
  useEffect(() => {
    if (!containerRef.current) return
    const cards = containerRef.current.querySelectorAll('.stack-card')
    if (!cards.length) return

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: `top ${120 + i * 20}px`,
          endTrigger: '#stack-end',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
        })

        gsap.fromTo(card,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
            }
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [containerRef])
}
