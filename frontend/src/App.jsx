import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CinematicHome from './pages/CinematicHome'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import Terms from './pages/legal/Terms'
import Refund from './pages/legal/Refund'
import Shipping from './pages/legal/Shipping'
import { useLenis } from './hooks/useLenis'
import './styles/globals.css'

function AppLayout({ children }) {
  useLenis() // Initialize smooth scroll globally

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppLayout>
        <Routes>
          <Route path="/"         element={<CinematicHome />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/my-orders" element={<Dashboard />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms"          element={<Terms />} />
          <Route path="/refund-policy"  element={<Refund />} />
          <Route path="/shipping-policy" element={<Shipping />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
