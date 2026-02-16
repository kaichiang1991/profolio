# 時間線甘特圖重新設計 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 將個人經歷頁面重新設計為甘特圖風格，添加彩色矩形條視覺化工作時間跨度

**Architecture:** 基於現有的 lane 系統，在時間軸右側添加矩形條層，每個工作經歷對應一個彩色矩形條（高度對應時間跨度），卡片移至矩形條右側，用短連接線連接

**Tech Stack:** React, TypeScript, Tailwind CSS, SVG

**設計文件:** `docs/plans/2026-02-17-timeline-redesign-design.md`

---

## Task 1: 調整 Lane 佈局常數

**Files:**
- Modify: `src/pages/Experience.tsx:48-51`

**目的:** 調整 lane 寬度以容納矩形條 + 間隙 + 卡片的新佈局

**Step 1: 修改佈局常數**

修改 `Experience.tsx` 的常數定義（第 48-51 行附近）：

```typescript
// 計算每個經歷的位置
const cardHeight = 140 // 每個卡片的高度（px）
const laneWidth = 300 // 每個 lane 的寬度（px）- 修改為 300
const barWidth = 60 // 矩形條的寬度（px）- 新增
const gapWidth = 10 // 矩形條與卡片之間的間隙（px）- 新增
const cardWidth = 230 // 卡片的寬度（px）- 新增明確定義
const timelineHeight = 1200 // 時間軸的總高度（px）
const cardPadding = 10 // 卡片之間的垂直間距（px）
const minBarHeight = 20 // 矩形條的最小高度（px）- 新增
```

**Step 2: 檢查視覺效果**

Run: `npm run dev`
在瀏覽器中檢查 Experience 頁面，確認現有佈局仍然正常

**Step 3: 提交**

```bash
git add src/pages/Experience.tsx
git commit -m "refactor: adjust layout constants for gantt-chart design

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: 添加矩形條數據計算

**Files:**
- Modify: `src/pages/Experience.tsx:61-86`

**目的:** 為每個工作經歷計算矩形條的高度和位置

**Step 1: 擴展 cardsWithPosition 數據結構**

在 `cardsWithPosition` 的 map 函數中（第 61-86 行），添加矩形條相關的計算：

```typescript
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
    barTop: cardY, // 矩形條的頂部位置（px）- 與卡片相同
    barHeight, // 矩形條的高度（px）- 新增
    lane, // 動態分配的 lane
  }
})
```

**Step 2: 檢查編譯**

Run: `npm run dev`
確認 TypeScript 編譯無錯誤

**Step 3: 提交**

```bash
git add src/pages/Experience.tsx
git commit -m "feat: add bar height calculation for gantt-chart

Calculate bar height based on work duration (start to end)
Add minBarHeight to ensure short-term jobs are visible

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: 渲染矩形條層

**Files:**
- Modify: `src/pages/Experience.tsx:97-141`

**目的:** 在時間軸右側添加矩形條的視覺層

**Step 1: 在 Timeline Container 中添加矩形條層**

在 Timeline Container 內（第 98 行的 `<div className="flex gap-4 relative">` 之後），在 SVG Layer 之前添加矩形條層：

```typescript
{/* Timeline Container */}
<div className="flex gap-4 relative">
  {/* Year Markers Column */}
  <div className="w-12 md:w-20 shrink-0 relative" style={{ minHeight: `${timelineHeight}px` }}>
    <TimelineYearMarkers range={timeRange} />
  </div>

  {/* Timeline Axis */}
  <div className="w-0.5 bg-zinc-300 shrink-0 relative" style={{ minHeight: `${timelineHeight}px` }} />

  {/* Bar Layer - 新增 */}
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
  <svg className="absolute left-0 top-0 pointer-events-none" ...>
```

**Step 2: 檢查視覺效果**

Run: `npm run dev`
在瀏覽器中檢查：
1. 矩形條是否顯示在時間軸右側
2. 矩形條的高度是否對應工作時間跨度
3. 矩形條的顏色是否正確
4. Hover 時是否顯示 title tooltip

**Step 3: 提交**

```bash
git add src/pages/Experience.tsx
git commit -m "feat: render colored bars for work duration

Add bar layer with colored rectangles representing work duration
Bars positioned in lanes with appropriate colors based on job type

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: 調整卡片水平位置

**Files:**
- Modify: `src/pages/Experience.tsx:160-163`

**目的:** 將卡片移至矩形條右側

**Step 1: 修改卡片的 left 位置計算**

找到卡片的 style 屬性（第 160 行附近）並修改：

```typescript
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
    left: `${card.lane * laneWidth + barWidth + gapWidth}px`, // 修改：矩形條寬度 + 間隙
    width: `${cardWidth}px`,
    minHeight: `${cardHeight}px`,
  }}
