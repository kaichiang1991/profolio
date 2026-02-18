# CI/CD GitHub Pages 自動部署 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** push 到 main branch 後，自動執行 Lint / 型別 / 格式檢查，通過後部署到 https://kaichiang1991.github.io/profolio/

**Architecture:** 建立單一 GitHub Actions workflow 檔案。品質檢查依序執行，任一失敗則中止部署。部署沿用現有 `npm run deploy`（gh-pages npm 套件），推送 dist/ 到 gh-pages branch。

**Tech Stack:** GitHub Actions, Node.js 22 LTS, oxlint, TypeScript, Prettier, Vite, gh-pages

---

### Task 1: 建立 GitHub Actions Workflow 目錄與檔案

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: 建立目錄**

```bash
mkdir -p .github/workflows
```

**Step 2: 建立 `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Format check
        run: npm run format:check

      - name: Build
        run: npm run build

      - name: Deploy
        run: npm run deploy
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Step 3: 確認檔案內容正確**

用編輯器或 `cat .github/workflows/deploy.yml` 確認 YAML 縮排無誤。

**Step 4: Commit**

```bash
git add .github/workflows/deploy.yml docs/plans/2026-02-18-cicd-github-pages-design.md docs/plans/2026-02-18-cicd-github-pages.md
git commit -m "feat: add GitHub Actions CI/CD workflow for GitHub Pages deployment"
```

---

### Task 2: 推送並驗證 CI/CD 觸發

**Files:**
- 無需修改任何檔案

**Step 1: Push 到 origin main**

```bash
git push origin main
```

**Step 2: 確認 GitHub Actions 觸發**

1. 前往 `https://github.com/kaichiang1991/profolio/actions`
2. 應看到名為 **Deploy to GitHub Pages** 的 workflow 正在執行

**Step 3: 確認各步驟通過**

確認以下步驟都顯示綠色 ✓：
- Lint
- Type check
- Format check
- Build
- Deploy

**Step 4: 確認部署成功**

前往 `https://kaichiang1991.github.io/profolio/` 確認網站正常顯示。

---

## 注意事項

### gh-pages 套件與 GITHUB_TOKEN

`gh-pages` 套件需要 git push 權限。在 GitHub Actions 環境中，透過以下機制取得：

1. Workflow 頂層設定 `permissions: contents: write`
2. `npm run deploy` 執行時，`gh-pages` 會自動偵測 `GITHUB_TOKEN` 環境變數

**不需要**手動在 repo Settings 建立任何 Secret。

### 首次執行可能遇到的問題

若 CI 在 Deploy 步驟失敗，錯誤訊息為 `remote: Permission to ... denied`，請至 GitHub repo **Settings → Actions → General → Workflow permissions** 確認已勾選 **Read and write permissions**。

### tsc --noEmit 說明

`build` script 已包含 `tsc -b`，但 CI 中另外執行 `npx tsc --noEmit` 作為獨立的型別檢查步驟（不產生輸出檔），讓錯誤訊息更清晰。
