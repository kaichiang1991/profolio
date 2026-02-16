import { Mail } from 'lucide-react'
import GitHubIcon from './GitHubIcon.tsx'
import { useLanguage } from '../i18n/index.ts'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-zinc-200 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Kai. {t.footer.rights}.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/kaichiang1991"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-950 transition-colors duration-200"
            aria-label="GitHub"
          >
            <GitHubIcon size={20} />
          </a>
          <a
            href="mailto:hello@kai.dev"
            className="text-zinc-500 hover:text-zinc-950 transition-colors duration-200"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}
