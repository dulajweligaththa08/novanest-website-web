import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, User, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export const NAV_LINKS = [
  { to: '/',           label: 'Home' },
  { to: '/about',      label: 'About Us' },
  { to: '/apartments', label: 'Apartment' },
  { to: '/houses',     label: 'House' },
  { to: '/land',       label: 'Land' },
  { to: '/news',       label: 'News' },
  { to: '/careers',    label: 'Careers' },
  { to: '/contact',    label: 'Contact' },
]

// ─── Dimensions ───────────────────────────────────────────────────────────────
// BAR_H    : visible height of the flat bar left/right of the crest
// CREST_W  : total width of the curved crest section
// CREST_H  : total height of the SVG (bar + arch above + arch below)
// ARCH_UP  : how many px the top arch rises above the bar top
// ARCH_DN  : how many px the bottom arch dips below the bar bottom
const BAR_H   = 52
const CREST_W = 200
const ARCH_UP = 22
const ARCH_DN = 22
const CREST_H = BAR_H + ARCH_UP + ARCH_DN
// SVG viewBox coords — the bar occupies y=[ARCH_UP .. ARCH_UP+BAR_H]
const VB_W    = CREST_W
const VB_H    = CREST_H

/**
 * The entire navbar is one SVG shape — a flat rectangle with the centre
 * section arching upward (top edge) and downward (bottom edge) to frame
 * the logo. The gold stroke traces the full perimeter so the crest reads
 * as part of the bar, not a badge placed on top of it.
 */
