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
