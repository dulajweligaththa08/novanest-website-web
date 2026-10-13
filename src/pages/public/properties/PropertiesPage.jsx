import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X, ChevronDown, MapPin, Building2, ArrowRight } from 'lucide-react'
import api from '../../../lib/api'
import PageHero from '../../../components/ui/PageHero'
import PropertyCard from '../../../components/ui/PropertyCard'
import ListingCard from '../../../components/ui/ListingCard'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'

const BEDROOM_OPTS = ['Any', '0', '1', '2', '3', '4+']
const STATUS_OPTS = ['AVAILABLE', 'RESERVED', 'SOLD']
const SORT_OPTS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low', value: 'price_asc' },
  { label: 'Price: High', value: 'price_desc' },
]

// Tabs — Apartments uses the apartment & projects API; Houses & Land use the listings API
const TABS = [/*
  { value: 'ALL', label: '🏘 All', api: 'both' },
  { value: 'APARTMENT', label: '🏢 Apartments', api: 'apartments' },
  { value: 'HOUSE', label: '🏠 Houses', api: 'listings' },
  { value: 'LAND', label: '🌿 Land', api: 'listings' },*/
]

export default function PropertiesPage({ defaultTab = 'ALL', pageTitle = 'Properties' }) {
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [page, setPage] = useState(1)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    projectId: '',
    city: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
    status: '',
    sort: 'newest',
  })

  useEffect(() => { setPage(1) }, [filters, activeTab])

  // Fetch projects (Apartment developments)
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects-public'],
    queryFn: () => api.get('/projects', { params: { limit: 50 } }).then(r => r.data.data),
  })

  // ── Apartment query (tabs: ALL, APARTMENT) ────────────────────────────────
  const showApartments = activeTab === 'ALL' || activeTab === 'APARTMENT'
  const aptParams = {
    limit: activeTab === 'ALL' ? 6 : 12,
    page,
    status: filters.status || undefined,
    ...(filters.search && { search: filters.search }),
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.city && { city: filters.city }),
    ...(filters.bedrooms && filters.bedrooms !== 'Any' && {
      bedrooms: filters.bedrooms === '4+' ? 4 : filters.bedrooms,
    }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
  }

  const { data: aptData, isLoading: aptLoading } = useQuery({
    queryKey: ['apartments-public', aptParams, showApartments],
    queryFn: () => api.get('/apartments', { params: aptParams }).then(r => r.data),
    enabled: showApartments,
  })

  // ── Listings query (tabs: ALL, HOUSE, LAND) ───────────────────────────────
  const showListings = activeTab === 'ALL' || activeTab === 'HOUSE' || activeTab === 'LAND'
  const listingParams = {
    limit: activeTab === 'ALL' ? 6 : 12,
    page,
    status: filters.status || undefined,
    ...(activeTab !== 'ALL' && { listingType: activeTab }),
    ...(filters.city && { city: filters.city }),
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
  }

  const { data: listingData, isLoading: listingLoading } = useQuery({
    queryKey: ['listings-public', listingParams, showListings],
    queryFn: () => api.get('/listings', { params: listingParams }).then(r => r.data),
    enabled: showListings,
  })

  const projects = projectsData || []
  const apartments = aptData?.data || []
  const listings = listingData?.data || []
  const aptPagination = aptData?.pagination
  const listingPagination = listingData?.pagination
  const isLoading = projectsLoading || (showApartments && aptLoading) || (showListings && listingLoading)

  // Don't render results until every active query has settled at least once.
  // Without this, a cache-miss on one query while another is cached causes a
  // blank "no results" flash before the slower query resolves.
  const isReady = !projectsLoading &&
    (!showApartments || !aptLoading) &&
    (!showListings   || !listingLoading)

  const totalCount = (showApartments ? (projects.length + (aptPagination?.total ?? 0)) : 0)
    + (showListings ? (listingPagination?.total ?? 0) : 0)

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }))
  const clearFilters = () => setFilters({
    search: '', projectId: '', city: '', bedrooms: '',
    minPrice: '', maxPrice: '', status: '', sort: 'newest',
  })

  return (
    <div>
      <PageHero
        title={pageTitle}
        subtitle={`Explore our exclusive collection of luxury ${pageTitle.toLowerCase()}.`}
        backgroundImage="/images/hero-properties.jpg"
        breadcrumb={`Home › ${pageTitle}`}
      />

      <div className="container-site py-10">
        {/* ── Property type tabs ── */}
        <div className="flex gap-0 mb-8 border-b border-gray-200 overflow-x-auto">
          {TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setActiveTab(value); setPage(1) }}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-semibold border-b-2
                transition-all -mb-px flex-shrink-0
                ${activeTab === value
                  ? 'border-gold-500 text-navy-900'
                  : 'border-transparent text-gray-500 hover:text-navy-900 hover:border-gray-300'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Top bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-sm text-gray-500">
            {isReady
              ? <>Showing <span className="font-semibold text-gray-900">{totalCount}</span> properties</>
              : <span className="text-gray-300">Loading…</span>
            }
          </p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select value={filters.sort} onChange={e => set('sort', e.target.value)}
                className="input pr-8 py-2 appearance-none cursor-pointer w-44">
                {SORT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <button onClick={() => setShowFilters(o => !o)}
              className="lg:hidden btn-outline-gold py-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar filters ── */}
          <aside className={`w-64 flex-shrink-0 space-y-5 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="card p-5 space-y-5 sticky top-[90px]">

              <div>
                <label className="label">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input className="input pl-9" placeholder="Search..."
                    value={filters.search} onChange={e => set('search', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="label">Location / City</label>
                <input className="input" placeholder="Colombo, Galle..."
                  value={filters.city} onChange={e => set('city', e.target.value)} />
              </div>

              <div>
                <label className="label">Project</label>
                <select className="input" value={filters.projectId}
                  onChange={e => set('projectId', e.target.value)}>
                  <option value="">All Projects</option>
                  {projects.map(p =>
                    <option key={p.id} value={p.id}>{p.name}</option>
                  )}
                </select>
              </div>

              {/* Bedrooms — only for apartments/houses */}
              {activeTab !== 'LAND' && (
                <div>
                  <label className="label">Bedrooms</label>
                  <div className="flex flex-wrap gap-2">
                    {BEDROOM_OPTS.map(b => (
                      <button key={b}
                        onClick={() => set('bedrooms', b === 'Any' ? '' : b)}
                        className={`filter-chip ${(filters.bedrooms === b || (b === 'Any' && !filters.bedrooms))
                          ? 'filter-chip-active' : ''}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="label">Price Range (LKR)</label>
                <div className="flex gap-2">
                  <input className="input" type="number" placeholder="Min"
                    value={filters.minPrice} onChange={e => set('minPrice', e.target.value)} />
                  <input className="input" type="number" placeholder="Max"
                    value={filters.maxPrice} onChange={e => set('maxPrice', e.target.value)} />
                </div>
              </div>

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

              <button onClick={clearFilters}
                className="btn-secondary w-full justify-center text-sm py-2 text-gray-700 border-gray-200">
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            </div>
          </aside>

          {/* ── Results grid ── */}
          <div className="flex-1 min-w-0">
            {!isReady ? (
              <LoadingSpinner />
            ) : showApartments && (projects.length > 0 || apartments.length > 0) ? (
              <div className="space-y-10">
                {/* Apartment Projects / Complexes */}
                {projects.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      🏢 Apartment Developments
                      <span className="text-xs font-normal text-gray-400">
                        {projects.length} project{projects.length > 1 ? 's' : ''}
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {projects.map(p => (
                        <ApartmentProjectCard key={p.id} project={p} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Apartment Units */}
                {apartments.length > 0 && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      🚪 Apartment Units
                      <span className="text-xs font-normal text-gray-400">
                        {aptPagination?.total ?? 0} listings
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {apartments.map(apt => <PropertyCard key={apt.id} apartment={apt} />)}
                    </div>
                    {activeTab === 'APARTMENT' && aptPagination?.pages > 1 && (
                      <Pagination page={page} total={aptPagination.pages} onPage={setPage} />
                    )}
                  </div>
                )}
              </div>
            ) : showListings && listings.length > 0 ? (
              <div>
                {activeTab === 'ALL' && (
                  <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    🏠 Houses & Land
                    <span className="text-xs font-normal text-gray-400">
                      {listingPagination?.total ?? 0} listings
                    </span>
                  </h3>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {listings.map(l => <ListingCard key={l.id} listing={l} />)}
                </div>
                {(activeTab === 'HOUSE' || activeTab === 'LAND') && listingPagination?.pages > 1 && (
                  <Pagination page={page} total={listingPagination.pages} onPage={setPage} />
                )}
              </div>
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

function ApartmentProjectCard({ project }) {
  return (
    <Link to={`/apartments/${project.slug}`} className="card-hover group block overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="relative h-52 overflow-hidden bg-navy-900">
        {project.mainImage ? (
          <img src={project.mainImage} alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30">
            <Building2 className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white
          ${project.status === 'COMPLETED' ? 'bg-blue-500' : project.status === 'ONGOING' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
          {project.status}
        </span>
        <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
          🏢 Luxury Apartment
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-navy-900 text-lg mb-1 group-hover:text-gold-600 transition-colors">
          {project.name}
        </h3>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" /> {project.location} {project.city ? `· ${project.city}` : ''}
        </div>
        {project.startingPrice && (
          <p className="text-gold-600 font-bold text-sm mb-3">
            From LKR {Number(project.startingPrice).toLocaleString()}
          </p>
        )}
        <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-navy-800 group-hover:text-gold-600 transition-colors">
          <span>View Master Plan & Details</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}

function Pagination({ page, total, onPage }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button disabled={page === 1} onClick={() => onPage(p => p - 1)}
        className="btn-secondary py-2 px-4 disabled:opacity-40 text-gray-700 border-gray-200">
        ← Prev
      </button>
      <span className="text-sm text-gray-600">Page {page} of {total}</span>
      <button disabled={page === total} onClick={() => onPage(p => p + 1)}
        className="btn-secondary py-2 px-4 disabled:opacity-40 text-gray-700 border-gray-200">
        Next →
      </button>
    </div>
  )
}
