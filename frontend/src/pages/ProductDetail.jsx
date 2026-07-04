import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProductsStore, useCartStore } from '@/store'
import { ProductCard } from '@/components/ui/ProductCard'
import { motion } from 'framer-motion'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { fetchProductDetail, currentProduct, relatedProducts, productLoading } = useProductsStore()
  const { addToCart } = useCartStore()
  
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeImage, setActiveImage] = useState('')

  useEffect(() => {
    fetchProductDetail(id)
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (currentProduct?.images?.length > 0) {
      setActiveImage(currentProduct.images[0])
    }
  }, [currentProduct])

  if (productLoading || !currentProduct) {
    return (
      <div className={styles.loaderPage}>
        <div className={styles.spinner}></div>
        <span>Unveiling Quality...</span>
      </div>
    )
  }

  const handleAdd = async () => {
    await addToCart(currentProduct.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className={styles.page}>
      
      {/* ── SPLIT LAYOUT HERO ── */}
      <div className={styles.splitContainer}>
        
        {/* Left: Sticky Image Gallery */}
        <div className={styles.galleryCol}>
          <motion.div 
            className={styles.mainImageWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {activeImage ? (
              <img src={activeImage} alt={currentProduct.name} className={styles.mainImage} />
            ) : (
              <div className={styles.placeholder}>No Image</div>
            )}
            <div className={styles.imageOverlay}></div>
          </motion.div>
          
          {currentProduct.images?.length > 1 && (
            <div className={styles.thumbnails}>
              {currentProduct.images.map((img, i) => (
                <div 
                  key={i} 
                  className={`${styles.thumb} ${activeImage === img ? styles.activeThumb : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`Thumbnail ${i+1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className={styles.detailsCol}>
          <motion.div 
            className={styles.detailsContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className={styles.categoryLine}>{currentProduct.category_display}</span>
            <h1 className={styles.title}>{currentProduct.name}</h1>
            
            <div className={styles.ratingRow}>
              <span className={styles.stars}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={i <= Math.round(currentProduct.avg_rating) ? styles.starFill : styles.starEmpty}>★</span>
                ))}
              </span>
              <span className={styles.reviews}>({currentProduct.review_count} Reviews)</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.priceRow}>
              {currentProduct.is_discount && (
                <span className={styles.origPrice}>₹{currentProduct.price}</span>
              )}
              <span className={styles.sellPrice}>₹{currentProduct.display_price}</span>
            </div>

            <p className={styles.description}>{currentProduct.description}</p>

            {/* Actions */}
            <div className={styles.actionsBox}>
              {currentProduct.is_in_stock ? (
                <div className={styles.actionRow}>
                  <div className={styles.qtyBox}>
                    <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(qty + 1)}>+</button>
                  </div>
                  <button 
                    className={`${styles.addBtn} ${added ? styles.added : ''}`}
                    onClick={handleAdd}
                  >
                    {added ? 'Added ✓' : 'Add to Cart +'}
                  </button>
                </div>
              ) : (
                <div className={styles.outOfStock}>Currently Out of Stock</div>
              )}
            </div>
            
            <div className={styles.metaList}>
              <p><span>Availability:</span> {currentProduct.is_in_stock ? 'In Stock' : 'Out of Stock'}</p>
              <p><span>Sourcing:</span> Certified Organic Heritage Farms</p>
              <p><span>Packaging:</span> Premium Vacuum Sealed Bento</p>
            </div>
            
          </motion.div>
        </div>
      </div>

      {/* ── TASTING NOTES SECTION ── */}
      <section className={styles.notesSection}>
        <div className={styles.notesContainer}>
          <motion.div 
            className={styles.notesHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Tasting Notes & Pairings</h2>
            <p>Experience the multi-dimensional flavor profile of our finest harvest.</p>
          </motion.div>

          <div className={styles.notesGrid}>
            <div className={styles.noteCard}>
              <span className={styles.noteIcon}>👅</span>
              <h4>Flavor Profile</h4>
              <p>Rich, buttery texture with subtle earthy undertones and a delicate natural sweetness.</p>
            </div>
            <div className={styles.noteCard}>
              <span className={styles.noteIcon}>🍷</span>
              <h4>Ideal Pairing</h4>
              <p>Perfect alongside aged cheeses, robust red wines, or as a standalone midnight snack.</p>
            </div>
            <div className={styles.noteCard}>
              <span className={styles.noteIcon}>✨</span>
              <h4>Health Benefit</h4>
              <p>Abundant in heart-healthy monounsaturated fats, antioxidants, and essential minerals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CULINARY INSPIRATION SECTION ── */}
      <section className={styles.culinarySection}>
        <div className={styles.culinaryContent}>
          <motion.div 
            className={styles.culImageCol}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src="/animations/product_culinary.png" alt="Culinary Inspiration" className={styles.culImage} />
          </motion.div>
          <motion.div 
            className={styles.culTextCol}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className={styles.culTitle}>Culinary<br/><em>Inspiration.</em></h2>
            <p className={styles.culDesc}>
              Beyond snacking, our premium dry fruits and nuts are the secret ingredient to elevating your culinary creations. From exquisite dark chocolate tarts to savory Moroccan tagines, they add a layer of texture, richness, and depth that ordinary ingredients simply cannot match.
            </p>
            <p className={styles.culDesc}>
              Discover a new world of gastronomy and let your creativity flourish with the finest nature has to offer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── RELATED PRODUCTS ── */}
      {relatedProducts?.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.relatedContainer}>
            <h2 className={styles.relatedTitle}>You May Also Like</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((prod, i) => (
                <motion.div 
                  key={prod.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={prod} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
