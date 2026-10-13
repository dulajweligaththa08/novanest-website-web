import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  User, Phone, Mail, Lock, CheckCircle,
  MapPin, CreditCard, Home, ArrowRight,
  ClipboardList, Layers, Building2,
} from 'lucide-react'
import { useState } from 'react'
import api from '../../../lib/api'
import { formatDate } from '../../../lib/utils'

// ─── Phone update form ────────────────────────────────────────────────────────
function PhoneForm({ profile, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm({ defaultValues: { phone: profile?.phone || '' } })

  const mutation = useMutation({
    mutationFn: (data) => api.put('/customer/profile', data),
    onSuccess,
  })

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {mutation.isSuccess && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> Profile updated.
        </div>
      )}
      {mutation.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {mutation.error?.response?.data?.message || 'Something went wrong.'}
        </div>
      )}
      <div>
        <label className="label">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="+94 77 000 0000" {...register('phone')} />
        </div>
      </div>
      <button type="submit" disabled={isSubmitting || !isDirty} className="btn-primary">
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}

// ─── Password change form ─────────────────────────────────────────────────────
function PasswordForm() {
  const [success, setSuccess] = useState(false)
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm()

  const mutation = useMutation({
    mutationFn: (data) => api.post('/auth/change-password', data),
    onSuccess: () => { setSuccess(true); reset(); setTimeout(() => setSuccess(false), 4000) },
  })

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {success && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> Password changed successfully.
        </div>
      )}
      {mutation.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {mutation.error?.response?.data?.message || 'Something went wrong.'}
        </div>
      )}
      <div>
        <label className="label">Current Password</label>
        <input type="password" className={`input ${errors.currentPassword ? 'border-red-400' : ''}`}
          placeholder="••••••••"
          {...register('currentPassword', { required: 'Required' })} />
        {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>}
      </div>
      <div>
        <label className="label">New Password</label>
        <input type="password" className={`input ${errors.newPassword ? 'border-red-400' : ''}`}
          placeholder="Minimum 8 characters"
          {...register('newPassword', { required: 'Required', minLength: { value: 8, message: 'Must be at least 8 characters' } })} />
        {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
      </div>
      <div>
        <label className="label">Confirm New Password</label>
        <input type="password" className={`input ${errors.confirmPassword ? 'border-red-400' : ''}`}
          placeholder="••••••••"
          {...register('confirmPassword', {
            required: 'Required',
            validate: (v) => v === watch('newPassword') || 'Passwords do not match',
          })} />
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? 'Updating...' : 'Change Password'}
      </button>
    </form>
  )
}

// ─── Purchase Process section (per assignment) ────────────────────────────────
function PurchaseProcessSection({ assignments }) {
  const hasProcess = assignments.some(a => a.nextSteps || a.purchaseProcess)
  if (!hasProcess) return null

  return (
    <div className="space-y-4">
      {assignments.map((a) => {
        if (!a.nextSteps && !a.purchaseProcess) return null
        const apt     = a.apartment
        const project = apt?.floor?.building?.project

        return (
          <div key={a.id} className="card overflow-hidden">
            {/* Property header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-navy-900/3">
              <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center flex-shrink-0">
                <Home className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {apt?.propertyType === 'LAND'
                    ? apt?.unitNumber
                    : `Unit ${apt?.unitNumber}`}
                </p>
                <p className="text-xs text-gray-500">
                  {project?.name}
                  {apt?.floor?.building?.name ? ` · ${apt.floor.building.name}` : ''}
                  {apt?.floor?.floorNumber != null ? ` · Floor ${apt.floor.floorNumber}` : ''}
                </p>
              </div>
              {a.bookingDate && (
                <div className="ml-auto text-right">
                  <p className="text-xs text-gray-400">Booking date</p>
                  <p className="text-xs font-medium text-gray-700">{formatDate(a.bookingDate)}</p>
                </div>
              )}
            </div>

            <div className="p-5 space-y-5">
              {/* Next Steps */}
              {a.nextSteps && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-navy-900 mb-3">
                    <ArrowRight className="w-4 h-4 text-gold-500" />
                    Your Next Steps
                  </h4>
                  <div
                    className="p-4 bg-gold-50 border border-gold-200 rounded-xl text-sm text-gray-800
                               leading-relaxed whitespace-pre-line"
                  >
                    {a.nextSteps}
                  </div>
                </div>
              )}

              {/* Purchase Process */}
              {a.purchaseProcess && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-navy-900 mb-3">
                    <ClipboardList className="w-4 h-4 text-gold-500" />
                    Purchase Process Overview
                  </h4>
                  <div
                    className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700
                               leading-relaxed whitespace-pre-line"
                  >
                    {a.purchaseProcess}
                  </div>
                </div>
              )}

              {/* Agreed price */}
              {a.agreedPrice && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" /> Agreed Price
                  </span>
                  <span className="font-bold text-gold-600">
                    LKR {Number(a.agreedPrice).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main ProfilePage ─────────────────────────────────────────────────────────
export default function ProfilePage() {
  const qc = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => api.get('/customer/profile').then((r) => r.data.data),
  })

  const assignments = profile?.customerApartments || []
  const hasProcess  = assignments.some(a => a.nextSteps || a.purchaseProcess)

  if (isLoading) return <ProfileSkeleton />

  return (
    <div className="max-w-xl space-y-6">

      {/* ── Avatar + name ── */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-navy-900 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-2xl font-bold">
            {profile?.fullName?.[0]?.toUpperCase() || 'C'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900">{profile?.fullName}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
            <Mail className="w-3.5 h-3.5" /> {profile?.user?.email}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Member since {formatDate(profile?.user?.createdAt)}
          </p>
        </div>
      </div>

      {/* ── Personal details (read-only admin-managed fields) ── */}
      {(profile?.nationalId || profile?.address) && (
        <div className="card p-5 space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-2">
            Personal Details
          </h3>
          {profile.nationalId && (
            <div className="flex items-center justify-between text-sm py-1">
              <span className="flex items-center gap-2 text-gray-500">
                <CreditCard className="w-3.5 h-3.5" /> National ID / Passport
              </span>
              <span className="font-medium text-gray-900">{profile.nationalId}</span>
            </div>
          )}
          {profile.address && (
            <div className="flex items-start justify-between text-sm py-1">
              <span className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-3.5 h-3.5 mt-0.5" /> Address
              </span>
              <span className="font-medium text-gray-900 text-right max-w-[60%]">{profile.address}</span>
            </div>
          )}
          <p className="text-xs text-gray-400 pt-1">
            To update these details, please contact NovaNest.
          </p>
        </div>
      )}

      {/* ── Update phone ── */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-gold-500" /> Contact Information
        </h3>
        <PhoneForm
          profile={profile}
          onSuccess={() => qc.invalidateQueries({ queryKey: ['my-profile'] })}
        />
      </div>

      {/* ── My Purchase Process ── */}
      {hasProcess && (
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 px-1">
            <ClipboardList className="w-5 h-5 text-gold-500" />
            My Purchase Process
          </h3>
          <p className="text-sm text-gray-500 px-1">
            Details about your property purchase and the next steps provided by NovaNest.
          </p>
          <PurchaseProcessSection assignments={assignments} />
        </div>
      )}

      {/* ── Change password ── */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-gold-500" /> Change Password
        </h3>
        <PasswordForm />
      </div>

    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="max-w-xl space-y-6 animate-pulse">
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <div className="card p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-9 bg-gray-200 rounded w-28" />
      </div>
      <div className="card p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-9 bg-gray-200 rounded w-36" />
      </div>
    </div>
  )
}
