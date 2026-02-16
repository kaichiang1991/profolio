import type { Experience, JobType } from '../data/experience'
import { useLanguage } from '../i18n'

interface ExperienceCardProps {
  experience: Experience
  top: number      // 百分比
  height: number   // 百分比
  lane: number     // 泳道編號
}

const typeColors: Record<JobType, string> = {
  'full-time': 'border-l-blue-600 bg-blue-50',
  'part-time': 'border-l-green-600 bg-green-50',
  'freelance': 'border-l-purple-600 bg-purple-50',
  'contract': 'border-l-orange-600 bg-orange-50',
}

const typeLabels: Record<JobType, { zh: string; en: string }> = {
  'full-time': { zh: '全職', en: 'Full-time' },
  'part-time': { zh: '兼職', en: 'Part-time' },
  'freelance': { zh: '自由接案', en: 'Freelance' },
  'contract': { zh: '合約', en: 'Contract' },
}

export default function ExperienceCard({
  experience,
  top,
  height,
  lane,
}: ExperienceCardProps) {
  const { locale } = useLanguage()

  const now = new Date()
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const isPresent = experience.end === null
  const endDate = experience.end || currentDate

  // 格式化日期顯示
  const formatDate = (date: string) => {
    const [year, month] = date.split('-')
    return `${year}/${month}`
  }

  return (
    <div
      className={`
        absolute rounded-lg border-l-4 shadow-md p-3 md:p-4
        transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
        ${typeColors[experience.type]}
      `}
      style={{
        top: `${top}%`,
        height: `${Math.max(height, 8)}%`, // 最小高度 8%
        gridColumn: lane + 3, // +3 因為前兩列是年份和時間軸
      }}
    >
      <div className="text-xs text-zinc-500 mb-1">
        {formatDate(experience.start)} - {isPresent ? (locale === 'zh' ? '至今' : 'Present') : formatDate(endDate)}
      </div>
      <h3 className="font-heading text-base md:text-lg font-semibold mb-1 line-clamp-2">
        {experience.title[locale]}
      </h3>
      <p className="text-blue-600 font-medium text-xs md:text-sm mb-1">
        {experience.company}
      </p>
      <span className="inline-block text-xs px-2 py-0.5 rounded bg-white/50 border border-current mb-2">
        {typeLabels[experience.type][locale]}
      </span>
      <p className="text-zinc-700 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
        {experience.description[locale]}
      </p>
    </div>
  )
}
