import { useEffect, useRef, useState } from 'react'

const movimientoRespetado = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const campo = [
  'M0 6 H1200',
  'M0 154 H1200',
  'M600 6 V154',
  'M120 6 V154',
  'M1080 6 V154',
  'M120 44 H260 V116 H120',
  'M1080 44 H940 V116 H1080',
  'M0 80 H440',
  'M760 80 H1200',
]

export function DivisorCancha() {
  const ref = useRef(null)
  const [activo, setActivo] = useState(false)

  useEffect(() => {
    const nodo = ref.current
    if (!nodo || typeof IntersectionObserver === 'undefined' || movimientoRespetado()) {
      setActivo(true)
      return undefined
    }
    const enPantalla = () => {
      const caja = nodo.getBoundingClientRect()
      return caja.bottom >= 0 && caja.top <= (window.innerHeight || 0)
    }
    if (enPantalla()) {
      setActivo(true)
      return undefined
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setActivo(true)
          observador.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [])

  const lineas = 'stroke-cyan-300/70 [stroke-width:2]'

  return (
    <div ref={ref} className="relative h-32 w-full overflow-hidden bg-slate-950 md:h-40" aria-hidden="true">
      <span className="velocidad absolute inset-0 text-cyan-300 opacity-[0.07]" />
      <svg
        className={`trazo absolute inset-0 h-full w-full ${activo ? 'trazo-activo' : ''}`}
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        fill="none"
      >
        {campo.map((d, indice) => (
          <path key={d} className={lineas} pathLength="1" d={d} style={{ '--trazo': `${indice * 80}ms` }} />
        ))}
      </svg>
      <svg
        className={`trazo absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 md:h-32 md:w-32 ${activo ? 'trazo-activo' : ''}`}
        viewBox="0 0 120 120"
        fill="none"
      >
        <circle className={lineas} pathLength="1" cx="60" cy="60" r="48" style={{ '--trazo': '640ms' }} />
        <circle className="fill-cyan-300" cx="60" cy="60" r="4" />
      </svg>
    </div>
  )
}
