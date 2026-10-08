import { useMemo, useRef, useState } from 'react'
import { MenuMovil, SaltarAlContenido, WhatsAppFlotante } from './sitio.jsx'
import { DivisorCancha } from './marcador.jsx'
import { DatosSede, MapaSede } from './mapa.jsx'
import { useCarril, useContador, useFranjas, useRevelar } from './motion.js'
import { useAnclaInicial, useSeccionActiva, wa } from './navegacion.js'

const enlaces = [
  ['categorias', 'Categorías'],
  ['productos', 'Productos'],
  ['ofertas', 'Ofertas'],
  ['club', 'Club'],
  ['ubicacion', 'Ubicación'],
]

const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MAPA_URL = 'https://www.google.com/maps/search/?api=1&query=Punto+Fijo+Falcón+Venezuela'

const filters = ['Todos', 'Running', 'Training', 'Fútbol', 'Basket', 'Accesorios']

const categories = [
  {
    name: 'Running',
    eyebrow: 'Velocidad + resistencia',
    img: '/img/running.jpg',
    stat: '42 modelos',
    size: 'md:col-span-2 md:row-span-2 min-h-[380px] md:min-h-[520px]',
  },
  {
    name: 'Training',
    eyebrow: 'Fuerza + movilidad',
    img: '/img/foto-15344383272761.jpg',
    stat: '36 piezas',
    size: 'md:col-span-2 min-h-[250px]',
  },
  {
    name: 'Fútbol',
    eyebrow: 'Cancha + precisión',
    img: '/img/foto-15799523638732.jpg',
    stat: '24 kits',
    size: 'min-h-[250px]',
  },
  {
    name: 'Basket',
    eyebrow: 'Salto + soporte',
    img: '/img/foto-154651963868e1.jpg',
    stat: '18 drops',
    size: 'min-h-[250px]',
  },
]

const products = [
  {
    img: '/img/foto-15422910267eec.jpg',
    name: 'AeroPulse Runner Pro',
    category: 'Running',
    price: 89,
    oldPrice: 110,
    tag: '-20%',
    rating: '4.9',
  },
  {
    img: '/img/foto-15184580287858.jpg',
    name: 'FlexMove Training Leggings',
    category: 'Training',
    price: 32,
    tag: 'Nuevo',
    rating: '4.8',
  },
  {
    img: '/img/foto-155306240798ee.jpg',
    name: 'Morral Training Pro 28L',
    category: 'Accesorios',
    price: 45,
    oldPrice: 60,
    tag: '-25%',
    rating: '4.7',
  },
  {
    img: '/img/foto-15847359356822.jpg',
    name: 'PowerGrip Elite Gloves',
    category: 'Training',
    price: 18,
    tag: 'Top',
    rating: '4.9',
  },
  {
    img: '/img/thermal-bottle.jpg',
    name: 'HydroSport Thermal Bottle',
    category: 'Accesorios',
    price: 22,
    rating: '4.6',
  },
  {
    img: '/img/foto-15765665880284.jpg',
    name: 'DryTech Performance Tee',
    category: 'Training',
    price: 25,
    oldPrice: 35,
    tag: '-30%',
    rating: '4.8',
  },
  {
    img: '/img/foto-16061075571950.jpg',
    name: 'Court Air Basketball Pro',
    category: 'Basket',
    price: 95,
    rating: '4.7',
  },
  {
    img: '/img/running-shorts.jpg',
    name: 'RunFlow 2-in-1 Shorts',
    category: 'Running',
    price: 28,
    tag: 'Nuevo',
    rating: '4.8',
  },
]

const benefits = [
  { value: '24h', title: 'Despacho rápido', desc: 'Entrega nacional coordinada por WhatsApp.' },
  { value: '100%', title: 'Original garantizado', desc: 'Productos verificados, sin réplicas ni sorpresas.' },
  { value: '30d', title: 'Cambio de talla', desc: 'Cambios simples si necesitas ajustar modelo o talla.' },
]

const marcador = [
  ['500', 'productos en catálogo'],
  ['024', 'horas de despacho'],
  ['4.9', 'valoración media'],
  ['30d', 'cambio de talla'],
]

