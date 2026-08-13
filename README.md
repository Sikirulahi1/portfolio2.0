# Portfolio — AI Engineer · Backend Developer · AI Researcher

A single-page developer portfolio built with **vanilla JS + Vite** — no framework.
"Terminal Emerald" dark theme, hand-tuned canvas animations, live GitHub feed,
and all content driven by JSON files for easy editing.

## Quick start

```bash
npm install      # one-time — installs Vite
npm run dev      # dev server at http://localhost:5173 (hot reload)
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

Requires Node 18+ (developed on Node 22).

## Project structure

```
public/              static assets served as-is (favicon, images, resume.pdf)
src/
  styles/            CSS split by concern
    variables.css      design tokens (colors, fonts, radius)
    base.css           reset, body, scrollbar, canvases, reveal, reduced-motion
    layout.css         nav, footer, intro curtain, cursor, toast
    components.css     cards, buttons, tags, timeline, project/stat/repo cards, do/pub/blog cards
    sections.css       hero, about, skills, contact, responsive
    main.css           @imports the above in order
  scripts/
    utils/
      dom.js            $, $$, store (sessionStorage)
      motion.js         RM (reduced-motion), FINE (fine pointer), countUp()
    modules/            one ES module per animation/feature, each exports init*()
      fx.js             spark trail + copy-burst particles
      intro.js          curtain + name cascade trigger
      split.js          splits the hero name into letters (run before intro)
      typed.js          cycling role phrases
      progress.js       scroll progress bar
      constellation.js  background canvas
      cursor.js         cursor ring + dot + trail
      pointer-fx.js     magnetic buttons, spotlight glow, 3D tilt
      scramble.js       decode headings (used by reveal)
      reveal.js         scroll reveal + active-nav tracking
      toast.js          toast + copy-email
      github.js         live GitHub stats + contribution calendar
    main.js           boot order: render → split → intro → ... → github
  data/               ALL content lives here — edit these, not the code
    profile.json        name, links, typed roles, hero, contact, nav
    about.json          bio, "right now", "off the clock"
    whatido.json        the 3 discipline cards
    experience.json     work history
    resume.json         Industrial + Academic CV links
    projects.json       project cards (any number — "View more" paginates)
    publications.json   paper list (any number — "View more" paginates)
    blogs.json          blog cards (any number — "View more" paginates)
    skills.json         skill cards
    github.json         GitHub username, email, fallback snapshot, language colors
  render.js           reads data/*.json → injects into the HTML shell
index.html            structural shell only (content is filled by render.js)
```

### Static assets to drop in `public/`

- `public/images/portrait.jpg` — your About photo (displayed at 4:5; replace the `portrait.svg` placeholder, then update `about.json` → `photo`).
- `public/resume-industrial.pdf` — your Industrial CV (linked from the hero résumé menu + Resume section).
- `public/resume-academic.pdf` — your Academic CV.

## Where to edit things

| To change... | Edit |
|---|---|
| Your name, email, GitHub/LinkedIn, nav links | `src/data/profile.json` |
| Hero tagline / typed roles / contact copy | `src/data/profile.json` |
| About bio, "Right now", hobbies | `src/data/about.json` |
| The three "What I Do" cards | `src/data/whatido.json` |
| Work experience | `src/data/experience.json` |
| Résumé CVs (labels, descriptions, file paths) | `src/data/resume.json` |
| About photo path | `src/data/about.json` → `photo` / `photoAlt` |
| Projects (add as many as you like) | `src/data/projects.json` |
| Publications (add as many as you like) | `src/data/publications.json` |
| Blog posts (add as many as you like) | `src/data/blogs.json` |
| Skills | `src/data/skills.json` |
| GitHub username + offline fallback | `src/data/github.json` |
| Colors, fonts, spacing | `src/styles/variables.css` |
| A specific animation | `src/scripts/modules/<name>.js` |

**Projects / Publications / Blogs** show the first 3 with a "View more" button
that reveals the next 3, and hides when the list is exhausted. Just add items
to the JSON — no code change needed.

Inline HTML is allowed in JSON string values (e.g. `<b>`, `<span class="hl">`) —
it's the author's own content, injected via `innerHTML`.

## How the boot order works

`main.js` runs `renderAll()` **first** (synchronous — Vite bundles JSON at build
time), so the DOM is populated before any animation queries it. Then modules init
in order. The one hard constraint: `initSplit()` must run before `initIntro()`,
because the name cascade animates the letter-spans that `split` creates.

## Deploy

`npm run build` produces a static `dist/`. Drop it on any static host:

- **Vercel / Netlify:** connect the repo, build command `npm run build`, output `dist`.
- **GitHub Pages:** build, then publish `dist/` (e.g. via `gh-pages` or Actions).

No environment variables required. The GitHub feed fetches `api.github.com`
client-side and falls back to the snapshot in `github.json` if rate-limited/offline.

## Notes

- All animations respect `prefers-reduced-motion` and degrade on coarse pointers.
- The cursor ring/spark trail only activate on fine-pointer (desktop) devices.
- Currently filled with placeholder content — replace the JSON values with your own.
