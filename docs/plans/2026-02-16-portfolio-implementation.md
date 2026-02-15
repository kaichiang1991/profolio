# Kai Portfolio - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a minimalist modern portfolio website for Kai based on the design spec at `docs/plans/2026-02-16-portfolio-design.md`.

**Architecture:** Single-page application using React 19 with HashRouter for GitHub Pages compatibility. Tailwind CSS v4 for styling with custom font configuration. Static data files for projects and experience content.

**Tech Stack:** Vite 7 + React 19 + TypeScript + Tailwind CSS v4 + React Router v7 (HashRouter) + Lucide React

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install runtime dependencies**

Run:
```bash
npm install react-router-dom lucide-react
```

**Step 2: Install Tailwind CSS v4 + Vite plugin**

Run:
```bash
npm install -D tailwindcss @tailwindcss/vite
```

**Step 3: Verify installation**

Run: `npm ls react-router-dom lucide-react tailwindcss @tailwindcss/vite`
Expected: All packages listed without errors

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add tailwind css v4, react-router, lucide-react"
```

---

### Task 2: Configure Tailwind CSS v4 + Fonts + Base Styles

**Files:**
- Modify: `src/index.css` (replace entirely)
- Modify: `index.html` (add font link, update lang/title)
- Modify: `vite.config.ts` (add Tailwind plugin)
- Delete: `src/App.css` (no longer needed)

**Step 1: Update `vite.config.ts` to add Tailwind plugin**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/kai-profolio/',
  plugins: [react(), tailwindcss()],
})
```

**Step 2: Replace `src/index.css` with Tailwind v4 imports and custom theme**

```css
@import "tailwindcss";

@theme {
  --font-heading: "Space Grotesk", sans-serif;
  --font-body: "Archivo", sans-serif;
}

body {
  font-family: var(--font-body);
  background-color: #fafafa;
  color: #09090b;
  line-height: 1.6;
  margin: 0;
  min-height: 100vh;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: 1.2;
}
```

**Step 3: Update `index.html`**

- Change `<html lang="en">` to `<html lang="zh-Hant">`
- Add Google Fonts link in `<head>`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  ```
- Update `<title>` to `Kai | Full-Stack Developer`

**Step 4: Delete `src/App.css`**

Remove the file — all styling will be done via Tailwind utility classes.

**Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds without errors

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: configure tailwind css v4, fonts, and base styles"
```

---

### Task 3: Set Up Routing + App Shell

**Files:**
- Modify: `src/App.tsx` (replace entirely)
- Modify: `src/main.tsx` (wrap with HashRouter)
- Create: `src/pages/Home.tsx` (placeholder)
- Create: `src/pages/Projects.tsx` (placeholder)
- Create: `src/pages/Experience.tsx` (placeholder)
- Create: `src/pages/Contact.tsx` (placeholder)

**Step 1: Create placeholder pages**

Each page should be a simple component with the page name as heading:

`src/pages/Home.tsx`:
```tsx
export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold">Home</h1>
    </main>
  )
}
```

Same pattern for `Projects.tsx`, `Experience.tsx`, `Contact.tsx` (each with their own name).

**Step 2: Update `src/main.tsx` with HashRouter**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
```

**Step 3: Update `src/App.tsx` with routes**

```tsx
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
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds without errors

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: set up hash router with placeholder pages"
```

---

### Task 4: Create Data Files

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/data/experience.ts`

**Step 1: Create `src/data/projects.ts`**

```ts
export interface Project {
  title: string
  description: string
  tech: string[]
  github?: string
  demo?: string
}

export const projects: Project[] = [
  {
    title: "Portfolio Website",
    description: "A minimalist portfolio built with React and Tailwind CSS, deployed on GitHub Pages.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    github: "https://github.com/kai/kai-profolio",
  },
]
```

**Step 2: Create `src/data/experience.ts`**

```ts
export interface Experience {
  company: string
  title: string
  period: string
  description: string
}

export const experiences: Experience[] = [
  {
    company: "Company Name",
    title: "Full-Stack Developer",
    period: "2024 - Present",
    description: "Building web applications with TypeScript, React, and Node.js.",
  },
]
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: add project and experience data files"
```

---

### Task 5: Create Navbar Component

**Files:**
- Create: `src/components/Navbar.tsx`
- Modify: `src/App.tsx` (add Navbar to layout)

**Step 1: Create `src/components/Navbar.tsx`**

Floating navbar as described in design spec:
- Floating with `fixed top-4 left-4 right-4`
- `bg-white/80 backdrop-blur` with `rounded-full`
- Left: name/logo link, Right: nav links
- Mobile: hamburger menu with `Menu` / `X` icons from Lucide React
- Use `NavLink` from react-router-dom for active state styling

```tsx
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
```

**Step 2: Update `src/App.tsx` to include Navbar with scroll padding**

```tsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import Home from './pages/Home.tsx'
import Projects from './pages/Projects.tsx'
import Experience from './pages/Experience.tsx'
import Contact from './pages/Contact.tsx'

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
    </div>
  )
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/App.tsx
git commit -m "feat: add floating navbar with mobile hamburger menu"
```

