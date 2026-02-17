import { useLanguage } from '../i18n/index.ts'
import { experiences, type JobType } from '../data/experience.ts'
import {
  getTimeRange,
  calculatePosition,
} from '../utils/timeline.ts'
import TimelineYearMarkers from '../components/TimelineYearMarkers.tsx'

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
  const barWidth = 10 // 矩形條的寬度（px）
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

  // 計算最大 lane 數量（最多同時有幾個矩形條）
  const maxLane = Math.max(...cardsWithPosition.map(card => card.lane), 0)
  // 計算所需的矩形條總寬度
  const barsWidth = (maxLane + 1) * (barWidth + 10) // +1 因為 lane 從 0 開始

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

        {/* Spacer for bars - 為矩形條預留空間，避免壓到年份 */}
        <div className="shrink-0" style={{ width: `${barsWidth}px`, minHeight: `${timelineHeight}px` }} />

        {/* Bar Layer - 在時間線左邊 */}
        <div className="relative shrink-0 pointer-events-none" style={{ width: '0px', minHeight: `${timelineHeight}px` }}>
          {cardsWithPosition.map((card, index) => {
              // 為每個工作經歷分配不同顏色
              const colors = [
                'bg-blue-500',
                'bg-green-500',
                'bg-purple-500',
                'bg-orange-500',
                'bg-pink-500',
                'bg-teal-500',
                'bg-indigo-500',
                'bg-yellow-500',
              ]
              const barColor = colors[index % colors.length]

              return (
                <div
                  key={`bar-${card.company}-${card.start}-${index}`}
                  className={`
                    absolute rounded opacity-80
                    ${barColor}
                  `}
                  style={{
                    top: `${card.barTop}px`,
                    right: `${card.lane * (barWidth + 10)}px`, // 在時間線左邊，Lane 0 緊貼時間線
                    width: `${barWidth}px`,
                    height: `${card.barHeight}px`,
                  }}
                  title={`${card.title[locale]} (${formatDate(card.start)} - ${card.end ? formatDate(card.end) : locale === 'zh' ? '至今' : 'Present'})`}
                />
              )
            })}
        </div>

        {/* Timeline Axis */}
        <div className="w-0.5 bg-zinc-300 shrink-0 relative" style={{ minHeight: `${timelineHeight}px` }} />

        {/* Experience Cards Container */}
        <div className="flex-1 relative pl-4" style={{ minHeight: `${timelineHeight}px` }}>
          {cardsWithPosition.map((card, index) => {
            const now = new Date()
            const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
            const isPresent = card.end === null
            const endDate = card.end || currentDate

            // 為每個工作經歷分配對應的顏色（與矩形條相同）
            const cardColors = [
              'border-l-blue-600 bg-blue-50',
              'border-l-green-600 bg-green-50',
              'border-l-purple-600 bg-purple-50',
              'border-l-orange-600 bg-orange-50',
              'border-l-pink-600 bg-pink-50',
              'border-l-teal-600 bg-teal-50',
              'border-l-indigo-600 bg-indigo-50',
              'border-l-yellow-600 bg-yellow-50',
            ]
            const cardColor = cardColors[index % cardColors.length]

            return (
              <div
                key={`${card.company}-${index}`}
                className={`
                  absolute rounded-lg border-l-4 shadow-sm
                  p-3 md:p-4
                  text-xs
                  transition-all duration-200 hover:shadow-md
                  ${cardColor}
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
