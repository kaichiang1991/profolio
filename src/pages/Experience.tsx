import { useLanguage } from '../i18n/index.ts'
import { experiences, type JobType } from '../data/experience.ts'
import {
  getTimeRange,
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

  // 計算時間範圍
  const timeRange = getTimeRange(experiences)

  // 格式化日期
  const formatDate = (date: string) => {
    const [year, month] = date.split('-')
    return `${year}/${month}`
  }

  // 計算每個經歷的位置
  const cardHeight = 140 // 每個卡片的高度（px）
  const laneWidth = 300 // 每個 lane 的寬度（px）
  const barWidth = 60 // 矩形條的寬度（px）
  const gapWidth = 10 // 矩形條與卡片之間的間隙（px）
  const cardWidth = 230 // 卡片的寬度（px）
  const timelineHeight = 1200 // 時間軸的總高度（px）
  const cardPadding = 10 // 卡片之間的垂直間距（px）
  const minBarHeight = 20 // 矩形條的最小高度（px）

  // 按 start 時間排序所有經歷
  const sortedExperiences = [...experiences].sort((a, b) =>
    a.start.localeCompare(b.start)
  )

  // 追蹤每個 lane 的最後一張卡片的底部位置
  const laneBottoms: number[] = []

  const cardsWithPosition = sortedExperiences.map((exp) => {
    // 計算 start 位置
    const startPosition = calculatePosition(
      { start: exp.start, end: exp.start } as any,
      timeRange
    )

    // 計算 end 位置（如果是進行中則使用當前日期）
    const now = new Date()
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const endDate = exp.end || currentDate
    const endPosition = calculatePosition(
      { start: endDate, end: endDate } as any,
      timeRange
    )

    // 矩形條的高度 = end 位置 - start 位置
    const barHeight = Math.max(
      ((endPosition.top - startPosition.top) / 100) * timelineHeight,
      minBarHeight
    )

    // 卡片的 Y 位置 = start 時間在時間軸上的位置（頂部對齊）
    const cardY = (startPosition.top / 100) * timelineHeight
    const cardBottom = cardY + cardHeight + cardPadding

    // 找到第一個不會重疊的 lane
    let lane = 0
    while (lane < laneBottoms.length && laneBottoms[lane] > cardY) {
      lane++
    }

    // 更新這個 lane 的底部位置
    laneBottoms[lane] = cardBottom

    return {
      ...exp,
      timelinePosition: startPosition.top, // 在時間軸上的位置（%）
      cardTop: cardY, // 卡片的實際位置（px）
      barTop: cardY, // 矩形條的頂部位置（px）
      barHeight, // 矩形條的高度（px）
      lane, // 動態分配的 lane
    }
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t.experience.title}
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        {t.experience.subtitle}
      </p>

      {/* Timeline Container */}
      <div className="flex gap-4 relative">
        {/* Year Markers Column */}
        <div className="w-12 md:w-20 shrink-0 relative" style={{ minHeight: `${timelineHeight}px` }}>
          <TimelineYearMarkers range={timeRange} />
        </div>

        {/* Timeline Axis */}
        <div className="w-0.5 bg-zinc-300 shrink-0 relative" style={{ minHeight: `${timelineHeight}px` }} />

        {/* Bar Layer */}
        <div className="absolute left-0 top-0 pointer-events-none" style={{ width: '100%', minHeight: `${timelineHeight}px` }}>
          <div className="relative" style={{ marginLeft: '52px', minHeight: `${timelineHeight}px` }}>
            {cardsWithPosition.map((card, index) => {
              const barColors: Record<JobType, string> = {
                'full-time': 'bg-blue-500',
                'part-time': 'bg-green-500',
                'freelance': 'bg-purple-500',
                'contract': 'bg-orange-500',
              }

              return (
                <div
                  key={`bar-${card.company}-${card.start}-${index}`}
                  className={`
                    absolute rounded opacity-80
                    ${barColors[card.type]}
                  `}
                  style={{
                    top: `${card.barTop}px`,
                    left: `${card.lane * laneWidth + 16}px`, // 16px = gap after timeline
                    width: `${barWidth}px`,
                    height: `${card.barHeight}px`,
                  }}
                  title={`${card.title[locale]} (${formatDate(card.start)} - ${card.end ? formatDate(card.end) : locale === 'zh' ? '至今' : 'Present'})`}
                />
              )
            })}
          </div>
        </div>

        {/* SVG Layer for connecting lines */}
        <svg
          className="absolute left-0 top-0 pointer-events-none"
          style={{
            width: '100%',
            height: '100%',
            minHeight: `${timelineHeight}px`,
          }}
        >
          {cardsWithPosition.map((card, index) => {
            const timelineX = 52 + 16 + 2 // yearMarker width + gap + half of axis width
            const timelineY = (card.timelinePosition / 100) * timelineHeight // 根據 start 時間在時間軸上的 Y 座標
            const cardX = timelineX + 16 + card.lane * laneWidth // 起始 X + gap + lane offset

            return (
              <g key={`line-${card.company}-${card.start}-${index}`}>
                {/* 橫線 - 從時間軸到卡片（完全水平） */}
                <line
                  x1={timelineX}
                  y1={timelineY}
                  x2={cardX}
                  y2={timelineY}
                  stroke="#d4d4d8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* 起點圓點（在時間軸上的 start 位置） */}
                <circle cx={timelineX} cy={timelineY} r="4" fill="#3b82f6" />
                {/* 終點圓點（在卡片左側） */}
                <circle cx={cardX} cy={timelineY} r="3" fill="#71717a" />
              </g>
            )
          })}
        </svg>

        {/* Experience Cards Container */}
        <div className="flex-1 relative pl-4" style={{ minHeight: `${timelineHeight}px` }}>
          {cardsWithPosition.map((card, index) => {
            const now = new Date()
            const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
            const isPresent = card.end === null
            const endDate = card.end || currentDate

            return (
              <div
                key={`${card.company}-${index}`}
                className={`
                  absolute rounded-lg border-l-4 shadow-sm
                  p-3 md:p-4
                  text-xs
                  transition-all duration-200 hover:shadow-md
                  ${typeColors[card.type]}
                `}
                style={{
                  top: `${card.cardTop}px`,
                  left: `${card.lane * laneWidth}px`,
                  width: '230px',
                  minHeight: `${cardHeight}px`,
                }}
              >
                {/* 時間 */}
                <div className="text-[10px] md:text-xs text-zinc-600 mb-1 font-medium">
                  {formatDate(card.start)} -{' '}
                  {isPresent ? (locale === 'zh' ? '至今' : 'Present') : formatDate(endDate)}
                </div>

                {/* 職位 */}
                <h3 className="font-heading text-xs md:text-sm font-semibold mb-1">
                  {card.title[locale]}
                </h3>

                {/* JobType 標籤 */}
                <div className="mb-2">
                  <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-white/60 border border-current/30">
                    {typeLabels[card.type][locale]}
                  </span>
                </div>

                {/* 使用技術標籤 */}
                <div className="flex flex-wrap gap-1">
                  {card.technologies.map((tech, techIndex) => (
                    <span
                      key={`${tech}-${techIndex}`}
                      className="inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-white/80 text-zinc-700 border border-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
