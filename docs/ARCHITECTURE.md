# Technical architecture
## Overview

The Activity Explorer is a feed-first application, not a board editor and not a dual-mode experience.
Its architecture should directly reflect the three visible product areas from the design:

- **Filter rail** on the left for authors, colors, and time range
- **Activity feed** in the center for chronological note exploration
- **Note details panel** on the right for the currently selected note

The system is still intentionally small and split into two runtime layers:

- **Frontend**: a TypeScript + React client that owns layout, URL state, interaction, accessibility, and rendering
- **Backend**: a minimal Node HTTP API that serves note data, filter metadata, and paginated feed results

The backend is not meant to model production infrastructure. Its job is to make the frontend exercise a realistic contract: typed queries, server-side filtering, total counts, and incremental loading.

## Runtime responsibilities

### Frontend

- Read URL search params as the source of truth for shareable filters
- Request metadata for authors, colors, and available date bounds
- Request feed pages using the active filters
- Read UI copy from a centralized English text module instead of scattering hardcoded strings across components
- Render a keyboard-accessible list of notes
- Maintain the selected note locally and open or close the details panel
- Preserve visible focus when users move between sticky sidebar, feed, and details panel

### Backend

- Load the dataset and expose typed JSON endpoints
- Apply filtering by author, color, and time range on the server
- Return total result counts for the current query
- Return stable cursor-based pagination for the feed

## Domain model

The core domain object is a `StickyNote`.

```ts
type NoteColor = "red" | "yellow" | "blue" | "green" | "purple";

type TimeRangePreset = "all" | "today" | "week" | "month";

type AuthorSummary = {
  id: string;
  name: string;
};

type StickyNote = {
  id: string;
  text: string;
  color: NoteColor;
  author: AuthorSummary;
  createdAt: string;
};
```

Notes should already contain the information needed by both the feed card and the details panel. That keeps selection fast and avoids requiring another fetch just to open the right rail.

## Data flow

1. The app boots and requests `/api/meta`.
2. The frontend parses URL params into a `FeedQuery`.
3. The frontend requests `/api/notes` with that query and stores the result in the query cache.
4. The activity feed renders a virtualized list of note cards from the loaded pages.
5. When a note is selected, the note details panel opens using the note already present in client state.
6. When filters change, the URL updates first, then the query cache refetches against the new `FeedQuery`.

Selection is UI state, not server state. It may optionally be mirrored in the URL later, but it does not need to be part of the initial architecture.

## API contract

### `GET /api/meta`

Used to populate the left rail and bootstrap global context.

Response:

```json
{
  "total": 523,
  "authors": [
    { "id": "user_1", "name": "Sarah Chen" }
  ],
  "colors": [
    { "id": "blue", "label": "Blue" }
  ],
  "timeBounds": {
    "min": "2026-03-01T10:00:00Z",
    "max": "2026-04-15T12:00:00Z"
  },
  "timeRangePresets": ["all", "today", "week", "month"]
}
```

Notes:

- `total` is the total number of notes in the dataset before filters
- author and color counts are global counts used to label filter options
- `timeBounds` supports future expansion beyond preset ranges

### `GET /api/notes`

Used by the center feed.

Query params:

- `limit`: page size, for example `50`
- `cursor`: opaque cursor for the next page
- `authors`: comma-separated author ids
- `colors`: comma-separated color ids
- `timeRange`: one of `all | today | week | month`
Example:

`GET /api/notes?limit=50&authors=user_1,user_2&colors=blue,yellow&timeRange=today`

Response:

```json
{
  "items": [
    {
      "id": "note_42",
      "text": "User research shows 85% prefer the simplified onboarding flow",
      "color": "blue",
      "author": {
        "id": "user_1",
        "name": "Sarah Chen"
      },
      "createdAt": "2026-04-15T09:30:00Z"
    }
  ],
  "total": 38,
  "nextCursor": "eyJjcmVhdGVkQXQiOiIyMDI2LTA0LTE1VDA5OjMwOjAwWiIsImlkIjoibm90ZV80MiJ9",
  "hasMore": true
}
```

Notes:

- `total` is the total count for the active filter set and powers the result count in the header
- cursor pagination is preferred over page numbers because the product is a chronological feed
- `text` is the full note text, which is enough to render both the card and the details panel

## Tokens architecture

The token system should stay intentionally small, but it should still be built on **Style Dictionary** so the app can grow into a broader design system later without replacing the foundation.

### Token model

Use only two token layers for the first iteration:

- **Reference tokens** for raw values such as brand colors, spacing scale, radius, shadow, and typography primitives
- **Semantic tokens** for UI roles such as `surface`, `text-primary`, `border-muted`, `focus-ring`, and note color roles

Component tokens are intentionally out of scope for now.

### Theme strategy

- Ship a single default theme and emit it to `:root`
- Keep semantic tokens grouped by theme name in the source files so future themes can be added as sibling folders without changing how app code consumes tokens
- Application code should consume **semantic CSS variables only**, not raw palette values

This removes runtime theme-switching complexity for the take-home while leaving room for additional themes later.

### Build and output contract

- Token source files live outside the app runtime source in a dedicated `tokens/` directory
- A single Style Dictionary config builds the runtime artifact
- The primary output is one generated CSS file that contains the default semantic variables for the shipped theme
- The product app imports that generated CSS once near the app entry point and uses `var(--token-name)` everywhere else
- Additional outputs such as TypeScript, JSON, platform-specific artifacts, or future theme override files can be added later from the same token source without changing how the app consumes tokens today

The goal is to keep the build flow as small as possible:

1. Edit token source files in `tokens/src/`
2. Run one command such as `build:tokens`
3. Import the generated CSS file in the app shell

## Frontend tech stack
- React & TypeScript & Vite 8
- SCSS using DS tokens
- Native fetch & URLSearchParams
- Jest & React Testing Library & jest-dom
- ESLint
- Prettier

### SCSS Styling

We avoid lage .scss grouping unrelated classes in the same file. We prefer atomic .scss for specific components.

## Component composition rule

Use a simple atomic design approach in the frontend to keep components reusable and easy to evolve:

- **Atomic components** are the smallest reusable UI pieces such as buttons, badges, avatars, inputs, and layout primitives
- **Composite components** combine atomic pieces into reusable patterns such as filter groups, note metadata rows, or card headers

Prefer moving UI into the smallest reusable level that makes sense. Shared atoms and composites can live under `src/shared/ui/`, but complex components should stay inside their feature slice. If a piece only makes sense within one feature, keep it feature-scoped.

## Backend tech stack
- Node.js & TypeScript & Express -> Lightweight
- fs/promises & local notes.json

## Key architectural decisions

- **Feed-first, no board mode**: the design only supports activity exploration, so the architecture should not reserve top-level space for a board canvas mode
- **URL-backed filters**: authors, colors, and time range are shareable and debuggable
- **Local selection**: the open note is transient UI state and does not need backend coordination
- **Cursor pagination**: better matches an infinite chronological feed with scrolling than page-based pagination
- **Style Dictionary-backed tokens**: tokens stay as the only design-system boundary, with semantic CSS variables generated for a single shipped theme while the token source layout remains ready for additional themes later
- **Centralized app text**: UI strings live in one typed English dictionary with a tiny helper, avoiding hardcoded copy without introducing locale infrastructure in v1
