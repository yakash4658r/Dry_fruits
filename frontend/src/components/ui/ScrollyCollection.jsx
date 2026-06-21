import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCartStore } from '../../store'
import styles from './ScrollyCollection.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollyCollection({ products, categories }) {
  const sectionRef = useRef(null)
  const panelsRef = useRef([])
  const { addToCart } = useCartStore()

  // Use products if available, fallback to categories
  const items = products && products.length > 0 ? products : categories

  useLayoutEffect(() => {
    if (!items || items.length === 0) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${items.length * 1500}`, // 1500px scroll duration per product
        pin: true,
        scrub: 1,
      }
    })

    // Animation logic
    panelsRef.current.forEach((panel, i) => {
      if (!panel) return

      if (i === 0) {
        // First panel starts visible
        gsap.set(panel, { opacity: 1, visibility: 'visible', x: 0 })
        
        // Pause to play animation (dummy scroll distance)
        tl.to({}, { duration: 1 })
        
        // Slide out to left
        if (items.length > 1) {
          tl.to(panel, { x: '-50%', opacity: 0, duration: 1 }, "out" + i)
        }
      } else {
        // Subsequent panels slide in from right
        tl.fromTo(panel, 
          { x: '50%', opacity: 0, visibility: 'visible' },
          { x: '0%', opacity: 1, duration: 1 },
          "out" + (i - 1) // Slide in exactly when previous slides out
        )
        
        // Pause to play animation
        tl.to({}, { duration: 1 })
        
        // Slide out to left (unless it's the last one)
        if (i < items.length - 1) {
          tl.to(panel, { x: '-50%', opacity: 0, duration: 1 }, "out" + i)
        }
      }
    })

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill()
      tl.kill()
    }
  }, [items])

  if (!items || items.length === 0) return null

  return (
    <section className={styles.scrollySection} ref={sectionRef}>
      <div className={styles.pinContainer}>
        {items.map((item, i) => {
          // Normalize data between product and category fallback
          const isProd = !!item.display_price
          const title = isProd ? item.name : item.label
          const category = isProd ? item.category_display : 'Category'
          const desc = isProd ? item.description : item.desc
          const price = isProd ? `₹${item.display_price}` : 'Explore'

          return (
            <div 
              key={item.id || item.key} 
              className={styles.productPanel}
              ref={el => panelsRef.current[i] = el}
            >
              {/* Left Side: Product Details */}
              <div className={styles.cardSide}>
                <div className={styles.scrollyCard}>
                  <span className={styles.cardCat}>{category}</span>
                  <h3 className={styles.cardName}>{title}</h3>
                  <p className={styles.cardDesc}>
                    {desc?.length > 120 ? desc.slice(0, 120) + '...' : desc}
                  </p>
                  
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>{price}</span>
                    {isProd && (
                      <button 
                        className={styles.addBtn}
                        onClick={() => addToCart(item.id, 1)}
                        title="Add to cart"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Animation Placeholder */}
              <div className={styles.animSide}>
                <div className={styles.animPlaceholder}>
                  <span className={styles.animIcon}>🎬</span>
                  <h4 className={styles.animText}>Animation Space</h4>
                  <p className={styles.animSub}>Your animation for {title} goes here</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