>
```

**Step 2: 檢查視覺效果**

Run: `npm run dev`
在瀏覽器中檢查：
1. 卡片是否位於矩形條右側
2. 矩形條與卡片之間是否有 10px 間隙
3. 卡片與矩形條是否在同一 lane（垂直對齊）

**Step 3: 提交**

```bash
git add src/pages/Experience.tsx
git commit -m "feat: reposition cards to the right of bars

Move cards to the right side of bars with 10px gap
Cards now align with their corresponding bars in the same lane

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: 重新設計連接線

**Files:**
- Modify: `src/pages/Experience.tsx:108-140`

**目的:** 將連接線從時間軸→卡片改為矩形條→卡片的短線

**Step 1: 修改 SVG 連接線邏輯**

找到 SVG Layer（第 108-140 行）並完全替換：

```typescript
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
    const baseX = 52 + 16 // yearMarker width + gap
    const barRightX = baseX + card.lane * laneWidth + barWidth // 矩形條右側
    const cardLeftX = baseX + card.lane * laneWidth + barWidth + gapWidth // 卡片左側
    const lineY = card.cardTop + cardHeight / 2 // 連接線的 Y 位置（卡片中點）

    // 矩形條顏色對應
    const lineColors: Record<JobType, string> = {
      'full-time': '#3b82f6',
      'part-time': '#22c55e',
      'freelance': '#a855f7',
      'contract': '#f97316',
    }

    return (
      <g key={`line-${card.company}-${card.start}-${index}`}>
        {/* 短連接線 - 從矩形條右側到卡片左側 */}
        <line
          x1={barRightX}
          y1={lineY}
          x2={cardLeftX}
          y2={lineY}
          stroke={lineColors[card.type]}
          strokeWidth="2"
          opacity="0.6"
        />
        {/* 終點圓點（在卡片左側）- 可選 */}
        <circle cx={cardLeftX} cy={lineY} r="2" fill={lineColors[card.type]} opacity="0.8" />
      </g>
    )
  })}
</svg>
```

**Step 2: 檢查視覺效果**

Run: `npm run dev`
在瀏覽器中檢查：
1. 連接線是否從矩形條右側連接到卡片左側
2. 連接線是否為短距離（10px）
3. 連接線顏色是否與矩形條/工作類型對應
4. 沒有多餘的長距離虛線

**Step 3: 提交**

```bash
git add src/pages/Experience.tsx
git commit -m "feat: redesign connecting lines to short segments

Replace long dashed lines with short connecting lines
Lines now connect bar right edge to card left edge
Color-coded to match job type

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: 添加響應式樣式

**Files:**
- Modify: `src/pages/Experience.tsx:48-51`

**目的:** 在平板/行動裝置上縮小但保持結構

**Step 1: 調整常數為響應式**

修改常數定義，使其支援響應式：

```typescript
// 計算每個經歷的位置 - 響應式調整
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
const cardHeight = 140
const laneWidth = isMobile ? 250 : 300 // 行動裝置縮小
const barWidth = isMobile ? 50 : 60 // 行動裝置縮小
const gapWidth = 10
const cardWidth = isMobile ? 190 : 230 // 行動裝置縮小
const timelineHeight = 1200
const cardPadding = 10
const minBarHeight = 20
```

**Step 2: 添加 CSS 橫向滾動支援**

修改 Timeline Container 的樣式（第 98 行）：

```typescript
{/* Timeline Container */}
<div className="flex gap-4 relative overflow-x-auto md:overflow-x-visible">
```

**Step 3: 檢查響應式效果**

Run: `npm run dev`
在瀏覽器中：
1. 調整瀏覽器寬度到 < 768px
2. 檢查 lane 寬度、矩形條、卡片是否縮小
3. 檢查是否支援橫向滾動
4. 檢查在桌面版（≥ 768px）是否恢復正常大小

**Step 4: 提交**

```bash
git add src/pages/Experience.tsx
git commit -m "feat: add responsive styles for mobile devices

Reduce lane width, bar width, and card width on mobile
Add horizontal scroll support for smaller screens

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: 測試邊界情況

**Files:**
- None (manual testing)

**目的:** 驗證各種邊界情況的顯示效果

**Step 1: 測試極短期工作**

在 `src/data/experience.ts` 中暫時添加一個 1 個月的測試工作：

```typescript
{
  company: '測試公司',
  title: { zh: '短期測試', en: 'Short Test' },
  start: '2024-01',
  end: '2024-02',
  type: 'contract',
  description: { zh: '測試極短期工作', en: 'Test short-term job' },
  technologies: ['Test'],
}
```

Run: `npm run dev`
檢查：矩形條是否顯示為最小高度（20px），仍然可見

