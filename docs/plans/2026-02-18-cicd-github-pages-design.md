# CI/CD GitHub Pages 自動部署設計

**日期**: 2026-02-18
**狀態**: 已確認

## 目標

push 到 `main` branch 後，自動執行品質檢查並部署到 GitHub Pages，取代手動執行 `npm run deploy`。

## 部署網址

`https://kaichiang1991.github.io/profolio/`

## 方案選擇

使用 **GitHub Actions + gh-pages npm 套件（方案 A）**，沿用現有 `npm run deploy` script，最小變動。

## Workflow 設計

- **檔案路徑**: `.github/workflows/deploy.yml`
- **觸發條件**: push 到 `main` branch
- **Node.js 版本**: 22 LTS

### 流程

```
push to main
    ↓
checkout code
    ↓
setup Node.js 22
    ↓
npm ci
    ↓
Lint 檢查 (npm run lint)       ─┐
型別檢查 (npx tsc --noEmit)    ─┤ 任一失敗則中止，不部署
格式檢查 (npm run format:check) ─┘
    ↓
npm run build
    ↓
npm run deploy
  → gh-pages 推送 dist/ 到 gh-pages branch
  → GitHub Pages 自動更新
```

## 權限設定

- 使用 `GITHUB_TOKEN`（GitHub Actions 內建，無需手動設定 secret）
- Workflow 需宣告 `permissions: contents: write` 讓 gh-pages 能推送 branch

## 失敗行為

Lint / 型別 / 格式任一檢查失敗時，**阻擋部署**，確保線上版本永遠是通過所有檢查的程式碼。

## 不需要的設定

- 不需要手動建立任何 secret
- 不需要修改 GitHub repo Pages 設定（gh-pages branch 已是現有部署方式）
- 不需要修改 `vite.config.ts` 或 `package.json`
