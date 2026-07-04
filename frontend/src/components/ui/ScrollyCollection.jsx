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
        end: `+=${items.length * 1200}`, // 1200px scroll duration per product
        pin: true,
        scrub: 1,
      }
    })

    // Animation logic
    panelsRef.current.forEach((panel, i) => {
      if (!panel) return
      
      const textSide = panel.querySelector(`.${styles.textSide}`)
      const imgSide = panel.querySelector(`.${styles.imageSide}`)

      if (i === 0) {
        // First panel starts visible
        gsap.set(panel, { visibility: 'visible' })
        gsap.set(textSide, { opacity: 1, y: 0 })
        gsap.set(imgSide, { opacity: 1, scale: 1 })
        
        // Pause to play animation (dummy scroll distance)
        tl.to({}, { duration: 1 })
        
        // Slide out
        if (items.length > 1) {
          tl.to(textSide, { y: -80, opacity: 0, duration: 1, ease: "power2.inOut" }, "out" + i)
          tl.to(imgSide, { scale: 1.1, opacity: 0, duration: 1, ease: "power2.inOut" }, "out" + i)
        }
      } else {
        // Subsequent panels start hidden
        gsap.set(panel, { visibility: 'visible' })
        gsap.set(textSide, { opacity: 0, y: 80 })
        gsap.set(imgSide, { opacity: 0, scale: 0.9 })
        
        // Animate IN (sync with previous panel OUT)
        tl.to(textSide, { opacity: 1, y: 0, duration: 1, ease: "power2.inOut" }, "out" + (i - 1))
        tl.to(imgSide, { opacity: 1, scale: 1, duration: 1, ease: "power2.inOut" }, "out" + (i - 1))
        
        // Pause to play animation
        tl.to({}, { duration: 1 })
        
        // Slide out (unless it's the last one)
        if (i < items.length - 1) {
          tl.to(textSide, { opacity: 0, y: -80, duration: 1, ease: "power2.inOut" }, "out" + i)
          tl.to(imgSide, { opacity: 0, scale: 1.1, duration: 1, ease: "power2.inOut" }, "out" + i)
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
          const image = isProd && item.images && item.images.length > 0 ? item.images[0] : '/animations/0292.jpg'

          return (
            <div 
              key={item.id || item.key} 
              className={styles.productPanel}
              ref={el => panelsRef.current[i] = el}
            >
              {/* Left Side: Text */}
              <div className={styles.textSide}>
                <div className={styles.textContent}>
                  <span className={styles.categoryLine}>{category}</span>
                  <h3 className={styles.productTitle}>{title}</h3>
                  <div className={styles.divider}></div>
                  <p className={styles.productDesc}>
                    {desc?.length > 180 ? desc.slice(0, 180) + '...' : desc}
                  </p>
                  
                  <div className={styles.actionRow}>
                    <span className={styles.price}>{price}</span>
                    {isProd ? (
                      <button 
                        className={styles.buyBtn}
                        onClick={() => addToCart(item.id, 1)}
                      >
                        Add to Cart <span>+</span>
                      </button>
                    ) : (
                      <a 
                        href={`/products?category=${item.key}`}
                        className={styles.buyBtn}
                      >
                        Explore <span>→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Image */}
              <div className={styles.imageSide}>
                <div className={styles.imageWrapper}>
                  <img src={image} alt={title} className={styles.heroImg} />
                  <div className={styles.imageOverlay}></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
