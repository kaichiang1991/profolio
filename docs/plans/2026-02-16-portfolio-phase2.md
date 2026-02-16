# Portfolio Phase 2: i18n + Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add lightweight i18n infrastructure (zh/en, default zh) and build all 4 pages with bilingual support.

**Architecture:** React Context-based i18n with typed translation files. No external i18n library. Language preference stored in localStorage.

**Tech Stack:** React 19 Context API, TypeScript strict typing

---

### Task 1: Create i18n Infrastructure

**Files:**
- Create: `src/i18n/types.ts`
- Create: `src/i18n/zh.ts`
- Create: `src/i18n/en.ts`
- Create: `src/i18n/LanguageContext.tsx`
- Create: `src/i18n/index.ts`
- Modify: `src/main.tsx` (wrap with LanguageProvider)

**Step 1: Create `src/i18n/types.ts`**

```ts
export type Locale = 'zh' | 'en'

export interface Translations {
  nav: {
    home: string
    projects: string
    experience: string
    contact: string
  }
  hero: {
    greeting: string
    subtitle: string
    viewProjects: string
    github: string
  }
  projects: {
    title: string
    subtitle: string
    code: string
    demo: string
  }
  experience: {
    title: string
    subtitle: string
  }
  contact: {
    title: string
    subtitle: string
    github: string
    githubDesc: string
    email: string
    emailDesc: string
  }
  footer: {
    rights: string
  }
}
```

**Step 2: Create `src/i18n/zh.ts`**

```ts
import type { Translations } from './types.ts'

const zh: Translations = {
  nav: {
    home: '首頁',
    projects: '作品集',
    experience: '經歷',
    contact: '聯繫',
  },
  hero: {
    greeting: '嗨，我是 Kai',
    subtitle: '專注於 TypeScript 的全端開發者。我使用現代工具與最佳實踐，打造乾淨且高效能的網頁應用程式。',
    viewProjects: '查看作品',
    github: 'GitHub',
  },
  projects: {
    title: '作品集',
    subtitle: '我建構和參與的精選專案。',
    code: '程式碼',
    demo: '展示',
  },
  experience: {
    title: '經歷',
    subtitle: '我的專業旅程。',
  },
  contact: {
    title: '聯繫',
    subtitle: '歡迎與我聯繫，我隨時樂於接受新的機會與合作。',
    github: 'GitHub',
    githubDesc: '查看我的開源作品',
    email: 'Email',
    emailDesc: '直接與我聯繫',
  },
  footer: {
    rights: '版權所有',
  },
}

export default zh
```

**Step 3: Create `src/i18n/en.ts`**

```ts
import type { Translations } from './types.ts'

const en: Translations = {
  nav: {
    home: 'Home',
    projects: 'Projects',
    experience: 'Experience',
    contact: 'Contact',
  },
  hero: {
    greeting: "Hi, I'm Kai",
    subtitle: 'Full-stack developer specializing in TypeScript. I build clean, performant web applications with modern tools and best practices.',
    viewProjects: 'View Projects',
    github: 'GitHub',
  },
  projects: {
    title: 'Projects',
    subtitle: "A selection of projects I've built and contributed to.",
    code: 'Code',
    demo: 'Demo',
  },
  experience: {
    title: 'Experience',
    subtitle: 'My professional journey so far.',
  },
  contact: {
    title: 'Contact',
    subtitle: "Feel free to reach out. I'm always open to new opportunities and collaborations.",
    github: 'GitHub',
    githubDesc: 'Check out my open source work',
    email: 'Email',
    emailDesc: 'Get in touch directly',
  },
  footer: {
    rights: 'All rights reserved',
  },
}

export default en
```

**Step 4: Create `src/i18n/LanguageContext.tsx`**

```tsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Locale, Translations } from './types.ts'
import zh from './zh.ts'
import en from './en.ts'

const translations: Record<Locale, Translations> = { zh, en }

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLocale(): Locale {
  const saved = localStorage.getItem('lang')
  if (saved === 'zh' || saved === 'en') return saved
  return 'zh'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('lang', newLocale)
    document.documentElement.lang = newLocale === 'zh' ? 'zh-Hant' : 'en'
  }, [])

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: translations[locale],
  }), [locale, setLocale])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
```

