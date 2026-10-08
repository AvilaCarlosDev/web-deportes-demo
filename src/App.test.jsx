import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { render } from '@testing-library/react'
import App from './App.jsx'

const raiz = resolve(__dirname, '..')
const leer = (ruta) => readFileSync(resolve(raiz, ruta), 'utf8')
const indexHtml = leer('index.html')
const fuente = leer('src/App.jsx')
const dominioVercel = `https://${JSON.parse(leer('vercel.json')).name}.vercel.app/`

describe('sitio: integridad del contenido', () => {
  it('se renderiza sin errores', () => {
    const { container } = render(<App />)
    expect(container.firstChild).not.toBeNull()
  })

  it('no depende de imágenes externas (sin hotlinks a Unsplash ni similares)', () => {
    const externas = fuente.match(/https?:\/\/[^\s'"`)]+\.(?:jpe?g|png|webp|avif|gif)|https?:\/\/images\.unsplash\.com[^\s'"`)]*/gi)
    expect(externas).toBeNull()
  })

  it('todas las imágenes locales existen en public/', () => {
    const { container } = render(<App />)
    const rutas = [...container.querySelectorAll('img')]
      .map((img) => img.getAttribute('src'))
      .filter((src) => src?.startsWith('/'))
    const faltantes = rutas.filter((src) => !existsSync(resolve(raiz, 'public', src.slice(1))))
    expect(faltantes).toEqual([])
    const referenciadas = [...fuente.matchAll(/['"`](\/img\/[\w./-]+)['"`]/g)].map((m) => m[1])
    const rotas = referenciadas.filter((src) => !existsSync(resolve(raiz, 'public', src.slice(1))))
    expect(rotas).toEqual([])
  })

  it('todas las imágenes tienen texto alternativo', () => {
    const { container } = render(<App />)
    const sinAlt = [...container.querySelectorAll('img')].filter((img) => !img.getAttribute('alt')?.trim())
    expect(sinAlt).toHaveLength(0)
  })

  it('todos los enlaces internos (#ancla) apuntan a una sección existente', () => {
    const { container } = render(<App />)
    const anclas = [...container.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute('href'))
      .filter((href) => href.length > 1)
    const huerfanas = anclas.filter((href) => !container.querySelector(`[id="${href.slice(1)}"]`))
    expect(huerfanas).toEqual([])
  })

  it('los enlaces externos que abren pestaña nueva usan rel="noopener"', () => {
    const { container } = render(<App />)
    const inseguros = [...container.querySelectorAll('a[target="_blank"]')].filter(
      (a) => !/noopener/.test(a.getAttribute('rel') ?? ''),
    )
    expect(inseguros).toHaveLength(0)
  })

  it('los botones y enlaces no están vacíos', () => {
    const { container } = render(<App />)
    const vacios = [...container.querySelectorAll('a, button')].filter(
      (el) => !el.textContent.trim() && !el.getAttribute('aria-label'),
    )
    expect(vacios).toHaveLength(0)
  })
})

describe('sitio: metadatos para compartir', () => {
  it('tiene título y descripción', () => {
    expect(indexHtml).toMatch(/<title>[^<]{5,}<\/title>/)
    expect(indexHtml).toMatch(/<meta\s+name="description"\s+content="[^"]{20,}"/)
  })

  it('og:image apunta a una imagen propia y no a un servicio externo', () => {
    const og = indexHtml.match(/property="og:image"\s+content="([^"]+)"/)?.[1]
    expect(og, 'falta og:image').toBeTruthy()
    expect(og.startsWith(dominioVercel)).toBe(true)
  })
})
