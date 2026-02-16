# Experience Timeline Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 重新設計工作經歷頁面，支援同時顯示多個時間重疊的工作，使用泳道式佈局呈現。

**Architecture:** 使用 CSS Grid 建立時間-空間的二維佈局系統。左側時間軸顯示年份標記，右側根據工作時間重疊情況動態分配泳道。核心邏輯包含時間計算函數和泳道分配演算法。

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Vite

**Testing Approach:** 由於專案目前沒有測試框架，我們將採用漸進式方法：核心邏輯函數使用瀏覽器 console 驗證，UI 元件使用視覺測試。

---

## Task 1: 更新 Experience 資料結構

**Files:**
- Modify: `src/data/experience.ts`

**Step 1: 更新 Experience interface**

在 `src/data/experience.ts` 的開頭，將現有的 interface 替換為：

```typescript
export type JobType = 'full-time' | 'part-time' | 'freelance' | 'contract'

export interface Experience {
  company: string
  title: { zh: string; en: string }
  start: string  // 格式：'YYYY-MM'
  end: string | null  // 'YYYY-MM' 或 null（表示至今）
  type: JobType
  description: { zh: string; en: string }
}
```

**Step 2: 更新現有資料**

將現有的 `experiences` 陣列中的資料更新為新格式：

```typescript
export const experiences: Experience[] = [
  {
    company: '永勝雲端',
    title: {
      zh: '遊戲前端工程師',
      en: 'Game Frontend Developer',
    },
    start: '2016-12',
    end: '2019-05',
    type: 'full-time',
    description: {
      zh: '使用 TypeScript、Cocos Creator 開發遊戲前端應用程式。',
      en: 'Developing game frontend applications with TypeScript and Cocos Creator.',
    },
  },
  {
    company: '微微一笑國際股份有限公司',
    title: {
      zh: '遊戲前端工程師',
      en: 'Game Frontend Developer',
    },
    start: '2019-10',
    end: '2021-03',
    type: 'full-time',
    description: {
      zh: '使用 TypeScript、Cocos Creator 開發遊戲前端應用程式。',
      en: 'Developing game frontend applications with TypeScript and Cocos Creator.',
    },
  },
  {
    company: '遊戲公司',
    title: {
      zh: '前端工程師',
      en: 'Frontend Developer',
    },
    start: '2021-03',
    end: '2021-10',
    type: 'full-time',
    description: {
      zh: '使用 TypeScript、Cocos Creator 開發遊戲前端應用程式、建構遊戲相關網站、配合美術開發軟體、',
      en: 'Developing game frontend applications with TypeScript and Cocos Creator.',
    },
  },
]
```

**Step 3: 驗證 TypeScript 編譯**

Run: `npm run build`
Expected: 應該會看到 Experience.tsx 出現型別錯誤（因為使用舊的 period 屬性）

**Step 4: Commit**

```bash
git add src/data/experience.ts
git commit -m "refactor: update Experience interface with start/end dates and job type"
```

---

## Task 2: 建立時間計算工具函數

**Files:**
- Create: `src/utils/timeline.ts`

**Step 1: 建立時間工具函數檔案**

建立 `src/utils/timeline.ts` 並加入基礎型別和函數：

```typescript
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
```

**Step 2: 在瀏覽器 console 中測試**

在 `src/pages/Experience.tsx` 中臨時加入以下程式碼來測試：

```typescript
import { getTimeRange, timeToPosition, calculatePosition } from '../utils/timeline'

// 在元件內部加入：
console.log('Time Range:', getTimeRange(experiences))
console.log('First exp position:', calculatePosition(experiences[0], getTimeRange(experiences)))
```

Run: `npm run dev`
在瀏覽器開啟 console，檢查輸出是否合理

**Step 3: Commit**

```bash
git add src/utils/timeline.ts
git commit -m "feat: add timeline calculation utility functions"
```

---

## Task 3: 建立泳道分配演算法

**Files:**
- Modify: `src/utils/timeline.ts`

**Step 1: 在 timeline.ts 中加入泳道分配函數**

在 `src/utils/timeline.ts` 末尾加入：

```typescript
/**
 * 檢查兩個工作經歷的時間是否重疊
 */
function hasOverlap(exp1: Experience, exp2: Experience): boolean {
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
```

**Step 2: 測試泳道分配**

在 `src/pages/Experience.tsx` 中更新測試程式碼：

```typescript
import { assignLanes } from '../utils/timeline'

// 在元件內部：
console.log('Lanes assigned:', assignLanes(experiences))
```

Run: `npm run dev`
檢查 console 輸出，確認：
- 每個工作都有 lane 屬性
- 沒有重疊的工作應該在同一個 lane
- 有重疊的工作在不同的 lane

**Step 3: Commit**

