import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { render } from '@testing-library/react'
import App from './App.jsx'

const raiz = resolve(__dirname, '..')
const leer = (ruta) => readFileSync(resolve(raiz, ruta), 'utf8')
const vercel = JSON.parse(leer('vercel.json'))
const dominio = `https://${vercel.name}.vercel.app`
const indexHtml = leer('index.html')
const meta = (atributo, nombre) => indexHtml.match(new RegExp(`<meta ${atributo}="${nombre}" content="([^"]*)"`))?.[1]

describe('SEO: cabecera del documento', () => {
  it('tiene canonical y og:url absolutos que apuntan al dominio propio', () => {
    expect(indexHtml).toContain(`<link rel="canonical" href="${dominio}/" />`)
    expect(meta('property', 'og:url')).toBe(`${dominio}/`)
  })

  it('declara la vista previa social completa (imagen con medidas y alt, twitter:image, locale)', () => {
    expect(meta('property', 'og:image')).toBe(`${dominio}/og.jpg`)
    expect(meta('property', 'og:image:width')).toBe('1200')
    expect(meta('property', 'og:image:height')).toBe('630')
    expect(meta('property', 'og:image:alt')?.length).toBeGreaterThan(5)
    expect(meta('name', 'twitter:image')).toBe(`${dominio}/og.jpg`)
    expect(meta('property', 'og:locale')).toBe('es_VE')
    expect(meta('property', 'og:site_name')?.length).toBeGreaterThan(2)
  })

  it('la descripción cabe en los resultados de búsqueda (70–165 caracteres)', () => {
    const d = meta('name', 'description')
    expect(d.length).toBeGreaterThanOrEqual(70)
    expect(d.length).toBeLessThanOrEqual(165)
  })

  it('enlaza manifest, apple-touch-icon y theme-color que existen', () => {
    expect(indexHtml).toContain('rel="manifest" href="/manifest.webmanifest"')
    expect(indexHtml).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"')
    expect(meta('name', 'theme-color')).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('el JSON-LD es válido, usa URLs absolutas y aclara que es una demo', () => {
    const ld = JSON.parse(indexHtml.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/)[1])
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld.url).toBe(`${dominio}/`)
    expect(ld.image).toBe(`${dominio}/og.jpg`)
    expect(ld.disambiguatingDescription).toMatch(/demostración/i)
  })
})

describe('archivos públicos', () => {
  it('robots.txt permite rastrear y apunta al sitemap', () => {
    const r = leer('public/robots.txt')
    expect(r).toMatch(/User-agent: \*/)
    expect(r).toContain(`Sitemap: ${dominio}/sitemap.xml`)
  })

  it('sitemap.xml lista inicio y privacidad', () => {
    const s = leer('public/sitemap.xml')
    expect(s).toContain(`<loc>${dominio}/</loc>`)
    expect(s).toContain(`<loc>${dominio}/privacidad/</loc>`)
  })

  it('el manifest es válido y sus iconos existen', () => {
    const m = JSON.parse(leer('public/manifest.webmanifest'))
    expect(m.name).toBeTruthy()
    expect(m.lang).toBe('es')
    for (const icono of m.icons) expect(existsSync(resolve(raiz, 'public', icono.src.slice(1)))).toBe(true)
    expect(existsSync(resolve(raiz, 'public/apple-touch-icon.png'))).toBe(true)
  })

  it('security.txt tiene contacto y no ha caducado', () => {
    const t = leer('public/.well-known/security.txt')
    expect(t).toMatch(/^Contact: mailto:.+@.+/m)
    const expira = new Date(t.match(/^Expires: (.+)$/m)[1])
    expect(expira.getTime()).toBeGreaterThan(Date.now())
  })

  it('la página 404 no se indexa y la de privacidad sí', () => {
    expect(leer('public/404.html')).toContain('content="noindex"')
    const p = leer('public/privacidad/index.html')
    expect(p).toContain('content="index, follow"')
    expect(p).toContain('mailto:')
    expect(p).toMatch(/ficticios/)
  })
})

describe('seguridad y privacidad', () => {
  const cabeceras = Object.fromEntries(vercel.headers.find((h) => h.source === '/(.*)').headers.map((h) => [h.key, h.value]))

  it('vercel.json define CSP estricta, HSTS y anti-clickjacking', () => {
    const csp = cabeceras['Content-Security-Policy']
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("script-src 'self';")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).not.toContain('unsafe-eval')
    expect(cabeceras['Strict-Transport-Security']).toMatch(/max-age=\d{7,}/)
    expect(cabeceras['X-Content-Type-Options']).toBe('nosniff')
    expect(cabeceras['Referrer-Policy']).toBeTruthy()
  })

  it('no carga nada de terceros: tipografías autoalojadas', () => {
    const fuentes = ['index.html', 'src/index.css', 'src/main.jsx', 'public/pagina.css'].map(leer).join('\n')
    expect(fuentes).not.toMatch(/fonts\.googleapis|fonts\.gstatic/)
    expect(leer('src/main.jsx')).toContain('@fontsource/')
    expect(leer('vite.config.js')).toContain('assetsInlineLimit: 0')
  })
})

describe('contenido', () => {
  it('el pie muestra copyright y enlaza a la política de privacidad', () => {
    const { container } = render(<App />)
    const pie = container.querySelector('footer')
    expect(pie.textContent).toMatch(/© 2026/)
    expect(pie.querySelector('a[href="/privacidad/"]')).not.toBeNull()
  })

  it('tiene un único h1', () => {
    const { container } = render(<App />)
    expect(container.querySelectorAll('h1')).toHaveLength(1)
  })

  it('español venezolano: sin voseo en la interfaz ni en las páginas legales', () => {
    const texto = [leer('src/App.jsx'), leer('public/privacidad/index.html'), leer('public/404.html'), indexHtml].join('\n')
    const voseo = /\b(vos|contame|escribime|decime|mandame|probá|podés|tenés|querés|sabés|reservá|consultá|cotizá|comprá|conocé|disfrutá|pedilo|sumate|registrate|acá|sos)\b/i
    expect(texto.match(voseo)?.[0]).toBeUndefined()
  })
})
