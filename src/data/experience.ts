export interface Experience {
  company: string
  title: { zh: string; en: string }
  period: string
  description: { zh: string; en: string }
}

export const experiences: Experience[] = [
  {
    company: '永勝雲端',
    title: {
      zh: '遊戲前端工程師',
      en: 'Game Frontend Developer',
    },
    period: '2016/12 - 2019/5',
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
    period: '2019/10 - 2021/3',
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
    period: '2021/3 - 2021/10',
    description: {
      zh: '使用 TypeScript、Cocos Creator 開發遊戲前端應用程式、建構遊戲相關網站、配合美術開發軟體、',
      en: 'Developing game frontend applications with TypeScript and Cocos Creator.',
    },
  },
]
