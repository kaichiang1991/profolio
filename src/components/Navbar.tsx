import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '../i18n/index.ts'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { locale, setLocale, t } = useLanguage()

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/projects', label: t.nav.projects },
    { to: '/experience', label: t.nav.experience },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl bg-white/80 backdrop-blur border border-zinc-200 rounded-full px-6 py-3">
      <div className="flex items-center justify-between">
        <NavLink
          to="/"
          className="font-heading text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          Kai
        </NavLink>

        {/* Desktop links + language toggle */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-950'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors duration-200"
            aria-label="Toggle language"
          >
            {locale === 'zh' ? 'EN' : '中文'}
          </button>
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
                  isActive
                    ? 'text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-950'
                }`
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setLocale(locale === 'zh' ? 'en' : 'zh')
              setOpen(false)
            }}
            className="text-sm font-medium px-2 py-1 text-zinc-500 hover:text-zinc-950 transition-colors duration-200 text-left"
            aria-label="Toggle language"
          >
            {locale === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      )}
    </nav>
  )
}