```bash
git add src/utils/timeline.ts
git commit -m "feat: add lane assignment algorithm for overlapping experiences"
```

---

## Task 4: 建立 ExperienceCard 元件

**Files:**
- Create: `src/components/ExperienceCard.tsx`

**Step 1: 建立 ExperienceCard 元件**

建立 `src/components/ExperienceCard.tsx`：

```typescript
import type { Experience, JobType } from '../data/experience'
import { useLanguage } from '../i18n'

interface ExperienceCardProps {
  experience: Experience
  top: number      // 百分比
  height: number   // 百分比
  lane: number     // 泳道編號
}

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

export default function ExperienceCard({
  experience,
  top,
  height,
  lane,
}: ExperienceCardProps) {
  const { locale } = useLanguage()

  const now = new Date()
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const isPresent = experience.end === null
  const endDate = experience.end || currentDate

  // 格式化日期顯示
  const formatDate = (date: string) => {
    const [year, month] = date.split('-')
    return `${year}/${month}`
  }

  return (
    <div
      className={`
        absolute rounded-lg border-l-4 shadow-md p-3 md:p-4
        transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
        ${typeColors[experience.type]}
      `}
      style={{
        top: `${top}%`,
        height: `${Math.max(height, 8)}%`, // 最小高度 8%
        gridColumn: lane + 3, // +3 因為前兩列是年份和時間軸
      }}
    >
      <div className="text-xs text-zinc-500 mb-1">
        {formatDate(experience.start)} - {isPresent ? (locale === 'zh' ? '至今' : 'Present') : formatDate(endDate)}
      </div>
      <h3 className="font-heading text-base md:text-lg font-semibold mb-1 line-clamp-2">
        {experience.title[locale]}
      </h3>
      <p className="text-blue-600 font-medium text-xs md:text-sm mb-1">
        {experience.company}
      </p>
      <span className="inline-block text-xs px-2 py-0.5 rounded bg-white/50 border border-current mb-2">
        {typeLabels[experience.type][locale]}
      </span>
      <p className="text-zinc-700 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3">
        {experience.description[locale]}
      </p>
    </div>
  )
}
```

**Step 2: 驗證編譯**

Run: `npm run build`
Expected: TypeScript 應該編譯成功

**Step 3: Commit**

```bash
git add src/components/ExperienceCard.tsx
git commit -m "feat: create ExperienceCard component with job type styling"
```

---

## Task 5: 建立 TimelineYearMarkers 元件

**Files:**
- Create: `src/components/TimelineYearMarkers.tsx`

**Step 1: 建立 TimelineYearMarkers 元件**

建立 `src/components/TimelineYearMarkers.tsx`：

```typescript
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
            <span className="text-sm font-medium text-zinc-600 mr-2">
              {year}
            </span>
            <div className="w-2 h-px bg-zinc-300" />
          </div>
        )
      })}
    </div>
  )
}
```

**Step 2: 驗證編譯**

Run: `npm run build`
Expected: TypeScript 應該編譯成功

**Step 3: Commit**

```bash
git add src/components/TimelineYearMarkers.tsx
git commit -m "feat: create TimelineYearMarkers component"
```

---

## Task 6: 重構 Experience 頁面主邏輯

**Files:**
- Modify: `src/pages/Experience.tsx`

**Step 1: 重寫 Experience 頁面**

完全替換 `src/pages/Experience.tsx` 的內容：

```typescript
import { useLanguage } from '../i18n/index.ts'
import { experiences } from '../data/experience.ts'
import {
  getTimeRange,
  assignLanes,
  calculatePosition,
  type ExperienceWithLane,
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
```

**Step 2: 移除測試程式碼**

確保移除之前加入的 console.log 測試程式碼。

**Step 3: 視覺測試**

Run: `npm run dev`
在瀏覽器中檢查：
- 年份標記是否正確顯示
- 時間軸線是否顯示
- 工作卡片是否正確定位
- 重疊的工作是否在不同泳道

**Step 4: Commit**

```bash
git add src/pages/Experience.tsx
git commit -m "refactor: rebuild Experience page with swimlane timeline layout"
```

---

## Task 7: 修正 Grid 佈局問題

**Files:**
- Modify: `src/pages/Experience.tsx`

**Step 1: 修正卡片定位**

在 `src/pages/Experience.tsx` 中，修正 ExperienceCard 的 grid-column 計算：

更新 ExperienceCard 元件的使用：

```typescript
{experiencesWithLanes.map((exp, index) => {
  const position = calculatePosition(exp, timeRange)
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
```

並修正 ExperienceCard.tsx 中的 style：

```typescript
style={{
  top: `${top}%`,
  height: `${Math.max(height, 8)}%`,
  left: `calc(${lane * (100 / 3)}%)`, // 假設最多 3 個泳道
  width: `calc(${100 / 3}% - 8px)`,
}}
```

