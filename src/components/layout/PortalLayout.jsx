import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Home, TrendingUp, FileText,
  Bell, User, LogOut, Menu, X, ChevronRight,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

const NAV_LINKS = [
  { to: '/portal',               label: 'Dashboard',     icon: LayoutDashboard, end: true },
  { to: '/portal/apartment',     label: 'My Apartment',  icon: Home },
  { to: '/portal/updates',       label: 'Updates',       icon: TrendingUp },
  /*{ to: '/portal/documents',     label: 'Documents',     icon: FileText },*/
  /*{ to: '/portal/notifications', label: 'Notifications', icon: Bell },*/
  { to: '/portal/profile',       label: 'Profile',       icon: User },
]

export default function PortalLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout }        = useAuth()
  const navigate                = useNavigate()

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/customer/notifications').then(r => r.data),
    refetchInterval: 60000,
  })
  const unreadCount = notifData?.unreadCount ?? 0

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top navbar ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(10,22,40,0.97) 0%, rgba(22,40,70,0.97) 100%)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 mr-4">
              <img src="/images/1logo.png" alt="NovaNest" className="h-7 w-auto" />
              <div className="leading-none hidden sm:block">
                <span className="text-white font-bold text-sm tracking-tight block">NovaNest</span>
                <span className="text-white/45 text-[8px] tracking-widest uppercase block">My Portal</span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     transition-all duration-150
                     ${isActive
                      ? 'bg-gold-500 text-white shadow shadow-gold-500/30'
                      : 'text-white/65 hover:text-white hover:bg-white/10'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {label}
                      {label === 'Notifications' && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500
                                         text-white text-[9px] font-bold flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right — user + logout */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Notification bell shortcut (mobile) */}
              <NavLink to="/portal/notifications"
                className="lg:hidden relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </NavLink>

              {/* User chip — desktop */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="w-6 h-6 rounded-full bg-gold-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold-300 text-xs font-bold">
                    {user?.fullName?.[0]?.toUpperCase() || 'C'}
                  </span>
                </div>
                <span className="text-white/80 text-xs font-medium max-w-[120px] truncate">
                  {user?.fullName || 'Customer'}
                </span>
              </div>

              {/* Logout — desktop */}
              <button onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                           text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10"
            style={{ background: 'rgba(10,22,40,0.98)' }}>
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                     ${isActive
                      ? 'bg-gold-500/20 text-gold-400'
                      : 'text-white/70 hover:text-white hover:bg-white/10'}`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {label === 'Notifications' && unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold
                                     flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
              <div className="pt-2 border-t border-white/10 mt-2 flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <span className="text-gold-400 text-xs font-bold">
                      {user?.fullName?.[0]?.toUpperCase() || 'C'}
                    </span>
                  </div>
                  <span className="text-white/70 text-sm">{user?.fullName || 'Customer'}</span>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

    </div>
  )
}
