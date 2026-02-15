import { Github, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Kai. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/kai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-950 transition-colors duration-200"
            aria-label="GitHub"
          >
            <Github size={20} />
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
