import { useLanguage } from '../i18n/index.ts'
import { experiences, type JobType } from '../data/experience.ts'
import {
  getTimeRange,
  assignLanes,
  calculatePosition,
} from '../utils/timeline.ts'
import TimelineYearMarkers from '../components/TimelineYearMarkers.tsx'

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

export default function Experience() {
  const { locale, t } = useLanguage()

  // 計算時間範圍和泳道
  const timeRange = getTimeRange(experiences)
  const experiencesWithLanes = assignLanes(experiences)
  const maxLane = experiencesWithLanes.reduce((max, exp) => Math.max(max, exp.lane), 0)
  const laneCount = maxLane + 1

  // 格式化日期
  const formatDate = (date: string) => {
    const [year, month] = date.split('-')
    return `${year}/${month}`
  }

  // 處理空狀態
  if (experiences.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {t.experience.title}
        </h1>
        <p className="text-lg text-zinc-700">{t.experience.subtitle}</p>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t.experience.title}
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        {t.experience.subtitle}
      </p>

      {/* Timeline Container */}
      <div className="flex gap-4">
        {/* Year Markers Column */}
        <div className="w-20 flex-shrink-0 relative" style={{ minHeight: '600px' }}>
          <TimelineYearMarkers range={timeRange} />
        </div>

        {/* Timeline Axis */}
        <div className="w-0.5 bg-zinc-300 flex-shrink-0" />

        {/* Experience Cards Container */}
        <div className="flex-1 relative" style={{ minHeight: '600px' }}>
          {experiencesWithLanes.map((exp, index) => {
            const position = calculatePosition(exp, timeRange)
            const now = new Date()
            const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
            const isPresent = exp.end === null
            const endDate = exp.end || currentDate

            // 計算泳道位置
            const laneWidth = 100 / laneCount
            const leftOffset = exp.lane * laneWidth

            return (
              <div
                key={`${exp.company}-${index}`}
                className={`
                  absolute rounded-lg border-l-4 shadow-md p-3 md:p-4
                  transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
                  ${typeColors[exp.type]}
                `}
                style={{
                  top: `${position.top}%`,
                  height: `${Math.max(position.height, 8)}%`,
                  left: `${leftOffset}%`,
                  width: `calc(${laneWidth}% - 12px)`,
                }}
              >
                <div className="text-xs text-zinc-600 mb-1">
                  {formatDate(exp.start)} -{' '}
                  {isPresent ? (locale === 'zh' ? '至今' : 'Present') : formatDate(endDate)}
                </div>
                <h3 className="font-heading text-base md:text-lg font-semibold mb-1 line-clamp-2">
                  {exp.title[locale]}
                </h3>
                <p className="text-blue-600 font-medium text-xs md:text-sm mb-1">
                  {exp.company}
                </p>
                <span className="inline-block text-xs px-2 py-0.5 rounded bg-white/50 border border-current mb-2">
                  {typeLabels[exp.type][locale]}
                </span>
                <p className="text-zinc-700 text-xs md:text-sm leading-relaxed line-clamp-1 md:line-clamp-3">
                  {exp.description[locale]}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
