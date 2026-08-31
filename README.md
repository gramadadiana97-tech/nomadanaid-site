# Nomadanaid — site build notes

Plain HTML/CSS/JS, no build step. Open `index.html` directly or serve the
folder with any static server.

## Fonts (do this first)

The design uses two licensed typefaces:

- **Founders Grotesk X-Condensed** (display/headings) — Klim Type Foundry
- **GT Walsheim** (body) — Grilli Type

Neither is bundled here (they're paid). Until you license them, the site
falls back to system fonts (`Archivo Narrow` / `Work Sans` / `Helvetica Neue`)
so everything still renders correctly.

Once purchased, drop the `.woff2` files into `assets/fonts/` using these
exact names (or edit the `@font-face` blocks in `css/style.css` to match
whatever you're given):

```
assets/fonts/founders-grotesk-x-cond-regular.woff2
assets/fonts/founders-grotesk-x-cond-bold.woff2
assets/fonts/gt-walsheim-regular.woff2
assets/fonts/gt-walsheim-medium.woff2
```

## Placeholder content

Everything is real structure with placeholder copy/media so the site is
fully navigable out of the box:

- **Reel / images** — grey dashed-pattern boxes marked `PLACEHOLDER —
  replace with ...`. Swap each `.placeholder-media` div for a `<video>` or
  `<img>` tag.
- **Case studies** — `work-wawa.html` is real client work (copy + hero video
  wired up). `work-fielder.html` and `work-echoform.html` are still invented
  placeholders showing the template. All three live at the site root (not a
  subfolder) on purpose — see the note below. Duplicate the template for more
  real work; add entries to `work.html` and the homepage's work section to
  match.
- **Work-row preview clips** — hovering a `.work-row` (on `work.html`) shows
  a small panel that follows the cursor; hovering a `.spread` (on the
  homepage) plays its preview inline. Add `data-preview-video="assets/video/name.mp4"`
  to the item's `<a>` tag to play a real muted/looping clip there instead of
  the placeholder.
- **Email / socials** — `hello@nomadanaid.com` and `#` social links in the
  footer and contact page. Replace with real addresses/handles.

## Structure

```
index.html                     home / hero
work.html                      full work index
work-wawa.html                 real case study (flat, not in a subfolder)
work-fielder.html              placeholder case study
work-echoform.html             placeholder case study
about.html
contact.html
css/style.css        single shared stylesheet
js/main.js           mobile nav toggle + footer year (no decorative JS)
assets/fonts/        drop licensed font files here
assets/video/        drop reel + case study video files here
assets/images/       drop stills here
```

**Why the case studies are flat, not in `work/`:** when opened directly as
local files (no server), Safari blocks a page from loading `../` parent-
directory resources by default — so a page in a subfolder can't reach
`css/style.css` one level up. Keeping every `.html` file at the same depth
means every stylesheet/script reference is a plain relative path (`css/
style.css`, no `..`), which works in every browser with just a double-click,
no server required. If you add more case studies, keep them at the root
with this same `work-*.html` naming rather than reintroducing a subfolder.
