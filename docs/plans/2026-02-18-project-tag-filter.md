# Project Tag Filter System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a technology tag filtering system to the Projects page that allows users to filter projects by clicking tags sorted by usage frequency.

**Architecture:** Pure frontend state management using React useState in Projects.tsx. Calculate tag frequencies from project data, render clickable tags above the project grid, filter projects based on selected tag.

**Tech Stack:** React, TypeScript, Tailwind CSS, existing i18n system

---

## Task 1: Add i18n Translations

**Files:**
- Modify: `src/i18n/zh.ts`
- Modify: `src/i18n/en.ts`
- Modify: `src/i18n/types.ts`

**Step 1: Add translation types**

Open `src/i18n/types.ts` and add the new translation keys to the interface:

```typescript
// Add to the projects section of the translation interface
projects: {
  title: string
  subtitle: string
  code: string
  demo: string
  all: string          // NEW
  noResults: string    // NEW
}
```

**Step 2: Add Chinese translations**

Open `src/i18n/zh.ts` and add to the projects section:

```typescript
projects: {
  title: '作品集',
  subtitle: '這裡是我的一些專案作品',
  code: '程式碼',
  demo: '展示',
  all: '全部',                              // NEW
  noResults: '沒有使用此技術的專案',         // NEW
}
```

**Step 3: Add English translations**

Open `src/i18n/en.ts` and add to the projects section:

```typescript
projects: {
  title: 'Projects',
  subtitle: 'Here are some of my project works',
  code: 'Code',
  demo: 'Demo',
  all: 'All',                                    // NEW
  noResults: 'No projects using this technology', // NEW
}
```

**Step 4: Verify in browser**

Run: `npm run dev`
- Check console for TypeScript errors
- Expected: No errors

**Step 5: Commit**

