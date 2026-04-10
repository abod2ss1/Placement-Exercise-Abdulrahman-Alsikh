# GitHub Pages Deployment

This site is deployed using [GitHub Pages](https://pages.github.com/) and [GitHub Actions](https://github.com/features/actions).

## How it works
- On every push to the `main` branch, the site is built and deployed to the `gh-pages` branch.
- The site is served from the `/docs` folder in the `gh-pages` branch.

## Setup
- Ensure your repository is public (or GitHub Pages is enabled for private repos).
- The workflow uses the `gh-pages` npm package for deployment.

## Custom domain
If you want to use a custom domain, add a `CNAME` file to the `public/` directory.
