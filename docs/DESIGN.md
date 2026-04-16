# Design principles
## Brand grounding

Mural's identity is "structure and play," with black-bar structure and five core colors. The product direction emphasizes rounded corners, drop shadows, whitespace, and an accessible hierarchy.

This implementation mirrors that by:
- Using rounded corners + subtle shadows for note objects.
- Using a calm neutral view (white + "Natural") with bold accents for interactive states.
- Ensuring contrast rules remain intact (text + focus outlines).

## Tokens

Token categories:

- **Reference tokens** (raw values)
- **Semantic tokens** (meaningful roles, mapped for the shipped theme and organized so more themes can be added later)
- **Component tokens** are intentionally omitted (tokens-only system boundary)

Core palette values come from Mural's published brand assets page.

Implementation notes:

- Tokens should be authored in Style Dictionary source files.
- The runtime output should be semantic CSS variables for the product app.
- The default theme should be the only shipped theme for now.
- Future themes should be additive token sources, not new component APIs.

## Accessibility-driven visual rules

- Focus rings must be obvious and high contrast. WCAG requires visible focus.
- Focus should not end up hidden behind sticky UI.
- Never rely on color alone for meaning (filters show labels; selection uses outline + icon/marker).
- Maintain text contrast and non-text contrast for key cues.
- Visible labels and accessibility-only copy should come from the centralized English text module so terminology stays consistent across the UI.
- Treat WCAG as the baseline; WCAG 2.2 is the current recommendation track and covers a wide range of accessibility needs.

## Layout and interaction

- Overall shell: feed-first explorer with a persistent filter rail on the left, a dominant activity canvas in the center, and a right-side details panel that appears when a note is selected.
- Header: slim top bar inside the main content area with app title and a visible result count.
- Left sidebar: fixed-width white filter rail with grouped `<fieldset>` sections for authors, colors, and time range. Each row should support checkbox or radio semantics, clear text labels, and optional secondary cues like avatars or color swatches.
- Main content: canvas with a centered feed column. The feed column should use a readable max width and generous vertical spacing.
- Feed item anatomy: rounded white card, subtle border/shadow, thin vertical accent bar on the left that mirrors note color, author name and color label grouped at the top-left, timestamp aligned top-right, and note text as the primary content line below.
- Interaction: clicking or keyboard-selecting a note opens the right-side details panel. Selection and focus must be expressed with outline/elevation and never by color alone. Filter changes update the URL, keyboard users can move through the list without losing context, and sticky UI must not hide focused elements.
- Details behavior: the selected note opens in a right-side panel with the full note text and key metadata such as author, color, and created date/time. The panel should be dismissible and treated as a secondary layer.
