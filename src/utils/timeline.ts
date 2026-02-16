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

/**
 * 檢查兩個工作經歷的時間是否重疊
 */
export function hasOverlap(exp1: Experience, exp2: Experience): boolean {
  const now = new Date()
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const end1 = exp1.end || currentDate
  const end2 = exp2.end || currentDate

  // 轉換為月份數進行比較
  const start1 = dateToMonths(exp1.start)
  const end1Months = dateToMonths(end1)
  const start2 = dateToMonths(exp2.start)
  const end2Months = dateToMonths(end2)

  // 檢查是否重疊：exp1 結束時間 > exp2 開始時間 && exp1 開始時間 < exp2 結束時間
  return end1Months > start2 && start1 < end2Months
}

/**
 * 使用貪心演算法分配泳道
 * 返回每個工作經歷及其對應的泳道編號
 */
export function assignLanes(experiences: Experience[]): ExperienceWithLane[] {
  if (experiences.length === 0) return []

  // 按開始時間排序（早開始的在前）
  const sorted = [...experiences].sort((a, b) => {
    const aMonths = dateToMonths(a.start)
    const bMonths = dateToMonths(b.start)
    return aMonths - bMonths
  })

  // 泳道陣列：記錄每條泳道最後一個工作的結束時間
  const lanes: string[] = []
  const result: ExperienceWithLane[] = []

  sorted.forEach(exp => {
    const now = new Date()
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const expEnd = exp.end || currentDate

    // 找第一個可用的泳道（該泳道的最後結束時間 <= 當前工作的開始時間）
    let assignedLane = -1
    for (let i = 0; i < lanes.length; i++) {
      const laneEndMonths = dateToMonths(lanes[i])
      const expStartMonths = dateToMonths(exp.start)

      if (laneEndMonths <= expStartMonths) {
        assignedLane = i
        lanes[i] = expEnd  // 更新該泳道的結束時間
        break
      }
    }

    // 若無可用泳道，創建新泳道
    if (assignedLane === -1) {
      assignedLane = lanes.length
      lanes.push(expEnd)
    }

    result.push({
      ...exp,
      lane: assignedLane
    })
  })

  return result
}
