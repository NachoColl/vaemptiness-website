# Suspending the site

How to take the public site down to a single holding page, and how to bring it
back. The suspension assets stay in the repo permanently — suspending and
restoring is a matter of flipping `permalink` values, not rewriting pages.

## The assets

| File | Role | Published when |
|---|---|---|
| `src/templates/index.njk` | The real homepage | site is live |
| `src/templates/index-suspended.njk` | Holding page: Ratnāvalī V.38 verse, no header/footer | site is suspended |
| `src/templates/ratnavali.njk` | Source page for the verse, linked from the holding page | site is suspended |

`index-suspended.njk` and `ratnavali.njk` are standalone documents. They do not
use `base.njk`, and that is deliberate — see the warning below.

## To suspend

1. `src/templates/index.njk` → add `permalink: false` to the front matter.
2. `src/templates/index-suspended.njk` → change `permalink: false` to `permalink: /`.
3. `src/templates/ratnavali.njk` → change `permalink: false` to `permalink: /ratnavali/`.
4. `src/templates/_includes/base.njk` → add the redirect below inside `<head>`,
   **before** the cache-buster script, so a non-home URL redirects in one hop
   instead of reload-then-redirect.
5. `src/templates/empresas.njk` → add the same redirect. This page sets
   `layout: null` and never renders `base.njk`, so it needs its own copy.
   Missing this is what left `/taller-empresas/` live through the February 2026
   suspension.

```html
<!-- Temporary suspension: redirect all pages to home. -->
<script>
  (function() {
    var home = "{{ '/' | url }}";
    var p = window.location.pathname;
    if (p !== home && p !== home + 'index.html') {
      window.location.replace(home);
    }
  })();
</script>
```

## To restore

Reverse all five steps: `permalink: false` on the two suspension pages,
`layout: base.njk` with no `permalink` on `index.njk`, and delete both redirect
blocks.

## Warnings

**Any page you want reachable during a suspension must not use `base.njk`.**
The redirect lives in that layout, so a normal page will bounce to home and be
unreachable. This is why the two suspension pages set `layout: null`.

**The redirect is client-side JavaScript, not a real redirect.** Every suspended
page still returns HTTP 200 with its full content. Crawlers, scrapers and
JS-disabled clients see the real page. The site looks suspended to ordinary
visitors but is not withdrawn. Genuine unreachability needs server-level
redirects, which GitHub Pages does not support.

**Only the suspension pages carry `noindex`.** The suspended pages still emit
`index, follow`, so search engines reaching them directly can keep indexing
them. For a long suspension, consider forcing `noindex` site-wide in `base.njk`.

## History

- Feb–Apr 2026 — suspended with a plain "Love." page (`528792b` … `5982a1e`).
- Aug 2026 — suspended with the Ratnāvalī V.38 page (`18c27e9`), restored the
  same month.
