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

      {/* Timeline Grid Container */}
      <div
        className="grid relative min-h-[600px]"
        style={{
          gridTemplateColumns: `80px 2px repeat(${laneCount}, 1fr)`,
          gap: '0 12px',
        }}
      >
        {/* Year Markers Column */}
        <div className="relative">
          <TimelineYearMarkers range={timeRange} />
        </div>

        {/* Timeline Axis */}
        <div className="bg-zinc-300 w-full h-full" />

        {/* Experience Cards in Lanes */}
        <div
          className="relative col-span-full"
          style={{
            gridColumn: '3 / -1',
            minHeight: '600px',
          }}
        >
          {experiencesWithLanes.map((exp, index) => {
            const position = calculatePosition(exp, timeRange)
            return (
              <ExperienceCard
                key={index}
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
