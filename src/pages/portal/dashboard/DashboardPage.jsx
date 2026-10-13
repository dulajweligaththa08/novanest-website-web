import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Home, TrendingUp, FileText, Bell,
  ChevronRight, MapPin, Bed, Bath, Maximize2,
  CreditCard, BadgeCheck, Clock, AlertCircle,
} from 'lucide-react'
import api from '../../../lib/api'
import { useAuth } from '../../../context/AuthContext'
import { updateClass, updateTypeLabel, formatDate } from '../../../lib/utils'

// ─── Payment summary mini-card for dashboard ──────────────────────────────────
function PaymentSummaryCard() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-payment-plan'],
    queryFn: () => api.get('/customer/payment-plan').then(r => r.data.data),
  })

  if (isLoading) return (
    <div className="card p-5 animate-pulse space-y-3">
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      <div className="h-2.5 bg-gray-100 rounded-full" />
      <div className="h-12 bg-gray-100 rounded-xl" />
    </div>
  )

  const instalments = data || []
  if (instalments.length === 0) return null

  const isLumpSum = instalments.length === 1
  const total     = instalments.reduce((s, i) => s + Number(i.amount), 0)
  const paid      = instalments.filter(i => i.isPaid).reduce((s, i) => s + Number(i.amount), 0)
  const balance   = total - paid
  const paidCount = instalments.filter(i => i.isPaid).length
  const nextDue   = instalments.find(i => !i.isPaid)
  const today     = new Date()
  const overdue   = nextDue && new Date(nextDue.dueDate) < today
  const pct       = total > 0 ? Math.round((paid / total) * 100) : 0

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-500" /> Payment Plan
        </h3>
        <Link to="/portal/updates"
          className="text-sm text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1">
          View full <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-5 space-y-4">
        {/* Type badge */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
            ${isLumpSum
              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
            {isLumpSum ? '💰 Lump Sum' : `📅 ${instalments.length} Instalments`}
          </span>
          <span className="text-xs font-semibold text-gray-500">{pct}% paid</span>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-sm font-bold text-navy-900">LKR {total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Paid</p>
            <p className="text-sm font-bold text-emerald-600">LKR {paid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Balance</p>
            <p className={`text-sm font-bold ${balance > 0 ? 'text-blue-600' : 'text-emerald-600'}`}>
              LKR {balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>

        {/* Next due / overdue / complete */}
        {balance === 0 ? (
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
            <BadgeCheck className="w-4 h-4" /> Payment complete!
          </div>
        ) : nextDue ? (
          <div className={`flex items-start gap-2 p-2.5 rounded-xl text-xs
            ${overdue
              ? 'bg-red-50 border border-red-100 text-red-700'
              : 'bg-amber-50 border border-amber-100 text-amber-700'}`}>
            {overdue
              ? <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              : <Clock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
            <div>
              <p className="font-semibold">{overdue ? 'Payment overdue' : 'Next payment'}</p>
              <p>{nextDue.description} — LKR {Number(nextDue.amount).toLocaleString()}</p>
              <p>{overdue ? `Was due ${formatDate(nextDue.dueDate)}` : `Due ${formatDate(nextDue.dueDate)}`}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  const { data: assignmentData, isLoading: loadingApt } = useQuery({
    queryKey: ['my-apartment'],
    queryFn: () => api.get('/customer/apartment').then((r) => r.data.data),
  })

  const { data: updatesData, isLoading: loadingUpdates } = useQuery({
    queryKey: ['my-updates', { limit: 3 }],
    queryFn: () => api.get('/customer/updates', { params: { limit: 3 } }).then((r) => r.data),
  })

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/customer/notifications').then((r) => r.data),
  })

  const { data: docsData } = useQuery({
    queryKey: ['my-documents'],
    queryFn: () => api.get('/customer/documents').then((r) => r.data.data),
  })

  const apt = assignmentData?.apartment
  const project = apt?.floor?.building?.project
  const recentUpdates = updatesData?.data || []
  const unreadCount = notifData?.unreadCount ?? 0
  const docCount = docsData?.length ?? 0

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-6 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #C9A84C 0%, transparent 60%)' }} />
        <div className="relative">
          <p className="text-navy-300 text-sm mb-1">Welcome back,</p>
          <h2 className="text-2xl font-bold text-white">{user?.fullName?.split(' ')[0] || 'Customer'} 👋</h2>
          <p className="text-navy-300 text-sm mt-1">
            {project
              ? `Your apartment at ${project.name} is ready to view.`
              : 'Your apartment details will appear here once assigned.'}
          </p>
        </div>
      </div>

      {/* Quick stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Updates',       value: updatesData?.pagination?.total ?? '—', icon: TrendingUp, color: 'text-amber-500',  bg: 'bg-amber-50',  to: '/portal/updates' },
          { label: 'Documents',     value: docCount,                               icon: FileText,   color: 'text-blue-500',   bg: 'bg-blue-50',   to: '/portal/documents' },
          { label: 'Notifications', value: unreadCount,                            icon: Bell,       color: 'text-red-500',    bg: 'bg-red-50',    to: '/portal/notifications' },
          { label: 'My Apartment',  value: apt ? apt.unitNumber : '—',             icon: Home,       color: 'text-gold-600',   bg: 'bg-yellow-50', to: '/portal/apartment' },
        ].map(({ label, value, icon: Icon, color, bg, to }) => (
          <Link key={label} to={to}
            className="card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow group">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apartment snapshot */}        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">My Apartment</h3>
            <Link to="/portal/apartment"
              className="text-sm text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1">
              View details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingApt ? (
            <AptSkeleton />
          ) : apt ? (
            <div className="p-5 space-y-4">
              {/* Project image */}
              {project?.gallery?.[0]?.imageUrl && (
                <img
                  src={project.gallery[0].imageUrl}
                  alt={project.name}
                  className="w-full h-36 object-cover rounded-xl"
                />
              )}
              <div>
                <p className="text-lg font-bold text-gray-900">Unit {apt.unitNumber}</p>
                <p className="text-sm text-gold-600 font-medium">{project?.name}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {project?.location}
                </div>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-gray-400" />{apt.bedrooms} Beds</span>
                <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-gray-400" />{apt.bathrooms} Baths</span>
                {apt.areaSqft && (
                  <span className="flex items-center gap-1">
                    <Maximize2 className="w-4 h-4 text-gray-400" />
                    {Number(apt.areaSqft).toLocaleString()} sqft
                  </span>
                )}
              </div>
              {assignmentData?.agreedPrice && (
                <p className="text-sm font-semibold text-navy-900">
                  LKR {Number(assignmentData.agreedPrice).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              No apartment assigned yet. Please contact NovaNest.
            </div>
          )}
        </div>

        {/* Recent updates */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Latest Updates</h3>
            <Link to="/portal/updates"
              className="text-sm text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingUpdates ? (
            <UpdatesSkeleton />
          ) : recentUpdates.length ? (
            <div className="divide-y divide-gray-50">
              {recentUpdates.map((u) => (
                <div key={u.id} className={`px-5 py-4 ${updateClass(u.updateType)}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {updateTypeLabel(u.updateType)}
                      </span>
                      <p className="text-sm font-medium text-gray-900 mt-0.5 truncate">{u.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{u.description}</p>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(u.publishedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">No updates yet.</div>
          )}
        </div>
      </div>

      {/* Payment Plan summary — shown when a plan exists */}
      <PaymentSummaryCard />

    </div>
  )
}

function AptSkeleton() {
  return (
    <div className="p-5 space-y-3 animate-pulse">
      <div className="h-36 bg-gray-100 rounded-xl" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
      <div className="flex gap-4">
        <div className="h-3 bg-gray-100 rounded w-16" />
        <div className="h-3 bg-gray-100 rounded w-16" />
      </div>
    </div>
  )
}

function UpdatesSkeleton() {
  return Array.from({ length: 3 }).map((_, i) => (
    <div key={i} className="px-5 py-4 animate-pulse space-y-1.5">
      <div className="h-3 bg-gray-100 rounded w-1/4" />
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  ))
}
