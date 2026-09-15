import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, BellOff, CheckCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../../lib/api'
import { formatDateTime } from '../../../lib/utils'

export default function NotificationsPage() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/customer/notifications').then((r) => r.data),
  })

  const markAllRead = useMutation({
    mutationFn: () => api.post('/customer/notifications/read-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const notifications = data?.data || []
  const unreadCount = data?.unreadCount ?? 0

  return (
    <div className="max-w-2xl space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {unreadCount > 0
            ? <span className="text-red-600 font-medium">{unreadCount} unread</span>
            : 'All caught up'}
        </p>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="btn-secondary text-sm py-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <NotifSkeleton />
      ) : notifications.length ? (
        <div className="card overflow-hidden divide-y divide-gray-50">
          {notifications.map((n) => (
            <NotifItem key={n.id} notif={n} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <BellOff className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No notifications</h3>
          <p className="text-sm text-gray-500">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

function NotifItem({ notif }) {
  // Decide link target
  const linkTo = notif.updateId
    ? '/portal/updates'
    : notif.documentId
    ? '/portal/documents'
    : null

  const Inner = (
    <div className={`flex items-start gap-4 px-5 py-4 transition-colors
      ${!notif.isRead ? 'bg-gold-50/50' : 'hover:bg-gray-50'}`}
    >
      {/* Icon dot */}
      <div className="flex-shrink-0 mt-0.5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center
          ${notif.isRead ? 'bg-gray-100' : 'bg-gold-100'}`}>
          <Bell className={`w-4 h-4 ${notif.isRead ? 'text-gray-400' : 'text-gold-600'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium leading-snug ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
            {notif.title}
          </p>
          {!notif.isRead && (
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gold-500 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
        <p className="text-xs text-gray-400 mt-1">{formatDateTime(notif.createdAt)}</p>
      </div>
    </div>
  )

  return linkTo
    ? <Link to={linkTo} className="block">{Inner}</Link>
    : <div>{Inner}</div>
}

function NotifSkeleton() {
  return (
    <div className="card overflow-hidden divide-y divide-gray-50 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 px-5 py-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
