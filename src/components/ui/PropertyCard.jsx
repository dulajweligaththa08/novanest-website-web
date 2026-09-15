import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Maximize2, Heart } from 'lucide-react'

const STATUS_BADGE = {
  AVAILABLE:   'badge-available',
  RESERVED:    'badge-reserved',
  SOLD:        'badge-sold',
  UNAVAILABLE: 'bg-gray-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full',
}

export default function PropertyCard({ apartment }) {
  const project  = apartment?.floor?.building?.project
  const imgUrl   = apartment?.gallery?.[0]?.imageUrl || project?.mainImage
  const status   = apartment?.status || 'AVAILABLE'

  return (
    <div className="card-hover group overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={`Unit ${apartment.unitNumber}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
            <span className="text-white/30 text-4xl font-bold">N</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3">
          <span className={STATUS_BADGE[status]}>{status}</span>
        </div>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
                           flex items-center justify-center text-gray-400 hover:text-red-500
                           transition-colors shadow-sm">
          <Heart className="w-4 h-4" />
        </button>

        {/* Project name overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 px-3 py-2">
          <p className="text-white text-xs font-medium truncate">{project?.name}</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-base">Unit {apartment.unitNumber}</h3>
          {apartment.price && (
            <p className="text-gold-600 font-bold text-sm flex-shrink-0">
              LKR {formatPrice(apartment.price)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{project?.location || 'Colombo'}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-gray-400" />
            {apartment.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-gray-400" />
            {apartment.bathrooms} Baths
          </span>
          {apartment.areaSqft && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              {Number(apartment.areaSqft).toLocaleString()} sqft
            </span>
          )}
        </div>

        <Link
          to={`/apartments/${apartment.id}`}
          className="btn-outline-gold w-full justify-center text-sm py-2"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}

function formatPrice(price) {
  const n = Number(price)
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return n.toLocaleString()
}