**Step 2: 測試進行中的工作**

檢查 `end: null` 的工作：
- 矩形條是否延伸到當前日期
- 顯示是否正確（「至今」/「Present」）

**Step 3: 測試時間重疊**

檢查時間重疊的多個工作（例如全職 + 接案）：
- 矩形條是否分配到不同 lane
- 卡片是否也分配到對應 lane
- 連接線是否正確連接

**Step 4: 測試不同工作類型的顏色**

檢查所有工作類型：
- full-time: 藍色
- part-time: 綠色
- freelance: 紫色
- contract: 橘色

**Step 5: 移除測試數據並提交**

```bash
git add src/data/experience.ts
git restore src/data/experience.ts  # 恢復原始數據
```

---

## Task 8: 清理和最終調整

**Files:**
- Modify: `src/pages/Experience.tsx`

**目的:** 移除未使用的代碼，添加註釋，確保代碼品質

**Step 1: 移除未使用的變數和導入**

檢查並移除任何未使用的變數（如果有）。

**Step 2: 添加關鍵註釋**

在複雜邏輯處添加註釋：

```typescript
// 矩形條層：視覺化工作時間跨度
// 每個矩形條的高度對應工作的時間長度（start 到 end）
<div className="absolute left-0 top-0 pointer-events-none" ...>
```

**Step 3: 檢查 TypeScript 類型**

Run: `npm run build`
確認沒有 TypeScript 錯誤或警告

**Step 4: 最終視覺檢查**

Run: `npm run dev`
完整測試所有功能：
1. 矩形條顯示正確
2. 卡片位置正確
3. 連接線正確
4. 顏色系統正確
5. 響應式設計正常
6. Hover 效果正常

**Step 5: 最終提交**

```bash
git add src/pages/Experience.tsx
git commit -m "refactor: clean up and add comments for timeline redesign

Remove unused code and add clarifying comments
Final adjustments for gantt-chart style timeline

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: 更新文檔（可選）

**Files:**
- Create/Modify: `README.md` 或相關文檔

**目的:** 記錄新的時間線設計

**Step 1: 更新 README（如果需要）**

如果專案有 README，可以添加關於時間線設計的說明：

```markdown
## 個人經歷時間線

經歷頁面使用甘特圖風格的時間線設計：
- **彩色矩形條**：視覺化工作時間跨度，高度對應工作期間長度
- **Lane 系統**：自動處理時間重疊的工作經歷，避免視覺衝突
- **顏色編碼**：不同工作類型（全職、兼職、接案、合約）使用不同顏色
- **響應式**：支援桌面和行動裝置，自動調整佈局
```

**Step 2: 提交文檔更新**

```bash
git add README.md
git commit -m "docs: update README with timeline design description

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 驗收標準

完成後，時間線應該：

✅ **視覺呈現**
- [ ] 時間軸右側顯示彩色矩形條
- [ ] 矩形條高度對應工作時間跨度
- [ ] 矩形條顏色對應工作類型
- [ ] 卡片位於矩形條右側，有 10px 間隙
- [ ] 短連接線連接矩形條與卡片

✅ **功能性**
- [ ] Lane 系統正確處理時間重疊
- [ ] 極短期工作（< 2 個月）仍可見（min-height: 20px）
- [ ] 進行中的工作（end: null）矩形條延伸到當前日期
- [ ] Hover 時顯示工作時間跨度 tooltip

✅ **響應式**
- [ ] 桌面版（≥ 768px）完整顯示
- [ ] 行動版（< 768px）元素縮小但保持結構
- [ ] 支援橫向滾動

✅ **程式碼品質**
- [ ] TypeScript 無錯誤無警告
- [ ] 無 console 錯誤
- [ ] 關鍵邏輯有註釋
- [ ] 無未使用的變數或導入

---

## 預估時間

- Task 1-2: 15 分鐘（常數調整 + 數據計算）
- Task 3: 20 分鐘（渲染矩形條）
- Task 4: 10 分鐘（調整卡片位置）
- Task 5: 15 分鐘（重新設計連接線）
- Task 6: 15 分鐘（響應式樣式）
- Task 7: 20 分鐘（邊界情況測試）
- Task 8: 10 分鐘（清理和調整）
- Task 9: 5 分鐘（文檔更新）

**總計：約 2 小時**

---

## 相關檔案清單

**主要修改：**
- `src/pages/Experience.tsx` - 時間線組件主體

**保持不變：**
- `src/data/experience.ts` - 工作經歷資料
- `src/utils/timeline.ts` - 時間計算工具函數
- `src/components/TimelineYearMarkers.tsx` - 年份標記組件

**參考文檔：**
- `docs/plans/2026-02-17-timeline-redesign-design.md` - 設計文件
