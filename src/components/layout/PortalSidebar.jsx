import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Home,
  TrendingUp,
  FileText,
  Bell,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/portal',               label: 'Dashboard',     icon: LayoutDashboard, end: true },
  { to: '/portal/apartment',     label: 'My Apartment',  icon: Home },
  { to: '/portal/updates',       label: 'Updates',       icon: TrendingUp },
  { to: '/portal/documents',     label: 'Documents',     icon: FileText },
  { to: '/portal/notifications', label: 'Notifications', icon: Bell },
  { to: '/portal/profile',       label: 'Profile',       icon: User },
]

export default function PortalSidebar({ onClose, unreadCount = 0 }) {
  const { user, logout } = useAuth()

  return (
    <aside className="flex flex-col h-full w-64 bg-navy-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <img src="/images/1logo.png" alt="NovaNest" className="h-9 w-auto flex-shrink-0" />
        <div>
          <p className="font-bold text-white leading-none">NovaNest</p>
          <p className="text-xs text-navy-400 mt-0.5">My Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
               ${isActive
                ? 'bg-gold-500 text-white shadow shadow-gold-500/30'
                : 'text-navy-300 hover:bg-white/10 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>

                {/* Notification badge */}
                {label === 'Notifications' && unreadCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}

                {isActive && !unreadCount && (
                  <ChevronRight className="w-3 h-3 opacity-60" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-0.5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-gold-400 text-sm font-semibold">
              {user?.fullName?.[0]?.toUpperCase() || 'C'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.fullName || 'Customer'}</p>
            <p className="text-navy-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
                     text-navy-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
