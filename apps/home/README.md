[![Version](https://img.shields.io/badge/version-0.51.0-blue.svg)](https://github.com/amerharb/sawt)
# Home

The landing page for [sawt](../../README.md), deployed at
**https://sawt.info**. One large button per app, each linking to that
app's own subdomain.

| button | goes to |
| --- | --- |
| Week | https://week.sawt.info |
| Flag | https://flag.sawt.info |
| Color | https://color.sawt.info |
| Number | https://number.sawt.info |
| Anthem | https://anthem.sawt.info |
| Face | https://face.sawt.info |
| Map | https://map.sawt.info |
| Verb | https://verb.sawt.info |
| Dino | https://dino.sawt.info |

The Face button is beta-gated (`beta: true` in `src/apps.ts`), so production
hides it until its tile is wanted — dev and `VITE_SHOW_BETA=true` builds show
everything.

The list lives in [`src/apps.ts`](src/apps.ts) — the subdomain is derived from
the slug, which is also the workspace folder name, so the three can't drift
apart.

## How it works

No storage, no audio — a static page, until you sign in. It follows the
operating system's light/dark preference via `light-dark()` and reuses the
same token names as the apps (`--bg`, `--fg`, `--button-bg`, `--active-bg`)
so the landing page and the apps look like one family. There is no theme
toggle, because there is nothing to remember.

## Signing in

The round button top right — an arrow into a box, or a person in a circle
once someone is in, the words and the name in its tooltip, as ⚙️'s 👤
draws them in the apps — is the family's sign-in —
[baab](https://github.com/amerharb/baab) — as this page shows it. The sheet
asks for an email, baab mails a six-digit code and a magic link, and
behind the code is the account: the handle baab minted (eight characters,
`K7Q4-X2M9`), a nickname to set, Sign out, and a way to delete the account,
which asks first.

The session is baab's httpOnly cookie for `.sawt.info`, so signing in here
signs in every app under it, and nothing about it is kept on this side — the
page asks baab who is in on every load, and again when the tab is looked at.
The magic link lands here as `?login=<token>`; the page takes the token out of
the address bar before spending it, then opens the sheet to say how it went.

The sheet and this page's foot link the privacy notice — plain HTML on
this page's tokens, no script, at an address per language:
`/privacy/<code>` — English at `/privacy/en`, then Arabic, German and
Swedish so far — which Vercel serves without `.html` (`cleanUrls` in
`vercel.json`). Each page names its language and direction on `<html>`,
lists the others as `hreflang` alternates with `/privacy/en` as
`x-default`, and links them in a switcher at the top; a translation says
the English text is the one followed where the two differ. The sheet
links the notice in the app's interface language where there is one,
English otherwise, and this page's foot links `/privacy/en`. `/privacy`
itself, and an address for a language the notice is not written in —
`/privacy/xx` — redirect to `/privacy/en`: on Vercel by redirects in
`vercel.json`, in Vite's dev and preview servers by the same rule, both
made from `notice/languages.json` by `notice/fallback.mjs`. The redirects
are temporary, so no browser keeps them when a language is added.

The pages are written, not hand-kept: `notice/template.html` holds the
page, `notice/<code>.json` its texts, and `notice/languages.json` the
languages. `npm run privacy -w home` writes `privacy/<code>.html`, and the
redirects into `vercel.json`; the
build runs it with `--check` first, so a text changed without writing the
pages, or a language added without moving the redirect, cannot ship. A new language is its
texts file, a line in `languages.json`, and its code in the sheet's
`PRIVACY_LANGUAGES` (`packages/game/src/BaabSheet.tsx`), which a test keeps
in step. The notice says what each service keeps, read from their code,
so it changes when they do.

The client, the session hook and the sheet are shared
(`packages/game/src/baab.ts`, `useBaab.ts`, `BaabSheet.tsx`); this page hands
the sheet its English strings from `src/strings.ts` and styles its class
names in `index.css`. Open to everyone since 0.49.0, it is gated only by
`VITE_BAAB_ENABLED` and `VITE_BAAB_URL` in `.env` — a build without them
draws nothing and asks baab nothing. For development, a
`.env.local` pointing `VITE_BAAB_URL` at a local baab (see its README) makes
the console the inbox.

Each button carries the app's **own** `favicon.svg`, copied into
`public/icons/`. Those are hand-drawn per app, so the buttons show the same mark
you see in the browser tab once you arrive.

## Deploying

Its own Vercel project alongside the apps — same setup as the others (see
the [root README](../../README.md)), with Root Directory `apps/home`.

`vercel.json` adds one thing the apps don't need: a permanent redirect from
`www.sawt.info` to the apex `https://sawt.info`, so the apex is canonical no
matter which host a visitor types — as the page's canonical link and `og:url`
say. The `has` host condition matches `www` exactly, so preview deployments on
`*.vercel.app` are unaffected.

Add both `sawt.info` and `www.sawt.info` to this project in the Vercel
dashboard — the redirect only fires for requests the project actually receives.

## Setup environment

- Node 24 or above
- From the workspace root: `npm install`
- Dev server: `npm run dev -w home`
- Build: `npm run build -w home` (output in `dist/`)
- Preview the production build: `npm run preview -w home`

## Credits

The button icons are each app's own favicon. `public/favicon.svg` for this
page is a placeholder sound-wave mark — unlike the app icons it is not
hand-drawn, and is worth replacing when the branding settles.
