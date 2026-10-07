import { useEffect, useState } from 'react'

export const WHATSAPP_URL = 'https://wa.me/584120000000'

// Enlace a WhatsApp con el mensaje ya escrito para que el negocio sepa qué se pide.
export const wa = (texto) => (texto ? `${WHATSAPP_URL}?text=${encodeURIComponent(texto)}` : WHATSAPP_URL)

// Sección visible en pantalla, para resaltar su enlace en el menú.
export function useSeccionActiva(ids) {
  const [activa, setActiva] = useState(ids[0])
  const clave = ids.join(',')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiva(visible.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    )
    clave.split(',').forEach((id) => {
      const el = document.getElementById(id)
      if (el) observador.observe(el)
    })
    return () => observador.disconnect()
  }, [clave])

  return activa
}
