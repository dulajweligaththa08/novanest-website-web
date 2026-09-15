import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  MapPin, Download, ArrowRight, ChevronLeft,
  Building2, Layers, Home, Check,
} from 'lucide-react'
import api from '../../../lib/api'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import PropertyCard from '../../../components/ui/PropertyCard'

const TABS = ['Overview', 'Facilities', 'Master Plan', 'Gallery', 'Amenities', 'Floor Plans', 'Availability']

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.get(`/projects/${slug}`).then(r => r.data.data),
  })

  if (isLoading) return <><div className="h-20 bg-navy-900" /><LoadingSpinner /></>
  if (error || !project) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
        <Link to="/projects" className="btn-outline-gold mt-4">← Back to Projects</Link>
      </div>
    </div>
  )

  const facilities = project.projectFacilities?.map(pf => pf.facility) || []
  const gallery    = project.gallery || []
  const allApts    = project.buildings?.flatMap(b =>
    b.floors?.flatMap(f => f.apartments || []) || []
  ) || []

  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden bg-navy-900">
        {project.mainImage && (
          <img src={project.mainImage} alt={project.name}
            className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-28">
          <div className="container-site">
            <Link to="/projects"
              className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm mb-3 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Projects
            </Link>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                    ${project.status === 'COMPLETED' ? 'bg-blue-500 text-white'
                    : project.status === 'ONGOING' ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'}`}>
                    {project.status}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white">{project.name}</h1>
                <div className="flex items-center gap-1.5 text-white/70 mt-2">
                  <MapPin className="w-4 h-4" /> {project.location}
                </div>
              </div>
              <div className="flex gap-3">
                {project.brochureUrl && (
                  <a href={project.brochureUrl} target="_blank" rel="noreferrer"
                    className="btn-white text-sm gap-2">
                    <Download className="w-4 h-4" /> Download Brochure
                  </a>
                )}
                <Link to="/contact" className="btn-primary text-sm">Enquire Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-16 lg:top-20 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="container-site">
          <div className="flex gap-0 overflow-x-auto scrollbar-none">
            {TABS.map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn flex-shrink-0 ${activeTab === tab ? 'tab-btn-active' : ''}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container-site py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2">

            {activeTab === 'Overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 mb-3">A Landmark of Modern Living</h2>
                  <p className="text-gray-600 leading-relaxed">{project.description}</p>
                </div>
                {project.highlights && (
                  <div>
                    <h3 className="text-lg font-bold text-navy-900 mb-3">Project Highlights</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {project.highlights.split(',').map((h, i) => (
                        <div key={i}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                          <Check className="w-4 h-4 text-gold-500 flex-shrink-0" />
                          {h.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Facilities' && (
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-6">Project Facilities</h2>
                {facilities.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {facilities.map(f => (
                      <div key={f.id}
                        className="flex items-center gap-3 p-4 bg-navy-900/5 rounded-xl border border-gray-100">
                        <div className="w-9 h-9 rounded-lg bg-gold-500/15 flex items-center justify-center">
                          <Check className="w-4 h-4 text-gold-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{f.name}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500">No facilities listed.</p>}
              </div>
            )}

            {activeTab === 'Gallery' && (
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-6">Gallery</h2>
                {gallery.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {gallery.map(img => (
                      <a key={img.id} href={img.imageUrl} target="_blank" rel="noreferrer"
                        className="relative overflow-hidden rounded-xl aspect-video group">
                        <img src={img.imageUrl} alt={img.caption || ''}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {img.caption && (
                          <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs p-2
                                          opacity-0 group-hover:opacity-100 transition-opacity">
                            {img.caption}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                ) : <p className="text-gray-500">No gallery images yet.</p>}
              </div>
            )}

            {activeTab === 'Floor Plans' && (
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-6">Floor Plans</h2>
                <p className="text-gray-500">Select an apartment unit to view its floor plan.</p>
              </div>
            )}

            {activeTab === 'Availability' && (
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-6">Available Units</h2>
                {allApts.filter(a => a.status === 'AVAILABLE').length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allApts.filter(a => a.status === 'AVAILABLE').map(apt => (
                      <PropertyCard key={apt.id} apartment={{ ...apt, floor: { building: { project } } }} />
                    ))}
                  </div>
                ) : <p className="text-gray-500">No available units at the moment.</p>}
              </div>
            )}

            {['Master Plan', 'Amenities', 'Specifications'].includes(activeTab) && (
              <div className="text-center py-16">
                <p className="text-gray-400">Content for {activeTab} coming soon.</p>
              </div>
            )}
          </div>

          {/* Sidebar — project details */}
          <div className="space-y-5">
            <div className="card p-5 space-y-3">
              <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">Project Details</h3>
              {[
                { label: 'Location',      value: project.location },
                { label: 'City',          value: project.city },
                { label: 'Status',        value: project.status },
                { label: 'Completion',    value: project.completionDate
                  ? new Date(project.completionDate).getFullYear() : '—' },
                { label: 'Starting from', value: project.startingPrice
                  ? `LKR ${Number(project.startingPrice).toLocaleString()}` : '—' },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex items-center justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-900 text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Building summary */}
            {project.buildings?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-bold text-gray-900 text-base mb-3">Buildings</h3>
                {project.buildings.map(b => (
                  <div key={b.id} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
                    <Building2 className="w-4 h-4 text-gold-500" />
                    <span className="text-sm text-gray-700 flex-1">{b.name}</span>
                    <span className="text-xs text-gray-400">{b.floors?.length || 0} floors</span>
                  </div>
                ))}
              </div>
            )}

            {/* Map */}
            {project.mapUrl && (
              <div className="card overflow-hidden">
                <iframe src={project.mapUrl} width="100%" height="200"
                  style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Project location" />
              </div>
            )}

            <Link to="/contact" className="btn-primary w-full justify-center">
              Enquire About This Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
