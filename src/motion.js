import { useEffect, useLayoutEffect, useRef } from 'react'

const consulta = (q) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(q) : null

export const movimientoRespetado = () => consulta('(prefers-reduced-motion: reduce)')?.matches === true

const animacionPosible = () => typeof IntersectionObserver !== 'undefined' && !movimientoRespetado()

const enPantalla = (nodo) => {
  const caja = nodo.getBoundingClientRect()
  return caja.bottom >= 0 && caja.top <= (window.innerHeight || 0)
}

const limitar = (valor, min, max) => Math.min(max, Math.max(min, valor))

const analizar = (texto) => {
  const partes = String(texto).match(/^(\D*)(\d+)(\.\d+)?(\D*)$/)
  if (!partes) return null
  return {
    prefijo: partes[1] || '',
    sufijo: partes[4] || '',
    digitos: partes[2].length,
    decimales: partes[3] ? partes[3].length - 1 : 0,
    destino: Number(`${partes[2]}${partes[3] || ''}`),
  }
}

const escribir = (valor, e) => {
  const escala = 10 ** e.decimales
  const bruto = Math.round(valor * escala)
  const entero = String(Math.floor(bruto / escala)).padStart(e.digitos, '0')
  const decimal = e.decimales ? `.${String(bruto % escala).padStart(e.decimales, '0')}` : ''
  return `${e.prefijo}${entero}${decimal}${e.sufijo}`
}

const observarEntrada = (nodo, alEntrar, opciones) => {
  const observador = new IntersectionObserver((entradas) => {
    if (entradas.some((entrada) => entrada.isIntersecting)) {
      observador.disconnect()
      alEntrar()
    }
  }, opciones)
  observador.observe(nodo)
  return observador
}

const anchoPista = (ventana, pista) => {
  const ultimo = pista.lastElementChild
  if (!ultimo) return 0
  const margen = parseFloat(getComputedStyle(pista).paddingRight) || 0
  return Math.max(0, ultimo.offsetLeft + ultimo.offsetWidth + margen - ventana.clientWidth)
}

const recolectar = () =>
  [...document.querySelectorAll('.velocidad')].map((nodo) => ({
    nodo,
    ancla: nodo.closest('section') || nodo.parentElement || nodo,
  }))

export function useContador(duracion = 1400) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const caja = ref.current
    if (!caja || !animacionPosible()) return undefined
    const cifras = [...caja.querySelectorAll('[data-cifra]')]
      .map((nodo) => ({ nodo, e: analizar(nodo.dataset.cifra) }))
      .filter((cifra) => cifra.e)
    if (!cifras.length) return undefined

    let cuadro = 0
    const pintar = (transcurrido) => {
      let vivas = 0
      cifras.forEach((cifra, indice) => {
        const t = limitar((transcurrido - indice * 160) / duracion, 0, 1)
        if (t < 1) vivas += 1
        cifra.nodo.textContent = escribir(cifra.e.destino * (1 - (1 - t) ** 3), cifra.e)
      })
      if (vivas) cuadro = requestAnimationFrame(pintar)
    }
    const arrancar = () => {
      const inicio = performance.now()
      cuadro = requestAnimationFrame((ahora) => pintar(ahora - inicio))
    }

    if (enPantalla(caja)) {
      arrancar()
      return () => cancelAnimationFrame(cuadro)
    }

    const observador = observarEntrada(caja, arrancar, { threshold: 0.35 })
    return () => {
      observador.disconnect()
      cancelAnimationFrame(cuadro)
    }
  }, [duracion])

  return ref
}

export function useRevelar(pausa = 90) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const caja = ref.current
    if (!caja || !animacionPosible()) return undefined
    ;[...caja.children].forEach((hijo, indice) => hijo.style.setProperty('--retardo', `${indice * pausa}ms`))
    caja.classList.add('revela')
    if (enPantalla(caja)) {
      caja.classList.add('revela-listo')
      return undefined
    }
    const observador = observarEntrada(
      caja,
      () => caja.classList.add('revela-listo'),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    return () => observador.disconnect()
  }, [pausa])

  return ref
}

export function useFranjas() {
  useEffect(() => {
    if (movimientoRespetado()) return undefined
    let nodos = recolectar()
    if (!nodos.length) return undefined
    let cuadro = 0

    const medir = () => {
      cuadro = 0
      if (nodos.some((nodo) => !nodo.nodo.isConnected)) nodos = recolectar()
      const alto = window.innerHeight
      nodos.forEach(({ nodo, ancla }) => {
        if (!nodo.isConnected) return
        const caja = ancla.getBoundingClientRect()
        if (caja.bottom < -alto || caja.top > alto * 2) return
        const progreso = limitar((alto - caja.top) / (alto + caja.height), 0, 1)
        nodo.style.backgroundPosition = `${(progreso * 640).toFixed(1)}px 0px`
      })
    }
    const solicitar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir)
    }

    medir()
    window.addEventListener('scroll', solicitar, { passive: true })
    window.addEventListener('resize', solicitar, { passive: true })
    return () => {
      window.removeEventListener('scroll', solicitar)
      window.removeEventListener('resize', solicitar)
      if (cuadro) cancelAnimationFrame(cuadro)
    }
  }, [])
}

export function useCarril(ref) {
  useLayoutEffect(() => {
    const seccion = ref.current
    const escritorio = consulta('(min-width: 768px)')
    if (!seccion || !escritorio || !animacionPosible()) return undefined
    const ventana = seccion.querySelector('.carril-ventana')
    const pista = seccion.querySelector('.carril-pista')
    if (!ventana || !pista) return undefined

    let cuadro = 0
    const aplicar = () => {
      cuadro = 0
      if (!escritorio.matches) return
      const altura = seccion.offsetHeight - window.innerHeight
      if (altura <= 0) return
      const avance = limitar(-seccion.getBoundingClientRect().top / altura, 0, 1)
      pista.style.transform = `translate3d(${-avance * anchoPista(ventana, pista)}px, 0, 0)`
    }
    const solicitar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(aplicar)
    }
    const sincronizar = () => {
      if (cuadro) {
        cancelAnimationFrame(cuadro)
        cuadro = 0
      }
      if (escritorio.matches) {
        seccion.classList.add('carril-fija')
        solicitar()
      } else {
        seccion.classList.remove('carril-fija')
        pista.style.transform = ''
      }
    }

    sincronizar()
    window.addEventListener('scroll', solicitar, { passive: true })
    window.addEventListener('resize', sincronizar)
    escritorio.addEventListener('change', sincronizar)
    return () => {
      window.removeEventListener('scroll', solicitar)
      window.removeEventListener('resize', sincronizar)
      escritorio.removeEventListener('change', sincronizar)
      if (cuadro) cancelAnimationFrame(cuadro)
    }
  }, [ref])

  return ref
}
