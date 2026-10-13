import { useState, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  MapPin, Download, ArrowRight, ChevronLeft,
  Building2, Layers, Check, ShieldCheck, Dumbbell,
  Waves, Car, Zap, Sparkles, Eye, X,
  MessageSquare, CheckCircle,
} from 'lucide-react'
import api from '../../../lib/api'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import PropertyCard from '../../../components/ui/PropertyCard'
import GeneratedMasterFloorPlan from '../../../components/ui/GeneratedMasterFloorPlan'

const TABS = ['Overview', 'Facilities', 'Master Plan', 'Gallery', 'Amenities', 'Floor Plans', 'Availability']

const DEFAULT_AMENITIES = [
  { icon: Waves,      name: 'Infinity Swimming Pool',   desc: 'Temperature-controlled rooftop pool with panoramic skyline views.' },
  { icon: Dumbbell,   name: 'State-of-the-Art Gym',     desc: 'Fully equipped fitness center with modern cardio and strength equipment.' },
  { icon: ShieldCheck,name: '24/7 Security & CCTV',     desc: 'Round-the-clock security personnel and smart access control systems.' },
  { icon: Car,        name: 'Covered Resident Parking', desc: 'Dedicated multi-level underground parking with EV charging stations.' },
  { icon: Zap,        name: '100% Backup Power',        desc: 'Automatic standby generators ensuring uninterrupted electricity.' },
  { icon: Sparkles,   name: 'Rooftop Lounge & Garden',  desc: 'Beautifully landscaped garden space for relaxation and private events.' },
]

