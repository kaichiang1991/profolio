# Kai Portfolio - Design Document

## Overview

Minimalist modern portfolio for Kai, a full-stack developer specializing in TypeScript.

- **Tech Stack**: Vite + React 19 + TypeScript + Tailwind CSS v4 + React Router v7 (HashRouter)
- **Deploy**: GitHub Pages (gh-pages)
- **Style**: Minimalism & Swiss Style

## Pages & Routes

| Route | Page | Content |
|-------|------|---------|
| `/` | Home | Hero: name, title, intro, GitHub link, skill tags |
| `/projects` | Projects | Project cards with title, description, tech tags, links |
| `/experience` | Experience | Timeline-style work history |
| `/contact` | Contact | Social links (GitHub, Email) |

## Color System

| Role | Hex | Tailwind |
|------|-----|----------|
| Background | `#FAFAFA` | `zinc-50` |
| Primary Text | `#09090B` | `zinc-950` |
| Secondary Text | `#3F3F46` | `zinc-700` |
| Accent / CTA | `#2563EB` | `blue-600` |
| Border | `#E4E4E7` | `zinc-200` |
| Card Background | `#FFFFFF` | `white` |

## Typography

- **Headings**: Space Grotesk (300-700)
- **Body**: Archivo (300-700)
- **Line height**: Body 1.6, Headings 1.2
- **Max line width**: 65-75 characters

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap
```

## Spacing

- Section gaps: `py-20` (80px)
- Card gaps: `gap-6` (24px)
- Container: `max-w-6xl` (1152px), centered
- Navbar height: 64px

## Component Specs

### Navbar
- Floating: `top-4 left-4 right-4`, `bg-white/80 backdrop-blur`, `rounded-full`
- Left: name/logo, Right: nav links
- Mobile: hamburger menu

### Hero (Home)
- Title: `text-5xl md:text-7xl font-bold` (Space Grotesk)
- Subtitle: `text-xl text-zinc-700` (Archivo)
- Skill tags: `rounded-full border border-zinc-200 px-4 py-1.5`
- CTA buttons: `bg-zinc-950 text-white rounded-full px-6 py-3`

### Project Cards
- `bg-white rounded-2xl border border-zinc-200`
- Hover: `hover:border-blue-600 transition-colors duration-200`
- Tech tags as small pills
- `cursor-pointer` required

### Experience Timeline
- Vertical line: `border-l-2 border-zinc-200`
- Dot marker: `w-3 h-3 rounded-full bg-blue-600`
- Each entry: company, title, date range, description

## Icons
- Lucide React for UI icons
- Simple Icons SVG for brand logos (GitHub, etc.)
- No emojis as icons

## Animation
- Hover transitions: `duration-200 ease`
- Respect `prefers-reduced-motion`
- No large scale/translate animations

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | 375px | Single column, hamburger menu |
| Tablet | 768px | 2-column grid |
| Desktop | 1024px | Full layout |
| Large | 1440px | Max-width constraint |

## File Structure

```
src/
├── main.tsx
├── App.tsx              # Router setup
├── index.css            # Tailwind imports + fonts
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── pages/
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── Experience.tsx
│   └── Contact.tsx
└── data/
    ├── projects.ts
    └── experience.ts
```
