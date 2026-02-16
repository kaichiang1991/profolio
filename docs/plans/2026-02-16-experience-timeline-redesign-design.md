# 工作經歷時間軸重新設計

## 概述

重新設計工作經歷頁面，支援同時顯示多個時間重疊的工作，使用泳道式 (swimlane) 佈局呈現。

## 背景

目前的工作經歷頁面使用簡單的垂直列表，每個工作依序顯示。當使用者有時間重疊的工作經歷（例如：兼職 + 全職）時，無法清楚呈現時間關係。

## 目標

1. 支援顯示時間重疊的多個工作
2. 使用視覺化時間軸清楚呈現時間關係
3. 保留左側時間進度條，增加年份標記
4. 右側使用泳道式並排顯示重疊的工作
5. 支援「至今」(目前在職) 的狀態
6. 區分不同工作類型（全職、兼職、自由接案等）

## 設計方案

選擇 **CSS Grid 精確佈局** 方案，使用原生 HTML/CSS 實作，無需外部依賴。

### 優點
- 完全控制樣式和互動
- SEO 友善，可訪問性好
- 符合目前專案技術棧（React + Tailwind）
- 輕量級，易於維護

## 設計細節

### 1. 資料結構

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

**變更點：**
- `period: string` → `start: string, end: string | null`
- 使用 'YYYY-MM' 格式（只到月份）
- 新增 `type: JobType` 欄位

**設計決策：**
- 使用字串而非 Date 物件：只需年月精度，字串更易序列化和比較
- `end: null` 表示「至今」
- `type` 用於視覺區分（顏色、標籤）

### 2. 時間計算邏輯

#### 2.1 時間範圍計算
```typescript
interface TimeRange {
  start: string  // 最早的 experience.start
  end: string    // 最晚的 experience.end（若有 null 則用當前時間）
}
```

#### 2.2 位置映射函數
```typescript
function timeToPosition(date: string, range: TimeRange): number {
  // 將 'YYYY-MM' 轉換為月份數，計算相對位置百分比
  // 例如：若範圍是 2016-12 ~ 2026-02
  // 則 2016-12 → 0%, 2021-01 → 50%, 2026-02 → 100%
}
```

#### 2.3 重疊偵測與泳道分配

使用貪心演算法 (greedy algorithm) 分配泳道：

1. 將所有工作按 `start` 時間排序
2. 維護「泳道陣列」，記錄每條泳道的最後結束時間
3. 對每個工作：
   - 找第一個「可用」的泳道（該泳道最後結束時間 ≤ 當前工作開始時間）
   - 若無可用泳道，創建新泳道
   - 分配到該泳道，更新泳道的最後結束時間

**結果：**
- 同一泳道內的工作不會重疊
- 使用最少的泳道數量
- 按開始時間排序，左側工作較早開始

**範例：**
```
工作 A: 2024-10 ~ 2024-12
工作 B: 2024-11 ~ 2025-01

結果：
- A → Lane 1 (左側)
- B → Lane 2 (右側)
- 在 2024-11 ~ 2024-12 期間視覺上重疊
```

### 3. 元件架構

```
Experience (頁面)
├── TimelineYearMarkers (年份標記)
├── TimelineAxis (左側時間軸線)
└── ExperienceGrid (工作內容區)
    └── ExperienceCard × N (單一工作卡片)
```

#### 元件職責

**Experience** (src/pages/Experience.tsx)
- 載入資料
- 計算時間範圍和泳道分配
- 協調各子元件

**TimelineYearMarkers**
- 根據時間範圍生成年份標記
- 絕對定位在時間軸左側

**TimelineAxis**
- 單純的視覺元素（垂直線）

**ExperienceGrid**
- CSS Grid 容器
- 管理泳道的列配置

**ExperienceCard**
- 顯示單一工作的卡片
- Props: experience, position (top/height), lane, type
- 響應式內容精簡邏輯

### 4. UI 佈局設計

#### CSS Grid 結構

```
┌─────────────────────────────────────────────────┐
│  [Years]  │  [Timeline]  │  [Lane 1]  │  [Lane 2]  │
│           │              │            │            │
│   2016 ─  │      │       │  ┌──────┐  │            │
│           │      │       │  │ Job1 │  │            │
│   2017 ─  │      │       │  └──────┘  │            │
│           │      │       │            │            │
│   2018 ─  │      │       │  ┌──────┐  │  ┌──────┐  │
│           │      │       │  │ Job2 │  │  │ Job3 │  │
│   2019 ─  │      │       │  └──────┘  │  │      │  │
│           │      │       │            │  └──────┘  │
└─────────────────────────────────────────────────┘
```

