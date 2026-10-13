import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Maximize2, Layers, Heart } from 'lucide-react'

const STATUS_BADGE = {
  AVAILABLE:   'badge-available',
  RESERVED:    'badge-reserved',
  SOLD:        'badge-sold',
  UNAVAILABLE: 'bg-gray-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full',
}

export default function ListingCard({ listing }) {
  const imgUrl  = listing?.mainImage || listing?.gallery?.[0]?.imageUrl
  const status  = listing?.status || 'AVAILABLE'
  const isHouse = listing?.listingType === 'HOUSE'

  return (
    <div className="card-hover group overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden h-52 rounded-t-2xl">
        {imgUrl ? (
          <motion.img
            src={imgUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
            <span className="text-5xl opacity-30">{isHouse ? '' : ''}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={STATUS_BADGE[status]}>{status}</span>
          <span className="bg-navy-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
            {isHouse ? ' House' : ' Land'}
          </span>
        </div>

        {/* Wishlist */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
                     flex items-center justify-center text-gray-400 hover:text-red-500
                     transition-colors shadow-sm"
        >
          <Heart className="w-4 h-4" />
        </motion.button>

        {/* Project overlay */}
        {listing.project && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 px-3 py-2">
            <p className="text-white text-xs font-medium truncate">{listing.project.name}</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">
            {listing.title}
          </h3>
          {listing.price && (
            <p className="text-gold-600 font-bold text-sm flex-shrink-0">
              LKR {formatPrice(listing.price)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{listing.location}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center flex-wrap gap-3 text-xs text-gray-600 mb-4 border-t border-gray-100 pt-3">
          {isHouse ? (
            <>
              {listing.bedrooms != null && (
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-gray-400" /> {listing.bedrooms} Beds
                </span>
              )}
              {listing.bathrooms != null && (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-gray-400" /> {listing.bathrooms} Baths
                </span>
              )}
              {listing.storeys != null && (
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-gray-400" />
                  {listing.storeys} {listing.storeys === 1 ? 'Storey' : 'Storeys'}
                </span>
              )}
              {listing.areaSqft && (
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
                  {Number(listing.areaSqft).toLocaleString()} sqft
                </span>
              )}
            </>
          ) : (
            <>
              {listing.landAreaPerches != null && (
                <span className="flex items-center gap-1">
                  {Number(listing.landAreaPerches)} perches
                </span>
              )}
              {listing.landAreaAcres != null && (
                <span className="text-gray-500">
                  ({Number(listing.landAreaAcres)} acres)
                </span>
              )}
              {listing.landType && (
                <span className="text-gray-500">{listing.landType}</span>
              )}
              {listing.roadFrontage && (
                <span className="text-gray-500 truncate">{listing.roadFrontage}</span>
              )}
            </>
          )}
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Link
            to={`/listings/${listing.id}`}
            className="btn-outline-gold w-full justify-center text-sm py-2"
          >
            View Details →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function formatPrice(price) {
  const n = Number(price)
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000)    return `${(n / 1000).toFixed(0)}K`
  return n.toLocaleString()
}
