# Fully client-side rendered testbricks site

## What's being asked

Make the app React + Vite with fully client-side rendering, then finish the testbricks landing page.

## Note on the stack

The project already runs on **React 19 + Vite 8**. The router is TanStack Router, which is fixed for this platform and can't be swapped for a bare `react-router` SPA setup. What *can* change — and what makes the practical difference — is turning **SSR off** so the app ships as a pure client-rendered SPA: the server sends an empty HTML shell and React renders everything in the browser. That's the change this plan makes.

## Changes

### 1. Disable SSR globally
- In `vite.config.ts`, keep the existing `@lovable.dev/vite-tanstack-config` wiring and add the TanStack Start option to disable server rendering, so every route is client-rendered and prerendering is off.
- In `src/router.tsx`, set `defaultSsr: false` on `createRouter` so no route opts back into server rendering.

Result: HTML shell + JS bundle only. No SSR data loading, no hydration mismatches, no Worker-side render path for page content. The existing `src/server.ts` error wrapper and `src/start.ts` middleware stay in place — they still serve the shell and keep server-function protection intact for any future backend work.

### 2. Confirm nothing depends on SSR
- The site is static marketing content with no loaders, no server functions, and no data fetching — nothing to migrate.
- `head()` metadata still works: TanStack Router writes title/description/OG tags into the document from the client. Note the tradeoff below.

### 3. Finish the landing page
`src/routes/__root.tsx` (fonts + root meta) and `src/styles.css` (Sandy Shore palette) are already done. Remaining work is `src/routes/index.tsx`, which still holds the blank-page placeholder. Build the single-page site:

1. **Nav** — `testbricks` wordmark, GitHub + PyPI links.
2. **Hero** — "Run Databricks workflows on your laptop", subtitle, `pip install testbricks` copy chip, two CTAs.
3. **Features** — cards for SparkProxy (delta reads/writes → CSV), drop-in `dbutils` mock, `LocalWorkflowRunner` (parses workflow JSON, runs notebooks in dependency order), zero-cluster local dev.
4. **Code** — tabbed block with the three provided snippets (SparkMock, dbutils, LocalWorkflowRunner) plus copy-to-clipboard.
5. **How it works** — three-step flow.
6. **Footer** — links and a chill sign-off.

Plus a route-specific `head()` with a testbricks title, description, and OG/Twitter tags.

## Tradeoff worth knowing

With SSR off, crawlers and link-preview bots that don't run JavaScript see an empty shell instead of the page content. Google renders JS and will index it fine; some social preview scrapers won't pick up the OG tags. For a library landing page this is usually acceptable, but say the word if SEO/social previews matter and I'll keep SSR on for the index route only.

## Technical details

- `vite.config.ts`: add `spa: { enabled: true }` (or the equivalent `ssr: false` flag for the installed TanStack Start version) under `tanstackStart`, verified against the installed `@tanstack/react-start` 1.168.
- `src/router.tsx`: `createRouter({ ..., defaultSsr: false })`.
- No new dependencies. No changes to `src/start.ts` or `src/server.ts`.
- Verify with a production build plus a browser check that the page renders and that the served HTML shell is client-hydrated.
