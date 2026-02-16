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
    github: 'https://github.com/kaichiang1991/kai-profolio',
  },
]
