# CU Open Day Requirements

## Context

The supplied repository already consumes a Cardiff University Open Day feed, but the user experience is minimal. Prospective students need a clearer way to browse sessions, compare venues, and shape a day plan quickly on mobile and desktop.

The data feed in this exercise represents a programme snapshot for Friday 27 June 2025.

## Product goal

Create a more engaging, accessible, and visually polished Open Day experience that helps prospective students understand what is available and organise their visit with less friction.

## Functional requirements

`FR1` The homepage must present the Open Day as a Cardiff University-branded experience rather than a starter template.

`FR2` Users must be able to browse the programme by session, with the key details visible at a glance:
- title
- subject area
- start and end time
- venue and room
- campus
- session type

`FR3` Users must be able to narrow the programme using common planning controls:
- keyword search
- subject filter
- session type filter
- campus filter
- accessible venue filter
- sort order

`FR4` Users must be able to save sessions into a lightweight personal shortlist without creating an account.

`FR5` The shortlist must help users spot timing clashes between saved sessions.

`FR6` Session cards must provide additional venue context and a link to venue accessibility information where available in the feed.

## Non-functional requirements

`NFR1` The layout must be responsive and remain usable down to small mobile widths.

`NFR2` Core interactions must be keyboard accessible and use semantic HTML where possible.

`NFR3` Visual design must use high-contrast text, visible focus states, and clear interaction affordances consistent with WCAG 2.2 AA principles.

`NFR4` The solution must continue to use the provided static feed and work as a client-side application deployable to GitHub Pages.

`NFR5` The interface should keep the large programme approachable by using progressive disclosure, concise summaries, and clear empty states.

## Assumptions

- No authentication or cross-device persistence is required for the shortlist.
- The supplied feed is treated as the source of truth for timing, venues, and accessibility flags.
- A full campus map, route planner, and live updates are out of scope for this exercise.

## Acceptance checks

- The page loads successfully from the provided JSON feed.
- Users can filter and search the programme without reloading the page.
- Saved sessions persist in the current browser via local storage.
- Saved sessions display in time order and flag overlaps.
- The production build works with a relative base path suitable for GitHub Pages.
