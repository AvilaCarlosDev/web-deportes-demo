import { useEffect, useRef, useState } from 'react'
import { movimientoRespetado } from './motion.js'
import { wa } from './navegacion.js'

const avenida = 'M0 70 H640'

const calles = [
  'M0 190 H640',
  'M0 320 H640',
  'M90 0 V420',
  'M250 0 V420',
  'M430 0 V420',
  'M570 0 V420',
  'M0 130 H430',
  'M0 255 H250',
  'M640 40 L480 420',
]

const ruta = 'M90 420 L90 320 L430 320 L430 246 L455 246'

const edificios = [
  { x: 104, y: 82, w: 58, h: 34 },
  { x: 264, y: 84, w: 72, h: 32 },
  { x: 110, y: 204, w: 52, h: 38 },
  { x: 445, y: 206, w: 70, h: 40 },
  { x: 600, y: 212, w: 34, h: 52 },
]

const filas = [
  { termino: 'Dirección', dato: 'Punto Fijo, Falcón, Venezuela' },
  { termino: 'Horario', dato: '9:00 AM - 7:00 PM' },
  { termino: 'WhatsApp', dato: '+58 412-000-0000', enlace: wa() },
  { termino: 'Cobertura', dato: 'Envíos a toda Venezuela' },
]

export function MapaSede() {
  const ref = useRef(null)
  const [modo, setModo] = useState('espera')

  useEffect(() => {
    const nodo = ref.current
    if (!nodo || typeof IntersectionObserver === 'undefined' || movimientoRespetado()) {
      setModo('instante')
      return undefined
    }
    const enPantalla = () => {
      const caja = nodo.getBoundingClientRect()
      return caja.bottom >= 0 && caja.top <= (window.innerHeight || 0)
    }
    if (enPantalla()) {
      setModo('instante')
      return undefined
    }
    const seccion = nodo.closest('section')
    if (seccion?.id && window.location.hash.slice(1) === seccion.id) {
      setModo('instante')
      return undefined
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setModo('animado')
          observador.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [])

  const clases = [
    'mapa relative overflow-hidden border border-cyan-300/25',
    modo === 'espera' ? '' : 'mapa-activo',
    modo === 'instante' ? 'mapa-instante' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="corte bg-slate-950 p-2 shadow-2xl shadow-slate-950/25 ring-1 ring-cyan-300/40">
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <span className="tabular font-marcador text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">SEDE 01</span>
        <span className="font-marcador text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">Punto Fijo · Falcón</span>
      </div>

      <div ref={ref} className={clases}>
        <svg viewBox="0 0 640 420" className="block w-full" role="img" aria-label="Mapa de Punto Fijo con la sede SportZone marcada">
          <defs>
            <filter id="mapa-sombra" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.35" />
            </filter>
            <mask id="mapa-ruta" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="420">
              <rect x="0" y="0" width="640" height="420" fill="#000000" />
              <path className="mapa-mascara" d={ruta} pathLength="1" fill="none" stroke="#ffffff" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" />
            </mask>
          </defs>

          <rect x="0" y="0" width="640" height="420" fill="#e8eaed" />

          <rect x="264" y="204" width="152" height="102" fill="#c8e6c9" />
          <g fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.85">
            <rect x="272" y="212" width="136" height="86" />
            <path d="M340 212 V298" />
            <circle cx="340" cy="255" r="14" />
            <rect x="272" y="231" width="26" height="48" />
            <rect x="382" y="231" width="26" height="48" />
          </g>

          <g fill="none" stroke="#dadce0" strokeLinecap="butt">
            <path d={avenida} strokeWidth="24" />
            {calles.map((d) => (
              <path key={d} d={d} strokeWidth="17" />
            ))}
          </g>
          <g fill="none" stroke="#ffffff" strokeLinecap="butt">
            <path d={avenida} strokeWidth="20" />
            {calles.map((d) => (
              <path key={d} d={d} strokeWidth="14" />
            ))}
          </g>

          <g fill="#ffffff" stroke="#dadce0" strokeWidth="1">
            {edificios.map((edificio) => (
              <rect key={`${edificio.x}-${edificio.y}`} x={edificio.x} y={edificio.y} width={edificio.w} height={edificio.h} />
            ))}
          </g>

          <g mask="url(#mapa-ruta)">
            <path d={ruta} fill="none" stroke="#1a73e8" strokeWidth="5" strokeLinecap="round" strokeDasharray="0.5 10" />
          </g>

          <g className="mapa-etiqueta" filter="url(#mapa-sombra)">
            <rect x="367" y="176" width="176" height="28" rx="7" fill="#ffffff" stroke="#dadce0" strokeWidth="1" />
            <text x="455" y="195" textAnchor="middle" className="font-marcador" fontSize="12" fontWeight="700" fill="#202124">
              SportZone · Punto Fijo
            </text>
          </g>

          <g transform="translate(455 246)">
            <g className="mapa-pin" filter="url(#mapa-sombra)">
              <path d="M0 0 C -3.5 -7 -13 -14 -13 -22 A 13 13 0 1 1 13 -22 C 13 -14 3.5 -7 0 0 Z" fill="#ea4335" />
              <circle cx="0" cy="-22" r="5" fill="#ffffff" />
            </g>
          </g>
        </svg>
      </div>

      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <span className="flex items-center gap-2 font-marcador text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
          <span className="block h-1.5 w-10 border-x border-t border-white/60" aria-hidden="true" />
          200 m
        </span>
        <span className="font-marcador text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">Mapa ilustrativo</span>
      </div>
    </div>
  )
}

export function DatosSede() {
  return (
    <dl className="mt-7 divide-y divide-slate-200 border-y border-slate-200 text-sm">
      {filas.map((fila) => (
        <div key={fila.termino} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5">
          <dt className="font-marcador text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{fila.termino}</dt>
          <dd className="tabular font-semibold text-slate-800">
            {fila.enlace ? (
              <a href={fila.enlace} className="transition hover:text-cyan-700">
                {fila.dato}
              </a>
            ) : (
              fila.dato
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
