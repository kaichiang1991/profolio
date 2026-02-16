import type { Experience } from '../data/experience'

export interface TimeRange {
  start: string  // 'YYYY-MM'
  end: string    // 'YYYY-MM'
}

export interface ExperienceWithLane extends Experience {
  lane: number  // 泳道編號，從 0 開始
}

/**
 * 將 'YYYY-MM' 格式的日期轉換為月份數（從 1970-01 開始）
 */
export function dateToMonths(date: string): number {
  const [year, month] = date.split('-').map(Number)
  return year * 12 + month
}

/**
 * 計算所有工作經歷的時間範圍
 * 若有 end 為 null（至今），使用當前日期
 */
export function getTimeRange(experiences: Experience[]): TimeRange {
  if (experiences.length === 0) {
    const now = new Date()
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return { start: current, end: current }
  }

  const now = new Date()
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  let minStart = experiences[0].start
  let maxEnd = experiences[0].end || currentDate

  experiences.forEach(exp => {
    if (exp.start < minStart) minStart = exp.start
    const expEnd = exp.end || currentDate
    if (expEnd > maxEnd) maxEnd = expEnd
  })

  return { start: minStart, end: maxEnd }
}

/**
 * 將日期映射到相對位置（0-100%）
 */
export function timeToPosition(date: string, range: TimeRange): number {
  const dateMonths = dateToMonths(date)
  const startMonths = dateToMonths(range.start)
  const endMonths = dateToMonths(range.end)

  const totalMonths = endMonths - startMonths
  if (totalMonths === 0) return 0

  const relativeMonths = dateMonths - startMonths
  return (relativeMonths / totalMonths) * 100
}

/**
 * 計算工作經歷在時間軸上的位置和高度
 */
export function calculatePosition(
  experience: Experience,
  range: TimeRange
): { top: number; height: number } {
  const now = new Date()
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const start = experience.start
  const end = experience.end || currentDate

  const top = timeToPosition(start, range)
  const bottom = timeToPosition(end, range)
  const height = bottom - top

  return { top, height }
}