**Step 5: Create `src/i18n/index.ts`**

```ts
export { LanguageProvider, useLanguage } from './LanguageContext.tsx'
export type { Locale, Translations } from './types.ts'
```

**Step 6: Update `src/main.tsx`**

Wrap the app with LanguageProvider (inside HashRouter, outside App):

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { LanguageProvider } from './i18n/index.ts'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </HashRouter>
  </StrictMode>,
)
```

**Step 7: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 8: Commit**

```bash
git add src/i18n/ src/main.tsx
git commit -m "feat: add i18n infrastructure with zh/en translations"
```

---

### Task 2: Update Data Files for Bilingual Support

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/data/experience.ts`

**Step 1: Update `src/data/projects.ts`**

```ts
export interface Project {
  title: { zh: string; en: string }
  description: { zh: string; en: string }
  tech: string[]
  github?: string
  demo?: string
}

export const projects: Project[] = [
  {
    title: {
      zh: '個人作品集網站',
      en: 'Portfolio Website',
    },
    description: {
      zh: '使用 React 和 Tailwind CSS 打造的極簡作品集，部署於 GitHub Pages。',
      en: 'A minimalist portfolio built with React and Tailwind CSS, deployed on GitHub Pages.',
    },
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    github: 'https://github.com/kai/kai-profolio',
  },
]
```

**Step 2: Update `src/data/experience.ts`**

```ts
export interface Experience {
  company: string
  title: { zh: string; en: string }
  period: string
  description: { zh: string; en: string }
}

export const experiences: Experience[] = [
  {
    company: 'Company Name',
    title: {
      zh: '全端工程師',
      en: 'Full-Stack Developer',
    },
    period: '2024 - Present',
    description: {
      zh: '使用 TypeScript、React 和 Node.js 開發網頁應用程式。',
      en: 'Building web applications with TypeScript, React, and Node.js.',
    },
  },
]
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: update data files with bilingual fields"
```

---

### Task 3: Update Navbar with i18n + Language Toggle

**Files:**
- Modify: `src/components/Navbar.tsx`

**Step 1: Update Navbar to use i18n and add language toggle**

```tsx
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
        <NavLink to="/" className="font-heading text-lg font-bold tracking-tight" onClick={() => setOpen(false)}>
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
                  isActive ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-950'
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
                  isActive ? 'text-zinc-950' : 'text-zinc-500 hover:text-zinc-950'
                }`
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => { setLocale(locale === 'zh' ? 'en' : 'zh'); setOpen(false) }}
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
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add language toggle to navbar with i18n support"
```

---

### Task 4: Update Footer with i18n

**Files:**
- Modify: `src/components/Footer.tsx`

**Step 1: Update Footer to use translations**

```tsx
import { Github, Mail } from 'lucide-react'
import { useLanguage } from '../i18n/index.ts'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-zinc-200 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Kai. {t.footer.rights}.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/kai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-950 transition-colors duration-200"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="mailto:hello@kai.dev"
            className="text-zinc-500 hover:text-zinc-950 transition-colors duration-200"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: update footer with i18n support"
```

---

### Task 5: Build Home Page (Hero)

**Files:**
- Modify: `src/pages/Home.tsx` (replace placeholder)

**Step 1: Implement Home page with i18n**

```tsx
import { Github } from 'lucide-react'
import { useLanguage } from '../i18n/index.ts'

const skills = [
  'TypeScript', 'React', 'Node.js', 'Next.js',
  'Tailwind CSS', 'PostgreSQL', 'Docker', 'AWS',
]

