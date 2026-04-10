# Cardiff University Open Day Planner

This submission turns the starter repository into a more complete Open Day planning experience built around the provided programme feed.

## What changed

- Applied a clearer Cardiff-inspired visual identity and responsive layout
- Added searchable and filterable programme browsing by subject, session type, campus, and accessibility
- Added a browser-saved shortlist so users can build a personal plan and spot timing clashes
- Surfaced venue, room, campus, and accessibility information more clearly on each session
- Improved semantic structure, focus states, contrast, and keyboard support

## Requirements

The requirements documented for the exercise are in [docs/requirements.md](docs/requirements.md).

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

## Deployment note

`vite.config.js` uses a relative base path so the built site can be hosted on GitHub Pages without changing the repo name in source.
