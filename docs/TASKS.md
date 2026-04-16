# Implementation Tasks

Target build time: approximately 4 hours (`240 minutes`).

Path note: file paths below follow current repo structure first. When implementation differs from earlier planning, keep existing folders and update this document instead of forcing a refactor.

## Foundation

- [x] Bootstrap client, server, and quality tooling
  - Estimated time: `20 min`
  - Files to create/modify: `package.json`, `tsconfig.json`, `vite.config.ts`, `jest.config.ts`, `src/test/setup.ts`, `.eslintrc.*`, `.prettierrc`
  - Acceptance criteria:
    - One command starts the app and API together.
    - `test`, `typecheck`, and `lint` scripts exist and run.
    - TypeScript is used across frontend and backend.

- [x] Add tokens pipeline and base shell styles
  - Estimated time: `20 min`
  - Files to create/modify: `tokens/src/base/*.json`, `tokens/src/semantic/light.json`, `tokens/style-dictionary.config.mjs`, `src/shared/styles/tokens.css`, `src/app/layout/AppShell.*`
  - Acceptance criteria:
    - Semantic CSS variables are generated and imported once near the app entry point.
    - The shell supports the left rail, center feed, and right details panel layout.
    - Focus-ring tokens exist and are used by the app.
    - The token folder structure is ready for future themes without requiring app-level refactors.

- [x] Add centralized English-only app text helper
  - Estimated time: `10 min`
  - Files to create/modify: `src/shared/i18n/locales/en.json`, `src/shared/i18n/index.ts`, `src/shared/i18n/index.test.ts`, relevant feature UI files
  - Acceptance criteria:
    - User-facing copy is read from a centralized text module instead of inline string literals.
    - The dictionary is organized by feature or screen intent so labels remain easy to find and update.
    - Button labels, filter labels, loading text, empty states, error states, and accessibility-only strings all use the same centralized source.
    - The helper supports simple named interpolation for dynamic labels such as result counts.
    - The public API stays synchronous and tiny, for example a typed dictionary export plus a small `t()` function.
    - Only English is supported in v1.
    - No locale provider, language switcher, browser language detection, or runtime translation loading is introduced.

## Backend Contract

- [x] Create seed data and typed contracts
  - Estimated time: `25 min`
  - Files to create/modify: `server/data/notes.json`, `src/entities/note/model/types.ts`, `server/api/contracts/notes.ts`
  - Acceptance criteria:
    - `StickyNote`, filter enums, and response types are explicit.
    - Frontend and backend use compatible typed shapes.
    - The dataset is realistic enough to exercise filtering and pagination.

- [x] Implement pure note query engine and API routes
  - Estimated time: `20 min`
  - Files to create/modify: `server/domain/notes/queryNotes.ts`, `server/domain/notes/cursor.ts`, `server/domain/notes/getMeta.ts`, `server/api/routes/metaRoute.ts`, `server/api/routes/notesRoute.ts`, `server/index.ts`
  - Acceptance criteria:
    - `GET /api/meta` returns global counts and time bounds.
    - `GET /api/notes` supports cursor pagination.
    - `GET /api/notes` supports filtering by author, color, and time range.
    - `GET /api/notes` supports deterministic newest-first ordering.

## Core UX

- [x] Centralize URL state, query parsing, and API client code
  - Estimated time: `20 min`
  - Files to create/modify: `src/features/filter-rail/model/searchParams.ts`, `src/shared/api/client.ts`, `src/features/filter-rail/api/getMeta.ts`, `src/features/activity-feed/api/getNotes.ts`, `src/app/providers/QueryProvider.tsx`
  - Acceptance criteria:
    - URL search params are the source of truth for filters.
    - Parse and stringify behavior round-trips predictably.
    - TanStack Query keys are deterministic and based on typed query input.

