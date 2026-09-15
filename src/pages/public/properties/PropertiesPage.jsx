import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import api from '../../../lib/api'
import PageHero from '../../../components/ui/PageHero'
import PropertyCard from '../../../components/ui/PropertyCard'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'

const BEDROOM_OPTS = ['Any', '0', '1', '2', '3', '4+']
const STATUS_OPTS  = ['AVAILABLE', 'RESERVED', 'SOLD']
const SORT_OPTS    = [
  { label: 'Newest',       value: 'newest' },
  { label: 'Price: Low',   value: 'price_asc' },
  { label: 'Price: High',  value: 'price_desc' },
]

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters]   = useState(false)

  const [filters, setFilters] = useState({
    search:    searchParams.get('search') || '',
    projectId: '',
    city:      '',
    bedrooms:  '',
    minPrice:  '',
    maxPrice:  '',
    status:    'AVAILABLE',
    sort:      'newest',
  })
  const [page, setPage] = useState(1)

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [filters])

  const { data: projectsData } = useQuery({
    queryKey: ['projects-public'],
    queryFn: () => api.get('/projects', { params: { limit: 50 } }).then(r => r.data.data),
  })

  const params = {
    limit: 12,
    page,
    ...(filters.search    && { search: filters.search }),
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.city      && { city: filters.city }),
    ...(filters.bedrooms && filters.bedrooms !== 'Any' && {
      bedrooms: filters.bedrooms === '4+' ? 4 : filters.bedrooms,
    }),
    ...(filters.minPrice  && { minPrice: filters.minPrice }),
    ...(filters.maxPrice  && { maxPrice: filters.maxPrice }),
    status: filters.status || undefined,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['apartments-public', params],
    queryFn: () => api.get('/apartments', { params }).then(r => r.data),
    keepPreviousData: true,
  })

  const apartments = data?.data || []
  const pagination = data?.pagination

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }))
  const clearFilters = () => setFilters({
    search: '', projectId: '', city: '', bedrooms: '',
    minPrice: '', maxPrice: '', status: 'AVAILABLE', sort: 'newest',
  })

  return (
    <div>
      <PageHero
        title="Properties"
        subtitle="Find your perfect home here in our exclusive collection of luxury apartments and residences."
        backgroundImage="/images/hero-properties.jpg"
        breadcrumb="Home › Properties"
      />

      <div className="container-site py-10">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{pagination?.total ?? 0}</span> properties
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={e => set('sort', e.target.value)}
                className="input pr-8 py-2 appearance-none cursor-pointer w-44"
              >
                {SORT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {/* Filter toggle mobile */}
            <button
              onClick={() => setShowFilters(o => !o)}
              className="lg:hidden btn-outline-gold py-2"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar filters ── */}
          <aside className={`w-64 flex-shrink-0 space-y-6
            ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="card p-5 space-y-5 sticky top-24">

              {/* Search */}
              <div>
                <label className="label">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input className="input pl-9" placeholder="Unit, project..."
                    value={filters.search}
                    onChange={e => set('search', e.target.value)} />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="label">Location</label>
                <input className="input" placeholder="Colombo, Galle..."
                  value={filters.city} onChange={e => set('city', e.target.value)} />
              </div>

              {/* Project */}
              <div>
                <label className="label">Project</label>
                <select className="input" value={filters.projectId}
                  onChange={e => set('projectId', e.target.value)}>
                  <option value="">All Projects</option>
                  {(projectsData || []).map(p =>
                    <option key={p.id} value={p.id}>{p.name}</option>
                  )}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="label">Bedrooms</label>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTS.map(b => (
                    <button key={b}
                      onClick={() => set('bedrooms', b === 'Any' ? '' : b)}
                      className={`filter-chip ${(filters.bedrooms === b || (b === 'Any' && !filters.bedrooms)) ? 'filter-chip-active' : ''}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="label">Price Range (LKR)</label>
                <div className="flex gap-2">
                  <input className="input" type="number" placeholder="Min"
                    value={filters.minPrice} onChange={e => set('minPrice', e.target.value)} />
                  <input className="input" type="number" placeholder="Max"
                    value={filters.maxPrice} onChange={e => set('maxPrice', e.target.value)} />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="label">Availability</label>
                <div className="space-y-1.5">
                  {STATUS_OPTS.map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="status" value={s}
                        checked={filters.status === s}
                        onChange={() => set('status', s)}
                        className="accent-gold-500" />
                      <span className="text-sm text-gray-700 capitalize">{s.toLowerCase()}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="status" value=""
                      checked={!filters.status}
                      onChange={() => set('status', '')}
                      className="accent-gold-500" />
                    <span className="text-sm text-gray-700">All</span>
                  </label>
                </div>
              </div>

              {/* Apply / Clear */}
              <div className="flex gap-2 pt-2">
                <button onClick={clearFilters} className="btn-secondary flex-1 justify-center text-sm py-2 text-gray-700 border-gray-200">
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>
          </aside>

          {/* ── Grid ── */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <LoadingSpinner />
            ) : apartments.length ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {apartments.map(apt => <PropertyCard key={apt.id} apartment={apt} />)}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                      className="btn-secondary py-2 px-4 disabled:opacity-40">← Prev</button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {pagination.pages}
                    </span>
                    <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
                      className="btn-secondary py-2 px-4 disabled:opacity-40">Next →</button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No properties match your filters.</p>
                <button onClick={clearFilters} className="btn-outline-gold mt-4">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
