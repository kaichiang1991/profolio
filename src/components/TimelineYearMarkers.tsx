import { timeToPosition, type TimeRange } from '../utils/timeline'

interface TimelineYearMarkersProps {
  range: TimeRange
}

export default function TimelineYearMarkers({ range }: TimelineYearMarkersProps) {
  // 生成年份標記
  const startYear = parseInt(range.start.split('-')[0])
  const endYear = parseInt(range.end.split('-')[0])

  const years: number[] = []
  for (let year = startYear; year <= endYear; year++) {
    years.push(year)
  }

  return (
    <div className="relative h-full">
      {years.map(year => {
        const yearDate = `${year}-01`
        const position = timeToPosition(yearDate, range)

        return (
          <div
            key={year}
            className="absolute left-0 flex items-center"
            style={{ top: `${position}%` }}
          >
            <span className="text-xs md:text-sm font-medium text-zinc-600 mr-1 md:mr-2">
              {year}
            </span>
            <div className="w-1 md:w-2 h-px bg-zinc-300" />
          </div>
        )
      })}
    </div>
  )
}
