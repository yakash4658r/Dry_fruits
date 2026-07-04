import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, useUserStore } from '../../store'
import CartDrawer from '../ui/CartDrawer'
import SearchOverlay from '../ui/SearchOverlay'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Home',          to: '/' },
  { label: 'Our Catalogue', to: '/products' },
  { label: 'Our Story',     to: '/about' },
  { label: 'Contact',       to: '/contact' },
]

const CATEGORIES = [
  { key: 'almonds',    label: 'Almonds',         icon: '🥜' },
  { key: 'cashews',    label: 'Cashews',         icon: '🌰' },
  { key: 'pistachios', label: 'Pistachios',      icon: '💚' },
  { key: 'walnuts',    label: 'Walnuts',         icon: '🤎' },
  { key: 'raisins',    label: 'Raisins & Dates', icon: '🍇' },
  { key: 'mix_seeds',  label: 'Seeds & Mixes',   icon: '🌱' },
]

export default function Navbar() {
  const { count, fetchCart } = useCartStore()
  const { user, fetchUser }  = useUserStore()
  const location              = useLocation()
  const isHome               = location.pathname === '/'
  
  const [scrolled,    setScrolled]    = useState(false)
  const [catOpen,     setCatOpen]     = useState(false)
  const [userOpen,    setUserOpen]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [cartOpen,    setCartOpen]    = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)

  useEffect(() => { fetchCart(); fetchUser() }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Announcement Bar */}


      <nav className={`${styles.nav} ${isHome ? styles.fixedNav : ''} ${(scrolled || !isHome) ? styles.scrolled : ''}`} id="main-navbar">
        <div className={`container ${styles.inner}`}>

          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🌰</span>
            <span className={styles.logoText}>
              Nectar<span className={styles.logoAccent}>&amp;Nut</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className={styles.navLinks}>
            {NAV_LINKS.slice(0, 1).map(l => (
              <li key={l.to}><Link to={l.to} className={styles.navLink}>{l.label}</Link></li>
            ))}

            {/* Categories dropdown */}
            <li
              className={styles.dropdown}
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className={styles.navLink}>
                Categories <span className={styles.arrow}>▾</span>
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    className={styles.dropMenu}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {CATEGORIES.map(c => (
                      <Link
                        key={c.key}
                        to={`/products?category=${c.key}`}
                        className={styles.dropItem}
                        onClick={() => setCatOpen(false)}
                      >
                        <span>{c.icon}</span> {c.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {NAV_LINKS.slice(1).map(l => (
              <li key={l.to}><Link to={l.to} className={styles.navLink}>{l.label}</Link></li>
            ))}
          </ul>

          {/* Right Icons */}
          <div className={styles.actions}>
            {/* Search */}
            <button className={styles.iconBtn} title="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </button>

            {/* Wishlist */}
            {user?.authenticated && (
              <a href="/wishlist/" className={styles.iconBtn} title="Wishlist">
                <HeartIcon />
              </a>
            )}

            {/* User */}
            {user?.authenticated ? (
              <div
                className={styles.dropdown}
                onMouseEnter={() => setUserOpen(true)}
                onMouseLeave={() => setUserOpen(false)}
              >
                <button className={styles.iconBtn} title="Account">
                  <UserIcon />
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      className={`${styles.dropMenu} ${styles.dropRight}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <span className={styles.dropGreet}>
                        Hi, {user.first_name || user.username}
                      </span>
                      <a href="/my-orders/"     className={styles.dropItem}>📦 My Orders</a>
                      <a href="/wishlist/"      className={styles.dropItem}>❤️ Wishlist</a>
                      {user.is_superuser && <>
                        <div className={styles.dropDivider}/>
                        <a href="/manage/orders/"  className={styles.dropItem}>📊 Order Dashboard</a>
                        <a href="/admin/"          className={styles.dropItem}>⚙️ Admin Panel</a>
                      </>}
                      <div className={styles.dropDivider}/>
                      <a href="/accounts/logout/" className={`${styles.dropItem} ${styles.dropDanger}`}>
                        🚪 Logout
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className={styles.authBtns}>
                <a href="/accounts/login/"  className={styles.loginBtn}>Login</a>
                <a href="/accounts/signup/" className={styles.signupBtn}>Sign Up</a>
              </div>
            )}

            {/* Cart */}
            <button className={styles.cartBtn} title="Cart" onClick={() => setCartOpen(true)}>
              <BagIcon />
              {count > 0 && <span className={styles.cartBadge}>{count}</span>}
            </button>

            {/* Mobile Hamburger */}
            <button className={styles.hamburger} onClick={() => setMobileOpen(o => !o)}>
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <div className={styles.mobileCats}>
                {CATEGORIES.map(c => (
                  <Link
                    key={c.key}
                    to={`/products?category=${c.key}`}
                    className={styles.mobileCatItem}
                    onClick={() => setMobileOpen(false)}
                  >
                    {c.icon} {c.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      
      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

/* Inline SVG Icons */
const SearchIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const HeartIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

const UserIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const BagIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
