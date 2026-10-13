import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  MapPin, Bed, Bath, Maximize2, Layers, ChevronLeft,
  ArrowRight, Check, CheckCircle, Calendar,
} from 'lucide-react'
import api from '../../../lib/api'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'

export default function ListingDetailPage() {
  const { id } = useParams()
  const [imgIdx, setImgIdx] = useState(0)

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get(`/listings/${id}`).then(r => r.data.data),
  })

  if (isLoading) return <><div className="h-20 bg-navy-900" /><LoadingSpinner /></>
  if (error || !listing) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
        <Link to="/properties" className="btn-outline-gold mt-4">← Back to Properties</Link>
      </div>
    </div>
  )

  const isHouse   = listing.listingType === 'HOUSE'
  const allImages = [
    ...(listing.mainImage ? [{ imageUrl: listing.mainImage }] : []),
    ...(listing.gallery   || []),
  ]
  const heroImg   = allImages[imgIdx]?.imageUrl

  const STATUS_COLOR = {
    AVAILABLE: 'bg-emerald-500', RESERVED: 'bg-amber-500',
    SOLD: 'bg-red-500', UNAVAILABLE: 'bg-gray-500',
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[55vh] overflow-hidden bg-navy-900">
        {heroImg && (
          <img src={heroImg} alt={listing.title}
            className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/60 to-transparent" />

        {/* Status */}
        <div className="absolute top-24 right-6">
          <span className={`text-sm font-semibold text-white px-3 py-1.5 rounded-full ${STATUS_COLOR[listing.status]}`}>
            {listing.status}
          </span>
        </div>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.slice(0, 5).map((img, i) => (
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
              <ChevronLeft className="w-4 h-4" /> Back to Properties
            </Link>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-navy-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                {isHouse ? '🏠 House' : '🌿 Land'}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white max-w-2xl leading-tight">
              {listing.title}
            </h1>
            <div className="flex items-center gap-1 text-white/70 text-sm mt-2">
              <MapPin className="w-4 h-4" /> {listing.location}
              {listing.city && `, ${listing.city}`}
            </div>
            {listing.price && (
              <p className="text-gold-400 font-bold text-2xl mt-2">
                LKR {Number(listing.price).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-site py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {listing.description && (
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-3">About This Property</h2>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>
            )}

            {/* Specs */}
            <div>
              <h2 className="text-xl font-bold text-navy-900 mb-4">
                {isHouse ? 'House Details' : 'Land Details'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {isHouse ? (
                  <>
                    {listing.bedrooms  != null && <SpecCard icon={Bed}      label="Bedrooms"   value={listing.bedrooms} />}
                    {listing.bathrooms != null && <SpecCard icon={Bath}     label="Bathrooms"  value={listing.bathrooms} />}
                    {listing.storeys   != null && <SpecCard icon={Layers}   label="Storeys"    value={listing.storeys} />}
                    {listing.areaSqft  != null && (
                      <SpecCard icon={Maximize2} label="Floor Area"
                        value={`${Number(listing.areaSqft).toLocaleString()} sqft`} />
                    )}
                  </>
                ) : (
                  <>
                    {listing.landAreaPerches != null && (
                      <SpecCard icon={Maximize2} label="Land Area" value={`${listing.landAreaPerches} perches`} />
                    )}
                    {listing.landAreaAcres != null && (
                      <SpecCard icon={Maximize2} label="Land Area" value={`${listing.landAreaAcres} acres`} />
                    )}
                    {listing.landType    && <SpecCard icon={Check} label="Land Type"      value={listing.landType} />}
                    {listing.roadFrontage && <SpecCard icon={Check} label="Road Frontage" value={listing.roadFrontage} />}
                  </>
                )}
                {listing.city && <SpecCard icon={MapPin} label="City" value={listing.city} />}
              </div>
            </div>

            {/* Gallery */}
            {allImages.length > 1 && (
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allImages.map((img, i) => (
                    <button key={i} onClick={() => { setImgIdx(i); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                      <img src={img.imageUrl} alt=""
                        className="w-full h-32 object-cover rounded-xl hover:opacity-90 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Price + CTA */}
            <div className="card p-5 border-t-4 border-gold-500">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-semibold text-white px-2.5 py-1 rounded-full ${STATUS_COLOR[listing.status]}`}>
                  {listing.status}
                </span>
                {listing.price && (
                  <p className="text-gold-600 font-bold text-xl">
                    LKR {Number(listing.price).toLocaleString()}
                  </p>
                )}
              </div>
              <Link to={`/contact?listingId=${listing.id}`}
                className="btn-primary w-full justify-center mb-3">
                <Calendar className="w-4 h-4" /> Schedule a Viewing
              </Link>
              <Link to={`/contact?listingId=${listing.id}`}
                className="btn-outline-gold w-full justify-center text-sm">
                Send Inquiry <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick specs */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Details</h3>
              {[
                { label: 'Type',      value: isHouse ? 'House' : 'Land' },
                { label: 'Location',  value: listing.location },
                { label: 'City',      value: listing.city },
                { label: 'Status',    value: listing.status },
                { label: 'Project',   value: listing.project?.name },
                isHouse && { label: 'Bedrooms',  value: listing.bedrooms },
                isHouse && { label: 'Bathrooms', value: listing.bathrooms },
                isHouse && { label: 'Storeys',   value: listing.storeys },
                isHouse && listing.areaSqft && {
                  label: 'Floor Area', value: `${Number(listing.areaSqft).toLocaleString()} sqft`,
                },
                !isHouse && listing.landAreaPerches && {
                  label: 'Land Area', value: `${listing.landAreaPerches} perches`,
                },
                !isHouse && { label: 'Land Type',     value: listing.landType },
                !isHouse && { label: 'Road Frontage', value: listing.roadFrontage },
              ].filter(Boolean).map(({ label, value }) => value != null && (
                <div key={label}
                  className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[55%]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SpecCard({ icon: Icon, label, value }) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-gold-500" />
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  )
}
