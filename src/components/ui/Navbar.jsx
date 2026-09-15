import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Bell, Menu, X, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/',           label: 'Home' },
  { to: '/properties', label: 'Properties' },
  { to: '/projects',   label: 'Projects' },
  { to: '/about',      label: 'About Us' },
  { to: '/careers',    label: 'Careers' },
  { to: '/news',       label: 'News' },
  { to: '/contact',    label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ]     = useState('')
  const { isAuthenticated }       = useAuth()
  const navigate                  = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
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
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-navy-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container-site">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img src="/images/1logo.png" alt="NovaNest" className="h-9 w-auto" />
              <span className="text-white font-bold text-lg tracking-tight">NovaNest</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen((o) => !o)}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              {isAuthenticated ? (
                <Link
                  to="/portal"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg
                             bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Portal
                </Link>
              ) : (
                <Link
                  to="/portal/login"
                  className="hidden sm:flex px-4 py-2 rounded-lg border border-white/30
                             text-white text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar dropdown */}
          {searchOpen && (
            <div className="pb-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search properties, projects..."
                  className="input-dark flex-1"
                />
                <button type="submit" className="btn-primary py-2">
                  <Search className="w-4 h-4" /> Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-navy-900/98 backdrop-blur-md border-t border-white/10">
            <div className="container-site py-4 space-y-1">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
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
          </div>
        )}
      </header>

      {/* Spacer to push content below fixed navbar — only used on non-hero pages */}
      <div className="h-16 lg:h-20 hidden" id="navbar-spacer" />
    </>
  )
}
