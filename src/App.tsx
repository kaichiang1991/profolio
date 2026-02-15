import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Projects from './pages/Projects.tsx'
import Experience from './pages/Experience.tsx'
import Contact from './pages/Contact.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}
