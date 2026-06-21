import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CinematicHome from './pages/CinematicHome'
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
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/"         element={<CinematicHome />} />
          {/* Products, Product detail, etc. can be added here */}
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
