export type JobType = 'full-time' | 'part-time' | 'freelance' | 'contract'

export interface Experience {
  company: string
  title: { zh: string; en: string }
  start: string  // 格式：'YYYY-MM'
  end: string | null  // 'YYYY-MM' 或 null（表示至今）
  type: JobType
  description: { zh: string; en: string }
  technologies: string[]  // 使用的技術標籤
}

export const experiences: Experience[] = [
  {
    company: '永勝雲端',
    title: {
      zh: '遊戲前端工程師',
      en: 'Game Frontend Developer',
    },
    start: '2016-12',
    end: '2019-05',
    type: 'full-time',
    description: {
      zh: '使用 TypeScript、Cocos Creator 開發遊戲前端應用程式。',
      en: 'Developing game frontend applications with TypeScript and Cocos Creator.',
    },
    technologies: ['TypeScript', 'Cocos Creator', 'JavaScript'],
  },
  {
    company: '微微一笑國際股份有限公司',
    title: {
      zh: '遊戲前端工程師',
      en: 'Game Frontend Developer',
    },
    start: '2019-10',
    end: '2021-03',
    type: 'full-time',
    description: {
      zh: '使用 TypeScript、PixiJS 開發遊戲前端應用程式。',
      en: 'Developing game frontend applications with TypeScript and PixiJS.',
    },
    technologies: ['TypeScript', 'PixiJS', 'JavaScript'],
  },
  {
    company: '遊戲公司',
    title: {
      zh: '前端工程師',
      en: 'Frontend Developer',
    },
    start: '2021-03',
    end: '2021-10',
    type: 'full-time',
    description: {
      zh: '使用 TypeScript、PixiJS 開發遊戲前端應用程式、建構遊戲相關網站。',
      en: 'Developing game frontend applications with TypeScript and PixiJS.',
    },
    technologies: ['TypeScript', 'PixiJS', 'React', 'Next.js'],
  },
  {
    company: '網站公司', // KG
    title: {
      zh: '全端工程師',
      en: 'Fullstack Developer',
    },
    start: '2021-11',
    end: '2025-11',
    type: 'part-time',
    description: {
      zh: 'H5遊戲開發、網站開發、網站後端管理、資料庫管理、網站維運',
      en: 'Developing H5 games, website development, website backend management, database management, website maintenance.',
    },
    technologies: ['Laravel', 'php', 'MySQL', 'Vue', 'Next.js'],
  },
  {
    company: '接案', // party game
    title: {
      zh: '後端工程師',
      en: 'backend Developer',
    },
    start: '2021-08',
    end: '2021-11',
    type: 'freelance',
    description: {
      zh: 'Node.js後端開發',
      en: 'Developing backend applications with Node.js.',
    },
    technologies: ['Node.js', 'Express', 'MySQL', 'webSocket'],
  },
  {
    company: 'KD', // KD
    title: {
      zh: '全端工程師',
      en: 'Fullstack Developer',
    },
    start: '2021-11',
    end: '2022-06',
    type: 'freelance',
    description: {
      zh: '網站維護、新增修改部分功能',
      en: 'Website maintenance, new feature development.',
    },
    technologies: ['Laravel', 'MySQL', 'Vue'],
  },
  {
    company: '接案公司', // 遠山創品
    title: {
      zh: '全端工程師',
      en: 'Fullstack Developer',
    },
    start: '2024-09',
    end: '2025-11',
    type: 'freelance',
    description: {
      zh: '網站維護、新增修改部分功能',
      en: 'Website maintenance, new feature development.',
    },
    technologies: ['React', 'Loopback 4', 'Liff'],
  },
  {
    company: '布穀町',
    title: {
      zh: '全端工程師',
      en: 'Fullstack Developer',
    },
    start: '2023-12',
    end: '2026-02',
    type: 'freelance',
    description: {
      zh: '',
      en: 'Developing backend applications with Node.js.',
    },
    technologies: ['React', 'Next.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    company: '遊戲幣',
    title: {
      zh: '全端工程師',
      en: 'Fullstack Developer',
    },
    start: '2024-10',
    end: '2026-02',
    type: 'freelance',
    description: {
      zh: '',
      en: 'Developing backend applications with Node.js.',
    },
    technologies: ['React', 'Next.js', 'TypeScript', 'PostgreSQL'],
  },
]