---

### Task 6: Create Footer Component

**Files:**
- Create: `src/components/Footer.tsx`
- Modify: `src/App.tsx` (add Footer)

**Step 1: Create `src/components/Footer.tsx`**

Simple footer with copyright and social links:

```tsx
import { Github, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Kai. All rights reserved.
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

**Step 2: Add Footer to `src/App.tsx`**

Import and add `<Footer />` after `</Routes>`.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/Footer.tsx src/App.tsx
git commit -m "feat: add footer with social links"
```

---

### Task 7: Build Home Page (Hero Section)

**Files:**
- Modify: `src/pages/Home.tsx` (replace placeholder)

**Step 1: Implement Home page**

Hero section per design spec:
- Title: `text-5xl md:text-7xl font-bold` (Space Grotesk via font-heading)
- Subtitle: `text-xl text-zinc-700` (Archivo via font-body)
- Skill tags: `rounded-full border border-zinc-200 px-4 py-1.5`
- CTA button: `bg-zinc-950 text-white rounded-full px-6 py-3`

```tsx
import { Github } from 'lucide-react'

const skills = [
  'TypeScript', 'React', 'Node.js', 'Next.js',
  'Tailwind CSS', 'PostgreSQL', 'Docker', 'AWS',
]

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight">
            Hi, I'm Kai
          </h1>
          <p className="text-xl text-zinc-700 max-w-[65ch]">
            Full-stack developer specializing in TypeScript. I build clean, performant web applications with modern tools and best practices.
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
            GitHub
          </a>
          <a
            href="#/projects"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-950 hover:border-blue-600 transition-colors duration-200"
          >
            View Projects
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
git commit -m "feat: build home page with hero section"
```

---

### Task 8: Build Projects Page

**Files:**
- Modify: `src/pages/Projects.tsx` (replace placeholder)

**Step 1: Implement Projects page**

Project cards per design spec:
- `bg-white rounded-2xl border border-zinc-200`
- `hover:border-blue-600 transition-colors duration-200`
- Tech tags as small pills
- Grid layout: single column on mobile, 2 columns on tablet+

```tsx
import { ExternalLink, Github } from 'lucide-react'
import { projects } from '../data/projects.ts'

export default function Projects() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Projects
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        A selection of projects I've built and contributed to.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <article
            key={project.title}
            className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-blue-600 transition-colors duration-200 cursor-pointer flex flex-col gap-4"
          >
            <h2 className="font-heading text-xl font-semibold">{project.title}</h2>
            <p className="text-zinc-700 text-sm leading-relaxed flex-1">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
                >
                  {t}
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
                  Code
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
                  Demo
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
git commit -m "feat: build projects page with card grid"
```

---

### Task 9: Build Experience Page

**Files:**
- Modify: `src/pages/Experience.tsx` (replace placeholder)

**Step 1: Implement Experience page**

Timeline per design spec:
- Vertical line: `border-l-2 border-zinc-200`
- Dot marker: `w-3 h-3 rounded-full bg-blue-600`
- Each entry: company, title, date range, description

```tsx
import { experiences } from '../data/experience.ts'

export default function Experience() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Experience
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        My professional journey so far.
      </p>

      <div className="relative border-l-2 border-zinc-200 ml-3">
        {experiences.map((exp, i) => (
          <div key={i} className="relative pl-8 pb-12 last:pb-0">
            {/* Dot marker */}
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-blue-600" />

            <p className="text-sm text-zinc-500 mb-1">{exp.period}</p>
            <h2 className="font-heading text-xl font-semibold">{exp.title}</h2>
            <p className="text-blue-600 font-medium text-sm mb-2">{exp.company}</p>
            <p className="text-zinc-700 text-sm leading-relaxed max-w-[65ch]">
              {exp.description}
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
git commit -m "feat: build experience page with timeline"
```

---

### Task 10: Build Contact Page

**Files:**
- Modify: `src/pages/Contact.tsx` (replace placeholder)

**Step 1: Implement Contact page**

Social links page (GitHub, Email) with clean minimal layout:

```tsx
import { Github, Mail } from 'lucide-react'

const contacts = [
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/kai',
    description: 'Check out my open source work',
  },
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:hello@kai.dev',
    description: 'Get in touch directly',
  },
]

export default function Contact() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Contact
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        Feel free to reach out. I'm always open to new opportunities and collaborations.
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
git commit -m "feat: build contact page with social links"
```

---

### Task 11: Cleanup + Final Verification

**Files:**
- Delete: `src/assets/react.svg` (unused)
- Delete: `public/vite.svg` (unused)
- Modify: `public/` — optionally add a favicon later

**Step 1: Remove unused Vite template assets**

Delete `src/assets/react.svg` and `public/vite.svg`.

**Step 2: Update `index.html` favicon reference**

Remove the `<link rel="icon" type="image/svg+xml" href="/vite.svg" />` line or replace with a simple emoji favicon:
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>K</text></svg>">
```

**Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

**Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Manual verification**

Run: `npm run preview`
Expected: Site loads at localhost, all 4 pages accessible via navigation, responsive layout works.

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: clean up unused template files and finalize"
```
