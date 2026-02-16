import GitHubIcon from '../components/GitHubIcon.tsx'
import { useLanguage } from '../i18n/index.ts'

const skills = [
  'TypeScript', 'React', 'Node.js', 'Next.js',
  'Tailwind CSS', 'PostgreSQL', 'Docker', 'AWS',
]

export default function Home() {
  const { t } = useLanguage()

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight">
            {t.hero.greeting}
          </h1>
          <p className="text-xl text-zinc-700 max-w-[65ch]">
            {t.hero.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-700"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com/kai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-zinc-950 text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-zinc-800 transition-colors duration-200"
          >
            <GitHubIcon size={18} />
            {t.hero.github}
          </a>
          <a
            href="#/projects"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-950 hover:border-blue-600 transition-colors duration-200"
          >
            {t.hero.viewProjects}
          </a>
        </div>
      </section>
    </main>
  )
}
