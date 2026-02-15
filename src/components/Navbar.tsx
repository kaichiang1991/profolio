import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl bg-white/80 backdrop-blur border border-zinc-200 rounded-full px-6 py-3">
      <div className="flex items-center justify-between">
        <NavLink to="/" className="font-heading text-lg font-bold tracking-tight" onClick={() => setOpen(false)}>
          Kai
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-950'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-4 pb-2 flex flex-col gap-3">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium px-2 py-1 transition-colors duration-200 ${
                  isActive ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-950'
                }`
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