// ─── Inline Inquiry Modal ─────────────────────────────────────────────────────
function UnitInquiryModal({ unit, project, onClose }) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const mutation = useMutation({
    mutationFn: (data) => api.post('/inquiries', {
      ...data,
      apartmentId: unit.id,
      projectId:   project?.id,
    }),
    onSuccess: () => { reset() },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, rgba(200,220,235,0.22) 0%, rgba(180,210,228,0.12) 40%, rgba(165,205,225,0.18) 100%)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          borderStyle: 'solid', borderWidth: '1.5px',
          borderTopColor: 'rgba(210,240,252,0.80)', borderLeftColor: 'rgba(200,235,248,0.68)',
          borderRightColor: 'rgba(130,190,218,0.28)', borderBottomColor: 'rgba(110,178,210,0.24)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.60)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-white/20">
          <div>
            <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-0.5">
              Unit Enquiry
            </p>
            <h3 className="text-lg font-bold text-white">
              Unit {unit.unitNumber}
              {unit.apartmentType?.name ? ` — ${unit.apartmentType.name}` : ''}
            </h3>
            <p className="text-white/60 text-sm mt-0.5">
              {project?.name}
              {unit.floor?.building?.name ? ` · ${unit.floor.building.name}` : ''}
              {unit.floor?.floorNumber ? ` · Floor ${unit.floor.floorNumber}` : ''}
            </p>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Unit summary strip */}
        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border-b border-white/10 text-sm text-white/80">
          {unit.bedrooms != null && <span>🛏 {unit.bedrooms} Beds</span>}
          {unit.bathrooms != null && <span>🚿 {unit.bathrooms} Baths</span>}
          {unit.areaSqft && <span>📐 {Number(unit.areaSqft).toLocaleString()} sqft</span>}
          {unit.price && (
            <span className="ml-auto font-bold text-gold-400">
              LKR {Number(unit.price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Form / Success */}
        <div className="px-6 py-5">
          {mutation.isSuccess ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40
                              flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Enquiry Submitted!</h4>
              <p className="text-white/60 text-sm max-w-xs mx-auto">
                Our team will contact you shortly with details about Unit {unit.unitNumber}.
              </p>
              <button onClick={onClose}
                className="btn-primary mt-6 text-sm">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
              {mutation.isError && (
                <div className="p-3 bg-red-500/15 border border-red-400/30 rounded-xl text-sm text-red-300">
                  {mutation.error?.response?.data?.message || 'Something went wrong. Please try again.'}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="label-white">Full Name *</label>
                  <input
                    className={`input-dark ${errors.customerName ? 'border-red-400' : ''}`}
                    placeholder="Your full name"
                    {...register('customerName', { required: 'Required' })}
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-xs text-red-400">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="label-white">Email *</label>
                  <input
                    type="email"
                    className={`input-dark ${errors.email ? 'border-red-400' : ''}`}
                    placeholder="your@email.com"
                    {...register('email', {
                      required: 'Required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="label-white">Phone *</label>
                  <input
                    className={`input-dark ${errors.phone ? 'border-red-400' : ''}`}
                    placeholder="+94 77 000 0000"
                    {...register('phone', { required: 'Required' })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="label-white">Message</label>
                  <textarea
                    className="input-dark resize-none"
                    rows={3}
                    placeholder={`I'm interested in Unit ${unit.unitNumber}. Please send me more details.`}
                    {...register('message', { required: 'Required' })}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center py-3"
              >
                {isSubmitting
                  ? <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  : <>
                      <MessageSquare className="w-4 h-4" />
                      Send Enquiry for Unit {unit.unitNumber}
                    </>
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Brochure Download Modal ──────────────────────────────────────────────────
function BrochureModal({ project, onClose }) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const mutation = useMutation({
    mutationFn: (data) =>
      api.post(`/projects/${project.id}/brochure-download`, data),
    onSuccess: (res) => {
      // Trigger the actual download in a new tab then close
      window.open(res.data.brochureUrl, '_blank', 'noopener,noreferrer')
      reset()
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(200,220,235,0.22) 0%, rgba(180,210,228,0.12) 40%, rgba(165,205,225,0.18) 100%)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          borderStyle: 'solid', borderWidth: '1.5px',
          borderTopColor: 'rgba(210,240,252,0.80)', borderLeftColor: 'rgba(200,235,248,0.68)',
          borderRightColor: 'rgba(130,190,218,0.28)', borderBottomColor: 'rgba(110,178,210,0.24)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.60)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-white/20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#C9A84C' }}>
              Download Brochure
            </p>
            <h3 className="text-lg font-bold text-white">{project.name}</h3>
            <p className="text-white/60 text-sm mt-0.5">
              Please share your details to receive the brochure.
            </p>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5">
          {mutation.isError && (
            <div className="mb-4 p-3 bg-red-500/15 border border-red-400/30 rounded-xl text-sm text-red-300">
              {mutation.error?.response?.data?.message || 'Something went wrong. Please try again.'}
            </div>
          )}
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div>
              <label className="label-white">Full Name *</label>
              <input
                className={`input-dark ${errors.fullName ? 'border-red-400' : ''}`}
                placeholder="Your full name"
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>
              )}
            </div>
            <div>
              <label className="label-white">Phone Number *</label>
              <input
                className={`input-dark ${errors.phone ? 'border-red-400' : ''}`}
                placeholder="+94 77 000 0000"
                {...register('phone', { required: 'Phone number is required' })}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="btn-primary w-full justify-center py-3 mt-1"
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download Brochure
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const { slug } = useParams()
  const [activeTab,               setActiveTab]               = useState('Overview')
  const [selectedFloorId,         setSelectedFloorId]         = useState(null)
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('ALL')
  const [lightboxImg,             setLightboxImg]             = useState(null) // { imageUrl, caption }
  const [selectedAptType,         setSelectedAptType]         = useState('ALL')

  // Unit selected from Master Plan
  const [highlightedUnitId, setHighlightedUnitId] = useState(null)
  // Unit for the inquiry modal
  const [enquiryUnit,       setEnquiryUnit]       = useState(null)
  // Brochure download modal
  const [brochureModal,     setBrochureModal]     = useState(false)

  // Ref map for floor plan cards — keyed by apt.id
  const floorPlanRefs = useRef({})

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.get(`/projects/${slug}`).then(r => r.data.data),
  })

  // ── Callback from GeneratedMasterFloorPlan ──────────────────────────────────
  // action: 'floor-plans' → switch to Floor Plans tab + scroll to that unit
  // action: 'enquire'     → open inline inquiry modal
  const handleUnitSelect = useCallback((apt, action) => {
    if (action === 'enquire') {
      setEnquiryUnit(apt)
    } else {
      // 'floor-plans' — switch tab then scroll after a short paint delay
      setHighlightedUnitId(apt.id)
      setActiveTab('Floor Plans')
      setTimeout(() => {
        const el = floorPlanRefs.current[apt.id]
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 120)
    }
  }, [])

  if (isLoading) return <><div className="h-20 bg-navy-900" /><LoadingSpinner /></>
  if (error || !project) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Apartment Project Not Found</h2>
        <Link to="/projects" className="btn-outline-gold mt-4">← Back to Projects</Link>
      </div>
    </div>
  )

  const facilities = project.projectFacilities?.map(pf => pf.facility) || []
  const gallery    = project.gallery || []

  const allFloors = project.buildings?.flatMap(b =>
    (b.floors || []).map(f => ({ ...f, buildingName: b.name }))
  ) || []

  const allApts = project.buildings?.flatMap(b =>
    b.floors?.flatMap(f =>
      (f.apartments || []).map(a => ({ ...a, floor: { ...f, building: b } }))
    ) || []
  ) || []

  const activeFloor = selectedFloorId
    ? allFloors.find(f => f.id === selectedFloorId) || allFloors[0]
    : allFloors[0]

  const galleryCategories = ['ALL', ...new Set(gallery.map(g => g.category))]
  const filteredGallery   = selectedGalleryCategory === 'ALL'
    ? gallery
    : gallery.filter(g => g.category === selectedGalleryCategory)

  const aptsWithPlans    = allApts.filter(a => a.floorPlans && a.floorPlans.length > 0)
  const aptTypes         = ['ALL', ...new Set(aptsWithPlans.map(a => a.apartmentType?.name).filter(Boolean))]
  const filteredFloorPlans = selectedAptType === 'ALL'
    ? aptsWithPlans
    : aptsWithPlans.filter(a => a.apartmentType?.name === selectedAptType)

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Hero ── */}
      <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden bg-navy-900">
        {project.mainImage && (
          <img src={project.mainImage} alt={project.name}
            className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-navy-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-28">
          <div className="container-site">
            <Link to="/projects"
              className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Projects
            </Link>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider
                    ${project.status === 'COMPLETED' ? 'bg-blue-500 text-white'
                    : project.status === 'ONGOING'   ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'}`}>
                    {project.status}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">{project.name}</h1>
                <div className="flex items-center gap-2 text-white/80 mt-2 text-sm">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  {project.location}{project.city ? ` · ${project.city}` : ''}
                </div>
              </div>
              <div className="flex gap-3">
                {project.brochureUrl && (
                  <button
                    onClick={() => setBrochureModal(true)}
                    className="btn-white text-sm gap-2">
                    <Download className="w-4 h-4" /> Download Brochure
                  </button>
                )}
                <Link to="/contact" className="btn-primary text-sm">Enquire Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky tabs ── */}
      <div className="sticky top-[74px] z-30 border-b border-white/20 shadow-md"
        style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.88) 100%)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        }}>
        <div className="container-site">
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-1">
            {TABS.map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 whitespace-nowrap
                  ${activeTab === tab
                    ? 'border-gold-400 text-gold-400 bg-white/5 rounded-t-lg'
                    : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="container-site py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {/* 1. OVERVIEW */}
            {activeTab === 'Overview' && (
              <div className="space-y-8">
                <div className="card p-6 lg:p-8 space-y-4">
                  <h2 className="text-2xl font-bold text-navy-900">A Landmark of Modern Living</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {project.description || 'Welcome to NovaNest — where architectural sophistication meets modern luxury.'}
                  </p>
                </div>
                {project.highlights && (
                  <div className="card p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold-500" /> Project Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.highlights.split(',').map((h, i) => (
                        <div key={i}
                          className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-800 border border-gray-100">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {h.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. FACILITIES */}
            {activeTab === 'Facilities' && (
              <div className="card p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-6">Project Facilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(facilities.length ? facilities : DEFAULT_AMENITIES).map((f, i) => {
                    // f.icon is a string (emoji / text) from the DB.
                    // DEFAULT_AMENITIES entries carry a Lucide component on their .icon field.
                    const isComponent = typeof f.icon === 'function'
                    const Icon = isComponent ? f.icon : null
                    return (
                      <div key={f.id || i}
                        className="flex items-center gap-3 p-4 bg-navy-900/5 rounded-xl border border-gray-100 hover:border-gold-500/30 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center flex-shrink-0">
                          {Icon
                            ? <Icon className="w-5 h-5 text-gold-600" />
                            : f.icon
                              ? <span className="text-xl leading-none">{f.icon}</span>
                              : <Check className="w-5 h-5 text-gold-600" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{f.name}</p>
                          {(f.description || f.desc) && (
                            <p className="text-xs text-gray-500 mt-0.5">{f.description || f.desc}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 3. MASTER PLAN — passes onUnitSelect callback */}
            {activeTab === 'Master Plan' && (
              <div className="card p-6 lg:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-navy-900">Master Plan & Floor Layouts</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Click any unit to view its floor plan or submit an enquiry.
                  </p>
                </div>

                {allFloors.length > 0 ? (
                  <div>
                    {/* Floor selector */}
                    <div className="flex gap-2 overflow-x-auto pb-3 border-b border-gray-100 mb-6">
                      {allFloors.map(f => (
                        <button key={f.id}
                          onClick={() => setSelectedFloorId(f.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all
                            ${activeFloor?.id === f.id
                              ? 'bg-navy-900 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                          <Layers className="w-4 h-4 text-gold-400" />
                          {f.buildingName} · Floor {f.floorNumber}
                        </button>
                      ))}
                    </div>

                    {activeFloor && (
                      <GeneratedMasterFloorPlan
                        floor={activeFloor}
                        buildingName={activeFloor.buildingName}
                        onUnitSelect={handleUnitSelect}
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-10">No floor plans created yet.</p>
                )}
              </div>
            )}

            {/* 4. GALLERY */}
            {activeTab === 'Gallery' && (
              <div className="card p-6 lg:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-navy-900">Project Gallery</h2>
                  <div className="flex gap-2 overflow-x-auto">
                    {galleryCategories.map(cat => (
                      <button key={cat}
                        onClick={() => setSelectedGalleryCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                          ${selectedGalleryCategory === cat ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                {filteredGallery.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGallery.map(img => (
                      <button key={img.id}
                        onClick={() => setLightboxImg(img)}
                        className="relative overflow-hidden rounded-xl aspect-video group shadow-sm bg-gray-100 text-left w-full">
                        <img src={img.imageUrl} alt={img.caption || ''}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        {img.caption && (
                          <div className="absolute bottom-0 inset-x-0 bg-navy-950/80 text-white text-xs p-2.5 font-medium">
                            {img.caption}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-12">No images available.</p>
                )}
              </div>
            )}

            {/* 5. AMENITIES */}
            {activeTab === 'Amenities' && (
              <div className="card p-6 lg:p-8 space-y-6">
                <h2 className="text-2xl font-bold text-navy-900">Luxury Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {DEFAULT_AMENITIES.map((a, i) => {
                    const Icon = a.icon
                    return (
                      <div key={i} className="flex gap-4 p-5 bg-navy-900/5 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-gold-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-navy-900 text-base">{a.name}</h4>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{a.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 6. FLOOR PLANS — unit cards with ref targets + Enquire button */}
            {activeTab === 'Floor Plans' && (
              <div className="card p-6 lg:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-navy-900">Apartment Floor Plans</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Unit architectural layouts and specifications.</p>
                  </div>
                  {aptTypes.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {aptTypes.map(t => (
                        <button key={t}
                          onClick={() => setSelectedAptType(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                            ${selectedAptType === t ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {filteredFloorPlans.length ? (
                  <div className="space-y-6">
                    {filteredFloorPlans.map(apt => {
                      const isHighlighted = highlightedUnitId === apt.id
                      return (
                        <div
                          key={apt.id}
                          id={`floor-plan-${apt.id}`}
                          ref={el => { if (el) floorPlanRefs.current[apt.id] = el }}
                          className={`p-6 rounded-2xl border space-y-4 transition-all duration-500
                            ${isHighlighted
                              ? 'border-gold-400 bg-gold-50 shadow-lg ring-2 ring-gold-400/30'
                              : 'border-gray-200 bg-gray-50'}`}
                        >
                          {/* Unit header */}
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
                            <div>
                              {isHighlighted && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-gold-600 bg-gold-100 px-2.5 py-0.5 rounded-full mb-1.5">
                                  ✦ Selected from Master Plan
                                </span>
                              )}
                              <h3 className="font-bold text-navy-900 text-lg">
                                Unit {apt.unitNumber}
                                <span className="text-gray-500 font-normal text-base ml-2">
                                  ({apt.apartmentType?.name || 'Standard Unit'})
                                </span>
                              </h3>
                              <p className="text-sm text-gray-500">
                                {apt.floor?.building?.name} · Floor {apt.floor?.floorNumber}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-navy-900 text-lg block">
                                {apt.price ? `LKR ${Number(apt.price).toLocaleString()}` : 'Price on Enquiry'}
                              </span>
                              <p className="text-xs text-gray-500">
                                {apt.bedrooms} Beds · {apt.bathrooms} Baths
                                {apt.areaSqft ? ` · ${apt.areaSqft} sqft` : ''}
                              </p>
                            </div>
                          </div>

                          {/* Floor plan images */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {apt.floorPlans.map(fp => (
                              <div key={fp.id}
                                className="bg-white p-3 rounded-xl border border-gray-200 text-center shadow-sm">
                                <img
                                  src={fp.imageUrl}
                                  alt={fp.caption || 'Unit Floor Plan'}
                                  className="max-h-64 object-contain mx-auto"
                                />
                                {fp.caption && (
                                  <p className="text-xs text-gray-500 mt-2 font-medium">{fp.caption}</p>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Enquire button */}
                          {apt.status === 'AVAILABLE' && (
                            <div className="pt-1 flex justify-end">
                              <button
                                onClick={() => setEnquiryUnit(apt)}
                                className="btn-primary text-sm"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Enquire About Unit {apt.unitNumber}
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-2">
                    <p className="text-gray-500">No floor plan images uploaded yet.</p>
                    <p className="text-sm text-gray-400">
                      Admins can upload floor plan images via the Properties section in the admin panel.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 7. AVAILABILITY */}
            {activeTab === 'Availability' && (
              <div className="card p-6 lg:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-navy-900">Apartment Availability</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Real-time unit status by floor.</p>
                </div>
                {allApts.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-navy-900 text-white">
                        <tr>
                          <th className="p-3 rounded-l-lg">Unit</th>
                          <th className="p-3">Building & Floor</th>
                          <th className="p-3">Beds</th>
                          <th className="p-3">Baths</th>
                          <th className="p-3">Area</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 rounded-r-lg">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {allApts.map(apt => (
                          <tr key={apt.id} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-navy-900">Unit {apt.unitNumber}</td>
                            <td className="p-3 text-gray-600">
                              {apt.floor?.building?.name} · Floor {apt.floor?.floorNumber}
                            </td>
                            <td className="p-3 text-gray-600">{apt.bedrooms} BR</td>
                            <td className="p-3 text-gray-600">{apt.bathrooms} BA</td>
                            <td className="p-3 text-gray-600">
                              {apt.areaSqft ? `${apt.areaSqft} sqft` : '—'}
                            </td>
                            <td className="p-3 font-semibold text-navy-900">
                              {apt.price ? `LKR ${Number(apt.price).toLocaleString()}` : 'Contact Us'}
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                ${apt.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700'
                                : apt.status === 'RESERVED'  ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'}`}>
                                {apt.status}
                              </span>
                            </td>
                            <td className="p-3">
                              {apt.status === 'AVAILABLE' && (
                                <button
                                  onClick={() => setEnquiryUnit(apt)}
                                  className="btn-primary py-1.5 px-3 text-xs"
                                >
                                  Enquire
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-10">No availability information published.</p>
                )}
              </div>
            )}

          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="card p-6 space-y-4 sticky top-[90px]">
              <h3 className="font-bold text-navy-900 text-lg border-b border-gray-100 pb-3">
                Project Details
              </h3>
              {[
                { label: 'Location',      value: project.location },
                { label: 'City',          value: project.city },
                { label: 'Status',        value: project.status },
                { label: 'Completion',    value: project.completionDate
                  ? new Date(project.completionDate).getFullYear() : '—' },
                { label: 'Starting Price', value: project.startingPrice
                  ? `LKR ${Number(project.startingPrice).toLocaleString()}` : '—' },
              ].map(({ label, value }) => value && (
                <div key={label}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
              ))}
              {project.brochureUrl && (
                <button
                  onClick={() => setBrochureModal(true)}
                  className="btn-white w-full justify-center text-sm gap-2 mt-2">
                  <Download className="w-4 h-4" /> Download Brochure
                </button>
              )}
              <Link to="/contact" className="btn-primary w-full justify-center text-sm gap-2">
                General Enquiry <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

        </div>
      </div>
      </div>

      {/* ── Brochure Download Modal ── */}
      {brochureModal && (
        <BrochureModal
          project={project}
          onClose={() => setBrochureModal(false)}
        />
      )}

      {/* ── Inline Unit Inquiry Modal ── */}
      {enquiryUnit && (
        <UnitInquiryModal
          unit={enquiryUnit}
          project={project}
          onClose={() => setEnquiryUnit(null)}
        />
      )}

      {/* ── Lightbox ── */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

          {/* Close button */}
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image */}
          <div
            className="relative z-10 max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightboxImg.imageUrl}
              alt={lightboxImg.caption || ''}
              className="max-h-[80vh] w-auto max-w-full rounded-xl shadow-2xl object-contain"
            />
            {lightboxImg.caption && (
              <p className="mt-3 text-white/80 text-sm text-center px-4">
                {lightboxImg.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
