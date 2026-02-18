import { useState, useMemo } from 'react'
import { ExternalLink, Lock } from 'lucide-react'
import GitHubIcon from '../components/GitHubIcon.tsx'
import { useLanguage } from '../i18n/index.ts'
import { projects } from '../data/projects.ts'

export default function Projects() {
  const { locale, t } = useLanguage()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Calculate tag frequencies and sort by usage
  const sortedTags = useMemo(() => {
    const freq = projects
      .flatMap((p) => p.tech)
      .reduce(
        (acc, tech) => {
          acc[tech] = (acc[tech] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .map(([tech]) => tech)
  }, []) // empty dep array: projects is a static import constant

  // Filter projects based on selected tag
  const filteredProjects =
    selectedTag === null
      ? projects
      : projects.filter((p) => p.tech.includes(selectedTag))

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t.projects.title}
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        {t.projects.subtitle}
      </p>

      {/* Tag Filter Bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          aria-pressed={selectedTag === null}
          onClick={() => setSelectedTag(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
            selectedTag === null
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          {t.projects.all}
        </button>

        {sortedTags.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={selectedTag === tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
              selectedTag === tag
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length === 0 && (
          <p className="text-zinc-500 text-center py-12 col-span-full">
            {t.projects.noResults}
          </p>
        )}

        {filteredProjects.map((project) => (
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
            <div className="flex flex-wrap gap-3 pt-2">
              {project.github && (
                <div className="inline-flex items-center gap-2">
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
                  {project.isPrivate && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                      <Lock size={10} />
                      {t.projects.private}
                    </span>
                  )}
                </div>
              )}
              {project.externalLink && (
                <a
                  href={project.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-950 transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} />
                  {t.projects.link}
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
