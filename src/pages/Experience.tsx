import React from 'react'
import { useLanguage } from '../i18n/index.ts'
import { experiences, type JobType } from '../data/experience.ts'
import {
  getTimeRange,
  calculatePosition,
  assignLanes,
} from '../utils/timeline.ts'
import TimelineYearMarkers from '../components/TimelineYearMarkers.tsx'

const typeLabels: Record<JobType, { zh: string; en: string }> = {
  'full-time': { zh: '全職', en: 'Full-time' },
  'part-time': { zh: '兼職', en: 'Part-time' },
  freelance: { zh: '自由接案', en: 'Freelance' },
  contract: { zh: '合約', en: 'Contract' },
}

/**
 * 獲取當前日期（YYYY-MM 格式）
 * 用於處理進行中的工作（end: null）
 */
const getCurrentDate = (): string => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export default function Experience() {
  const { locale, t } = useLanguage()

  // 響應式佈局 Hook
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  )

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 640 // sm
  const isTablet = windowWidth < 768 // md

  const responsiveLayout = {
    laneWidth: isMobile ? 200 : isTablet ? 220 : 250,
    barWidth: isMobile ? 25 : 10,
    cardWidth: isMobile ? 180 : isTablet ? 200 : 230,
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

  // 計算時間範圍
  const timeRange = getTimeRange(experiences)

  // 格式化日期
  const formatDate = (date: string) => {
    const [year, month] = date.split('-')
    return `${year}/${month}`
  }

  // 計算每個經歷的位置（使用響應式佈局）
  const minCardHeight = 120 // 卡片最小高度，確保內容可以顯示
  const laneWidth = responsiveLayout.laneWidth
  const barWidth = responsiveLayout.barWidth
  const cardWidth = responsiveLayout.cardWidth
  const timelineHeight = 1200

  // 使用基於時間範圍的 lane 分配（確保矩形條不會在時間上重疊）
  const experiencesWithLanes = assignLanes(experiences)

  const cardsWithPosition = experiencesWithLanes.map((exp) => {
    // 計算 start 位置（直接傳遞 exp，calculatePosition 已支援 Experience 類型）
    const startPosition = calculatePosition(exp, timeRange)

    // 計算 end 位置（如果是進行中則使用當前日期）
    const endDate = exp.end || getCurrentDate()
    const endPosition = calculatePosition(
      { ...exp, start: endDate, end: endDate },
      timeRange,
    )

    // 矩形條和卡片的高度對應工作時間跨度（end - start）
    // 使用 minCardHeight 確保超短期工作的卡片內容仍可見
    const barHeight = Math.max(
      ((endPosition.top - startPosition.top) / 100) * timelineHeight,
      minCardHeight,
    )

    // 卡片的 Y 位置 = start 時間在時間軸上的位置（頂部對齊）
    const cardY = (startPosition.top / 100) * timelineHeight

    return {
      ...exp,
      timelinePosition: startPosition.top, // 在時間軸上的位置（%）
      cardTop: cardY, // 卡片的實際位置（px）
      barTop: cardY, // 矩形條的頂部位置（px）
      barHeight, // 矩形條的高度（px）
      // lane 已經由 assignLanes 根據時間重疊情況分配
    }
  })

  // 計算最大 lane 數量（最多同時有幾個矩形條）
  const maxLane = Math.max(...cardsWithPosition.map((card) => card.lane), 0)
  // 計算所需的矩形條總寬度
  const barsWidth = (maxLane + 1) * (barWidth + 10) // +1 因為 lane 從 0 開始

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {t.experience.title}
      </h1>
      <p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
        {t.experience.subtitle}
      </p>

      {/* Timeline Container - 小屏幕支援橫向滾動 */}
      <div className="flex gap-2 md:gap-4 relative overflow-x-auto md:overflow-x-visible pb-4">
        {/* Year Markers Column */}
        <div
          className="w-12 md:w-20 shrink-0 relative"
          style={{ minHeight: `${timelineHeight}px` }}
        >
          <TimelineYearMarkers range={timeRange} />
        </div>

        {/* Spacer for bars - 為矩形條預留空間，避免壓到年份 */}
        <div
          className="shrink-0"
          style={{ width: `${barsWidth}px`, minHeight: `${timelineHeight}px` }}
        />

        {/* Bar Layer - 在時間線左邊 */}
        <div
          className="relative shrink-0 pointer-events-none"
          style={{ width: '0px', minHeight: `${timelineHeight}px` }}
        >
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
                    absolute rounded
                    ${barColor}
                  `}
                style={{
                  top: `${card.barTop}px`,
                  // 矩形條從左到右順序：Lane 0（最左）到 Lane maxLane（最右，緊貼時間線）
                  right: `${(maxLane - card.lane) * (barWidth + 10)}px`,
                  width: `${barWidth}px`,
                  height: `${card.barHeight}px`,
                  zIndex: index, // 時間越晚的矩形 z-index 越高，重疊時下方矩形顏色為主
                }}
                title={`${card.title[locale]} (${formatDate(card.start)} - ${card.end ? formatDate(card.end) : locale === 'zh' ? '至今' : 'Present'})`}
              />
            )
          })}
        </div>

        {/* Timeline Axis */}
        <div
          className="w-0.5 bg-zinc-300 shrink-0 relative"
          style={{ minHeight: `${timelineHeight}px` }}
        />

        {/* Experience Cards Container */}
        <div
          className="flex-1 relative pl-4"
          style={{ minHeight: `${timelineHeight}px` }}
        >
          {cardsWithPosition.map((card, index) => {
            const currentDate = getCurrentDate()
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
                  absolute rounded-lg border-l-4
                  p-3 md:p-4
                  text-xs
                  transition-all duration-200
                  hover:z-10 active:z-10 cursor-pointer
                  ${cardColor}
                `}
                style={{
                  top: `${card.cardTop}px`,
                  left: `${card.lane * laneWidth}px`,
                  width: `${cardWidth}px`, // 使用響應式寬度
                  minHeight: `${card.barHeight}px`, // 卡片最小高度與矩形條相同
                  boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)', // 頂部陰影
                }}
              >
                {/* 時間 */}
                <div className="text-[10px] md:text-xs text-zinc-600 mb-1 font-medium">
                  {formatDate(card.start)} -{' '}
                  {isPresent
                    ? locale === 'zh'
                      ? '至今'
                      : 'Present'
                    : formatDate(endDate)}
                </div>

                {/* 公司名稱 */}
                <h3 className="font-heading text-xs md:text-sm font-bold mb-1 text-zinc-800">
                  {card.company}
                </h3>

                {/* 職位 */}
                <div className="text-[10px] md:text-xs text-zinc-700 mb-1 font-medium flex gap-1">
                  {card.title[locale]}
                  {/* JobType 標籤 */}
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
