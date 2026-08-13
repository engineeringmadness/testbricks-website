# testbricks — Landing Page

A single-page marketing site for the **testbricks** Python library (run Databricks workflows locally with SparkProxy, dbutils mock, and a workflow runner). Chill, beachy vibe.

## Scope
- One route: rewrite `src/routes/index.tsx` (replace the placeholder). No new routes, no backend, no auth.
- All content lives on one scrolling page. Light, warm theme.

## Design direction (Sandy Shore palette)
Tokens mapped into `src/styles.css` (converted to oklch at build time):
- `--background` → `#f6f1e7` (warm sand cream)
- `--card / --secondary` → `#e8d5b7` (light sand)
- `--primary` → `#2a9d8f` (teal — main accent, buttons, links)
- `--accent` → `#f4a261` (coral amber — highlights, code chips)
- `--foreground` → `#264653` (deep teal — text/headings)
- Rounded, soft shadows (`--radius` ~0.75rem), generous whitespace, subtle hover lifts.

Typography:
- Headings: **Sora** (friendly geometric, chill).
- Body: **Manrope**.
- Code: **JetBrains Mono**.
- Loaded via `<link>` in `src/routes/__root.tsx` head; referenced in `@theme`.

Layout: single-column stacked full-width sections, centered max-width container (~`max-w-5xl`):
1. **Nav** — logo `testbricks`, GitHub + PyPI links.
2. **Hero** — tagline ("Run Databricks workflows on your laptop"), one-line subtitle, install command (`pip install testbricks` copy chip), two CTAs (Get started → #code, GitHub).
3. **Features** — 3–4 cards: SparkProxy (delta ↔ CSV), dbutils drop-in mock, LocalWorkflowRunner (parses workflow JSON, runs notebooks in dependency order), zero-cluster local dev.
4. **Code** — three labeled code segments (the user-provided examples) in a tabbed/segmented code block with syntax-styled mono:
   - SparkMock usage
   - dbutils usage
   - LocalWorkflowRunner usage
5. **How it works** — short 3-step flow (mock spark → mock dbutils → run workflow JSON).
6. **Footer** — name, tagline, GitHub/PyPI links, "built with a chill vibe".

## Code segments (verbatim content, cleaned)

SparkMock:
```python
from testbricks import SparkMock

spark = SparkMock("./data")
```

dbutils:
```python
from testbricks.dbutils import dbutils

dbutils.widgets.text("filter_country", "ALL")
country = dbutils.widgets.get("filter_country")
```

LocalWorkflowRunner:
```python
from testbricks import LocalWorkflowRunner

runner = LocalWorkflowRunner(
    source_dir="./notebooks",
    workflow_json_path="./workflow.json",
    base_path="./data",
)
runner.run_workflow(extra_globals={"spark": spark})
```

## Technical notes
- Tailwind v4: register new color tokens under `@theme inline` + `:root` in `src/styles.css` (oklch values). No `tailwind.config.js`.
- Fonts via `<link>` in `__root.tsx`; update root head title/description to testbricks ("testbricks — Run Databricks workflows locally").
- index.tsx gets its own `head()` with title "testbricks — Run Databricks workflows on your laptop", description, og/twitter.
- Code block: a small React component with three tabs, plain `<pre><code>` styled with `font-mono`, teal/coral token colors via inline spans (no heavy syntax highlighter dependency — keep it light). Copy-to-clipboard button.
- No new dependencies; pure React + Tailwind.

## Out of scope
- No docs pages, no API reference, no backend, no database.
- No real GitHub/PyPI links wired to a backend — use placeholder hrefs (`#` or `https://github.com`) the user can swap.

## Build steps
1. Update `src/styles.css` — add Sandy Shore tokens (oklch) + font tokens.
2. Update `src/routes/__root.tsx` — add Google Fonts `<link>`, set root title/meta.
3. Rewrite `src/routes/index.tsx` — full landing page with `head()`, sections, code-segment component.
4. Verify build + preview.
