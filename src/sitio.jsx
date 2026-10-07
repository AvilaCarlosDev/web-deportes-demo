import { useEffect, useState } from 'react'
import { wa } from './navegacion.js'

// Piezas de navegación compartidas: es un sitio web de una página, así que
// el menú tiene que funcionar también en el teléfono y marcar dónde está uno.

export function SaltarAlContenido({ className = '' }) {
  return (
    <a href="#contenido" className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:px-4 focus:py-2 focus:text-sm focus:font-bold ${className}`}>
      Saltar al contenido
    </a>
  )
}

// Botón de menú + panel desplegable, solo por debajo de lg.
export function MenuMovil({ enlaces, activa, cta, tono }) {
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    if (!abierto) return undefined
    const cerrar = (e) => e.key === 'Escape' && setAbierto(false)
    window.addEventListener('keydown', cerrar)
    return () => window.removeEventListener('keydown', cerrar)
  }, [abierto])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
        className={`grid h-11 w-11 place-items-center transition active:scale-95 ${tono.boton}`}
      >
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${abierto ? 'translate-y-1.5 rotate-45' : ''}`} />
          <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-current transition ${abierto ? 'opacity-0' : ''}`} />
          <span className={`absolute left-0 top-3 h-0.5 w-5 bg-current transition ${abierto ? '-translate-y-1.5 -rotate-45' : ''}`} />
        </span>
      </button>
      <nav
        id="menu-movil"
        aria-label="Menú"
        hidden={!abierto}
        className={`absolute inset-x-0 top-full border-b px-5 pb-6 pt-2 shadow-2xl ${tono.panel}`}
      >
        <ul className="divide-y divide-current/10">
          {enlaces.map(([id, texto]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setAbierto(false)}
                aria-current={activa === id ? 'true' : undefined}
                className={`flex items-center justify-between py-4 text-lg font-bold transition ${activa === id ? tono.activo : ''}`}
              >
                {texto}
                <span aria-hidden="true" className="opacity-40">→</span>
              </a>
            </li>
          ))}
        </ul>
        {cta && (
          <a href={cta.href} onClick={() => setAbierto(false)} className={`mt-4 flex justify-center px-5 py-4 text-sm font-black uppercase tracking-wide ${tono.cta}`}>
            {cta.texto}
          </a>
        )}
      </nav>
    </div>
  )
}

// Acceso permanente a WhatsApp en el teléfono, donde el menú del header queda lejos.
export function WhatsAppFlotante({ texto, className = '' }) {
  return (
    <a
      href={wa(texto)}
      aria-label="Escribir por WhatsApp"
      className={`fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full shadow-2xl transition hover:scale-105 active:scale-95 lg:hidden ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" />
      </svg>
    </a>
  )
}