**Step 2: 改用更簡單的佈局策略**

實際上，為了讓佈局更可靠，我們應該使用不同的策略。修改 Experience.tsx：

```typescript
{/* Experience Cards Container */}
<div className="relative" style={{ gridColumn: '3 / -1', minHeight: '600px' }}>
  {experiencesWithLanes.map((exp, index) => {
    const position = calculatePosition(exp, timeRange)

    // 計算每個泳道的寬度和偏移
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
        {/* Card content here */}
      </div>
    )
  })}
</div>
```

**Step 3: 視覺驗證**

Run: `npm run dev`
檢查卡片是否正確並排顯示。

**Step 4: Commit**

```bash
git add src/pages/Experience.tsx
git commit -m "fix: correct lane positioning calculation"
```

---

## Task 8: 整合卡片內容到 Experience 頁面

**Files:**
- Modify: `src/pages/Experience.tsx`
- Delete: `src/components/ExperienceCard.tsx` (內容已整合)

**Step 1: 簡化架構，將卡片內容直接寫在 Experience.tsx**

為了簡化和提高可維護性，將 ExperienceCard 的內容直接整合到 Experience.tsx：

```typescript
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
```

**Step 2: 刪除 ExperienceCard 元件檔案**

```bash
rm src/components/ExperienceCard.tsx
```

**Step 3: 視覺測試**

Run: `npm run dev`
檢查所有功能是否正常運作。

**Step 4: Commit**

```bash
git add src/pages/Experience.tsx
git add src/components/ExperienceCard.tsx
git commit -m "refactor: integrate ExperienceCard into Experience page for simplicity"
```

---

## Task 9: 加入響應式樣式優化

**Files:**
- Modify: `src/pages/Experience.tsx`

**Step 1: 調整小螢幕樣式**

在 Experience.tsx 中，為小螢幕優化樣式：

更新年份標記容器：

```typescript
<div className="w-12 md:w-20 flex-shrink-0 relative" style={{ minHeight: '600px' }}>
  <TimelineYearMarkers range={timeRange} />
</div>
```

更新卡片樣式，加強響應式：

```typescript
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
    height: `${Math.max(position.height, 10)}%`,
    left: `${leftOffset}%`,
    width: `calc(${laneWidth}% - 8px)`,
    minWidth: laneCount > 2 ? '120px' : 'auto',
  }}
>
```

更新內容樣式：

```typescript
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
```

**Step 2: 更新 TimelineYearMarkers 響應式**

修改 `src/components/TimelineYearMarkers.tsx`：

```typescript
<span className="text-xs md:text-sm font-medium text-zinc-600 mr-1 md:mr-2">
  {year}
</span>
<div className="w-1 md:w-2 h-px bg-zinc-300" />
```

**Step 3: 視覺測試（不同螢幕尺寸）**

Run: `npm run dev`
在瀏覽器中測試：
- 手機尺寸 (375px)
- 平板尺寸 (768px)
- 桌面尺寸 (1024px+)

檢查：
- 文字大小是否合適
- 卡片內容是否正確顯示或截斷
- 並排卡片是否過於擁擠

**Step 4: Commit**

```bash
git add src/pages/Experience.tsx src/components/TimelineYearMarkers.tsx
git commit -m "feat: add responsive styles for mobile and tablet devices"
```

---

## Task 10: 加入錯誤處理和資料驗證

**Files:**
- Modify: `src/utils/timeline.ts`

**Step 1: 加入資料驗證函數**

在 `src/utils/timeline.ts` 開頭加入驗證函數：

```typescript
/**
 * 驗證日期格式 (YYYY-MM)
 */
function isValidDateFormat(date: string): boolean {
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/
  return regex.test(date)
}

/**
 * 驗證 Experience 資料
 */
function validateExperience(exp: Experience): boolean {
  // 檢查必要欄位
  if (!exp.company || !exp.start || !exp.type) {
    console.warn('Invalid experience: missing required fields', exp)
    return false
  }

  // 檢查日期格式
  if (!isValidDateFormat(exp.start)) {
    console.warn('Invalid experience: invalid start date format', exp.start)
    return false
  }

  if (exp.end !== null && !isValidDateFormat(exp.end)) {
    console.warn('Invalid experience: invalid end date format', exp.end)
    return false
  }

  // 檢查 end 不能早於 start
  if (exp.end !== null) {
    const startMonths = dateToMonths(exp.start)
    const endMonths = dateToMonths(exp.end)
    if (endMonths < startMonths) {
      console.warn('Invalid experience: end date before start date', exp)
      return false
    }
  }

  return true
}

/**
 * 過濾並驗證工作經歷資料
 */
export function validateExperiences(experiences: Experience[]): Experience[] {
  return experiences.filter(validateExperience)
}
```

