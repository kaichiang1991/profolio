import { ExternalLink } from 'lucide-react'
import GitHubIcon from '../components/GitHubIcon.tsx'
import { useLanguage } from '../i18n/index.ts'
import { projects } from '../data/projects.ts'

export default function Projects() {
  const { locale, t } = useLanguage()

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t.projects.title}
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        {t.projects.subtitle}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <article
            key={project.title[locale]}
            className="bg-white rounded-2xl border border-zinc-200 p-6 hover:border-blue-600 transition-colors duration-200 cursor-pointer flex flex-col gap-4"
          >
            <h2 className="font-heading text-xl font-semibold">
              {project.title[locale]}
            </h2>
            <p className="text-zinc-700 text-sm leading-relaxed flex-1">
              {project.description[locale]}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
                >
                  {tech}
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
                  <GitHubIcon size={16} />
                  {t.projects.code}
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
                  {t.projects.demo}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
