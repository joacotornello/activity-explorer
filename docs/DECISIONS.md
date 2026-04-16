# Main project decisions
This document summarizes the main decisions made while building the project.

## Scalability

### Data limit for UI
I implemented a few safeguards to keep large amounts of data from making the UI heavy.
- Authors: this entity can grow significantly as the product grows. In this project, I render a limited number of authors and provide a simple expansion path with `Collapsible`. In the future, this could evolve into a fully virtualized and paginated solution, ideally with search.
- Notes in the explorer: notes are both paginated and virtualized in the UI. That allows the app to request large chunks of data through infinite scroll without overwhelming the page. Each note only shows minimal information upfront, and extra details are opened in a side panel. If the dataset grows further, this could naturally evolve into a full `/note/:id` route while keeping the initial request small.
- Filtering: all filtering happens in the backend through the API. The frontend never requests the full dataset and then performs heavy client-side operations.

## Tradeoffs

### No sorting in v1
As the expected time to complete the assignment is no more than 4 hours, I prioritized filtering and query-based navigation instead of adding sorting. The default feed already answers the main question well: what happened most recently.

### Notes positions
Given the expected build time of around 4 hours, there is one feature I intentionally left out: preserving and rendering the original note positions (`x` and `y`).

I considered it in the initial design, but in practice its main value here would be showing where the sticky note originally appeared on the board while reusing the current filtering capabilities. The real issue is scalability: to support hundreds or thousands of notes on a single board, I would need something much closer to Mural's rendering model. Rendering that many positioned notes in plain HTML would become noticeably slower.

I think the current feature set provides more value for the time available, and it is realistic to deliver well within the expected 4 hours.

### Single shipped theme (light theme)
For the take-home, the repo should document and implement a single shipped theme. That keeps the token pipeline, runtime setup, and UI testing much simpler during development.

That said, the structure should still remain theme-ready. Semantic tokens can live in per-theme source folders, so adding another theme later would mostly mean adding a new token set and generating another output, without changing component code.

### Per filter count
A nice addition would be showing the number of notes per author, per color, and even per time range. I decided not to implement that in this version because of the extra dynamic complexity.

With this minimal backend, returning the initial counts is straightforward. The harder part is recalculating and updating those numbers as the user combines multiple filters, which adds noticeable complexity to the data flow for limited product value in this scope.

### SEO
Even though SEO matters in many web applications, I intentionally kept it minimal here after considering the context.
- I do not know where this app would actually live. If it were embedded inside a larger product and not exposed as a public website, most SEO work would not matter. In a real project, that conversation would happen earlier.
- I still made sure to pass basic Lighthouse SEO checks. Open Graph, PWA support, external linking strategy, and full favicon coverage were left out of scope.

## Infrastructure

### Vite vs NextJS
The assignment is capped at about 4 hours, explicitly says the backend should stay simple/minimal, and makes it clear that the focus is frontend architecture, state management, performance, accessibility, and testing, not production-grade infrastructure.

This application also feels closer to an internal product surface inside Mural than to a public-facing website that needs strong SEO. There is no heavy routing, no multi-page flow, and no clear need for SSR.

Vite is a better fit here: faster startup, great HMR, less setup overhead, and a smaller dependency footprint.

### React-Query vs State Management
Server data lives in TanStack Query because it already handles the fetch lifecycle, caching, and pagination well. Shareable UI state such as filters lives in the URL, so the current view is reproducible and easy to debug. The remaining UI state is small enough to keep local.

Zustand, or a similar lightweight state library, would make more sense if there were more complex client-only coordination.

### Lightweight i18n without localization infrastructure
The app should still centralize product copy so text does not end up hardcoded across feature components. That is useful even before true localization exists, because it improves consistency, makes review easier, and lowers the cost of future edits.

### Atomic design style
To ensure agile scalability into a Design System in the future, I have implemented basic Atomic Design for foundational components that combined with the tokens makes product components tinier and easier to read.

### Backend
I chose a minimal backend instead of a plain `.json` file so I could better demonstrate pagination and frontend scalability concerns.

That said, I did not treat the backend as the core of the exercise. It was fully AI-assisted, with agents explicitly instructed to keep it simple and not over-engineer it. My focus was on the frontend.
