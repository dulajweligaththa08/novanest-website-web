import { useQuery } from '@tanstack/react-query'
import {
  MapPin, Bed, Bath, Maximize2, Building2,
  Layers, CheckCircle, Clock, Tag,
} from 'lucide-react'
import api from '../../../lib/api'
import { formatDate } from '../../../lib/utils'

const STATUS_CONFIG = {
  AVAILABLE:   { label: 'Available',    cls: 'bg-emerald-100 text-emerald-700' },
  RESERVED:    { label: 'Reserved',     cls: 'bg-amber-100 text-amber-700' },
  SOLD:        { label: 'Purchased',    cls: 'bg-blue-100 text-blue-700' },
  UNAVAILABLE: { label: 'Unavailable',  cls: 'bg-gray-100 text-gray-600' },
}

export default function ApartmentPage() {
  const { data: assignment, isLoading, error } = useQuery({
    queryKey: ['my-apartment'],
    queryFn: () => api.get('/customer/apartment').then((r) => r.data.data),
  })

  if (isLoading) return <PageSkeleton />

  if (error || !assignment) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No apartment assigned</h3>
        <p className="text-sm text-gray-500">
          Your apartment details will appear here once NovaNest assigns a unit to your account.
        </p>
      </div>
    )
  }

  const apt = assignment.apartment
  const project = apt?.floor?.building?.project
  const floor = apt?.floor
  const building = floor?.building
  const statusCfg = STATUS_CONFIG[apt?.status] || STATUS_CONFIG.AVAILABLE

  return (
    <div className="max-w-3xl space-y-6">

      {/* Hero image */}
      {project?.gallery?.[0]?.imageUrl ? (
        <div className="relative rounded-2xl overflow-hidden h-56 sm:h-72">
          <img
            src={project.gallery[0].imageUrl}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <p className="text-xl font-bold">Unit {apt.unitNumber}</p>
            <p className="text-sm text-white/80">{project.name} · {project.location}</p>
          </div>
          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${statusCfg.cls}`}>
            {statusCfg.label}
          </span>
        </div>
      ) : (
        <div className="card p-6 flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-gray-900">Unit {apt.unitNumber}</p>
            <p className="text-sm text-gold-600 font-medium">{project?.name}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusCfg.cls}`}>
            {statusCfg.label}
          </span>
        </div>
      )}

      {/* Key specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Bed,      label: 'Bedrooms',  value: apt.bedrooms },
          { icon: Bath,     label: 'Bathrooms', value: apt.bathrooms },
          { icon: Maximize2,label: 'Area',      value: apt.areaSqft ? `${Number(apt.areaSqft).toLocaleString()} sqft` : '—' },
          { icon: Tag,      label: 'Type',      value: apt.apartmentType?.name || '—' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-gold-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Project details */}
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-gray-900">Project Details</h3>
          <div className="space-y-2 text-sm">
            <InfoRow icon={Building2} label="Project"   value={project?.name} />
            <InfoRow icon={MapPin}    label="Location"  value={project?.location} />
            <InfoRow icon={Layers}    label="Floor"     value={floor?.floorNumber ? `Floor ${floor.floorNumber}` : '—'} />
            <InfoRow icon={Building2} label="Building"  value={building?.name} />
            {project?.status && (
              <InfoRow icon={CheckCircle} label="Status"
                value={project.status.charAt(0) + project.status.slice(1).toLowerCase()} />
            )}
          </div>
        </div>

        {/* Booking details */}
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-gray-900">Booking Details</h3>
          <div className="space-y-2 text-sm">
            {assignment.bookingDate && (
              <InfoRow icon={Clock} label="Booking Date" value={formatDate(assignment.bookingDate)} />
            )}
            {assignment.agreedPrice && (
              <InfoRow icon={Tag} label="Agreed Price"
                value={`LKR ${Number(assignment.agreedPrice).toLocaleString()}`} />
            )}
            <InfoRow icon={Clock} label="Assigned On" value={formatDate(assignment.assignedAt)} />
            {assignment.notes && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-700 leading-relaxed">{assignment.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Facilities */}
      {project?.projectFacilities?.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Project Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {project.projectFacilities.map(({ facility }) => (
              <span key={facility.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-900/5 text-navy-900 rounded-lg text-sm font-medium">
                {facility.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gallery */}
      {apt.gallery?.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Gallery</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {apt.gallery.map((img) => (
              <a key={img.id} href={img.imageUrl} target="_blank" rel="noreferrer">
                <img
                  src={img.imageUrl}
                  alt={img.caption || 'Apartment image'}
                  className="w-full h-32 object-cover rounded-xl hover:opacity-90 transition-opacity"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Floor plans */}
      {apt.floorPlans?.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Floor Plans</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {apt.floorPlans.map((fp) => (
              <a key={fp.id} href={fp.imageUrl} target="_blank" rel="noreferrer">
                <img
                  src={fp.imageUrl}
                  alt={fp.caption || 'Floor plan'}
                  className="w-full rounded-xl border border-gray-200 hover:opacity-90 transition-opacity"
                />
                {fp.caption && (
                  <p className="text-xs text-gray-500 text-center mt-1">{fp.caption}</p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      <span className="text-gray-500 w-28 flex-shrink-0">{label}</span>
      <span className="text-gray-900 font-medium">{value || '—'}</span>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="max-w-3xl space-y-6 animate-pulse">
      <div className="h-72 bg-gray-200 rounded-2xl" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  )
}
