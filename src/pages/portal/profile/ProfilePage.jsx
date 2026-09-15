import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { User, Phone, Mail, Lock, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import api from '../../../lib/api'
import { formatDate } from '../../../lib/utils'

export default function ProfilePage() {
  const qc = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => api.get('/customer/profile').then((r) => r.data.data),
  })

  if (isLoading) return <ProfileSkeleton />

  return (
    <div className="max-w-xl space-y-6">
      {/* Avatar + name */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-navy-900 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-2xl font-bold">
            {profile?.fullName?.[0]?.toUpperCase() || 'C'}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{profile?.fullName}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
            <Mail className="w-3.5 h-3.5" /> {profile?.user?.email}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Member since {formatDate(profile?.user?.createdAt)}
          </p>
        </div>
      </div>

      {/* Update phone */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-gold-500" /> Contact Information
        </h3>
        <PhoneForm profile={profile} onSuccess={() => qc.invalidateQueries({ queryKey: ['my-profile'] })} />
      </div>

      {/* Change password */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-gold-500" /> Change Password
        </h3>
        <PasswordForm />
      </div>
    </div>
  )
}

// ─── Phone update form ────────────────────────────────────────────────────────

function PhoneForm({ profile, onSuccess }) {
  const { register, handleSubmit, formState: { isSubmitting, isDirty } } = useForm({
    defaultValues: { phone: profile?.phone || '' },
  })

  const mutation = useMutation({
    mutationFn: (data) => api.put('/customer/profile', data),
    onSuccess,
  })

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
      {mutation.isSuccess && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> Profile updated successfully.
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
          <input
            className="input pl-9"
            placeholder="+94 77 000 0000"
            {...register('phone')}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="btn-primary"
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}

// ─── Password change form ─────────────────────────────────────────────────────

function PasswordForm() {
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const mutation = useMutation({
    mutationFn: (data) => api.post('/auth/change-password', data),
    onSuccess: () => {
      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 4000)
    },
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
        <input
          type="password"
          className={`input ${errors.currentPassword ? 'border-red-400' : ''}`}
          placeholder="••••••••"
          {...register('currentPassword', { required: 'Required' })}
        />
        {errors.currentPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <label className="label">New Password</label>
        <input
          type="password"
          className={`input ${errors.newPassword ? 'border-red-400' : ''}`}
          placeholder="Minimum 8 characters"
          {...register('newPassword', {
            required: 'Required',
            minLength: { value: 8, message: 'Must be at least 8 characters' },
          })}
        />
        {errors.newPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label className="label">Confirm New Password</label>
        <input
          type="password"
          className={`input ${errors.confirmPassword ? 'border-red-400' : ''}`}
          placeholder="••••••••"
          {...register('confirmPassword', {
            required: 'Required',
            validate: (val) => val === watch('newPassword') || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? 'Updating...' : 'Change Password'}
      </button>
    </form>
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
