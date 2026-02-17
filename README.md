# Kai's Portfolio

個人作品集網站，展示工作經歷、專案和技能。

## 特色功能

### 甘特圖式時間線

經歷頁面使用甘特圖風格時間線：
- **彩色矩形條**：視覺化工作時間跨度，高度對應工作期間長度
- **智能 Lane 系統**：自動處理時間重疊的工作經歷
- **顏色編碼**：每個工作經歷使用不同顏色
- **響應式設計**：支援桌面、平板、行動裝置
- **邊界情況處理**：超短期工作、進行中工作、時間重疊

### 國際化
- 繁體中文 / English 雙語支援

## 技術棧
- React 19 + TypeScript + Vite 7
- Tailwind CSS 4
- React Router 7

## 本地開發
```bash
npm install
npm run dev
npm run build
```

## 專案結構
```
src/
├── components/       # 可重用組件
├── data/            # 靜態數據（經歷、專案）
├── i18n/            # 國際化翻譯
├── pages/           # 頁面組件
├── utils/           # 工具函數
└── App.tsx          # 應用入口
```

## 授權
MIT License
