# leonardocuevas.com

Source for my personal portfolio — **[leonardocuevas.com](https://leonardocuevas.com)**.

A hand-built, single-page portfolio with no framework and no build step: just
vanilla HTML, CSS, and JavaScript served as static files on GitHub Pages.

Repository: https://github.com/leonardojpeg/platypus-weakness

## Highlights

- **Light / dark theming** — a warm "sun" daylight theme and a "moon" dark
  theme that turns the page into an ambient deep-sea scene.
- **Deep-sea ambient scene (dark mode)** — a moody water gradient, a swaying
  kelp bed, drifting jellyfish, bioluminescent organisms, marine snow, and an
  anglerfish easter egg that hovers by the footer. It's injected by JavaScript
  (`scene.js`) so the decorative SVG stays out of the static document, keeping
  the page lean for crawlers and machine readers.
- **Motion & interaction** — smooth scrolling (Lenis), scroll-triggered
  reveals and count-ups (GSAP), a WebGL noise shader (OGL), a custom cursor,
  magnetic buttons, and 3D card tilt.
- **Built for discovery** — semantic headings, `schema.org/Person` JSON-LD,
  Open Graph / Twitter cards, and a canonical tag.
- **Accessibility** — honors `prefers-reduced-motion`, keyboard navigation,
  and ARIA labelling; decorative layers are `aria-hidden`.

## Project structure

```
.
├── index.html        # Homepage (hero, case studies, experience, contact)
├── app.css           # All styles, including both themes
├── app.js            # Interactions, animations, theme toggle
├── scene.js          # Injects the full deep-sea scene on the homepage
├── deep-sea.js       # Lighter "water + marine snow" backdrop for blog pages
├── blog/             # Case-study / writing detail pages
├── imgs/             # Images
└── CNAME             # Custom domain for GitHub Pages
```

## Running locally

No build step — just serve the folder with any static server, for example:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly works too, though a local server is recommended
so relative paths and the injected scripts behave exactly as in production.

## Deployment

Hosted on **GitHub Pages**. Pushing to `main` deploys automatically to the
domain configured in `CNAME`.

## Tech

Vanilla HTML / CSS / JavaScript · [Lenis](https://github.com/darkroomengineering/lenis)
· [GSAP](https://gsap.com/) · [OGL](https://github.com/oframe/ogl) · GitHub Pages

## License

© Leonardo Cuevas. Code is available for reference and learning; please don't
republish the site or its content as your own.