const promos = [
  {
    code: 'RUN20',
    title: 'Running drop',
    desc: '20% OFF en calzado seleccionado',
    minuto: "20'",
    score: ['20', '0'],
    unidad: '% de descuento',
    accent: 'from-sky-400/30 to-cyan-300/20',
  },
  {
    code: 'GYM40',
    title: 'Gym week',
    desc: 'Hasta 40% OFF en ropa técnica',
    minuto: "40'",
    score: ['40', '0'],
    unidad: '% de descuento',
    accent: 'from-orange-400/30 to-amber-300/20',
  },
  {
    code: 'PACK2X1',
    title: 'Accesorios',
    desc: 'Combos 2x1 para entrenar diario',
    minuto: "60'",
    score: ['2', '1'],
    unidad: '2x1 en accesorios',
    accent: 'from-lime-300/30 to-cyan-300/20',
  },
]

function App() {
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [guardados, setGuardados] = useState([])
  const [correo, setCorreo] = useState('')
  const [club, setClub] = useState('inicial')
  const activa = useSeccionActiva(enlaces.map(([id]) => id))
  useAnclaInicial()
  const refMarcador = useContador()
  const refCategorias = useRevelar()
  const refOfertas = useRevelar(110)
  const refUbicacion = useRevelar()
  const refCarril = useRef(null)
  useFranjas()
  useCarril(refCarril)

  const filteredProducts = useMemo(() => {
    const q = normalizar(busqueda.trim())
    return products.filter(
      (product) =>
        (activeFilter === 'Todos' || product.category === activeFilter) &&
        (!q || normalizar(`${product.name} ${product.category}`).includes(q)),
    )
  }, [activeFilter, busqueda])

  const alternarGuardado = (nombre) =>
    setGuardados((actual) => (actual.includes(nombre) ? actual.filter((n) => n !== nombre) : [...actual, nombre]))

  const buscar = (event) => {
    event.preventDefault()
    setActiveFilter('Todos')
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
  }

  const unirse = (event) => {
    event.preventDefault()
    setClub(CORREO.test(correo.trim()) ? 'listo' : 'error')
  }

  const mensajeGuardados = guardados.length
    ? `Hola, me interesan estos productos: ${guardados.join(', ')}. ¿Tienen mi talla?`
    : 'Hola, quiero asesoría para elegir mi equipo.'

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950 antialiased">
      <SaltarAlContenido className="focus:rounded-full focus:bg-cyan-300 focus:text-slate-950" />
      <div className="relative overflow-hidden bg-slate-950">
        <span className="velocidad absolute inset-0 text-cyan-300 opacity-[0.12]" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-x-8 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 md:justify-between">
          <span className="flex items-center gap-2">
            <span className="latido h-1.5 w-1.5 rounded-full bg-rose-400" aria-hidden="true" />
            En vivo · Envíos a toda Venezuela
          </span>
          <span className="hidden md:inline">Compra asistida por WhatsApp</span>
          <span className="hidden md:inline">Cambios simples por talla</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-cyan-300/30 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-5 lg:px-8">
          <a href="#inicio" className="corte-sm flex shrink-0 items-center gap-3 bg-white/10 py-2 pl-2 pr-4" aria-label="SportZone Pro inicio">
            <span className="grid h-10 w-10 place-items-center bg-cyan-300 font-marcador text-lg font-bold text-slate-950">SZ</span>
            <span>
              <span className="block text-lg font-black uppercase leading-none tracking-tight text-white">SportZone Pro</span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">Performance store</span>
            </span>
          </a>

          <form role="search" onSubmit={buscar} className="hidden flex-1 items-center border border-white/20 bg-white/10 px-3 py-1.5 transition focus-within:border-cyan-300 focus-within:bg-white/15 lg:flex">
            <span aria-hidden="true" className="text-white/70">⌕</span>
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              aria-label="Buscar productos"
              placeholder="Buscar zapatos, ropa, accesorios..."
              className="w-full bg-transparent px-3 py-1.5 text-sm font-semibold text-white outline-none placeholder:text-white/70"
            />
            <button className="corte-sm bg-cyan-300 px-5 py-2 text-xs font-black uppercase tracking-wide text-slate-950 transition hover:bg-white active:scale-95">
              Buscar
            </button>
          </form>

          <nav aria-label="Principal" className="hidden items-center gap-6 font-display text-sm font-black uppercase tracking-[0.1em] lg:flex">
            {enlaces.map(([id, texto]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activa === id ? 'true' : undefined}
                className={`relative py-2 transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-1 after:-skew-x-12 after:bg-cyan-300 after:transition-transform ${activa === id ? 'text-cyan-300 after:scale-x-100' : 'text-white/75 after:scale-x-0 hover:text-white'}`}
              >
                {texto}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <a href={wa('Hola, quiero asesoría para elegir mi equipo.')} className="corte-sm hidden border border-white/25 px-4 py-2 font-display text-sm font-black uppercase tracking-wide text-white transition hover:border-cyan-300 hover:text-cyan-300 xl:inline-flex">
              WhatsApp
            </a>
            <a href={guardados.length ? wa(mensajeGuardados) : '#productos'} className="corte-sm relative grid h-11 w-11 shrink-0 place-items-center border border-white/25 bg-white/10 text-white transition hover:border-cyan-300 hover:text-cyan-300" aria-label={guardados.length ? `Consultar ${guardados.length} productos guardados` : 'Ver productos'}>
              <span aria-hidden="true">♡</span>
              {guardados.length > 0 && <span className="tabular absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center bg-rose-400 px-1 font-marcador text-[10px] font-bold text-slate-950">{guardados.length}</span>}
            </a>
            <MenuMovil
              enlaces={enlaces}
              activa={activa}
              cta={{ href: wa(mensajeGuardados), texto: 'Comprar por WhatsApp' }}
              tono={{
                boton: 'corte-sm border border-white/25 bg-white/10 text-white',
                panel: 'border-cyan-300/30 bg-slate-950 text-white',
                activo: 'text-cyan-300',
                cta: 'corte-sm bg-cyan-300 text-slate-950',
              }}
            />
          </div>
        </div>
      </header>

      <main id="contenido">
        <section id="inicio" className="relative isolate overflow-hidden bg-slate-950">
          <img
            src="/img/foto-15176497639620.jpg"
            alt="Atletas entrenando en una pista deportiva"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,#020617_0%,rgba(2,6,23,.95)_48%,rgba(2,6,23,.45)_100%)]" />
          <span className="velocidad absolute -right-24 top-0 -z-10 h-full w-2/3 text-cyan-300 opacity-[0.08]" aria-hidden="true" />

          <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 md:pb-24 md:pt-20 lg:px-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="corte-sm flex items-center gap-2 border border-rose-400/50 bg-rose-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-rose-300">
                <span className="latido h-1.5 w-1.5 rounded-full bg-rose-400" aria-hidden="true" />
                En vivo
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/75">Temporada 2026 · Punto Fijo, Falcón</span>
            </div>

            <h1 className="mt-8 max-w-5xl text-6xl font-black uppercase leading-[0.86] tracking-[-0.02em] text-white sm:text-7xl lg:text-[7rem]">
              Equipo original para entrenar <span className="text-cyan-300">en serio</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              Calzado, ropa técnica y accesorios originales. Te ayudamos a elegir la talla por WhatsApp antes de pagar y te lo enviamos a toda Venezuela.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#productos" className="corte inline-flex items-center justify-center bg-cyan-300 px-8 py-4 font-display text-lg font-black uppercase tracking-wide text-slate-950 shadow-2xl shadow-cyan-400/20 cta hover:bg-white">
                Ver productos destacados
              </a>
              <a href={wa('Hola, quiero asesoría para elegir mi equipo.')} className="corte inline-flex items-center justify-center border border-white/25 bg-white/10 px-8 py-4 font-display text-lg font-black uppercase tracking-wide text-white backdrop-blur cta hover:bg-white/15">
                Pedir asesoría por WhatsApp
              </a>
            </div>

            <div ref={refMarcador} className="tabular corte mt-12 grid max-w-4xl grid-cols-2 gap-px border border-white/15 bg-white/15 md:grid-cols-4">
              {marcador.map(([valor, etiqueta]) => (
                <div key={etiqueta} className="bg-slate-950/85 px-5 py-5 backdrop-blur">
                  <strong className="block font-marcador text-4xl font-bold leading-none text-cyan-300 md:text-5xl" aria-hidden="true" data-cifra={valor}>
                    {valor}
                  </strong>
                  <span className="sr-only">{valor}</span>
                  <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/75">{etiqueta}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Producto de la jornada" className="relative isolate overflow-hidden border-y border-cyan-300/25 bg-[#06121c] text-white">
          <span className="velocidad absolute inset-0 text-cyan-300 opacity-[0.07]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:px-8">
            <img
              src="/img/foto-15422910267eec.jpg"
              alt="Zapatos running rojos AeroPulse Runner Pro"
              className="corte h-52 w-full object-cover lg:h-60"
            />
            <div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em]">
                <span className="corte-sm border border-cyan-300/50 bg-cyan-300/10 px-3 py-1.5 text-cyan-200">Producto de la jornada</span>
                <span className="tabular font-marcador text-white/80">MIN 20'</span>
              </div>
              <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">AeroPulse Runner Pro</h2>
              <div className="tabular mt-4 flex flex-wrap items-baseline gap-4">
                <span className="font-marcador text-4xl font-bold text-cyan-300">$89</span>
                <span className="font-marcador text-lg text-white/70 line-through">$110</span>
                <span className="corte-sm bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">-20%</span>
              </div>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
                Confirma talla, disponibilidad y envío con un asesor antes de comprar. Respondemos en minutos.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={wa('Hola, quiero comprar AeroPulse Runner Pro ($89). ¿Qué tallas tienen disponibles?')} className="corte-sm bg-cyan-300 px-6 py-3 font-display text-base font-black uppercase tracking-wide text-slate-950 cta hover:bg-white">
                  Comprar
                </a>
                <a href={wa('Hola, quiero hablar con un asesor.')} className="corte-sm border border-white/30 px-6 py-3 font-display text-base font-black uppercase tracking-wide text-white cta hover:border-cyan-300 hover:text-cyan-300">
                  Hablar con asesor
                </a>
              </div>
            </div>
          </div>
        </section>

        <DivisorCancha />

        <section id="categorias" className="py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="corte-sm inline-block bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Plantilla oficial</p>
                <h2 className="mt-4 max-w-3xl text-5xl font-black uppercase leading-[0.95] sm:text-6xl">Elige tu disciplina</h2>
              </div>
              <p className="max-w-md text-base leading-7 text-slate-600">Running, gimnasio, cancha o tabla: cada línea con lo que de verdad se usa en cada deporte.</p>
            </div>

            <div ref={refCategorias} className="grid gap-5 md:grid-cols-4">
              {categories.map((cat, indice) => (
                <a
                  key={cat.name}
                  href="#productos"
                  className={`corte group relative overflow-hidden bg-slate-950 shadow-sm ${cat.size}`}
                  onClick={() => setActiveFilter(cat.name)}
                >
                  <img src={cat.img} alt={`Categoría ${cat.name}`} className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40" />
                  <span className="velocidad absolute inset-x-0 top-0 h-16 text-cyan-300 opacity-40" aria-hidden="true" />
                  <span aria-hidden="true" className="dorsal tabular absolute right-5 top-3 font-marcador text-5xl font-bold text-white/30 transition duration-500 group-hover:-translate-y-2 group-hover:text-cyan-300/80">
                    {String(indice + 1).padStart(2, '0')}
                  </span>
                  <span className="corte-sm absolute left-5 top-5 bg-slate-950/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/85 backdrop-blur">
                    {cat.stat}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">{cat.eyebrow}</p>
                    <div className="flex items-end justify-between gap-5">
                      <h3 className="text-3xl font-black uppercase tracking-tight">{cat.name}</h3>
                      <span className="corte-sm bg-cyan-300 px-4 py-2 text-xs font-black uppercase text-slate-950 transition duration-300 group-hover:-translate-y-1 group-hover:bg-white">Ver ficha</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="titulo-carril" ref={refCarril} className="carril relative bg-slate-950 text-white">
          <div className="carril-marco">
            <div className="mx-auto max-w-7xl px-5 pb-2 pt-24 lg:px-8">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="corte-sm inline-block bg-cyan-300 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-slate-950">Carril de destacados</p>
                  <h2 id="titulo-carril" className="mt-4 text-5xl font-black uppercase leading-[0.95] sm:text-6xl">Lo que más sale</h2>
                </div>
                <p className="max-w-md text-base leading-7 text-white/70">
                  Ocho modelos que se mueven esta semana: recórrelos de un vistazo y en el teléfono deslízalos con el dedo.
                </p>
              </div>
            </div>
            <div className="carril-ventana mt-6">
              <ul className="carril-pista">
                {products.map((product, indice) => (
                  <li key={product.name} className="carril-item corte group relative overflow-hidden border border-white/15 bg-white/[0.06]">
                    <div className="relative aspect-[5/4] overflow-hidden bg-slate-900">
                      <img src={product.img} alt={product.name} className="h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-105" />
                      <span className="velocidad absolute inset-x-0 bottom-0 h-14 text-cyan-300 opacity-45" aria-hidden="true" />
                      <span aria-hidden="true" className="dorsal tabular absolute bottom-0 right-3 font-marcador text-[4.5rem] font-bold leading-[0.8] text-white/40 [text-shadow:0_2px_12px_rgba(2,6,23,0.65)] transition duration-500 group-hover:-translate-y-3 group-hover:text-cyan-300">
                        {String(indice + 1).padStart(2, '0')}
                      </span>
                      {product.tag && (
                        <span className={`corte-sm absolute left-4 top-4 px-3 py-1.5 text-xs font-black ${product.tag.includes('%') ? 'bg-amber-300 text-slate-950' : 'bg-cyan-300 text-slate-950'}`}>
                          {product.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-200">{product.category}</p>
                      <h3 className="mt-1 text-xl font-extrabold uppercase leading-6 text-white">{product.name}</h3>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <p className="tabular font-marcador text-2xl font-bold text-cyan-300">${product.price}</p>
                        <a
                          href={wa(`Hola, quiero comprar ${product.name} ($${product.price}). ¿Qué tallas tienen disponibles?`)}
                          aria-label={`Comprar ${product.name}`}
                          className="cta corte-sm shrink-0 bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 hover:bg-white"
                        >
                          Comprar
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="productos" className="relative overflow-hidden border-y border-slate-950/10 bg-white py-24">
          <span className="velocidad absolute inset-x-0 top-0 h-20 text-slate-950 opacity-[0.05]" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="corte-sm inline-block bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Catálogo destacado</p>
                <h2 className="mt-4 text-5xl font-black uppercase leading-[0.95] sm:text-6xl">Productos listos para comprar</h2>
                {busqueda.trim() && (
                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    Resultados para «{busqueda.trim()}» ·{' '}
                    <button type="button" onClick={() => setBusqueda('')} className="font-black text-cyan-700 underline underline-offset-4">ver todo</button>
                  </p>
                )}
              </div>
              <a href={wa('Hola, ¿me pueden enviar el catálogo completo?')} className="corte-sm inline-flex w-fit bg-slate-950 px-6 py-3 font-display text-base font-black uppercase tracking-wide text-white cta hover:bg-cyan-500 hover:text-slate-950">
                Pedir catálogo completo
              </a>
            </div>

            <form role="search" onSubmit={buscar} className="mb-4 lg:hidden">
              <input
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                aria-label="Buscar productos"
                placeholder="Buscar zapatos, ropa, accesorios..."
                className="w-full border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-semibold outline-none transition focus:border-cyan-600 focus:bg-white"
              />
            </form>
            <div className="mb-10 flex gap-3 overflow-x-auto pb-2" role="group" aria-label="Filtrar por disciplina">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`corte-sm shrink-0 border px-5 py-2.5 font-display text-base font-black uppercase tracking-wide transition ${activeFilter === filter ? 'border-slate-950 bg-slate-950 text-cyan-300' : 'border-slate-300 bg-white text-slate-600 hover:border-cyan-600 hover:text-cyan-700'}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="corte border border-dashed border-slate-400 bg-slate-50 px-6 py-14 text-center">
                <p className="text-3xl font-black uppercase">No lo tenemos en vitrina</p>
                <p className="mx-auto mt-3 max-w-md text-sm font-semibold text-slate-600">Pregúntanos igual: traemos modelos por encargo en 5 a 7 días.</p>
                <a href={wa(`Hola, busco: ${busqueda.trim()}. ¿Lo pueden conseguir?`)} className="corte-sm mt-6 inline-flex bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-cyan-500 hover:text-slate-950">Preguntar por WhatsApp</a>
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product, indice) => (
                <article key={product.name} className="corte group flex flex-col overflow-hidden border border-slate-300 bg-white transition hover:-translate-y-1 hover:border-cyan-600 hover:shadow-2xl hover:shadow-slate-950/15">
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img src={product.img} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <span aria-hidden="true" className="dorsal tabular absolute bottom-0 right-4 font-marcador text-[5rem] font-bold leading-[0.8] text-white/40 [text-shadow:0_2px_12px_rgba(2,6,23,0.65)] transition duration-500 group-hover:-translate-y-3 group-hover:text-cyan-300">
                      {String(indice + 1).padStart(2, '0')}
                    </span>
                    <span className="velocidad absolute inset-x-0 bottom-0 h-12 text-slate-950 opacity-0 transition group-hover:opacity-20" aria-hidden="true" />
                    {product.tag && (
                      <span className={`corte-sm absolute left-4 top-4 px-3 py-1.5 text-xs font-black ${product.tag.includes('%') ? 'bg-amber-300 text-slate-950' : 'bg-cyan-300 text-slate-950'}`}>
                        {product.tag}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => alternarGuardado(product.name)}
                      aria-pressed={guardados.includes(product.name)}
                      className={`corte-sm absolute right-4 top-4 grid h-10 w-10 place-items-center shadow-sm backdrop-blur transition active:scale-90 ${guardados.includes(product.name) ? 'bg-slate-950 text-cyan-300' : 'bg-white/90 text-slate-950 hover:bg-slate-950 hover:text-white'}`}
                      aria-label={`Guardar ${product.name}`}
                    >
                      {guardados.includes(product.name) ? '♥' : '♡'}
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wide text-slate-500">
                      <span className="corte-sm bg-slate-100 px-2 py-1">{product.category}</span>
                      <span className="text-amber-700">★ {product.rating}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold uppercase leading-7">{product.name}</h3>
                    <div className="tabular mt-auto flex items-end justify-between gap-4 pt-5">
                      <div className="font-marcador">
                        <span className="text-3xl font-bold">${product.price}</span>
                        {product.oldPrice && <span className="ml-2 text-sm font-semibold text-slate-500 line-through">${product.oldPrice}</span>}
                      </div>
                      <a href={wa(`Hola, quiero comprar ${product.name} ($${product.price}). ¿Qué tallas tienen disponibles?`)} aria-label={`Comprar ${product.name}`} className="cta corte-sm bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 hover:bg-slate-950 hover:text-white">
                        Comprar
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Garantías" className="relative isolate overflow-hidden bg-slate-950 text-white">
          <span className="velocidad absolute inset-0 text-cyan-300 opacity-[0.08]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-7xl gap-4 px-5 py-20 md:grid-cols-3 lg:px-8">
            {benefits.map((benefit, indice) => (
              <div key={benefit.title} className="corte border border-white/15 bg-slate-950/70 p-7 backdrop-blur transition hover:border-cyan-300/60">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <span className="tabular font-marcador text-5xl font-bold leading-none text-cyan-300">{benefit.value}</span>
                  <span className="tabular font-marcador text-sm font-bold text-white/60">{String(indice + 1).padStart(2, '0')} / 03</span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/75">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="ofertas" className="relative overflow-hidden bg-white py-24">
          <span className="velocidad absolute inset-x-0 top-0 h-24 text-slate-950 opacity-[0.05]" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="corte-sm inline-block bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Marcador de la semana</p>
              <h2 className="mt-4 text-5xl font-black uppercase leading-[0.95] sm:text-6xl">Cupones de esta semana</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Dile el código al asesor por WhatsApp y te lo aplica al confirmar tu compra.</p>
            </div>

            <div ref={refOfertas} className="grid gap-6 md:grid-cols-3">
              {promos.map((promo) => (
                <article key={promo.code} className="corte relative overflow-hidden bg-slate-950 text-white shadow-2xl shadow-slate-950/20">
                  <div className={`absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br ${promo.accent} blur-2xl`} aria-hidden="true" />
                  <div className="relative flex items-center justify-between border-b border-white/15 bg-white/[0.07] px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em]">
                    <span className="flex items-center gap-2 text-cyan-200">
                      <span className="latido h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden="true" />
                      En curso
                    </span>
                    <span className="tabular font-marcador text-white/85">MIN {promo.minuto}</span>
                  </div>
                  <div className="relative flex items-end justify-between gap-4 px-5 pt-6">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/75">{promo.title}</p>
                      <h3 className="mt-1 font-marcador text-3xl font-bold tracking-tight text-cyan-300">{promo.code}</h3>
                    </div>
                    <div className="text-right">
                      <p className="tabular font-marcador text-5xl font-bold leading-none">
                        <span>{promo.score[0]}</span>
                        <span className="text-white/65">-</span>
                        <span className="text-white/75">{promo.score[1]}</span>
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/75">{promo.unidad}</p>
                    </div>
                  </div>
                  <p className="relative mt-4 min-h-14 px-5 text-base leading-7 text-white/80">{promo.desc}</p>
                  <div className="relative mt-4 pb-6 px-5">
                    <a href={wa(`Hola, quiero usar el cupón ${promo.code}.`)} className="cta corte-sm inline-flex bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-white">
                      Usar cupón
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="club" className="bg-[#f4f7fb] px-5 py-24 lg:px-8">
          <div className="corte mx-auto grid max-w-7xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white shadow-2xl shadow-slate-950/25 lg:grid-cols-[1.08fr_.92fr]">
            <div className="relative isolate p-8 sm:p-12 lg:p-16">
              <span className="velocidad absolute inset-x-0 top-0 h-14 text-cyan-300 opacity-20" aria-hidden="true" />
              <div className="relative flex flex-wrap items-center gap-3">
                <span className="corte-sm bg-cyan-300 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-950">Club SportZone</span>
                <span className="tabular font-marcador text-xs font-bold text-white/75">INSCRIPCIÓN 01 / 02</span>
              </div>
              <h2 className="relative mt-5 max-w-2xl text-5xl font-black uppercase leading-[0.95] sm:text-6xl">Entra al Club SportZone</h2>
              <p className="relative mt-6 max-w-xl text-lg leading-8 text-white/80">Te avisamos primero cuando llegan modelos nuevos y te guardamos tu talla. Un correo al mes, sin relleno.</p>
              {club === 'listo' ? (
                <div className="corte-sm relative mt-9 border border-cyan-300/50 bg-cyan-300/10 p-6" role="status">
                  <p className="text-lg font-black">Falta un paso: confírmalo por WhatsApp.</p>
                  <p className="mt-2 text-sm text-white/80">Así te guardamos la talla y te avisamos de los modelos nuevos en {correo.trim()}.</p>
                  <a href={wa(`Hola, quiero entrar al Club SportZone. Mi correo es ${correo.trim()}.`)} className="corte-sm mt-5 inline-flex bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-white">Confirmar por WhatsApp</a>
                </div>
              ) : (
                <form onSubmit={unirse} noValidate className="relative mt-9">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="email"
                      value={correo}
                      onChange={(event) => {
                        setCorreo(event.target.value)
                        if (club === 'error') setClub('inicial')
                      }}
                      placeholder="Tu correo electrónico"
                      aria-label="Correo electrónico"
                      aria-invalid={club === 'error'}
                      aria-describedby="club-error"
                      autoComplete="email"
                      className={`min-h-14 flex-1 border bg-white/10 px-6 text-white outline-none placeholder:text-white/70 focus:border-cyan-200 ${club === 'error' ? 'border-orange-300' : 'border-white/25'}`}
                    />
                    <button className="cta corte-sm min-h-14 bg-cyan-300 px-8 font-display text-base font-black uppercase tracking-wide text-slate-950 hover:bg-white">Unirme</button>
                  </div>
                  <p id="club-error" className="mt-3 min-h-5 pl-6 text-sm font-semibold text-orange-200">{club === 'error' ? 'Revisa el correo: debe tener la forma nombre@dominio.com.' : ''}</p>
                </form>
              )}
            </div>
            <div className="relative min-h-[360px] bg-slate-950">
              <img src="/img/foto-15186110121186.jpg" alt="Persona entrenando con ropa deportiva" className="absolute inset-0 h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
              <span className="velocidad absolute inset-x-0 bottom-0 h-24 text-cyan-300 opacity-25" aria-hidden="true" />
              <a href={wa(mensajeGuardados)} className="cta corte-sm absolute bottom-8 left-8 right-8 bg-cyan-300 px-6 py-4 text-center font-display text-lg font-black uppercase tracking-wide text-slate-950 hover:bg-white">
                Comprar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section id="ubicacion" aria-labelledby="titulo-ubicacion" className="relative overflow-hidden bg-white py-24">
          <span className="velocidad absolute inset-x-0 top-0 h-20 text-slate-950 opacity-[0.05]" aria-hidden="true" />
          <div ref={refUbicacion} className="relative mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="corte-sm inline-block bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Dónde estamos</p>
                <h2 id="titulo-ubicacion" className="mt-4 max-w-3xl text-5xl font-black uppercase leading-[0.95] sm:text-6xl">Te esperamos en Punto Fijo</h2>
              </div>
              <p className="max-w-md text-base leading-7 text-slate-600">
                Pasa por la sede o coordina por WhatsApp antes de venir: confirmamos talla y disponibilidad en minutos.
              </p>
            </div>

            <div className="grid gap-7 lg:grid-cols-2 lg:items-start">
              <div className="corte border border-slate-200 bg-slate-50 p-7 sm:p-9">
                <p className="tabular font-marcador text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">SEDE 01</p>
                <h3 className="mt-4 text-3xl font-black uppercase leading-8 tracking-tight text-slate-950 sm:text-4xl">Punto Fijo, Falcón</h3>
                <p className="mt-2 text-base leading-7 text-slate-600">Estado Falcón, Venezuela. Sede principal de SportZone Pro.</p>
                <DatosSede />
                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={MAPA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta corte-sm inline-flex items-center bg-slate-950 px-6 py-4 font-display text-base font-black uppercase tracking-wide text-cyan-300 transition hover:bg-cyan-300 hover:text-slate-950"
                  >
                    Cómo llegar
                  </a>
                  <a
                    href={wa('Hola, quiero consultar la sede de Punto Fijo.')}
                    className="cta corte-sm inline-flex items-center border border-slate-300 bg-white px-6 py-4 font-display text-base font-black uppercase tracking-wide text-slate-950 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
                  >
                    Escribir por WhatsApp
                  </a>
                </div>
              </div>

              <MapaSede />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-cyan-300/30 bg-slate-950 py-14 text-white">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center bg-cyan-300 font-marcador text-sm font-bold text-slate-950">SZ</span>
              <div>
                <span className="block text-lg font-black uppercase">SportZone Pro</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Performance store</span>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/75">Calzado, ropa técnica y accesorios originales con asesoría de talla por WhatsApp y envíos a toda Venezuela.</p>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">Categorías</h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-white/75">
              <li><a href="#categorias" className="transition hover:text-cyan-300">Running</a></li>
              <li><a href="#categorias" className="transition hover:text-cyan-300">Training</a></li>
              <li><a href="#categorias" className="transition hover:text-cyan-300">Fútbol</a></li>
              <li><a href="#ofertas" className="transition hover:text-cyan-300">Ofertas</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">Contacto</h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-white/75">
              <li><a href="#ubicacion" className="transition hover:text-cyan-300">Punto Fijo, Falcón</a></li>
              <li><a href={wa()} className="transition hover:text-cyan-300">WhatsApp: +58 412-000-0000</a></li>
              <li>Atención: 9:00 AM - 7:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-white/15 px-5 pt-7 text-center text-xs font-semibold text-white/70 lg:px-8">
          © 2026 SportZone Pro. Demo creada por Carlos Avila - Developer 🇻🇪 ·{' '}
          <a href="/privacidad/" className="underline underline-offset-2 transition hover:text-cyan-300">Privacidad</a>
        </div>
      </footer>
      <WhatsAppFlotante texto={mensajeGuardados} className="corte-sm bg-cyan-300 text-slate-950" />
    </div>
  )
}

export default App
