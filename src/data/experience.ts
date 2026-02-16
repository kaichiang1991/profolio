export type JobType = 'full-time' | 'part-time' | 'freelance' | 'contract'

export interface Experience {
  company: string
  title: { zh: string; en: string }
  start: string  // 格式：'YYYY-MM'
  end: string | null  // 'YYYY-MM' 或 null（表示至今）
  type: JobType
  description: { zh: string; en: string }
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
      zh: '使用 TypeScript、Cocos Creator 開發遊戲前端應用程式。',
      en: 'Developing game frontend applications with TypeScript and Cocos Creator.',
    },
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
      zh: '使用 TypeScript、Cocos Creator 開發遊戲前端應用程式、建構遊戲相關網站、配合美術開發軟體、',
      en: 'Developing game frontend applications with TypeScript and Cocos Creator.',
    },
  },
]
