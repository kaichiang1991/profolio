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
