import { Mail } from 'lucide-react'
import GitHubIcon from '../components/GitHubIcon.tsx'
import { useLanguage } from '../i18n/index.ts'

export default function Contact() {
  const { t } = useLanguage()

  const contacts = [
    {
      icon: GitHubIcon,
      label: t.contact.github,
      href: 'https://github.com/kaichiang1991',
      description: t.contact.githubDesc,
    },
    {
      icon: Mail,
      label: t.contact.email,
      href: 'mailto:hello@kai.dev',
      description: t.contact.emailDesc,
    },
  ]

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t.contact.title}
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        {t.contact.subtitle}
      </p>

      <div className="flex flex-col gap-4 max-w-md">
        {contacts.map(({ icon: Icon, label, href, description }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="flex items-center gap-4 bg-white rounded-2xl border border-zinc-200 p-5 hover:border-blue-600 transition-colors duration-200 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-blue-50 transition-colors duration-200">
              <Icon size={20} className="text-zinc-700 group-hover:text-blue-600 transition-colors duration-200" />
            </div>
            <div>
              <p className="font-medium text-sm">{label}</p>
              <p className="text-zinc-500 text-sm">{description}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