#### Grid 配置
```css
grid-template-columns:
  80px        /* 年份列 */
  2px         /* 時間軸線 */
  1fr 1fr ... /* 泳道列，數量動態決定 */
```

#### 定位邏輯

**年份標記：**
- `position: absolute` 在固定的年份列中
- 根據年份計算 `top` 位置

**工作卡片：**
- `grid-column` 指定泳道位置
- `grid-row: 1` + `position: relative` + 自訂 `top` 和 `height`

#### 視覺元素

**類型顏色對應：**
- `full-time`: 藍色 (blue-600)
- `part-time`: 綠色 (green-600)
- `freelance`: 紫色 (purple-600)
- `contract`: 橙色 (orange-600)

**卡片樣式：**
- 圓角、陰影
- 左側彩色邊框（根據 type）
- hover 效果：放大、陰影加深

### 5. 響應式設計

#### 斷點策略

**桌面 (lg: 1024px+)**
- 完整顯示所有泳道
- 卡片寬度充足，顯示完整內容
- 年份標記在左側獨立列

**平板 (md: 768px ~ 1023px)**
- 保持並排，減少內邊距
- 描述文字限制 2-3 行
- 年份標記文字縮小

**手機 (< 768px)**
- 保持並排佈局
- 卡片變窄，內容精簡：
  - 職稱可能換行或縮短
  - 公司名稱保留
  - 描述隱藏或只顯示 1 行
  - 時間格式簡化 (10/24 - 12/24)
- Grid 列最小寬度：120px

#### Tailwind 範例
```tsx
<div className="
  text-sm md:text-base
  px-2 md:px-4
  line-clamp-1 md:line-clamp-3
">
```

### 6. 錯誤處理與邊界情況

#### 資料驗證
- `start` 和 `end` 格式檢查 (YYYY-MM)
- `end` 不能早於 `start`
- `type` 必須是有效值
- 驗證失敗：console.warn 並跳過該筆資料

#### 邊界情況
- **沒有工作經歷**: 顯示空狀態訊息
- **只有一份工作**: 單列顯示，不需泳道分配
- **所有工作都「至今」**: 使用當前日期作為 end
- **工作時間完全相同**: 分配到不同泳道
- **時間跨度很長** (10+ 年): 調整年份標記密度或卡片最小高度

#### 計算保護
- 除以零檢查（時間範圍為 0）
- 泳道數量過多警告（超過 5 條）

#### 降級策略
- 計算失敗時，降級為簡單列表顯示
- 保證頁面不崩潰

### 7. 測試策略

#### 單元測試
- `timeToPosition()`: 時間映射正確性
- 泳道分配演算法：
  - 無重疊
  - 完全重疊
  - 部分重疊
  - 3+ 個工作交錯

#### 元件測試
- ExperienceCard 顯示正確內容
- 類型顏色映射
- 響應式樣式

#### 邊界情況測試
- 空資料、單一工作、無效日期格式

## 實作優先級

1. **核心邏輯** (P0)
   - 資料結構變更
   - 時間計算函數
   - 泳道分配演算法

2. **基本 UI** (P0)
   - ExperienceCard 元件
   - Grid 佈局
   - 年份標記

3. **視覺優化** (P1)
   - 類型顏色區分
   - hover 效果
   - 動畫過渡

4. **響應式** (P1)
   - 平板適配
   - 手機適配

5. **錯誤處理** (P2)
   - 資料驗證
   - 降級策略

## 成功標準

- ✅ 可以同時顯示時間重疊的多個工作
- ✅ 時間軸清楚標示年份
- ✅ 泳道並排顯示，視覺清晰
- ✅ 支援「至今」狀態
- ✅ 不同工作類型有視覺區分
- ✅ 響應式設計在所有裝置上正常運作
- ✅ 無資料或錯誤時不會崩潰

## 未來擴展

- 互動功能：點擊卡片展開詳細資訊
- 時間軸縮放：支援大範圍時間的縮放檢視
- 篩選功能：按工作類型篩選
- 動畫：進場動畫、hover 動畫

## 參考資料

- CSS Grid 佈局: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
- 貪心演算法: 用於泳道分配的經典問題（區間調度問題）
- Tailwind 響應式設計: https://tailwindcss.com/docs/responsive-design
