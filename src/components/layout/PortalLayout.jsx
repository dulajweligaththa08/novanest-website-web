import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import PortalSidebar from './PortalSidebar'
import ScrollToTop from './ScrollToTop'
import PageLoader from '../ui/PageLoader'
import api from '../../lib/api'

const PAGE_TITLES = {
  '/portal':               'Dashboard',
  '/portal/apartment':     'My Apartment',
  '/portal/updates':       'Apartment Updates',
  '/portal/documents':     'My Documents',
  '/portal/notifications': 'Notifications',
  '/portal/profile':       'My Profile',
}

export default function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const title =
    Object.entries(PAGE_TITLES)
      .reverse()
      .find(([path]) => location.pathname.startsWith(path))?.[1] || 'My Portal'

  // Fetch unread notification count
  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/customer/notifications').then((r) => r.data),
    refetchInterval: 60000, // refresh every minute
  })
  const unreadCount = notifData?.unreadCount ?? 0

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ScrollToTop />
      <PageLoader />
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <PortalSidebar unreadCount={unreadCount} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50">
            <PortalSidebar
              unreadCount={unreadCount}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold text-gray-900 flex-1">{title}</h1>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
