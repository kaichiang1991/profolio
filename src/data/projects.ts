export interface Project {
  title: { zh: string; en: string }
  description: { zh: string; en: string }
  tech: string[]
  github?: string
  isPrivate?: boolean
  externalLink?: string
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
    github: 'https://github.com/kaichiang1991/profolio',
  },
  {
    title: {
      zh: '交易系統後台',
      en: 'Trading System Backend',
    },
    description: {
      zh: '使用 Next.js 打造的交易系統後台，自架於 VPS 上。',
      en: 'A trading system backend built with Next.js, deployed on VPS.',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Docker', 'Postgresql'],
    github: 'https://github.com/kaichiang1991/next14-merchant-system',
    isPrivate: true,
  },
  {
    title: {
      zh: '布穀町活動網站',
      en: 'Boogooteam',
    },
    description: {
      zh: '使用 Next.js 打造的大型前後台網站，包含前台網站、個別活動網站、後台管理系統、管理員管理系統，自架於 VPS 上。',
      en: 'A fullstack system built with Next.js, deployed on VPS.',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Docker', 'Postgresql'],
    github: 'https://github.com/kaichiang1991/next13-boogoo-team',
    isPrivate: true,
    externalLink: 'https://boogooteam.com/zhTW',
  },
  {
    title: {
      zh: 'AI 量產網站系統',
      en: 'AI Production Website System',
    },
    description: {
      zh: '提供使用者利用提示詞生成網站、管理以及產出相關文章的系統，自架於 VPS 上。',
      en: 'A fullstack system allows users to generate websites, manage, and produce related articles using prompts, deployed on VPS.',
    },
    tech: [
      'Next.js',
      'NestJS',
      'TypeScript',
      'Tailwind CSS',
      'Docker',
      'Postgresql',
      'Claude',
    ],
    github: 'https://github.com/kaichiang1991/mono-webgen-ai',
    externalLink: 'https://casinotips.top/login?callbackUrl=/dashboard',
  },
  {
    title: {
      zh: '運動紀錄App',
      en: 'Exercise Record App',
    },
    description: {
      zh: '提供使用者紀錄運動的App，本地部署',
      en: 'A React Native App allows users to record their exercise',
    },
    tech: ['React Native', 'TypeScript', 'sqlite'],
    github: 'https://github.com/kaichiang1991/rn-workout-record',
  },
  {
    title: {
      zh: '品牌短期活動Liff',
      en: 'Short-term Activity Liff',
    },
    description: {
      zh: '品牌短期活動，使用liff開發',
      en: 'A liff app for a short-term activity',
    },
    tech: ['React', 'TypeScript', 'liff'],
  },
  {
    title: {
      zh: '品牌線上線下活動Liff',
      en: 'Brand Online and Offline Activity Liff',
    },
    description: {
      zh: '品牌線上線下活動，使用liff開發',
      en: 'A liff app for a brand online and offline activity',
    },
    tech: ['React', 'TypeScript', 'liff'],
  },
  {
    title: {
      zh: '腳踏車租借POS系統, 全端開發',
      en: 'Bicycle rental POS system',
    },
    description: {
      zh: '腳踏車租借POS系統、會員端Liff、管理員端',
      en: 'A POS system for a bicycle rental brand',
    },
    tech: ['React', 'TypeScript', 'liff', 'Loopback 4', 'Postgresql'],
  },
]
