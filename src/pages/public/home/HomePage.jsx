import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import {
  MapPin, ArrowRight, Search, User,
  Award, Building2, Users, MapPinned,
  ShieldCheck, Leaf, Lightbulb, Heart,
  Home, Grid, Settings, Sun,
} from 'lucide-react'
import api from '../../../lib/api'
import PropertyCard from '../../../components/ui/PropertyCard'
import SiteNavbar from '../../../components/ui/SiteNavbar'
import {
  fadeUp, staggerContainer, cardItem,
  heroLabel, heroTitle, heroSubtitle, heroButtons, heroCard, statsBar,
  viewportOnce,
} from '../../../lib/animations'

// ─── Hero media items ─────────────────────────────────────────────────────────
const HERO_MEDIA = [
  //{ type: 'image', src: '/images/1hero-home/1hero-home.jpg', alt: 'NovaNest Premium Living' },
  //{ type: 'video', src: '/images/1hero-home/1006.mp4' },
  { type: 'video', src: 'https://res.cloudinary.com/c5kaazrm/video/upload/v1791879423/1006_1.mp4' },
/*  { type: 'video', src: '/images/1hero-home/222.mp4' },*/
  { type: 'video', src: 'https://res.cloudinary.com/c5kaazrm/video/upload/v1791879207/333.mp4' },
  { type: 'video', src: 'https://res.cloudinary.com/c5kaazrm/video/upload/v1791879274/444.mp4' },
  { type: 'video', src: 'https://res.cloudinary.com/c5kaazrm/video/upload/v1791879136/555.mp4' },
  { type: 'video', src: 'https://res.cloudinary.com/c5kaazrm/video/upload/v1791879386/666.mp4' },
  /*{ type: 'video', src: '/images/1hero-home/777.mp4' },*/
  { type: 'video', src: 'https://res.cloudinary.com/c5kaazrm/video/upload/v1791879527/888.mp4' },
  { type: 'video', src: 'https://res.cloudinary.com/c5kaazrm/video/upload/v1791879281/999.mp4' },
]


// Ken Burns presets — one per slide index (cycles if more slides added)
const KB_PRESETS = [
  // zoom in from bottom-left
  { initial: { scale: 1.12, x: '-2%', y: '2%'  }, animate: { scale: 1,    x: '0%',  y: '0%'  } },
  // pan right to left, slight zoom out
  { initial: { scale: 1.10, x: '3%',  y: '0%'  }, animate: { scale: 1.04, x: '-2%', y: '0%'  } },
  // zoom in from top-right
  { initial: { scale: 1.08, x: '2%',  y: '-2%' }, animate: { scale: 1,    x: '0%',  y: '0%'  } },
]