- [x] Create shared UI base components
  - Estimated time: `35 min`
  - Files to create/modify: `src/shared/ui/atomic/*`, `src/shared/ui/composite/*`, related component SCSS files
  - Acceptance criteria:
    - Atomic components exist for `Button`, `IconButton`, `Checkbox`, `Radio`, `Avatar`, `Badge`, `ColorSwatch`, `Surface`, `MetadataItem`, and `VisuallyHidden`.
    - Composite components exist for `FilterSection`, `AuthorFilterOption`, `ColorFilterOption`, `TimeRangeFilterGroup`, `ResultSummary`, `NoteListItem`, `NoteTitleBanner`, `NoteMetadataList`, `EmptyState`, and `LoadingState`.
    - The component contracts are implemented against the current shared domain types, including `StickyNote`, `NoteColor`, and `TimeRangePreset`, instead of introducing parallel note model types.
    - Checkbox and radio wrappers use native inputs underneath, buttons use native `button` elements, and non-text selection states are visible without relying on color alone.
    - Styling stays token-driven and app-scoped, and does not introduce shared design-system components beyond the existing token boundary.

- [x] Compose the explorer page, feed view, and note details panel
  - Estimated time: `30 min`
  - Files to create/modify: `src/app/components/ActivityExplorerPage/*`, `src/app/components/FeedView/*`, `src/app/components/ExplorerHeader/*`, `src/app/components/NoteDetailsPanel/*`, `src/shared/ui/composite/ResultSummary/*`, `src/shared/ui/composite/NoteListItem/*`, `src/shared/ui/composite/NoteTitleBanner/*`, `src/shared/ui/composite/NoteMetadataList/*`, `src/entities/note/lib/formatters.ts`
  - Acceptance criteria:
    - `ActivityExplorerPage` owns query state, selected note id, loading, empty, and error branching, and wires together `FiltersSidebar`, `ExplorerHeader`, `FeedView`, and `NoteDetailsPanel`.
    - `ExplorerHeader` presents the title area plus `ResultSummary`.
    - `FeedView` renders newest-first by default and uses `NoteListItem` to show selection, note metadata, and the author/color affordances needed by the feed-first UI.
    - Selecting a note opens `NoteDetailsPanel` without requiring another fetch, and the panel uses `IconButton`, `NoteTitleBanner`, and `NoteMetadataList`.
    - Loading, empty, and error states are clear, understandable, and reusable through the shared composite components.

## Performance

- [x] Virtualize the activity feed and load more incrementally
  - Estimated time: `20 min`
  - Files to create/modify: `src/app/components/FeedView/*`, optional `src/app/components/VirtualizedNoteList/*`, `src/shared/ui/composite/NoteListItem/*`
  - Acceptance criteria:
    - `FeedView` virtualizes `NoteListItem` rows so only visible items are rendered.
    - The next page loads when the user nears the bottom.
    - The feed remains responsive with hundreds of notes.

## Accessibility

- [x] Add focus management and screen-reader support where it matters
  - Estimated time: `15 min`
  - Files to create/modify: `src/app/components/ActivityExplorerPage/*`, `src/app/components/NoteDetailsPanel/*`, `src/shared/lib/a11y.ts`, `src/shared/ui/atomic/*`, `src/shared/ui/composite/*`, related styles
  - Acceptance criteria:
    - Visible focus is present on every interactive control.
    - Sticky UI does not hide the focused element.
    - Loading, result-count, empty, and error messaging are announced appropriately.
    - Selection and pressed or checked states in shared UI primitives are not conveyed by color alone.

## Tests

- [x] Cover pure logic with unit tests
  - Estimated time: `20 min`
  - Files to create/modify: `server/domain/notes/queryNotes.test.ts`, `src/features/filter-rail/model/searchParams.test.ts`, `src/entities/note/lib/*.test.ts`, `src/shared/ui/composite/*.test.tsx`, `src/shared/i18n/index.test.ts`
  - Acceptance criteria:
    - Filtering, cursor behavior, time-range logic, query-param mapping, filter option mapping, result-summary text, note metadata formatting, selected-note behavior, and i18n interpolation are tested.
    - Edge cases such as empty filters and equal timestamps are covered.

- [x] Add integration/API tests and complete final verification
  - Estimated time: `35 min`
  - Files to create/modify: `src/app/components/ActivityExplorerPage/ActivityExplorerPage.test.tsx`, `server/api/routes/notesRoute.test.ts`, optional `*.a11y.test.tsx`
  - Acceptance criteria:
    - One UI integration test proves filter changes update the URL and refresh results.
    - Integration coverage includes keyboard interaction for shared buttons, checkboxes, and radios, clear-filter behavior, note selection opening the details panel, and accessible loading, empty, and error announcements.
    - One API test proves pagination and total counts work correctly.
    - `yarn run test`, `yarn run typecheck`, and `yarn run lint` pass before handoff.
