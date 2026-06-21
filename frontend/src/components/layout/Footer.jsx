import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const CATEGORIES = [
  { key: 'almonds',    label: 'Premium Almonds' },
  { key: 'cashews',    label: 'Creamy Cashews' },
  { key: 'pistachios', label: 'Salted Pistachios' },
  { key: 'walnuts',    label: 'Rich Walnuts' },
  { key: 'raisins',    label: 'Organic Raisins & Dates' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.logo}>🌰 Nectar &amp; Nut</span>
          <p className={styles.tagline}>
            Harvesting nature's finest dry fruits, nuts, and organic seeds direct from our orchards.
            Savor the crunchy goodness packed with vital nutrients.
          </p>
          <div className={styles.socials}>
            {['fb', 'ig', 'tw', 'yt'].map(s => (
              <a href="#" key={s} className={styles.social}>
                {s === 'fb' && <FbIcon />}
                {s === 'ig' && <IgIcon />}
                {s === 'tw' && <TwIcon />}
                {s === 'yt' && <YtIcon />}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h6 className={styles.heading}>Quick Links</h6>
          <ul className={styles.links}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Our Catalogue</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h6 className={styles.heading}>Shop By Category</h6>
          <ul className={styles.links}>
            {CATEGORIES.map(c => (
              <li key={c.key}>
                <Link to={`/products?category=${c.key}`}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h6 className={styles.heading}>Support &amp; Info</h6>
          <ul className={styles.links}>
            <li><a href="/terms/">Terms &amp; Conditions</a></li>
            <li><a href="/privacy/">Privacy Policy</a></li>
            <li><a href="/refund/">Refund Policy</a></li>
          </ul>
          <div className={styles.contact}>
            <p>✉️ hello@nectarnut.in</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 Kashmir / Chennai, India</p>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© 2026 Nectar &amp; Nut. All rights reserved.</p>
        <div className={styles.badges}>
          <span>🔒 Secure Checkout</span>
          <span>💳 Razorpay</span>
          <span>🚚 Express Shipping</span>
        </div>
      </div>
    </footer>
  )
}

const FbIcon = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
const IgIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
const TwIcon = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
const YtIcon = () => <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
