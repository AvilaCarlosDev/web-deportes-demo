import { useMemo, useState } from 'react'
import { MenuMovil, SaltarAlContenido, WhatsAppFlotante } from './sitio.jsx'
import { useSeccionActiva, wa } from './navegacion.js'

const enlaces = [
  ['categorias', 'Categorías'],
  ['productos', 'Productos'],
  ['ofertas', 'Ofertas'],
  ['club', 'Club'],
]

const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

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

const promos = [
  { code: 'RUN20', title: 'Running drop', desc: '20% OFF en calzado seleccionado', accent: 'from-sky-400 to-cyan-300' },
  { code: 'GYM40', title: 'Gym week', desc: 'Hasta 40% OFF en ropa técnica', accent: 'from-orange-400 to-amber-300' },
  { code: 'PACK2X1', title: 'Accesorios', desc: 'Combos 2x1 para entrenar diario', accent: 'from-lime-300 to-cyan-300' },
]

function App() {
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')
  const [guardados, setGuardados] = useState([])
  const [correo, setCorreo] = useState('')
  const [club, setClub] = useState('inicial')
  const activa = useSeccionActiva(enlaces.map(([id]) => id))

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
      <SaltarAlContenido className="focus:rounded-full focus:bg-slate-950 focus:text-white" />
      <div className="bg-slate-950 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-8 px-5 py-2.5 md:justify-between">
          <span>Envíos a toda Venezuela</span>
          <span className="hidden md:inline">Compra asistida por WhatsApp</span>
          <span className="hidden md:inline">Cambios simples por talla</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-5 lg:px-8">
          <a href="#inicio" className="flex shrink-0 items-center gap-3" aria-label="SportZone Pro inicio">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-cyan-300 shadow-xl shadow-slate-950/10">SZ</span>
            <span>
              <span className="block text-lg font-black tracking-tight">SportZone Pro</span>
              <span className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Performance Store</span>
            </span>
          </a>

          <form role="search" onSubmit={buscar} className="hidden flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 transition focus-within:border-cyan-400 focus-within:bg-white lg:flex">
            <span aria-hidden="true" className="text-slate-400">⌕</span>
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              aria-label="Buscar productos"
              placeholder="Buscar zapatos, ropa, accesorios..."
              className="w-full bg-transparent px-3 py-1 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button className="rounded-full bg-slate-950 px-5 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-cyan-500 hover:text-slate-950 active:scale-95">
              Buscar
            </button>
          </form>

          <nav aria-label="Principal" className="hidden items-center gap-5 text-sm font-black text-slate-600 lg:flex">
            {enlaces.map(([id, texto]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activa === id ? 'true' : undefined}
                className={`relative py-1 transition hover:text-cyan-600 ${activa === id ? 'text-slate-950 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-cyan-400' : ''}`}
              >
                {texto}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <a href={wa('Hola, quiero asesoría para elegir mi equipo.')} className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-800 transition hover:border-cyan-400 hover:text-cyan-700 xl:inline-flex">
              WhatsApp
            </a>
            <a href={guardados.length ? wa(mensajeGuardados) : '#productos'} className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-950 text-white transition hover:bg-cyan-500 hover:text-slate-950" aria-label={guardados.length ? `Consultar ${guardados.length} productos guardados` : 'Ver productos'}>
              <span aria-hidden="true">♡</span>
              {guardados.length > 0 && <span className="tabular absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-cyan-300 px-1 text-[10px] font-black text-slate-950">{guardados.length}</span>}
            </a>
            <MenuMovil
              enlaces={enlaces}
              activa={activa}
              cta={{ href: wa(mensajeGuardados), texto: 'Comprar por WhatsApp' }}
              tono={{
                boton: 'rounded-full border border-slate-200 bg-white text-slate-950',
                panel: 'border-slate-200 bg-white text-slate-950',
                activo: 'text-cyan-700',
                cta: 'rounded-full bg-cyan-300 text-slate-950',
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
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_74%_18%,rgba(34,211,238,.42),transparent_26%),linear-gradient(115deg,#020617_0%,rgba(2,6,23,.96)_42%,rgba(15,23,42,.42)_100%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f4f7fb] to-transparent" />

          <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.02fr_.98fr] lg:px-8">
            <div className="max-w-3xl pt-8 text-white">
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-200 backdrop-blur">
                Nueva colección 2026 · Venezuela
              </div>
              <h1 className="text-6xl font-black uppercase italic leading-[0.88] tracking-[-0.01em] sm:text-7xl lg:text-[6.5rem]">
                Equipo original para entrenar en serio
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
                Calzado, ropa técnica y accesorios originales. Te ayudamos a elegir la talla por WhatsApp antes de pagar y te lo enviamos a toda Venezuela.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a href="#productos" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-8 py-4 text-base font-black text-slate-950 shadow-2xl shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-white">
                  Ver productos destacados
                </a>
                <a href={wa('Hola, quiero asesoría para elegir mi equipo.')} className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur transition hover:bg-white/15">
                  Pedir asesoría por WhatsApp
                </a>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-3 overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 backdrop-blur-xl">
                {[
                  ['500+', 'productos'],
                  ['24h', 'despacho'],
                  ['4.9★', 'valoración'],
                ].map(([value, label]) => (
                  <div key={label} className="border-r border-white/10 p-5 last:border-r-0">
                    <strong className="block text-2xl font-black">{value}</strong>
                    <span className="text-[11px] font-black uppercase tracking-wide text-white/45">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden min-h-[560px] lg:block">
              <div className="absolute right-0 top-8 w-[22rem] rotate-2 rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <img
                  src="/img/foto-15422910267eec.jpg"
                  alt="Zapatos running rojos"
                  className="h-72 w-full rounded-[1.5rem] object-cover"
                />
                <div className="p-4 text-white">
                  <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wide text-cyan-200">
                    <span>Drop recomendado</span>
                    <span>4.9 ★</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">AeroPulse Runner Pro</h2>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-3xl font-black">$89</span>
                    <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">-20%</span>
                  </div>
                </div>
              </div>
              <div className="absolute left-0 top-24 max-w-[16rem] -rotate-2 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 text-white shadow-2xl backdrop-blur-xl">
                <p className="text-sm font-semibold leading-6 text-white/68">Confirma talla, disponibilidad y envío con un asesor antes de comprar. Respondemos en minutos.</p>
                <a href={wa('Hola, quiero hablar con un asesor.')} className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
                  Hablar con asesor
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="categorias" className="py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">Compra por disciplina</p>
                <h2 className="mt-3 max-w-3xl text-5xl font-black uppercase italic leading-[0.95] sm:text-6xl">Elige tu disciplina</h2>
              </div>
              <p className="max-w-md text-base leading-7 text-slate-500">Running, gimnasio, cancha o tabla: cada línea con lo que de verdad se usa en cada deporte.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-4">
              {categories.map((cat) => (
                <a
                  key={cat.name}
                  href="#productos"
                  className={`group relative overflow-hidden rounded-[2rem] bg-slate-950 shadow-sm ${cat.size}`}
                  onClick={() => setActiveFilter(cat.name)}
                >
                  <img src={cat.img} alt={cat.name} className="absolute inset-0 h-full w-full object-cover opacity-82 transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/75 backdrop-blur">
                    {cat.stat}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">{cat.eyebrow}</p>
                    <div className="flex items-end justify-between gap-5">
                      <h3 className="text-3xl font-black tracking-tight">{cat.name}</h3>
                      <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black backdrop-blur transition group-hover:bg-cyan-300 group-hover:text-slate-950">Explorar</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="productos" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-700">Catálogo destacado</p>
                <h2 className="mt-3 text-5xl font-black uppercase italic leading-[0.95] sm:text-6xl">Productos listos para comprar</h2>
                {busqueda.trim() && (
                  <p className="mt-3 text-sm font-semibold text-slate-500">
                    Resultados para «{busqueda.trim()}» ·{' '}
                    <button type="button" onClick={() => setBusqueda('')} className="font-black text-cyan-700 underline underline-offset-4">ver todo</button>
                  </p>
                )}
              </div>
              <a href={wa('Hola, ¿me pueden enviar el catálogo completo?')} className="inline-flex w-fit rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-cyan-500 hover:text-slate-950">
                Pedir catálogo completo
              </a>
            </div>

            <form role="search" onSubmit={buscar} className="mb-4 lg:hidden">
              <input
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                aria-label="Buscar productos"
                placeholder="⌕  Buscar zapatos, ropa, accesorios..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
              />
            </form>
            <div className="mb-10 flex gap-3 overflow-x-auto pb-2" role="group" aria-label="Filtrar por disciplina">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-black transition ${activeFilter === filter ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-cyan-400 hover:text-cyan-700'}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                <p className="text-3xl font-black uppercase italic">No lo tenemos en vitrina</p>
                <p className="mx-auto mt-3 max-w-md text-sm font-semibold text-slate-500">Pregúntanos igual: traemos modelos por encargo en 5 a 7 días.</p>
                <a href={wa(`Hola, busco: ${busqueda.trim()}. ¿Lo pueden conseguir?`)} className="mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-cyan-500 hover:text-slate-950">Preguntar por WhatsApp</a>
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <article key={product.name} className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-2xl hover:shadow-slate-950/10">
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img src={product.img} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    {product.tag && (
                      <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-black ${product.tag.includes('%') ? 'bg-orange-300 text-slate-950' : 'bg-cyan-300 text-slate-950'}`}>
                        {product.tag}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => alternarGuardado(product.name)}
                      aria-pressed={guardados.includes(product.name)}
                      className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full shadow-sm backdrop-blur transition active:scale-90 ${guardados.includes(product.name) ? 'bg-slate-950 text-cyan-300' : 'bg-white/90 text-slate-950 hover:bg-slate-950 hover:text-white'}`}
                      aria-label={`Guardar ${product.name}`}
                    >
                      {guardados.includes(product.name) ? '♥' : '♡'}
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wide text-slate-400">
                      <span>{product.category}</span>
                      <span className="text-amber-500">★ {product.rating}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold uppercase leading-7">{product.name}</h3>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                      <div className="tabular">
                        <span className="text-3xl font-black">${product.price}</span>
                        {product.oldPrice && <span className="ml-2 text-sm font-bold text-slate-400 line-through">${product.oldPrice}</span>}
                      </div>
                      <a href={wa(`Hola, quiero comprar ${product.name} ($${product.price}). ¿Qué tallas tienen disponibles?`)} aria-label={`Comprar ${product.name}`} className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-slate-950 hover:text-white active:scale-95">
                        Comprar
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Garantías" className="bg-slate-950 text-white">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-20 md:grid-cols-3 lg:px-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition hover:border-cyan-300/50 hover:bg-white/[0.07]">
                <span className="tabular mb-8 block font-[family-name:var(--font-display)] text-5xl font-black italic text-cyan-300">{benefit.value}</span>
                <h3 className="text-xl font-black tracking-tight">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="ofertas" className="relative overflow-hidden bg-white py-24">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-500">Ofertas activas</p>
              <h2 className="mt-3 text-5xl font-black uppercase italic leading-[0.95] sm:text-6xl">Cupones de esta semana</h2>
              <p className="mt-5 text-lg leading-8 text-slate-500">Dile el código al asesor por WhatsApp y te lo aplica al confirmar tu compra.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {promos.map((promo) => (
                <article key={promo.code} className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-slate-950/10">
                  <div className={`absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br ${promo.accent} opacity-70 blur-2xl`} />
                  <div className="relative">
                    <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/70">{promo.title}</span>
                    <h3 className="tabular mt-8 text-5xl font-black italic tracking-wide">{promo.code}</h3>
                    <p className="mt-4 min-h-14 text-base leading-7 text-white/60">{promo.desc}</p>
                    <a href={wa(`Hola, quiero usar el cupón ${promo.code}.`)} className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200">
                      Usar cupón
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="club" className="bg-[#f4f7fb] px-5 py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white shadow-2xl shadow-slate-950/20 lg:grid-cols-[1.08fr_.92fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Club SportZone</p>
              <h2 className="mt-4 max-w-2xl text-5xl font-black uppercase italic leading-[0.95] sm:text-6xl">Entra al Club SportZone</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">Te avisamos primero cuando llegan modelos nuevos y te guardamos tu talla. Un correo al mes, sin relleno.</p>
              {club === 'listo' ? (
                <div className="mt-9 rounded-[1.5rem] border border-cyan-300/40 bg-cyan-300/10 p-6" role="status">
                  <p className="text-lg font-black">Falta un paso: confírmalo por WhatsApp.</p>
                  <p className="mt-2 text-sm text-white/65">Así te guardamos la talla y te avisamos de los modelos nuevos en {correo.trim()}.</p>
                  <a href={wa(`Hola, quiero entrar al Club SportZone. Mi correo es ${correo.trim()}.`)} className="mt-5 inline-flex rounded-full bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-white">Confirmar por WhatsApp</a>
                </div>
              ) : (
                <form onSubmit={unirse} noValidate className="mt-9">
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
                      className={`min-h-14 flex-1 rounded-full border bg-white/10 px-6 text-white outline-none placeholder:text-white/50 focus:border-cyan-200 ${club === 'error' ? 'border-orange-300' : 'border-white/15'}`}
                    />
                    <button className="min-h-14 rounded-full bg-cyan-300 px-8 text-sm font-black text-slate-950 transition hover:bg-white active:scale-[.98]">Unirme</button>
                  </div>
                  <p id="club-error" className="mt-3 min-h-5 pl-6 text-sm font-semibold text-orange-200">{club === 'error' ? 'Revisa el correo: debe tener la forma nombre@dominio.com.' : ''}</p>
                </form>
              )}
            </div>
            <div className="relative min-h-[360px] bg-slate-950">
              <img src="/img/foto-15186110121186.jpg" alt="Persona entrenando con ropa deportiva" className="absolute inset-0 h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
              <a href={wa(mensajeGuardados)} className="absolute bottom-8 left-8 right-8 rounded-full bg-cyan-300 px-6 py-4 text-center text-sm font-black text-slate-950 transition hover:bg-white">
                Comprar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-cyan-300">SZ</span>
              <div>
                <span className="block text-lg font-black">SportZone Pro</span>
                <span className="text-xs font-semibold text-slate-500">Performance store</span>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-500">Calzado, ropa técnica y accesorios originales con asesoría de talla por WhatsApp y envíos a toda Venezuela.</p>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide">Categorías</h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-slate-500">
              <li><a href="#categorias" className="hover:text-cyan-700">Running</a></li>
              <li><a href="#categorias" className="hover:text-cyan-700">Training</a></li>
              <li><a href="#categorias" className="hover:text-cyan-700">Fútbol</a></li>
              <li><a href="#ofertas" className="hover:text-cyan-700">Ofertas</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide">Contacto</h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-slate-500">
              <li>Punto Fijo, Falcón</li>
              <li><a href={wa()} className="hover:text-cyan-700">WhatsApp: +58 412-000-0000</a></li>
              <li>Atención: 9:00 AM - 7:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-slate-200 px-5 pt-7 text-center text-xs font-semibold text-slate-400 lg:px-8">
          © 2026 SportZone Pro. Demo creada por Carlos Avila - Developer 🇻🇪 ·{' '}
          <a href="/privacidad/" className="underline underline-offset-2 hover:text-slate-700">Privacidad</a>
        </div>
      </footer>
      <WhatsAppFlotante texto={mensajeGuardados} className="bg-cyan-300 text-slate-950" />
    </div>
  )
}

export default App
