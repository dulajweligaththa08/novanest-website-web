import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  TrendingUp, CheckCircle, CreditCard, HardHat,
  Home, Key, Megaphone, ClipboardCheck, FileText,
  MessageCircle, ChevronDown, ChevronUp,
  BadgeCheck, Clock, AlertCircle, DollarSign,
} from 'lucide-react'
import api from '../../../lib/api'
import { updateTypeLabel, formatDate, UPDATE_TYPE_META } from '../../../lib/utils'

// ─── Per-category visual config ───────────────────────────────────────────────
const CATEGORY_CONFIG = {
  BOOKING_CONFIRMATION: {
    icon: CheckCircle, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
    borderColor: 'border-l-emerald-400', headingBg: 'bg-emerald-50', headingText: 'text-emerald-800',
    dot: 'border-emerald-400',
  },
  PAYMENT_UPDATE: {
    icon: CreditCard, iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
    borderColor: 'border-l-blue-400', headingBg: 'bg-blue-50', headingText: 'text-blue-800',
    dot: 'border-blue-400',
    hasPaymentPlan: true,
  },
  CONSTRUCTION_PROGRESS: {
    icon: HardHat, iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
    borderColor: 'border-l-amber-400', headingBg: 'bg-amber-50', headingText: 'text-amber-800',
    dot: 'border-amber-400',
  },
  APARTMENT_COMPLETION: {
    icon: Home, iconBg: 'bg-purple-100', iconColor: 'text-purple-600',
    borderColor: 'border-l-purple-400', headingBg: 'bg-purple-50', headingText: 'text-purple-800',
    dot: 'border-purple-400',
  },
  HANDOVER_INFORMATION: {
    icon: Key, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600',
    borderColor: 'border-l-yellow-400', headingBg: 'bg-yellow-50', headingText: 'text-yellow-800',
    dot: 'border-yellow-400',
  },
  IMPORTANT_ANNOUNCEMENT: {
    icon: Megaphone, iconBg: 'bg-red-100', iconColor: 'text-red-600',
    borderColor: 'border-l-red-400', headingBg: 'bg-red-50', headingText: 'text-red-800',
    dot: 'border-red-400',
  },
  INSPECTION_UPDATE: {
    icon: ClipboardCheck, iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600',
    borderColor: 'border-l-cyan-400', headingBg: 'bg-cyan-50', headingText: 'text-cyan-800',
    dot: 'border-cyan-400',
  },
  DOCUMENT_UPDATE: {
    icon: FileText, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600',
    borderColor: 'border-l-indigo-400', headingBg: 'bg-indigo-50', headingText: 'text-indigo-800',
    dot: 'border-indigo-400',
  },
  GENERAL: {
    icon: MessageCircle, iconBg: 'bg-gray-100', iconColor: 'text-gray-500',
    borderColor: 'border-l-gray-300', headingBg: 'bg-gray-50', headingText: 'text-gray-700',
    dot: 'border-gray-400',
  },
}

const CATEGORY_ORDER = [
  'BOOKING_CONFIRMATION', 'PAYMENT_UPDATE', 'CONSTRUCTION_PROGRESS',
  'APARTMENT_COMPLETION', 'HANDOVER_INFORMATION', 'IMPORTANT_ANNOUNCEMENT',
  'INSPECTION_UPDATE', 'DOCUMENT_UPDATE', 'GENERAL',
]

