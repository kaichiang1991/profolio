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
