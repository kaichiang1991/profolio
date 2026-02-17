# Project Tag Filter System Design

## Overview

Add a tag filtering system to the Projects page that allows users to filter projects by technology. Display all used technologies as clickable tags at the top of the page, sorted by usage frequency.

## User Requirements

- Display technology tags at the top of the page, sorted by frequency (most used first)
- Click a tag to filter projects that use that technology
- Single selection mode (clicking a new tag replaces the previous selection)
- Selected tag should be highlighted (blue), unselected tags remain gray
- Include an "All" tag to clear filters and show all projects
- Clicking the selected tag again clears the filter
- No project count displayed next to tags

## Approach

Pure frontend state management using React `useState` within the `Projects.tsx` component. No external libraries, no URL parameters, keeping the implementation simple and maintainable.

## Architecture

### State Management

```typescript
const [selectedTag, setSelectedTag] = useState<string | null>(null)
```

- `null` = show all projects (default state)
- `string` = filter by the selected technology tag

### Tag Calculation Logic

```typescript
// 1. Collect all technology tags from projects
const allTechs = projects.flatMap(p => p.tech)

// 2. Count frequency
const techFrequency = allTechs.reduce((acc, tech) => {
  acc[tech] = (acc[tech] || 0) + 1
  return acc
}, {} as Record<string, number>)

// 3. Sort by frequency (descending) and extract tag names
const sortedTags = Object.entries(techFrequency)
  .sort((a, b) => b[1] - a[1])
  .map(([tech]) => tech)
```

### Filtering Logic

```typescript
const filteredProjects = selectedTag === null
  ? projects
  : projects.filter(p => p.tech.includes(selectedTag))
```

### Interaction Handlers

- Click "All" tag → `setSelectedTag(null)`
- Click any other tag → `setSelectedTag(tagName)`
- Click currently selected tag → `setSelectedTag(null)` (toggle off)

## UI Design

### Layout Structure

```
[Page Title]
[Page Subtitle]
[Tag Filter Bar] ← NEW
[Project Grid]
```

### Tag Component

```tsx
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
      {locale === 'zh' ? '全部' : 'All'}
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
```

### Styling Details

- **Unselected state**: `bg-zinc-100 text-zinc-600` (gray, matches existing project card tags)
- **Selected state**: `bg-blue-600 text-white` (blue highlight, matches site theme)
- **Hover effects**: `hover:bg-zinc-200` (unselected) / `hover:bg-blue-700` (selected)
- **Shape**: `rounded-full` (pill shape, consistent with current design)
- **Transition**: `transition-colors duration-200` (smooth color changes)

## Edge Cases

### No Projects
- Tag filter bar does not render (no tags to show)
- Maintains existing empty state display

### No Filtered Results
Display a friendly message:
```tsx
{filteredProjects.length === 0 && (
  <p className="text-zinc-500 text-center py-12">
    {locale === 'zh' ? '沒有使用此技術的專案' : 'No projects using this technology'}
  </p>
)}
```

### Single Project
- Tag system still works normally
- All tags have frequency of 1

## Accessibility & UX

- Use `<button>` elements for tags (not `<span>`) for keyboard navigation
- Tags are keyboard accessible (Tab navigation, Enter/Space to activate)
- Instant filtering with no loading states needed
- Responsive design: tags wrap on smaller screens (`flex-wrap`)
- Maintains existing hover animations and transitions

## Affected Files

- `src/pages/Projects.tsx` — add tag filter bar, state management, and filtering logic
- `src/i18n/zh.ts` — add translations for "All" tag and empty state message
- `src/i18n/en.ts` — add translations for "All" tag and empty state message

## Implementation Notes

- Keep all logic within `Projects.tsx` for simplicity
- No need for separate components or hooks for this feature
- Can be easily upgraded to URL-based filtering later if needed
- Follow existing code style and naming conventions
