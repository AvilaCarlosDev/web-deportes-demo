# SportZone Pro

[Español](README.md) · [English](README.en.md)

Demo one-page website for a sporting goods store: categories, a filterable catalog, offers and advice by WhatsApp.

**Live demo:** https://agencia-web-deportes-demo.vercel.app

> This is a demonstration template by [Carlos Avila](https://github.com/AvilaCarlosDev). The business, prices and figures are made up. It is a starting point for a real business website.

## What it includes

- Responsive design (mobile, tablet and desktop) built with React and Tailwind.
- Section menu that also works on phones, with the visible section highlighted.
- Catalog search, saved products you can ask about together, and a club form with email validation.
- Complete SEO: canonical URL, Open Graph and Twitter cards with its own image, JSON-LD, `robots.txt`, `sitemap.xml`, web manifest, icons and a 404 page.
- Security: HTTP headers and a strict CSP in `vercel.json`, `security.txt` and zero third-party resources (fonts are self-hosted with Fontsource).
- Privacy: no cookies or analytics; whatever is typed into the fields never leaves the browser except inside the WhatsApp message; a [privacy policy](public/privacidad/index.html) linked from the footer (in Spanish).
- Images are hosted inside the project (`public/img`), so the page never depends on external services.

## Tech

React 19 · Vite 8 · Tailwind CSS 4 · Vitest + Testing Library · ESLint · Vercel

## Usage

Requires Node.js 22 or later.

```bash
npm ci          # install dependencies
npm run dev     # dev server
npm run lint    # code review
npm test        # tests
npm run build   # production build into dist/
```

## Tests

- `src/App.test.jsx` guards content quality: renders without errors, no external images, every image exists and has alt text, anchors point to real sections, external links use `rel="noopener"` and there are no empty buttons.
- `src/estandar.test.jsx` guards the SEO and security standard: absolute canonical and Open Graph, social image with dimensions, valid JSON-LD, `robots.txt`, `sitemap.xml`, manifest and icons present, unexpired `security.txt`, unindexed 404, CSP without `unsafe-eval`, no third-party resources, a single `h1`, copyright with a privacy link, and no Argentine "voseo" in the Spanish copy.

## Continuous integration

`.github/workflows/ci.yml` runs lint, tests, build and a production dependency audit on every push to `main` and every pull request.

## Deployment

Deployed on Vercel (`vercel.json`); every change on `main` publishes a new version.

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md), the [code of conduct](CODE_OF_CONDUCT.md) and the [security policy](SECURITY.md). [MIT](LICENSE) licensed.

## Author

Carlos Avila · [GitHub](https://github.com/AvilaCarlosDev) · [LinkedIn](https://www.linkedin.com/in/avilacarlosdev)
