import { useLanguage } from '../i18n/index.ts'
import { experiences } from '../data/experience.ts'

export default function Experience() {
  const { locale, t } = useLanguage()

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t.experience.title}
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        {t.experience.subtitle}
      </p>

      <div className="relative border-l-2 border-zinc-200 ml-3">
        {experiences.map((exp, i) => (
          <div key={i} className="relative pl-8 pb-12 last:pb-0">
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-blue-600" />
            <p className="text-sm text-zinc-500 mb-1">{exp.period}</p>
            <h2 className="font-heading text-xl font-semibold">{exp.title[locale]}</h2>
            <p className="text-blue-600 font-medium text-sm mb-2">{exp.company}</p>
            <p className="text-zinc-700 text-sm leading-relaxed max-w-[65ch]">
              {exp.description[locale]}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
