import { useLanguage } from '../i18n/index.ts'
import { experiences } from '../data/experience.ts'
import {
  getTimeRange,
  assignLanes,
  calculatePosition,
} from '../utils/timeline.ts'
import ExperienceCard from '../components/ExperienceCard.tsx'
import TimelineYearMarkers from '../components/TimelineYearMarkers.tsx'

export default function Experience() {
  const { t } = useLanguage()

  // 計算時間範圍
  const timeRange = getTimeRange(experiences)

  // 分配泳道
  const experiencesWithLanes = assignLanes(experiences)

  // 計算需要的泳道數量
  const maxLane = experiencesWithLanes.reduce(
    (max, exp) => Math.max(max, exp.lane),
    0
  )
  const laneCount = maxLane + 1

  // 計算泳道寬度（用於卡片定位）
  const laneWidth = 100 / laneCount

  // 處理空狀態
  if (experiences.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {t.experience.title}
        </h1>
        <p className="text-lg text-zinc-700">
          {t.experience.subtitle}
        </p>
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
            // 計算泳道位置 - laneWidth 會在 Task 8 整合時使用
            const _laneWidth = laneWidth // 暫時標記使用
            return (
              <ExperienceCard
                key={`${exp.company}-${index}`}
                experience={exp}
                top={position.top}
                height={position.height}
                lane={exp.lane}
              />
            )
          })}
        </div>
      </div>
    </main>
  )
}