```bash
git add src/i18n/
git commit -m "feat: add i18n translations for tag filter

Add 'all' tag and 'no results' message translations for project filtering.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Add State Management and Tag Calculation

**Files:**
- Modify: `src/pages/Projects.tsx`

**Step 1: Add state for selected tag**

In `Projects.tsx`, add state after the existing hooks:

```typescript
export default function Projects() {
  const { locale, t } = useLanguage()
  const [selectedTag, setSelectedTag] = useState<string | null>(null)  // NEW

  return (
    // ... existing JSX
```

**Step 2: Add tag calculation logic**

After the state declaration, add the calculation logic:

```typescript
const [selectedTag, setSelectedTag] = useState<string | null>(null)

// Calculate tag frequencies and sort by usage
const allTechs = projects.flatMap(p => p.tech)
const techFrequency = allTechs.reduce((acc, tech) => {
  acc[tech] = (acc[tech] || 0) + 1
  return acc
}, {} as Record<string, number>)

const sortedTags = Object.entries(techFrequency)
  .sort((a, b) => b[1] - a[1])  // Sort by frequency descending
  .map(([tech]) => tech)

return (
  // ... existing JSX
```

**Step 3: Verify compilation**

Run: `npm run dev`
- Check console for TypeScript errors
- Expected: No errors, app compiles successfully

**Step 4: Commit**

```bash
git add src/pages/Projects.tsx
git commit -m "feat: add tag calculation logic

Calculate all technology tags from projects and sort by usage frequency.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Add Tag Filter UI Component

**Files:**
- Modify: `src/pages/Projects.tsx`

**Step 1: Add tag filter bar JSX**

Insert the tag filter bar between the subtitle and the project grid:

```typescript
<p className="text-lg text-zinc-700 mb-12 max-w-[65ch]">
  {t.projects.subtitle}
</p>

{/* NEW: Tag Filter Bar */}
<div className="mb-8">
  <div className="flex flex-wrap gap-2">
    {/* "All" tag */}
    <button
      onClick={() => setSelectedTag(null)}
      className={`
        rounded-full px-4 py-2 text-sm font-medium
        transition-colors duration-200 cursor-pointer
        ${selectedTag === null
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
        }
      `}
    >
      {t.projects.all}
    </button>

    {/* Technology tags */}
    {sortedTags.map(tag => (
      <button
        key={tag}
        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
        className={`
          rounded-full px-4 py-2 text-sm font-medium
          transition-colors duration-200 cursor-pointer
          ${selectedTag === tag
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }
        `}
      >
        {tag}
      </button>
    ))}
  </div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* existing project cards */}
```

**Step 2: Test in browser**

Run: `npm run dev` (if not already running)
- Navigate to Projects page
- Expected: See "全部" tag and technology tags (React, TypeScript, Tailwind CSS, Vite)
- Expected: Tags are sorted by frequency
- Expected: "全部" is highlighted in blue, others are gray

**Step 3: Test tag interaction**

In browser:
- Click on "React" tag
- Expected: React tag turns blue, "全部" turns gray
- Click on "React" tag again
- Expected: React tag turns gray, "全部" turns blue
- Click on "TypeScript" tag
- Expected: TypeScript turns blue, React and "全部" turn gray

**Step 4: Commit**

```bash
git add src/pages/Projects.tsx
git commit -m "feat: add tag filter UI component

Add clickable tag buttons with visual feedback. Tags sorted by frequency,
with 'All' tag to clear filters.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Add Project Filtering Logic

**Files:**
- Modify: `src/pages/Projects.tsx`

**Step 1: Add filtering logic**

After the `sortedTags` calculation, add:

```typescript
const sortedTags = Object.entries(techFrequency)
  .sort((a, b) => b[1] - a[1])
  .map(([tech]) => tech)

// Filter projects based on selected tag
const filteredProjects = selectedTag === null
  ? projects
  : projects.filter(p => p.tech.includes(selectedTag))

return (
  // ... existing JSX
```

**Step 2: Update project grid to use filtered projects**

Change the map from `projects` to `filteredProjects`:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {filteredProjects.map((project) => (  // Changed from projects.map
    <article
      key={project.title[locale]}
      // ... rest of the card
```

**Step 3: Test filtering in browser**

In browser (Projects page):
- Click "React" tag
- Expected: All projects with React still visible (currently only 1 project)
- Click "全部" tag
- Expected: All projects visible

**Step 4: Add console log for verification**

Add temporary logging:

```typescript
const filteredProjects = selectedTag === null
  ? projects
  : projects.filter(p => p.tech.includes(selectedTag))

console.log('Selected tag:', selectedTag)
console.log('Filtered projects:', filteredProjects.length, '/', projects.length)
```

**Step 5: Test with console open**

In browser with DevTools open:
- Click different tags
- Expected: Console shows selected tag name and filtered count
- Click "全部"
- Expected: Console shows "Selected tag: null" and all projects

**Step 6: Remove console logs**

Remove the temporary console.log statements.

**Step 7: Commit**

```bash
git add src/pages/Projects.tsx
git commit -m "feat: add project filtering logic

Filter displayed projects based on selected technology tag.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Add Empty State Handling

**Files:**
- Modify: `src/pages/Projects.tsx`

**Step 1: Add empty state message**

Add the empty state check inside the project grid section:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {filteredProjects.length === 0 && (
    <p className="text-zinc-500 text-center py-12 col-span-full">
      {t.projects.noResults}
    </p>
  )}

  {filteredProjects.map((project) => (
    // ... existing project cards
```

**Step 2: Test empty state (simulate)**

To test this, temporarily modify the filter to always return empty:

```typescript
// TEMPORARY: for testing empty state
const filteredProjects: Project[] = []
```

**Step 3: Verify in browser**

In browser:
- Expected: See "沒有使用此技術的專案" message in Chinese
- Switch language to English
- Expected: See "No projects using this technology" message

**Step 4: Restore real filtering logic**

Remove the temporary empty array and restore the real filtering:

```typescript
const filteredProjects = selectedTag === null
  ? projects
  : projects.filter(p => p.tech.includes(selectedTag))
```

**Step 5: Commit**

```bash
git add src/pages/Projects.tsx
git commit -m "feat: add empty state for filtered results

Display friendly message when no projects match the selected tag.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Final Testing and Refinement

**Files:**
- None (visual testing only)

**Step 1: Test all interactions**

In browser on Projects page:
- ✓ "全部" tag is blue by default
- ✓ Click each technology tag, verify it highlights
- ✓ Click same tag again, verify it deselects
- ✓ Click different tag, verify previous deselects
- ✓ Verify projects filter correctly
- ✓ Hover over tags shows hover effect

**Step 2: Test responsive behavior**

Resize browser window:
- ✓ Tags wrap properly on narrow screens
- ✓ Project cards maintain grid layout
- ✓ No horizontal overflow

**Step 3: Test language switching**

Toggle between 中文 / EN:
- ✓ "全部" / "All" label changes
- ✓ Empty state message changes
- ✓ Technology tag names stay in English (as intended)

**Step 4: Test keyboard navigation**

Using keyboard only:
- ✓ Tab key navigates through tags
- ✓ Enter/Space activates selected tag
- ✓ Visual focus indicator visible

**Step 5: Add more test projects (optional)**

If you want to better test the filtering, add more projects to `src/data/projects.ts`:

```typescript
export const projects: Project[] = [
  // ... existing project
  {
    title: {
      zh: '測試專案 2',
      en: 'Test Project 2',
    },
    description: {
      zh: '用於測試標籤篩選功能的專案。',
      en: 'A project for testing tag filtering.',
    },
    tech: ['TypeScript', 'Node.js'],
  },
  {
    title: {
      zh: '測試專案 3',
      en: 'Test Project 3',
    },
    description: {
      zh: '另一個測試專案。',
      en: 'Another test project.',
    },
    tech: ['React', 'Next.js'],
  },
]
```

Then test:
- ✓ Tags now include Node.js and Next.js
- ✓ Frequency sorting: React (2), TypeScript (3), others (1 each)
- ✓ Filtering works for all tags

**Step 6: Document completion**

Run final checks:
- ✓ No console errors
- ✓ No TypeScript errors
- ✓ All features working as designed
- ✓ All commits have been made

---

## Success Criteria

- [x] Technology tags displayed at top of Projects page
- [x] Tags sorted by usage frequency (most used first)
- [x] "All" tag to show all projects
- [x] Single tag selection mode
- [x] Selected tag highlighted in blue
- [x] Unselected tags in gray
- [x] Click selected tag to deselect
- [x] Projects filter based on selected tag
- [x] Empty state message when no matches
- [x] Bilingual support (zh/en)
- [x] Responsive design
- [x] Keyboard accessible
- [x] Smooth transitions

## Notes

- No external libraries needed
- No URL state management (can add later if needed)
- Tech tag names stay in English (not translated)
- Maintains existing design system and patterns
- All changes in single component for simplicity
