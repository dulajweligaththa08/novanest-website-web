import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  MapPin, Bed, Bath, Maximize2, ChevronLeft, ArrowRight,
  Check, Calendar, ChevronRight,
} from 'lucide-react'
import api from '../../../lib/api'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'

const TABS = ['Overview', 'Floor Plans', 'Gallery', 'Amenities', 'Availability', 'Conditions']

const FEATURE_ICONS = { Bedrooms: Bed, Bathrooms: Bath, 'Living Area': Maximize2 }

export default function ApartmentDetailPage() {
  const { id }       = useParams()
  const [tab, setTab] = useState('Overview')
  const [imgIdx, setImgIdx] = useState(0)

  const { data: apt, isLoading, error } = useQuery({
    queryKey: ['apartment', id],
    queryFn: () => api.get(`/apartments/${id}`).then(r => r.data.data),
  })

  if (isLoading) return <><div className="h-20 bg-navy-900" /><LoadingSpinner /></>
  if (error || !apt) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Apartment not found</h2>
        <Link to="/properties" className="btn-outline-gold mt-4">← Back to Properties</Link>
      </div>
    </div>
  )

  const project  = apt.floor?.building?.project
  const allImgs  = [...(apt.gallery || []), ...(project?.gallery || [])]
  const heroImg  = allImgs[imgIdx]?.imageUrl || apt.gallery?.[0]?.imageUrl || project?.mainImage

  const STATUS_COLOR = {
    AVAILABLE: 'bg-emerald-500', RESERVED: 'bg-amber-500',
    SOLD: 'bg-red-500', UNAVAILABLE: 'bg-gray-500',
  }

  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative h-[55vh] overflow-hidden bg-navy-900">
        {heroImg && (
          <img src={heroImg} alt={`Unit ${apt.unitNumber}`}
            className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/60 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-24 right-6">
          <span className={`text-sm font-semibold text-white px-3 py-1.5 rounded-full ${STATUS_COLOR[apt.status]}`}>
            {apt.status}
          </span>
        </div>

        {/* Gallery thumbnails */}
        {allImgs.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {allImgs.slice(0, 5).map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all
                  ${i === imgIdx ? 'border-gold-500 opacity-100' : 'border-white/30 opacity-60 hover:opacity-80'}`}>
                <img src={img.imageUrl} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        )}

        {/* Info overlay */}
        <div className="absolute bottom-16 left-0 right-0">
          <div className="container-site">
            <Link to="/properties"
              className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm mb-3 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              {project && <Link to={`/projects/${project.slug}`} className="hover:text-gold-400">{project.name}</Link>}
              <span> › Unit {apt.unitNumber}</span>
            </Link>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Unit {apt.unitNumber}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-white/80 text-sm">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {project?.name} · {project?.location}</span>
              <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {apt.bedrooms} Bedrooms</span>
              <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {apt.bathrooms} Bathrooms</span>
              {apt.areaSqft && <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> {Number(apt.areaSqft).toLocaleString()} sqft</span>}
            </div>
            {apt.price && (
              <p className="text-gold-400 font-bold text-2xl mt-2">
                LKR {Number(apt.price).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-16 lg:top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container-site">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`tab-btn flex-shrink-0 ${tab === t ? 'tab-btn-active' : ''}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container-site py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {tab === 'Overview' && (
              <>
                {/* About */}
                <div>
                  <h2 className="text-xl font-bold text-navy-900 mb-3">About This Unit</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {apt.description || `Experience luxury living in Unit ${apt.unitNumber} at ${project?.name}. This ${apt.bedrooms}-bedroom apartment offers ${apt.areaSqft ? `${Number(apt.areaSqft).toLocaleString()} sqft of` : ''} premium living space with modern finishes and world-class amenities.`}
                  </p>
                </div>

                {/* Key features */}
                <div>
                  <h3 className="text-lg font-bold text-navy-900 mb-4">Key Features</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Bedrooms',    val: apt.bedrooms },
                      { label: 'Bathrooms',   val: apt.bathrooms },
                      { label: 'Area',        val: apt.areaSqft ? `${Number(apt.areaSqft).toLocaleString()} sqft` : '—' },
                      { label: 'Type',        val: apt.apartmentType?.name || '—' },
                      { label: 'Floor',       val: apt.floor?.floorNumber ? `Floor ${apt.floor.floorNumber}` : '—' },
                      { label: 'Building',    val: apt.floor?.building?.name || '—' },
                    ].map(({ label, val }) => (
                      <div key={label} className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-gray-900">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unit features */}
                <div>
                  <h3 className="text-lg font-bold text-navy-900 mb-4">Unit Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      `${apt.bedrooms} Bedrooms`, `${apt.bathrooms} Bathrooms`,
                      'Living Area', 'Dining Area', 'Kitchen', 'Balcony',
                      'Parking', 'Storage',
                    ].map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-gold-500 flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === 'Floor Plans' && (
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-6">Floor Plan</h2>
                {apt.floorPlans?.length ? (
                  <div className="space-y-6">
                    {apt.floorPlans.map(fp => (
                      <div key={fp.id}>
                        <img src={fp.imageUrl} alt={fp.caption || 'Floor plan'}
                          className="w-full rounded-2xl border border-gray-100" />
                        {fp.caption && <p className="text-sm text-gray-500 text-center mt-2">{fp.caption}</p>}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500">Floor plan not available yet.</p>}
              </div>
            )}

            {tab === 'Gallery' && (
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-6">Gallery</h2>
                {apt.gallery?.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {apt.gallery.map(img => (
                      <a key={img.id} href={img.imageUrl} target="_blank" rel="noreferrer"
                        className="overflow-hidden rounded-xl aspect-video group">
                        <img src={img.imageUrl} alt={img.caption || ''}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </a>
                    ))}
                  </div>
                ) : <p className="text-gray-500">No gallery images yet.</p>}
              </div>
            )}

            {!['Overview', 'Floor Plans', 'Gallery'].includes(tab) && (
              <div className="text-center py-16 text-gray-400">
                Content for {tab} coming soon.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Price card */}
            <div className="card p-5 border-t-4 border-gold-500">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-semibold text-white px-2.5 py-1 rounded-full ${STATUS_COLOR[apt.status]}`}>
                  {apt.status}
                </span>
                {apt.price && (
                  <p className="text-gold-600 font-bold text-xl">
                    LKR {Number(apt.price).toLocaleString()}
                  </p>
                )}
              </div>
              <Link to="/contact" state={{ apartmentId: id, unitNumber: apt.unitNumber }}
                className="btn-primary w-full justify-center mb-3">
                <Calendar className="w-4 h-4" /> Schedule a Viewing
              </Link>
              <Link to={`/contact?apartmentId=${id}`}
                className="btn-outline-gold w-full justify-center text-sm">
                Send Inquiry <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Specs */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Specifications</h3>
              {[
                { label: 'Unit Number', val: apt.unitNumber },
                { label: 'Bedrooms',   val: apt.bedrooms },
                { label: 'Bathrooms',  val: apt.bathrooms },
                { label: 'Area',       val: apt.areaSqft ? `${Number(apt.areaSqft).toLocaleString()} sqft` : '—' },
                { label: 'Type',       val: apt.apartmentType?.name || '—' },
                { label: 'Project',    val: project?.name },
                { label: 'Location',   val: project?.location },
              ].map(({ label, val }) => val && (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[55%]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
