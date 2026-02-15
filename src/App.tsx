import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import Home from './pages/Home.tsx'
import Projects from './pages/Projects.tsx'
import Experience from './pages/Experience.tsx'
import Contact from './pages/Contact.tsx'
import Footer from './components/Footer.tsx'

export default function App() {
  return (
    <div className="pt-24">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  )
}
