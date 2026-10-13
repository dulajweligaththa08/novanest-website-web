import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/',           label: 'Home' },
  { to: '/about',      label: 'About Us' },
  { to: '/apartments', label: 'Apartment' },
  { to: '/houses',     label: 'House' },
  { to: '/land',       label: 'Land' },
  { to: '/news',       label: 'News' },
  { to: '/careers',    label: 'Careers' },
  { to: '/contact',    label: 'Contact' },
]

export default function Navbar({ hideOnHome = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // On home page: the hero has its own embedded navbar, so hide this one
  if (hideOnHome && isHome) return null

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQ.trim())}`)
      setSearchOpen(false)
      setSearchQ('')
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled ? 'bg-navy-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <motion.img
                src="/images/1logo.png"
                alt="NovaNest"
                className="h-9 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              />
              <motion.span
                className="text-white font-bold text-lg tracking-tight"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                NovaNest
              </motion.span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {links.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                >
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setSearchOpen(o => !o)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Search className="w-4 h-4" />
              </motion.button>

              {isAuthenticated ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/portal"
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg
                               bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    <User className="w-4 h-4" /> My Portal
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    to="/portal/login"
                    className="hidden sm:flex px-4 py-2 rounded-lg border border-white/30
                               text-white text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Login
                  </Link>
                </motion.div>
              )}

              <button
                onClick={() => setMenuOpen(o => !o)}
                className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={menuOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pb-4"
              >
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    autoFocus
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search properties, projects..."
                    className="input-dark flex-1"
                  />
                  <button type="submit" className="btn-primary py-2">
                    <Search className="w-4 h-4" /> Search
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden bg-navy-900/98 backdrop-blur-md border-t border-white/10 overflow-hidden"
            >
              <div className="container-site py-4 space-y-1">
                {links.map(({ to, label }, i) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <NavLink
                      to={to}
                      end={to === '/'}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                         ${isActive
                          ? 'bg-gold-500/20 text-gold-400'
                          : 'text-white/80 hover:text-white hover:bg-white/10'}`
                      }
                    >
                      {label}
                    </NavLink>
                  </motion.div>
                ))}
                <div className="pt-2 border-t border-white/10 mt-2">
                  {isAuthenticated
                    ? <Link to="/portal" onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10">
                      My Portal
                    </Link>
                    : <Link to="/portal/login" onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10">
                      Login
                    </Link>
                  }
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div className="h-16 lg:h-20 hidden" id="navbar-spacer" />
    </>
  )
}