// ─── HeroMediaSlider ──────────────────────────────────────────────────────────
function HeroMediaSlider() {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  const advance = () => setIndex(i => (i + 1) % HERO_MEDIA.length)

  // 4-second timer for image slides
  useEffect(() => {
    clearTimeout(timerRef.current)
    if (HERO_MEDIA[index].type === 'image') {
      timerRef.current = setTimeout(advance, 4000)
    }
    return () => clearTimeout(timerRef.current)
  }, [index])

  // callback ref: fires the moment the <video> node attaches to the DOM,
  // which is safer than a useEffect when AnimatePresence has two slides mounted simultaneously
  const videoCallbackRef = (node) => {
    if (node) {
      node.currentTime = 0
      node.play().catch(() => {})
    }
  }

  const current = HERO_MEDIA[index]
  const kb      = KB_PRESETS[index % KB_PRESETS.length]

  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          {current.type === 'image' ? (
            <motion.img
              src={current.src}
              alt={current.alt || ''}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center center', willChange: 'transform' }}
              initial={kb.initial}
              animate={kb.animate}
              transition={{ duration: 4.8, ease: 'easeInOut' }}
              onError={e => e.target.style.display = 'none'}
            />
          ) : (
            <video
              ref={videoCallbackRef}
              src={current.src}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={advance}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5"
        style={{ zIndex: 10 }}
      >
        {HERO_MEDIA.map((_, i) => (
          <button
            key={i}
            onClick={() => { clearTimeout(timerRef.current); setIndex(i) }}
            aria-label={`Go to slide ${i + 1}`}
            className="transition-all duration-300 rounded-full focus:outline-none"
            style={{
              width:  i === index ? 22 : 8,
              height: 8,
              background: i === index ? '#C9A84C' : 'rgba(255,255,255,0.35)',
              boxShadow: i === index ? '0 0 8px rgba(201,168,76,0.6)' : 'none',
              border: '1.5px solid rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Left sidebar icons ───────────────────────────────────────────────────────
const SIDEBAR_ICONS = [
  /*{ icon: Home,     to: '/' },
  { icon: Search,   to: '/properties' },
  { icon: Grid,     to: '/projects' },
  { icon: User,     to: '/portal' },
  { icon: Settings, to: '/contact' },
  { icon: Sun,      to: '/about' },*/
]

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: 12,   suffix: '+', label: 'Years of Excellence', icon: Award },
  { value: 8,    suffix: '',  label: 'Completed Projects',  icon: Building2 },
  { value: 3500, suffix: '+', label: 'Happy Residents',     icon: Users },
  { value: 5,    suffix: '',  label: 'Prime Locations',     icon: MapPinned },
]

// ─── Values ───────────────────────────────────────────────────────────────────
const VALUES = [
  { icon: ShieldCheck, title: 'Excellence',    desc: 'Uncompromising quality in every detail of our developments.' },
  { icon: Heart,       title: 'Integrity',     desc: 'Honest, transparent dealings with every customer and partner.' },
  { icon: Lightbulb,   title: 'Innovation',    desc: 'Forward-thinking design that sets the standard for modern living.' },
  { icon: Leaf,        title: 'Sustainability', desc: 'Building a greener future through responsible development.' },
]

// ─── Glass style helper (reusable) ────────────────────────────────────────────
// Matches the tempered-glass panel image: near-transparent, blue-tinted edges,
// inner highlight at top, deep outer shadow.
const glassStyle = (opts = {}) => ({
  background: opts.dark
    ? 'linear-gradient(145deg, rgba(180,210,230,0.14) 0%, rgba(150,195,220,0.06) 40%, rgba(140,190,215,0.10) 100%)'
    : 'linear-gradient(145deg, rgba(200,220,235,0.22) 0%, rgba(180,210,228,0.12) 40%, rgba(165,205,225,0.18) 100%)',
  backdropFilter: 'blur(20px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
  borderStyle: 'solid',
  borderWidth: opts.thin ? '1px' : '1.5px',
  borderTopColor:    'rgba(210,240,252,0.80)',
  borderLeftColor:   'rgba(200,235,248,0.68)',
  borderRightColor:  'rgba(130,190,218,0.28)',
  borderBottomColor: 'rgba(110,178,210,0.24)',
  boxShadow: opts.noShadow ? 'none' : [
    '0 16px 48px rgba(0,0,0,0.42)',
    '0 4px 16px rgba(0,0,0,0.28)',
    'inset 0 1px 0 rgba(255,255,255,0.62)',
    'inset 0 2px 5px rgba(255,255,255,0.18)',
    'inset 0 -1px 0 rgba(90,150,185,0.20)',
  ].join(', '),
  ...opts.extra,
})

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let n = 0
    const step  = Math.ceil(target / (1800 / 16))
    const timer = setInterval(() => {
      n += step
      if (n >= target) { setCount(target); clearInterval(timer) }
      else setCount(n)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: projectsData } = useQuery({
    queryKey: ['projects-public'],
    queryFn: () => api.get('/projects', { params: { limit: 6 } }).then(r => r.data.data),
  })
  const { data: aptData } = useQuery({
    queryKey: ['apartments-featured'],
    queryFn: () => api.get('/apartments', { params: { limit: 6, status: 'AVAILABLE' } }).then(r => r.data),
  })

  const projects   = projectsData || []
  const apartments = aptData?.data || []
  const featured   = projects[0]

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── Fixed navbar — same hide/show scroll behaviour as all other pages ── */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <SiteNavbar />
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — full glass frame matching the provided design image
          Structure:
            • Outer glass frame (contains navbar + main content)
              ├── HeroNavbar (embedded at top of frame)
              ├── Left sidebar pill (icon shortcuts)
              ├── Background photo (fills the frame)
              ├── Left content (label → headline → subtitle → buttons)
              ├── Right featured-project card
              └── Bottom stats bar pill
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-navy-900 overflow-hidden"
        style={{ minHeight: '100svh', paddingTop: '74px' }}>

        {/* ── Outer glass frame ───────────────────────────────────────────── */}
        <div className="relative z-10 flex items-stretch min-h-screen p-3 lg:p-5">
          <motion.div
            className="flex-1 rounded-3xl relative flex flex-col"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              /* The glass border/shadow — no background blur here so the image is crisp */
              borderRadius: '24px',
              minHeight: 'calc(100svh - 2.5rem)',
              border: '1.5px solid rgba(210,240,252,0.35)',
              borderTopColor:    'rgba(220,245,255,0.55)',
              borderLeftColor:   'rgba(210,240,250,0.45)',
              borderRightColor:  'rgba(140,200,225,0.20)',
              borderBottomColor: 'rgba(120,185,215,0.18)',
              boxShadow: [
                '0 16px 48px rgba(0,0,0,0.55)',
                '0 4px 16px rgba(0,0,0,0.35)',
                'inset 0 1px 0 rgba(255,255,255,0.40)',
                'inset 0 -1px 0 rgba(90,150,185,0.15)',
              ].join(', '),
            }}
          >
            {/* ── Hero media slider INSIDE the frame ── */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ zIndex: 0 }}>
              <HeroMediaSlider />
            </div>

            {/* Vignette inside the frame */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none" style={{ zIndex: 1,
              background: [
                'linear-gradient(to right, rgba(10,22,40,0.72) 0%, rgba(10,22,40,0.38) 45%, rgba(10,22,40,0.05) 100%)',
                'linear-gradient(to bottom, rgba(10,22,40,0.25) 0%, transparent 25%, transparent 72%, rgba(10,22,40,0.45) 100%)',
              ].join(', '),
            }} />

            {/* All content sits above the background (z-index 2+) */}
            <div className="relative flex flex-col flex-1" style={{ zIndex: 2 }}>

            {/* ── Main hero body ──────────────────────────────────────────── */}
            <div className="flex-1 flex items-center relative px-4 lg:px-10 pb-4">

              {/* Left sidebar pill */}
              <motion.div
                className="hidden lg:flex flex-col items-center gap-3 mr-8 flex-shrink-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex flex-col items-center gap-2 py-4 px-2.5 rounded-2xl"
                  style={glassStyle({ dark: true })}>
                  {SIDEBAR_ICONS.map(({ icon: Icon, to }, i) => (
                    <motion.div key={i}
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.92 }}>
                      <Link to={to}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
                        style={glassStyle({ dark: true, thin: true, noShadow: true })}>
                        <Icon className="w-3.5 h-3.5" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── Two-column content ─────────────────────────────────────── */}
              <div className="flex-1 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                {/* Left — text content */}
                <div>
                  {/* Label */}
                  <motion.span
                    variants={heroLabel} initial="hidden" animate="visible"
                    className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-4"
                    style={{ color: '#e0b84a' }}
                  >
                    <motion.span
                      className="block h-px"
                      style={{ backgroundColor: '#C9A84C' }}
                      initial={{ width: 0 }} animate={{ width: 28 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    />
                    Premium Living in Sri Lanka
                  </motion.span>

                  {/* Headline */}
                  <motion.h1
                    variants={heroTitle} initial="hidden" animate="visible"
                    className="font-bold text-white leading-[1.08] mb-5"
                    style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)' }}
                  >
                    Live Smart.<br />
                    Live Better.<br />
                    <span className="text-gold-500">Live NovaNest.</span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    variants={heroSubtitle} initial="hidden" animate="visible"
                    className="text-white/70 text-base leading-relaxed max-w-md mb-7"
                  >
                    Discover premium living spaces designed for a brighter tomorrow.
                    Modern homes, world-class amenities, and unmatched lifestyle.
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    variants={heroButtons} initial="hidden" animate="visible"
                    className="flex flex-wrap gap-3"
                  >
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/properties" className="btn-primary-lg text-sm px-6 py-3">
                        Explore Properties <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                        style={glassStyle({ thin: true })}>
                        Send Inquiry
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Right — featured project card */}
                {featured ? (
                  <motion.div
                    variants={heroCard} initial="hidden" animate="visible"
                    className="hidden lg:flex justify-end"
                  >
                    <div className="w-64 xl:w-72 rounded-2xl overflow-hidden"
                      style={glassStyle({ dark: true })}>
                      {/* Project image */}
                      {featured.mainImage && (
                        <div className="relative h-40 overflow-hidden">
                          <img src={featured.mainImage} alt={featured.name}
                            className="w-full h-full object-cover" />
                          <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to top, rgba(10,22,40,0.5) 0%, transparent 60%)' }} />
                        </div>
                      )}

                      <div className="p-4">
                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                            style={{
                              background: featured.status === 'ONGOING' ? '#10b981' : featured.status === 'UPCOMING' ? '#f59e0b' : '#3b82f6',
                              color: '#fff',
                            }}>
                            {featured.status}
                          </span>
                          <span className="text-white/55 text-xs">Featured Project</span>
                        </div>

                        {/* Name */}
                        <h3 className="text-white font-bold text-sm leading-snug mb-1.5">
                          {featured.name}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-1 mb-2.5">
                          <MapPin className="w-3 h-3 text-white/50 flex-shrink-0" />
                          <span className="text-white/60 text-xs uppercase tracking-wide">
                            {featured.location}
                          </span>
                        </div>

                        {/* Price */}
                        {featured.startingPrice && (
                          <p className="font-bold text-sm mb-3" style={{ color: '#e0b84a' }}>
                            From LKR {Number(featured.startingPrice).toLocaleString()}
                          </p>
                        )}

                        {/* CTA */}
                        <Link to={`/projects/${featured.slug}`}
                          className="btn-primary w-full justify-center text-xs py-2">
                          Explore Project
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Placeholder when no project data yet */
                  <div className="hidden lg:block" />
                )}
              </div>
            </div>

            {/* ── Stats bar ───────────────────────────────────────────────── */}
            <motion.div
              variants={statsBar} initial="hidden" animate="visible"
              className="mx-4 lg:mx-10 mb-4 rounded-2xl"
              style={glassStyle({ dark: true })}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4">
                {STATS.map(({ value, suffix, label, icon: Icon }, i) => (
                  <motion.div
                    key={label}
                    className="flex items-center justify-center gap-3 py-4 px-4"
                    style={{
                      borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 + i * 0.1 }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" style={{ color: '#e0b84a' }} />
                    <div>
                      <p className="text-xl font-bold text-white leading-none">
                        <Counter target={value} suffix={suffix} />
                      </p>
                      <p className="text-white/55 text-xs mt-0.5">{label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
          </motion.div>{/* end stats bar */}

            </div>{/* end z-index wrapper */}

          </motion.div>{/* end outer glass frame */}
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════════ END HERO */}

      {/* ── FEATURED PROJECTS ──────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section className="section relative overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(200,220,235,0.55) 0%, rgba(180,210,228,0.35) 40%, rgba(165,205,225,0.48) 100%)',
            backdropFilter: 'blur(24px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.3)',
            borderTop:    '1.5px solid rgba(210,240,252,0.60)',
            borderBottom: '1.5px solid rgba(110,178,210,0.22)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(90,150,185,0.18)',
          }}>
          {/* Subtle inner glow radials */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.35) 0%, transparent 70%)' }} />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, rgba(147,197,253,0.4) 0%, transparent 70%)' }} />
          </div>

          <div className="container-site relative">
            <SectionHeader
              label="Our Projects"
              title="Iconic Developments Across Sri Lanka"
              subtitle="Explore our portfolio of premium residential projects crafted for exceptional living."
              glass
            />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer(0.1)} initial="hidden"
              whileInView="visible" viewport={viewportOnce}
            >
              {projects.map(p => (
                <motion.div key={p.id} variants={cardItem}>
                  <ProjectCard project={p} />
                </motion.div>
              ))}
            </motion.div>
            <motion.div className="text-center mt-10"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/apartments"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.22)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1.5px solid rgba(255,255,255,0.50)',
                    color: '#0A1628',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.70)',
                  }}>
                  View All Projects <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── AVAILABLE APARTMENTS ───────────────────────────────────────── */}
      {apartments.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <SectionHeader label="Available Units" title="Find Your Perfect Home"
              subtitle="Browse our available apartments and find the space that fits your lifestyle." />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer(0.1)} initial="hidden"
              whileInView="visible" viewport={viewportOnce}
            >
              {apartments.map(apt => (
                <motion.div key={apt.id} variants={cardItem}>
                  <PropertyCard apartment={apt} />
                </motion.div>
              ))}
            </motion.div>
            <motion.div className="text-center mt-10"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <Link to="/apartments" className="btn-outline-gold">
                Browse All Apartments <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ──────────────────────────────────────────────── */}
      <section className="section bg-navy-900">
        <div className="container-site">
          <SectionHeader label="Why NovaNest" title="Built on Trust. Designed for Life."
            subtitle="We believe every family deserves a home that inspires." light />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer(0.12)} initial="hidden"
            whileInView="visible" viewport={viewportOnce}
          >
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={cardItem} className="value-card group cursor-default">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center mb-4"
                  whileHover={{ backgroundColor: '#C9A84C', transition: { duration: 0.2 } }}
                >
                  <Icon className="w-5 h-5 text-gold-400 group-hover:text-white transition-colors" />
                </motion.div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────── */}
      <section className="section-sm bg-gold-500 overflow-hidden relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gold-600/40 to-transparent"
          initial={{ x: '-100%' }} whileInView={{ x: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          viewport={viewportOnce}
        />
        <div className="container-site text-center relative">
          <motion.h2 className="text-3xl lg:text-4xl font-bold text-white mb-3"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            Ready to Find Your Dream Home?
          </motion.h2>
          <motion.p className="text-white/80 mb-8 max-w-xl mx-auto"
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={viewportOnce} transition={{ delay: 0.15 }}>
            Our team is ready to help you find the perfect apartment.
            Schedule a viewing or send us an inquiry today.
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-4"
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={viewportOnce} transition={{ delay: 0.25 }}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/apartments" className="btn-white">Browse Apartments</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact" className="btn-secondary border-white/60 hover:bg-white/20">
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

/* ─── Shared helper components ───────────────────────────────────────────── */

function SectionHeader({ label, title, subtitle, light = false, glass = false }) {
  return (
    <motion.div className="text-center mb-10"
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
      <span className={`inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3
        ${light ? 'text-gold-400' : glass ? 'text-gold-600' : 'text-gold-600'}`}>
        <span className="w-6 h-px bg-gold-500" />
        {label}
        <span className="w-6 h-px bg-gold-500" />
      </span>
      <h2 className={`text-3xl lg:text-4xl font-bold mb-3
        ${light ? 'text-white' : glass ? 'text-navy-900' : 'text-navy-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`max-w-2xl mx-auto text-base
          ${light ? 'text-white/60' : glass ? 'text-navy-800/70' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

function ProjectCard({ project }) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: [
        '0 20px 48px rgba(0,0,0,0.14)',
        '0 4px 16px rgba(0,0,0,0.08)',
        'inset 0 1px 0 rgba(255,255,255,0.90)',
        'inset 0 -1px 0 rgba(100,160,190,0.20)',
      ].join(', ') }}
      transition={{ duration: 0.3, ease: 'easeOut' }}>
    <Link to={`/projects/${project.slug}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        /* Light glass card — near-transparent, teal-tinted edges, deep shadow */
        background: 'linear-gradient(145deg, rgba(255,255,255,0.62) 0%, rgba(240,250,255,0.48) 100%)',
        backdropFilter: 'blur(16px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
        borderStyle: 'solid',
        borderWidth: '1.5px',
        borderTopColor:    'rgba(220,245,255,0.90)',
        borderLeftColor:   'rgba(210,240,252,0.80)',
        borderRightColor:  'rgba(140,200,225,0.35)',
        borderBottomColor: 'rgba(120,185,215,0.30)',
        boxShadow: [
          '0 8px 32px rgba(0,0,0,0.10)',
          '0 2px 8px rgba(0,0,0,0.06)',
          'inset 0 1px 0 rgba(255,255,255,0.85)',
          'inset 0 -1px 0 rgba(100,160,190,0.15)',
        ].join(', '),
      }}>

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {project.mainImage ? (
          <motion.img src={project.mainImage} alt={project.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.07 }} transition={{ duration: 0.5 }} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full
          ${project.status === 'COMPLETED' ? 'bg-blue-500 text-white'
          : project.status === 'ONGOING'   ? 'bg-emerald-500 text-white'
          : 'bg-amber-500 text-white'}`}>
          {project.status}
        </span>
      </div>

      {/* Info — glass content area */}
      <div className="p-5">
        <h3 className="font-bold text-navy-900 text-lg mb-1 group-hover:text-gold-600 transition-colors">
          {project.name}
        </h3>
        <div className="flex items-center gap-1 text-navy-800/60 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" /> {project.location}
        </div>
        {project.startingPrice && (
          <p className="text-gold-600 font-bold text-sm">
            From LKR {Number(project.startingPrice).toLocaleString()}
          </p>
        )}
      </div>
    </Link>
    </motion.div>
  )
}
