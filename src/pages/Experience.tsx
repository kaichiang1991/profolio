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
        <div className="w-12 md:w-20 flex-shrink-0 relative" style={{ minHeight: '1200px' }}>
          <TimelineYearMarkers range={timeRange} />
        </div>

        {/* Timeline Axis */}
        <div className="w-0.5 bg-zinc-300 flex-shrink-0" />

        {/* Experience Cards Container */}
        <div className="flex-1 relative" style={{ minHeight: '1200px' }}>
          {experiencesWithLanes.map((exp, index) => {
            const position = calculatePosition(exp, timeRange)
            const now = new Date()
            const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
            const isPresent = exp.end === null
            const endDate = exp.end || currentDate

            // 計算泳道位置
            // 預設最少按 3 個 lane 的寬度計算，超過則按實際數量
            const minLanes = 3
            const effectiveLaneCount = Math.max(laneCount, minLanes)
            const laneWidth = 100 / effectiveLaneCount
            const leftOffset = exp.lane * laneWidth

            // 為緊鄰的工作預留間隙（減少 2% 高度作為視覺間距）
            const adjustedHeight = Math.max(position.height - 2, 8)

            return (
              <div
                key={`${exp.company}-${index}`}
                className={`
                  absolute rounded-lg border-l-4 shadow-md
                  p-2 md:p-3 lg:p-4
                  text-xs md:text-sm
                  transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
                  ${typeColors[exp.type]}
                `}
                style={{
                  top: `${position.top}%`,
                  minHeight: `${Math.max(adjustedHeight, 10)}%`,
                  left: `calc(${leftOffset}% + 8px)`,
                  width: `calc(${laneWidth}% - 24px)`,
                  minWidth: effectiveLaneCount > 2 ? '150px' : 'auto',
                }}
              >
                <div className="text-[10px] md:text-xs text-zinc-600 mb-1">
                  {formatDate(exp.start)} -{' '}
                  {isPresent ? (locale === 'zh' ? '至今' : 'Present') : formatDate(endDate)}
                </div>
                <h3 className="font-heading text-sm md:text-base lg:text-lg font-semibold mb-0.5 md:mb-1 line-clamp-1 md:line-clamp-2">
                  {exp.title[locale]}
                </h3>
                <p className="text-blue-600 font-medium text-[10px] md:text-xs lg:text-sm mb-0.5 md:mb-1 truncate">
                  {exp.company}
                </p>
                <span className="inline-block text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded bg-white/50 border border-current mb-1 md:mb-2">
                  {typeLabels[exp.type][locale]}
                </span>
                <p className="text-zinc-700 text-[10px] md:text-xs lg:text-sm leading-relaxed line-clamp-1 md:line-clamp-2 lg:line-clamp-3">
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
