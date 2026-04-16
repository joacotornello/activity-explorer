# AGENTS.md

## CODING BEHAVIOR

Before and after writting code, you must follow these practices:

- Before making any changes, check for similar implementations in the code repositroy, and _prioritize reusing code and implementing similar solutions instead of re-making everything_.

## Mission

Build a small, high-signal solution for the Mural take-home.
Optimize for:
- frontend architecture
- accessibility
- performance
- testability

## Non-negotiables

- Use TypeScript everywhere.
- Use Jest for automated tests.
- The design system exposes tokens only. Do not build shared design-system components.
- Prefer a small, strong feature set over a wide, shallow one.
- Every change must be easy to explain.
- Don’t over-engineer global state—server-state should live in TanStack Query; UI-state can live in URL + local component state.

## Scope guardrails

- This app is an activity explorer, not a full board editor.
- Prioritize loading, exploring, filtering, sorting, and understanding note activity.
- Prefer one primary flow implemented well over multiple half-finished flows.

## Architecture rules

- Separate:
  - server state
  - UI/view state
  - pure domain logic
- Keep data fetching, feature UI, domain utilities, and tokens in separate modules.
- Prefer pure functions for filtering, sorting, parsing, and time-based logic.
- Keep components small and focused; use atomic design principles.
- Prefer composition over inheritance or large generic abstractions.
- Do not introduce a global state library unless there is a clear need.
- Do not introduce big barrel files that exports unrelated modules; prefer small and scoped index.ts.
- Prefer URL/search params for filter and sort state.
- *Prefer grouping exports instead of multiple inline exports; use inline exports only when there's one export.*
- *Split file code in domains: file.tests, file.types, file.handlers, file.ts (main logic)*

## Performance rules

- Assume the board can contain hundreds of notes.
- Avoid rendering large unvirtualized lists; prefer virtualization.
- Prefer server-side chunking/pagination/filtering.
- Memoize only when it removes obvious re-render churn.

## Accessibility rules

- Use native HTML controls first.
- All interactive controls must be keyboard reachable and usable.
- Visible focus states are mandatory.
- Never rely on color alone to communicate meaning or selection.
- Use semantic HTML before ARIA.
- Add ARIA only when native semantics are insufficient.
- Filters should be grouped with clear labels.
- Loading, empty, and error states must be understandable to screen readers.
- Prefer predictable focus order and avoid focus traps unless a modal/drawer requires it.

## Testing rules

- Any behavior change should come with tests.
- Minimum expectation: unit tests + integration tests.
- Prioritize tests for:
  - filtering logic
  - recent/highlight logic
  - query param/state mapping
  - loading/empty/error states
  - key user interactions
- Prefer assertions on behavior, not implementation details.
- Run relevant tests, typecheck, and lint before finishing.
- If something fails, fix it or report the exact failure clearly.

## Dependency rules

- Keep dependencies minimal.
- Add a dependency only if it saves meaningful time or complexity.

## Code style rules

- *NEVER* use loose values in .scss files where a token can be used.
- Follow existing patterns before inventing new ones.
- Prefer explicit names over short clever names.
- Prefer small functions with **single clear responsibilities**.
- Keep branching shallow where possible.
- Extract helpers when they improve readability or testability.
- Avoid “utility dumping grounds”.
- Do not leave dead code, commented-out code, or placeholder TODO spam.
- Name event handlers with handle or on: e.g., handleClick, onChangeInput.
- Avoid spreading unknown props to DOM nodes; pass only valid HTML attributes to prevent React warnings and a11y issues.

## Commenting and documentation rules

- Comment intent, invariants, and trade-offs.
- Do not comment obvious code.

## Default implementation bias for this repo

When choosing between options, bias toward:
- accessible native controls
- deterministic state
- pure domain helpers
- virtualized list rendering
- a minimal backend contract
- token-driven styling
- strong tests on core behavior