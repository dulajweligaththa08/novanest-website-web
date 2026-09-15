import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp } from 'lucide-react'
import api from '../../../lib/api'
import { updateClass, updateTypeLabel, formatDate, UPDATE_TYPE_META } from '../../../lib/utils'

const UPDATE_TYPES = Object.entries(UPDATE_TYPE_META).map(([value, { label }]) => ({ value, label }))

export default function UpdatesPage() {
  const [filter, setFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['my-updates-all', filter],
    queryFn: () =>
      api.get('/customer/updates', {
        params: { limit: 100, ...(filter && { updateType: filter }) },
      }).then((r) => r.data),
  })

  const updates = data?.data || []

  return (
    <div className="max-w-2xl space-y-6">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <FilterChip label="All" value="" active={filter === ''} onClick={() => setFilter('')} />
        {UPDATE_TYPES.map(({ value, label }) => (
          <FilterChip key={value} label={label} value={value}
            active={filter === value} onClick={() => setFilter(value)} />
        ))}
      </div>

      {isLoading ? (
        <TimelineSkeleton />
      ) : updates.length ? (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-200" />

          <div className="space-y-4">
            {updates.map((update, idx) => (
              <div key={update.id} className="relative flex gap-4 pl-14">
                {/* Timeline dot */}
                <div className="absolute left-3.5 top-4 w-3 h-3 rounded-full bg-white border-2 border-gold-500 z-10" />

                {/* Card */}
                <div className={`flex-1 rounded-2xl p-4 ${updateClass(update.updateType)}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      {updateTypeLabel(update.updateType)}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatDate(update.publishedAt)}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{update.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{update.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyUpdates />
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border
        ${active
          ? 'bg-navy-900 text-white border-navy-900'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
    >
      {label}
    </button>
  )
}

function EmptyUpdates() {
  return (
    <div className="text-center py-16">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <TrendingUp className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">No updates yet</h3>
      <p className="text-sm text-gray-500">Updates from NovaNest will appear here.</p>
    </div>
  )
}

function TimelineSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="pl-14 relative">
          <div className="absolute left-3.5 top-4 w-3 h-3 rounded-full bg-gray-200" />
          <div className="bg-gray-100 rounded-2xl p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
