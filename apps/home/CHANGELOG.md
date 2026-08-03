# Home Changelog

<!-- https://keepachangelog.com/en/1.0.0/ -->

## [0.1.0] (unreleased)
### Added
- Landing page for sawt, to be deployed at www.sawt.info: five large buttons,
  one per app, each linking to that app's subdomain (`week.sawt.info` and so
  on). The list lives in `src/apps.ts` and derives the subdomain from the slug,
  which is also the workspace folder name, so the three cannot drift apart
- Each button carries the target app's own `favicon.svg`, copied into
  `public/icons/`, so the mark on the button matches the one in the browser tab
  after you arrive
- Follows the OS light/dark preference with `light-dark()`, reusing the same
  token names as the five apps (`--bg`, `--fg`, `--button-bg`, `--active-bg`).
  No theme toggle — the page holds no state at all
- `vercel.json` redirects the apex `sawt.info` permanently to
  `https://www.sawt.info`, so `www` is canonical whichever host is typed. The
  `has` host condition matches the apex exactly, leaving `*.vercel.app` preview
  deployments alone