**Step 2: 在關鍵函數中使用驗證**

更新 `getTimeRange` 和 `assignLanes` 函數，加入驗證：

```typescript
export function getTimeRange(experiences: Experience[]): TimeRange {
  const validExperiences = validateExperiences(experiences)

  if (validExperiences.length === 0) {
    const now = new Date()
    const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return { start: current, end: current }
  }

  // ... 原有邏輯，使用 validExperiences
}

export function assignLanes(experiences: Experience[]): ExperienceWithLane[] {
  const validExperiences = validateExperiences(experiences)

  if (validExperiences.length === 0) return []

  // ... 原有邏輯，使用 validExperiences
}
```

**Step 3: 加入除以零保護**

更新 `timeToPosition` 函數：

```typescript
export function timeToPosition(date: string, range: TimeRange): number {
  const dateMonths = dateToMonths(date)
  const startMonths = dateToMonths(range.start)
  const endMonths = dateToMonths(range.end)

  const totalMonths = endMonths - startMonths

  // 保護除以零
  if (totalMonths <= 0) {
    console.warn('Invalid time range: total months is zero or negative')
    return 0
  }

  const relativeMonths = dateMonths - startMonths
  return Math.max(0, Math.min(100, (relativeMonths / totalMonths) * 100))
}
```

**Step 4: 在 Experience 頁面中加入泳道數量警告**

在 `src/pages/Experience.tsx` 中：

```typescript
const laneCount = maxLane + 1

// 警告過多泳道
if (laneCount > 5) {
  console.warn(`Large number of lanes detected (${laneCount}). Consider reviewing data for better visual presentation.`)
}
```

**Step 5: 測試錯誤處理**

臨時修改 `src/data/experience.ts` 中的資料來測試：
- 無效的日期格式
- end 早於 start
- 缺少必要欄位

Run: `npm run dev`
檢查 console 是否有適當的警告訊息，頁面是否不會崩潰。

**Step 6: 還原測試資料並 Commit**

```bash
git add src/utils/timeline.ts src/pages/Experience.tsx
git commit -m "feat: add data validation and error handling"
```

---

## Task 11: 最終測試和調整

**Files:**
- Modify: `src/pages/Experience.tsx` (if needed)
- Modify: `src/components/TimelineYearMarkers.tsx` (if needed)

**Step 1: 綜合測試**

Run: `npm run dev`

檢查清單：
- [ ] 年份標記正確顯示
- [ ] 時間軸線正確顯示
- [ ] 工作卡片正確定位
- [ ] 重疊工作在不同泳道
- [ ] 工作類型顏色區分正確
- [ ] 「至今」狀態正確顯示
- [ ] Hover 效果正常
- [ ] 手機尺寸顯示正常
- [ ] 平板尺寸顯示正常
- [ ] 桌面尺寸顯示正常

**Step 2: 調整細節**

根據測試結果，調整：
- 卡片最小高度
- 文字大小
- 間距
- 顏色對比度

**Step 3: 生產環境建置測試**

```bash
npm run build
npm run preview
```

檢查生產版本是否正常運作。

**Step 4: 最終 Commit**

```bash
git add .
git commit -m "polish: final adjustments for experience timeline"
```

---

## Task 12: 更新文件和部署

**Files:**
- Create/Modify: `README.md` (if needed)

**Step 1: 確認所有變更已提交**

```bash
git status
```

Expected: working tree clean

**Step 2: 推送到遠端**

```bash
git push origin main
```

**Step 3: 部署到 GitHub Pages**

```bash
npm run deploy
```

**Step 4: 驗證部署**

在瀏覽器中開啟 GitHub Pages URL，確認新功能正常運作。

---

## 完成標準

- ✅ 資料結構已更新（start/end/type）
- ✅ 時間計算函數正常運作
- ✅ 泳道分配演算法正確
- ✅ UI 正確顯示年份標記和時間軸
- ✅ 重疊工作在不同泳道並排顯示
- ✅ 工作類型有視覺區分
- ✅ 響應式設計在所有裝置正常
- ✅ 錯誤處理機制正常
- ✅ 已部署到生產環境

## 注意事項

1. **測試方法**: 由於專案沒有測試框架，主要依賴瀏覽器視覺測試和 console 驗證
2. **頻繁提交**: 每完成一個 Task 就提交，保持 git 歷史清晰
3. **漸進式開發**: 先實作核心功能，再加入視覺優化和響應式
4. **錯誤處理**: 使用 console.warn 記錄問題，不讓頁面崩潰

## 未來改進

- 加入單元測試框架（Vitest）
- 加入 E2E 測試（Playwright）
- 加入動畫效果
- 支援時間軸縮放
- 支援工作類型篩選