// ─── Payment Plan panel (read-only for customer) ──────────────────────────────
function PaymentPlanPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-payment-plan'],
    queryFn: () => api.get('/customer/payment-plan').then(r => r.data.data),
  })

  if (isLoading) return (
    <div className="animate-pulse space-y-2 p-4 bg-blue-50 rounded-xl">
      {[1,2,3].map(i => <div key={i} className="h-14 bg-blue-100 rounded-xl" />)}
    </div>
  )

  const instalments = data || []
  if (instalments.length === 0) return (
    <p className="text-xs text-gray-400 italic py-2">
      No payment plan has been set up yet. Please contact NovaNest for payment details.
    </p>
  )

  const isLumpSum  = instalments.length === 1
  const total      = instalments.reduce((s, i) => s + Number(i.amount), 0)
  const paid       = instalments.filter(i => i.isPaid).reduce((s, i) => s + Number(i.amount), 0)
  const balance    = total - paid
  const paidCount  = instalments.filter(i => i.isPaid).length
  const nextDue    = instalments.find(i => !i.isPaid)
  const today      = new Date()
  const overdue    = nextDue && new Date(nextDue.dueDate) < today

  // Timeframe: first to last instalment
  const firstDue = instalments[0]?.dueDate
  const lastDue  = instalments[instalments.length - 1]?.dueDate

  return (
    <div className="space-y-4">

      {/* ── Plan type + overview ── */}
      <div className="flex flex-wrap items-start gap-3 p-4 rounded-xl border"
        style={{ background: 'rgba(239,246,255,0.7)', borderColor: 'rgba(147,197,253,0.5)' }}>
        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
              ${isLumpSum
                ? 'bg-gold-100 text-gold-700 border border-gold-200'
                : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
              {isLumpSum ? '💰 Lump Sum Payment' : `📅 Instalment Plan — ${instalments.length} Payments`}
            </span>
          </div>

          {/* Timeframe */}
          {!isLumpSum && firstDue && lastDue && (
            <p className="text-xs text-gray-500">
              Schedule: <span className="font-medium text-gray-700">{formatDate(firstDue)}</span>
              {' → '}
              <span className="font-medium text-gray-700">{formatDate(lastDue)}</span>
            </p>
          )}
          {isLumpSum && firstDue && (
            <p className="text-xs text-gray-500">
              Due date: <span className="font-medium text-gray-700">{formatDate(firstDue)}</span>
            </p>
          )}
        </div>

        {/* Total amount */}
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-base font-bold text-navy-900">LKR {total.toLocaleString()}</p>
        </div>
      </div>

      {/* ── Summary bar ── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Total',   value: `LKR ${total.toLocaleString()}`,   color: 'text-navy-900' },
          { label: 'Paid',    value: `LKR ${paid.toLocaleString()}`,    color: 'text-emerald-600' },
          { label: 'Balance', value: `LKR ${balance.toLocaleString()}`, color: balance > 0 ? 'text-blue-600' : 'text-emerald-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-2.5 bg-white rounded-xl border border-blue-100 text-center">
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            <p className={`text-xs font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Progress bar (instalment plan only) ── */}
      {!isLumpSum && (
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>{paidCount} of {instalments.length} payments made</span>
            <span className="font-semibold">{total > 0 ? Math.round((paid / total) * 100) : 0}% complete</span>
          </div>
          <div className="h-2.5 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${total > 0 ? (paid / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Next due / overdue alert ── */}
      {nextDue && (
        <div className={`flex items-start gap-2.5 p-3 rounded-xl text-xs
          ${overdue
            ? 'bg-red-50 border border-red-200 text-red-700'
            : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
          {overdue
            ? <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            : <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />}
          <div>
            <p className="font-semibold">{overdue ? '⚠️ Payment Overdue' : 'Next Payment Due'}</p>
            <p className="mt-0.5">{isLumpSum ? 'Full payment' : `Instalment ${nextDue.instalmentNumber}`} — {nextDue.description}</p>
            <p className="font-bold mt-0.5">
              LKR {Number(nextDue.amount).toLocaleString()}{' '}
              {overdue ? `(was due ${formatDate(nextDue.dueDate)})` : `due ${formatDate(nextDue.dueDate)}`}
            </p>
          </div>
        </div>
      )}

      {/* ── Instalment rows ── */}
      <div className="space-y-2">
        {instalments.map((inst) => (
          <div key={inst.id}
            className={`flex items-start gap-3 p-3 rounded-xl border
              ${inst.isPaid
                ? 'bg-emerald-50 border-emerald-200'
                : new Date(inst.dueDate) < today
                  ? 'bg-red-50 border-red-200'
                  : 'bg-white border-gray-200'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
              ${inst.isPaid ? 'bg-emerald-500' : new Date(inst.dueDate) < today ? 'bg-red-400' : 'bg-gray-200'}`}>
              {inst.isPaid
                ? <BadgeCheck className="w-4 h-4 text-white" />
                : <span className={`text-xs font-bold ${new Date(inst.dueDate) < today ? 'text-white' : 'text-gray-600'}`}>
                    {isLumpSum ? '₹' : inst.instalmentNumber}
                  </span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold leading-snug
                  ${inst.isPaid ? 'text-emerald-800'
                    : new Date(inst.dueDate) < today ? 'text-red-800'
                    : 'text-gray-900'}`}>
                  {inst.description}
                </p>
                <p className={`text-sm font-bold flex-shrink-0
                  ${inst.isPaid ? 'text-emerald-700' : 'text-blue-700'}`}>
                  LKR {Number(inst.amount).toLocaleString()}
                </p>
              </div>
              <span className={`text-xs flex items-center gap-1 mt-1
                ${inst.isPaid ? 'text-emerald-600'
                  : new Date(inst.dueDate) < today ? 'text-red-600'
                  : 'text-gray-500'}`}>
                {inst.isPaid
                  ? <><BadgeCheck className="w-3 h-3" /> Paid {inst.paidDate ? formatDate(inst.paidDate) : ''}</>
                  : new Date(inst.dueDate) < today
                    ? <><AlertCircle className="w-3 h-3" /> Overdue — was due {formatDate(inst.dueDate)}</>
                    : <><Clock className="w-3 h-3" /> Due {formatDate(inst.dueDate)}</>}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Completion banner ── */}
      {balance === 0 && paidCount === instalments.length && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold">
          <BadgeCheck className="w-4 h-4" />
          {isLumpSum ? 'Payment complete — thank you!' : 'All instalments paid — payment complete!'}
        </div>
      )}
    </div>
  )
}

// ─── Single category section ──────────────────────────────────────────────────
function CategorySection({ type, updates }) {
  const [collapsed, setCollapsed] = useState(false)
  const cfg   = CATEGORY_CONFIG[type] || CATEGORY_CONFIG.GENERAL
  const Icon  = cfg.icon
  const label = updateTypeLabel(type)

  // Payment Update — always show if payment plan exists even if 0 text updates
  const showPaymentPlan = cfg.hasPaymentPlan

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className={`w-full flex items-center gap-3 px-5 py-3.5 border-b border-gray-100
                    ${cfg.headingBg} hover:brightness-[0.97] transition-all`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
          <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
        </div>
        <span className={`flex-1 text-left text-sm font-bold ${cfg.headingText}`}>{label}</span>
        <span className="text-xs font-semibold text-gray-400 mr-1">
          {updates.length} {updates.length === 1 ? 'update' : 'updates'}
        </span>
        {collapsed
          ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronUp   className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>

      {/* Content */}
      {!collapsed && (
        <div className="bg-white">
          {/* Payment plan panel — shown at top of PAYMENT_UPDATE category */}
          {showPaymentPlan && (
            <div className="px-5 pt-4 pb-2 border-b border-gray-50">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide flex items-center gap-1.5 mb-3">
                <DollarSign className="w-3.5 h-3.5" /> Your Payment Plan
              </p>
              <PaymentPlanPanel />
            </div>
          )}

          {/* Text updates */}
          {updates.length > 0 && (
            <div className="divide-y divide-gray-50">
              {updates.map((update) => (
                <div key={update.id}
                  className={`flex gap-4 px-5 py-4 border-l-4 ${cfg.borderColor}`}>
                  <div className="flex flex-col items-center pt-1 flex-shrink-0">
                    <div className={`w-2.5 h-2.5 rounded-full bg-white border-2 ${cfg.dot}`} />
                    <div className="flex-1 w-px bg-gray-100 mt-1" />
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 leading-snug">
                        {update.title}
                      </h4>
                      <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">
                        {formatDate(update.publishedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{update.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state for non-payment categories */}
          {!showPaymentPlan && updates.length === 0 && (
            <p className="px-5 py-4 text-sm text-gray-400">No updates in this category yet.</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function UpdatesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-updates-all'],
    queryFn: () => api.get('/customer/updates', { params: { limit: 200 } }).then(r => r.data),
  })

  // Also check if payment plan exists (to always show PAYMENT_UPDATE section)
  const { data: planData } = useQuery({
    queryKey: ['my-payment-plan'],
    queryFn: () => api.get('/customer/payment-plan').then(r => r.data.data),
  })
  const hasPlan = (planData?.length || 0) > 0

  const allUpdates = data?.data || []

  const grouped = allUpdates.reduce((acc, u) => {
    const key = u.updateType || 'GENERAL'
    if (!acc[key]) acc[key] = []
    acc[key].push(u)
    return acc
  }, {})

  // Show PAYMENT_UPDATE section if there are updates OR a payment plan exists
  const activeCategories = CATEGORY_ORDER.filter(type =>
    (grouped[type]?.length > 0) || (type === 'PAYMENT_UPDATE' && hasPlan)
  )

  const totalCount = allUpdates.length

  if (isLoading) return <PageSkeleton />

  if (totalCount === 0 && !hasPlan) {
    return (
      <div className="max-w-2xl">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-3 pb-1">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{totalCount}</span>{' '}
          {totalCount === 1 ? 'update' : 'updates'} across{' '}
          <span className="font-semibold text-gray-900">{activeCategories.length}</span>{' '}
          {activeCategories.length === 1 ? 'category' : 'categories'}
        </p>
      </div>

      {activeCategories.map(type => (
        <CategorySection
          key={type}
          type={type}
          updates={grouped[type] || []}
        />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <TrendingUp className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">No updates yet</h3>
      <p className="text-sm text-gray-500">
        Updates from NovaNest will appear here, organised by category.
      </p>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="max-w-2xl space-y-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-50">
            <div className="w-8 h-8 rounded-xl bg-gray-200" />
            <div className="flex-1 h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-12" />
          </div>
          <div className="px-5 py-4 space-y-3">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="space-y-1.5">
                <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
