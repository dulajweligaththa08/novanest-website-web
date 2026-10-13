import { useState } from 'react'
import {
  Layers, Compass, Home, Check, Info, ArrowRight, Sparkles, Building2
} from 'lucide-react'

export default function GeneratedMasterFloorPlan({ floor, buildingName, onUnitSelect }) {
  const [selectedUnitId, setSelectedUnitId] = useState(null)
  const [viewMode, setViewMode] = useState('diagram') // 'diagram' | 'image'

  if (!floor) return null

  const apartments = floor.apartments || []
  const totalArea = apartments.reduce((acc, a) => acc + (Number(a.areaSqft) || 0), 0)
  const availableCount = apartments.filter(a => a.status === 'AVAILABLE').length
  const reservedCount = apartments.filter(a => a.status === 'RESERVED').length
  const soldCount = apartments.filter(a => a.status === 'SOLD').length

  const selectedUnit = apartments.find(a => a.id === selectedUnitId) || apartments[0]

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header bar */}
      <div className="bg-navy-900/5 p-5 rounded-2xl border border-navy-900/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gold-600 uppercase tracking-wide">
            {buildingName || 'Building'} · Floor {floor.floorNumber}
          </span>
          <h3 className="text-xl font-bold text-navy-900">Floor {floor.floorNumber} Master Plan</h3>
          {floor.description && <p className="text-sm text-gray-600 mt-0.5">{floor.description}</p>}
        </div>

        <div className="flex items-center gap-2">
          {floor.planImageUrl && (
            <div className="flex bg-gray-200 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setViewMode('diagram')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'diagram' ? 'bg-navy-900 text-white shadow' : 'text-gray-700'}`}>
                Auto Floor Plan
              </button>
              <button
                onClick={() => setViewMode('image')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'image' ? 'bg-navy-900 text-white shadow' : 'text-gray-700'}`}>
                Uploaded Blueprint
              </button>
            </div>
          )}
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-navy-900 text-white">
            {apartments.length} {apartments.length === 1 ? 'Unit' : 'Units'} on this Floor
          </span>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Floor Area</p>
          <p className="text-base font-bold text-navy-900">{totalArea ? `${totalArea.toLocaleString()} sqft` : '—'}</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
          <p className="text-xs text-emerald-700 font-medium">Available Units</p>
          <p className="text-base font-bold text-emerald-800">{availableCount}</p>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 shadow-sm">
          <p className="text-xs text-amber-700 font-medium">Reserved Units</p>
          <p className="text-base font-bold text-amber-800">{reservedCount}</p>
        </div>
        <div className="p-3 bg-red-50 rounded-xl border border-red-100 shadow-sm">
          <p className="text-xs text-red-700 font-medium">Sold Units</p>
          <p className="text-base font-bold text-red-800">{soldCount}</p>
        </div>
      </div>

      {/* Content view */}
      {viewMode === 'image' && floor.planImageUrl ? (
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white p-4 text-center">
          <img src={floor.planImageUrl} alt={`Floor ${floor.floorNumber} Blueprint`} className="max-h-[500px] w-full object-contain mx-auto" />
        </div>
      ) : apartments.length > 0 ? (
        <div className="space-y-6">
          {/* Architectural Layout Blueprint Diagram */}
          <div className="bg-navy-950 p-4 lg:p-8 rounded-3xl text-white shadow-xl border border-navy-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Compass className="w-64 h-64 text-gold-400" />
            </div>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <span className="font-bold text-sm tracking-wide uppercase text-gold-400">
                  Architectural Layout · Floor {floor.floorNumber}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Reserved</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Sold</span>
              </div>
            </div>

            {/* Central Corridor & Room Layout Grid */}
            <div className="space-y-6">
              {/* Central Building Services Core */}
              <div className="bg-navy-900/90 border border-white/15 p-3 rounded-xl flex flex-wrap items-center justify-around gap-2 text-center text-xs text-white/70">
                <span className="flex items-center gap-1 font-semibold text-gold-300">🛗 Elevator Lobby</span>
                <span className="hidden sm:block text-white/20">|</span>
                <span className="flex items-center gap-1 font-semibold text-gold-300">🚪 Main Corridor</span>
                <span className="hidden sm:block text-white/20">|</span>
                <span className="flex items-center gap-1 font-semibold text-gold-300">🪜 Fire Escape</span>
              </div>

              {/* Apartment Room Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {apartments.map((apt) => {
                  const isSelected = selectedUnit?.id === apt.id
                  const statusBg =
                    apt.status === 'AVAILABLE' ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200' :
                    apt.status === 'RESERVED' ? 'border-amber-500/50 bg-amber-950/30 text-amber-200' :
                    'border-rose-500/50 bg-rose-950/30 text-rose-200 shadow-none'

                  const badgeClass =
                    apt.status === 'AVAILABLE' ? 'bg-emerald-500 text-white' :
                    apt.status === 'RESERVED' ? 'bg-amber-500 text-white' :
                    'bg-rose-500 text-white'

                  return (
                    <button
                      key={apt.id}
                      onClick={() => setSelectedUnitId(apt.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative group cursor-pointer
                        ${statusBg} ${isSelected ? 'ring-2 ring-gold-400 scale-[1.02] shadow-lg' : 'hover:scale-[1.01]'}`}
                    >                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-base">Unit {apt.unitNumber}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeClass}`}>
                          {apt.status}
                        </span>
                      </div>
                      
                      <p className="text-xs text-white/70 font-medium">
                        {apt.bedrooms} Bed · {apt.bathrooms} Bath · {apt.areaSqft ? `${apt.areaSqft} sqft` : 'Standard'}
                      </p>

                      {apt.apartmentType?.name && (
                        <p className="text-[11px] text-gold-300/80 mt-1 font-mono">{apt.apartmentType.name}</p>
                      )}

                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="font-bold text-gold-400">
                          {apt.price ? `LKR ${Number(apt.price).toLocaleString()}` : 'Price on request'}
                        </span>
                        <span className="text-[11px] text-white/50 group-hover:text-white transition-colors">Select ›</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Selected Unit Details Card */}
          {selectedUnit && (
            <div className="bg-white p-6 rounded-2xl border border-gold-500/30 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <span className="text-xs font-semibold text-gold-600 uppercase tracking-wider">Selected Unit</span>
                  <h4 className="text-lg font-bold text-navy-900">Unit {selectedUnit.unitNumber} ({selectedUnit.apartmentType?.name || 'Apartment'})</h4>
                </div>
                <div className="sm:text-right">
                  <span className="text-xl font-extrabold text-navy-900">
                    {selectedUnit.price ? `LKR ${Number(selectedUnit.price).toLocaleString()}` : 'Price on Enquiry'}
                  </span>
                  <p className="text-xs text-gray-500">Floor {floor.floorNumber} · {buildingName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Bedrooms</p>
                  <p className="font-bold text-navy-900 text-sm">{selectedUnit.bedrooms} Beds</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Bathrooms</p>
                  <p className="font-bold text-navy-900 text-sm">{selectedUnit.bathrooms} Baths</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Floor Area</p>
                  <p className="font-bold text-navy-900 text-sm">{selectedUnit.areaSqft ? `${selectedUnit.areaSqft} sqft` : '—'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400">Status</p>
                  <p className={`font-bold text-sm ${selectedUnit.status === 'AVAILABLE' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedUnit.status}
                  </p>
                </div>
              </div>

              {selectedUnit.description && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">{selectedUnit.description}</p>
              )}

              {selectedUnit.status === 'AVAILABLE' && (
                <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                  {/* View Floor Plan — triggers parent to switch to Floor Plans tab for this unit */}
                  {onUnitSelect && selectedUnit.floorPlans?.length > 0 && (
                    <button
                      onClick={() => onUnitSelect(selectedUnit, 'floor-plans')}
                      className="btn-outline-gold text-sm"
                    >
                      View Floor Plan
                    </button>
                  )}
                  {/* Enquire — triggers parent to open inline inquiry modal pre-filled with this unit */}
                  <button
                    onClick={() => onUnitSelect
                      ? onUnitSelect(selectedUnit, 'enquire')
                      : null}
                    className="btn-primary text-sm"
                  >
                    Enquire About Unit {selectedUnit.unitNumber} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center bg-gray-50">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-navy-900">No Apartments Added to Floor {floor.floorNumber} Yet</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
            Add apartment units to Floor {floor.floorNumber} in the Admin Panel to automatically generate the Master Floor Plan layout diagram.
          </p>
        </div>
      )}
    </div>
  )
}