export default function Home() {
  const { t } = useLanguage()

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight">
            {t.hero.greeting}
          </h1>
          <p className="text-xl text-zinc-700 max-w-[65ch]">
            {t.hero.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-700"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com/kai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-zinc-950 text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-zinc-800 transition-colors duration-200"
          >
            <Github size={18} />
            {t.hero.github}
          </a>
          <a
            href="#/projects"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-950 hover:border-blue-600 transition-colors duration-200"
          >
            {t.hero.viewProjects}
          </a>
        </div>
      </section>
    </main>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: build home page with hero section and i18n"
```

---

### Task 6: Build Projects Page

**Files:**
- Modify: `src/pages/Projects.tsx` (replace placeholder)

**Step 1: Implement Projects page with i18n**

```tsx
import { ExternalLink, Github } from 'lucide-react'
import { useLanguage } from '../i18n/index.ts'
import { projects } from '../data/projects.ts'

export default function Projects() {
  const { locale, t } = useLanguage()

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t.projects.title}
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        {t.projects.subtitle}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <article
            key={project.title[locale]}
            className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-blue-600 transition-colors duration-200 cursor-pointer flex flex-col gap-4"
          >
            <h2 className="font-heading text-xl font-semibold">{project.title[locale]}</h2>
            <p className="text-zinc-700 text-sm leading-relaxed flex-1">
              {project.description[locale]}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-950 transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={16} />
                  {t.projects.code}
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-950 transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} />
                  {t.projects.demo}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/pages/Projects.tsx
git commit -m "feat: build projects page with card grid and i18n"
```

---

### Task 7: Build Experience Page

**Files:**
- Modify: `src/pages/Experience.tsx` (replace placeholder)

**Step 1: Implement Experience page with i18n**

```tsx
import { useLanguage } from '../i18n/index.ts'
import { experiences } from '../data/experience.ts'

export default function Experience() {
  const { locale, t } = useLanguage()

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t.experience.title}
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        {t.experience.subtitle}
      </p>

      <div className="relative border-l-2 border-zinc-200 ml-3">
        {experiences.map((exp, i) => (
          <div key={i} className="relative pl-8 pb-12 last:pb-0">
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-blue-600" />
            <p className="text-sm text-zinc-500 mb-1">{exp.period}</p>
            <h2 className="font-heading text-xl font-semibold">{exp.title[locale]}</h2>
            <p className="text-blue-600 font-medium text-sm mb-2">{exp.company}</p>
            <p className="text-zinc-700 text-sm leading-relaxed max-w-[65ch]">
              {exp.description[locale]}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/pages/Experience.tsx
git commit -m "feat: build experience page with timeline and i18n"
```

---

### Task 8: Build Contact Page

**Files:**
- Modify: `src/pages/Contact.tsx` (replace placeholder)

**Step 1: Implement Contact page with i18n**

```tsx
import { Github, Mail } from 'lucide-react'
import { useLanguage } from '../i18n/index.ts'

export default function Contact() {
  const { t } = useLanguage()

  const contacts = [
    {
      icon: Github,
      label: t.contact.github,
      href: 'https://github.com/kai',
      description: t.contact.githubDesc,
    },
    {
      icon: Mail,
      label: t.contact.email,
      href: 'mailto:hello@kai.dev',
      description: t.contact.emailDesc,
    },
  ]

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t.contact.title}
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        {t.contact.subtitle}
      </p>

      <div className="flex flex-col gap-4 max-w-md">
        {contacts.map(({ icon: Icon, label, href, description }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="flex items-center gap-4 bg-white rounded-2xl border border-zinc-200 p-5 hover:border-blue-600 transition-colors duration-200 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-blue-50 transition-colors duration-200">
              <Icon size={20} className="text-zinc-700 group-hover:text-blue-600 transition-colors duration-200" />
            </div>
            <div>
              <p className="font-medium text-sm">{label}</p>
              <p className="text-zinc-500 text-sm">{description}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/pages/Contact.tsx
git commit -m "feat: build contact page with social links and i18n"
```

---

### Task 9: Cleanup + Final Verification

**Files:**
- Delete: `src/assets/react.svg`
- Delete: `public/vite.svg`
- Modify: `index.html` (update favicon)

**Step 1: Remove unused Vite template assets**

Delete `src/assets/react.svg` and `public/vite.svg`.

**Step 2: Update favicon in `index.html`**

Replace the vite favicon link with:
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>K</text></svg>">
```

**Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

**Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: clean up unused template files and finalize"
```