function NavbarSVG({ svgW, svgH }) {
  const y0  = ARCH_UP           // top of flat bar sections
  const y1  = ARCH_UP + BAR_H   // bottom of flat bar sections
  const cx  = svgW / 2          // horizontal centre
  const hw  = CREST_W / 2       // half-width of the crest zone
  const cpX = hw * 0.55         // bezier control-point pull

  // ── Outer perimeter (clockwise from top-left) ──────────────────────────────
  // Top edge: flat → arch up → flat
  const topLeft   = hw * 0.18   // x where the arch begins on the left
  const topRight  = svgW - hw * 0.18

  const outline =
    // top-left corner
    `M 0,${y0} ` +
    // flat top-left section
    `L ${cx - hw},${y0} ` +
    // arch rising up to peak
    `C ${cx - hw + cpX},${y0} ${cx - cpX * 0.5},0 ${cx},0 ` +
    // arch coming back down
    `C ${cx + cpX * 0.5},0 ${cx + hw - cpX},${y0} ${cx + hw},${y0} ` +
    // flat top-right section
    `L ${svgW},${y0} ` +
    // right edge down
    `L ${svgW},${y1} ` +
    // flat bottom-right section
    `L ${cx + hw},${y1} ` +
    // arch dipping down to trough
    `C ${cx + hw - cpX},${y1} ${cx + cpX * 0.5},${svgH} ${cx},${svgH} ` +
    // arch coming back up
    `C ${cx - cpX * 0.5},${svgH} ${cx - hw + cpX},${y1} ${cx - hw},${y1} ` +
    // flat bottom-left section
    `L 0,${y1} ` +
    `Z`

  return (
    <svg
      width="100%"
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', position: 'absolute', top: 0, left: 0, right: 0 }}
    >
      <defs>
        <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(237,232,223,0.96)" />
          <stop offset="45%"  stopColor="rgba(244,240,232,0.94)" />
          <stop offset="100%" stopColor="rgba(237,232,223,0.96)" />
        </linearGradient>
        <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(154,120,82,0.20)" />
          <stop offset="35%"  stopColor="rgba(154,120,82,0.80)" />
          <stop offset="50%"  stopColor="rgba(190,155,100,1)"   />
          <stop offset="65%"  stopColor="rgba(154,120,82,0.80)" />
          <stop offset="100%" stopColor="rgba(154,120,82,0.20)" />
        </linearGradient>
        <filter id="barShadow" x="0" y="-10%" width="100%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(48,39,34,0.15)" />
        </filter>
      </defs>

      {/* Filled bar shape */}
      <path d={outline} fill="url(#barFill)" filter="url(#barShadow)" />

      {/* Gold outline — single stroke traces the whole perimeter */}
      <path d={outline} stroke="url(#goldStroke)" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SiteNavbar() {
  const { isAuthenticated }         = useAuth()
  const navigate                    = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ,    setSearchQ]    = useState('')
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [navWidth,   setNavWidth]   = useState(1440)
  const [visible,    setVisible]    = useState(true)
  const wrapperRef                  = useRef(null)
  const lastScrollY                 = useRef(0)

  // Hide on scroll down, reveal on scroll up
  useEffect(() => {
    const THRESHOLD = 8 // px — ignore tiny jitter
    const onScroll = () => {
      const current = window.scrollY
      if (Math.abs(current - lastScrollY.current) < THRESHOLD) return
      setVisible(current < lastScrollY.current || current < 60)
      lastScrollY.current = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Measure real rendered width so the SVG crest stays centred at all sizes
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setNavWidth(entry.contentRect.width || el.offsetWidth)
    })
    ro.observe(el)
    setNavWidth(el.offsetWidth)
    return () => ro.disconnect()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQ.trim())}`)
      setSearchOpen(false)
      setSearchQ('')
    }
  }

  return (
    <div
      className="relative w-full"
      style={{
        zIndex: 50,
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      ref={wrapperRef}
    >

      {/* ── Navbar wrapper — tall enough for the crest to protrude ── */}
      <div
        style={{
          position: 'relative',
          height: `${BAR_H + ARCH_UP}px`,
          paddingTop: `${ARCH_UP}px`,
        }}
      >
        {/* ── Single SVG — the entire navbar shape including the integral crest ── */}
        <NavbarSVG svgW={navWidth} svgH={CREST_H} />

        {/* ── Logo — centred over the crest zone ── */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: `${CREST_W}px`,
            height: `${CREST_H}px`,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            <img
              src="/images/1logo.png"
              alt="NovaNest Properties"
              style={{
                width: '90px',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
              }}
            />
          </Link>
        </div>

        {/* ── Bar content row (left nav + right controls) ── */}
        <div
          style={{
            position: 'absolute',
            top: `${ARCH_UP}px`,
            left: 0,
            right: 0,
            height: `${BAR_H}px`,
            display: 'flex',
            alignItems: 'center',
            zIndex: 5,
          }}
        >
          {/* Left: nav links */}
          <nav className="hidden lg:flex items-center gap-7 pl-8 flex-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 relative pb-1
                   ${isActive
                    ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:rounded-full'
                    : 'hover:opacity-100'}`
                }
                style={({ isActive }) => ({
                  color: isActive ? '#9A7852' : 'rgba(48,39,34,0.72)',
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Centre spacer — keeps right controls from being pushed left by nav */}
          <div style={{ width: `${CREST_W}px`, flexShrink: 0 }} />

          {/* Right: search + login */}
          <div className="hidden lg:flex items-center gap-3 pr-8 flex-1 justify-end">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setSearchOpen(o => !o)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: 'rgba(48,39,34,0.06)',
                border: '1.5px solid rgba(48,39,34,0.18)',
                color: 'rgba(48,39,34,0.75)',
              }}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </motion.button>

            {isAuthenticated ? (
              <Link
                to="/portal"
                className="flex items-center gap-1.5 text-sm font-semibold transition-all hover:opacity-80"
                style={{
                  background: '#302722',
                  border: '1.5px solid #302722',
                  borderRadius: '999px',
                  padding: '6px 20px',
                  color: '#FFFDF8',
                }}
              >
                <User className="w-3.5 h-3.5" /> My Portal
              </Link>
            ) : (
              <Link
                to="/portal/login"
                className="text-sm font-semibold transition-all hover:opacity-80"
                style={{
                  background: '#302722',
                  border: '1.5px solid #302722',
                  borderRadius: '999px',
                  padding: '6px 24px',
                  color: '#FFFDF8',
                }}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile: hamburger */}
          <div className="lg:hidden flex items-center gap-3 pr-4 ml-auto">
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
              onClick={() => setSearchOpen(o => !o)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ border: '1.5px solid rgba(48,39,34,0.20)', color: 'rgba(48,39,34,0.70)' }}
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </motion.button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ border: '1.5px solid rgba(48,39,34,0.20)', color: 'rgba(48,39,34,0.70)' }}
              aria-label="Menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={menuOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{    rotate:  90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* ── Search dropdown ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{    opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
            style={{
              background: '#EDE8DF',
              borderBottom: '1px solid #D7CEC2',
            }}
          >
            <form onSubmit={handleSearch} className="flex gap-2 px-6 py-3 max-w-2xl mx-auto">
              <input
                autoFocus
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search properties, projects…"
                className="input flex-1"
              />
              <button type="submit" className="btn-primary py-2 text-sm">
                <Search className="w-4 h-4" /> Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{    opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden lg:hidden"
            style={{
              background: '#F4F0E8',
              borderBottom: '1px solid #D7CEC2',
            }}
          >
            <div className="px-4 py-3 space-y-0.5">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                     ${isActive
                      ? 'bg-gold-500/10 text-gold-600'
                      : 'text-navy-900/70 hover:text-navy-900 hover:bg-navy-900/5'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="pt-2 border-t border-navy-900/10 mt-1">
                {isAuthenticated ? (
                  <Link to="/portal" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-navy-900/70 hover:text-navy-900 hover:bg-navy-900/5">
                    My Portal
                  </Link>
                ) : (
                  <Link to="/portal/login" onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-navy-900/70 hover:text-navy-900 hover:bg-navy-900/5">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
