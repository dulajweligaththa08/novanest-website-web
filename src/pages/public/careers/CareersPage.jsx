import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Search, MapPin, Clock, ArrowRight, Briefcase, ChevronDown, X } from 'lucide-react'
import api from '../../../lib/api'
import PageHero from '../../../components/ui/PageHero'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'

const DEPARTMENTS = [
  'All Departments', 'Architecture', 'Engineering', 'Sales', 'Finance',
  'Marketing', 'Legal', 'Technology', 'Operations', 'Management',
]

export default function CareersPage() {
  const [dept,     setDept]     = useState('All Departments')
  const [search,   setSearch]   = useState('')
  const [applying, setApplying] = useState(null) // job object

  const { data, isLoading } = useQuery({
    queryKey: ['jobs-public'],
    queryFn: () => api.get('/careers').then(r => r.data.data),
  })

  const jobs = (data || []).filter(j => {
    const matchDept   = dept === 'All Departments' || j.department === dept
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase())
    return matchDept && matchSearch
  })

  return (
    <div>
      <PageHero
        title="Careers"
        subtitle="Build places. Build communities. Build your career."
        backgroundImage="/images/hero-careers.jpg"
        breadcrumb="Home › Careers"
      />

      <div className="container-site py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-60 flex-shrink-0 space-y-5">
            {/* Search */}
            <div className="card p-4">
              <label className="label">Search Jobs</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className="input pl-9" placeholder="Job title..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>

            {/* Departments */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Departments</h3>
              <div className="space-y-1">
                {DEPARTMENTS.map(d => (
                  <button key={d} onClick={() => setDept(d)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                      ${dept === d
                        ? 'bg-navy-900 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-navy-900'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Jobs ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-navy-900">Featured Jobs</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {jobs.length} position{jobs.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            {isLoading ? <LoadingSpinner /> : jobs.length ? (
              <div className="space-y-4">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} onApply={() => setApplying(job)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No positions found matching your criteria.</p>
                <button onClick={() => { setDept('All Departments'); setSearch('') }}
                  className="btn-outline-gold mt-4">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply modal */}
      {applying && (
        <ApplicationModal job={applying} onClose={() => setApplying(null)} />
      )}
    </div>
  )
}

function JobCard({ job, onApply }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-semibold bg-navy-900/10 text-navy-900 px-2 py-0.5 rounded-full">
                {job.department}
              </span>
              <span className="text-xs text-gray-400">· {job.type}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.type}</span>
            </div>
          </div>
          <button onClick={onApply} className="btn-primary text-sm flex-shrink-0">
            Apply Now
          </button>
        </div>

        <button onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1 text-sm text-gold-600 hover:text-gold-700 mt-3 font-medium">
          {open ? 'Hide details' : 'View details'}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
            {job.requirements && (
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Requirements</p>
                <p className="text-sm text-gray-600 leading-relaxed">{job.requirements}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ApplicationModal({ job, onClose }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  const mutation = useMutation({
    mutationFn: (data) => api.post(`/careers/${job.id}/apply`, data),
    onSuccess: () => { reset(); setTimeout(onClose, 2000) },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">Apply for Position</h3>
            <p className="text-sm text-gold-600">{job.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {mutation.isSuccess ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="font-semibold text-gray-900">Application submitted!</p>
              <p className="text-sm text-gray-500 mt-1">We'll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
              {mutation.isError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">
                  {mutation.error?.response?.data?.message || 'Something went wrong.'}
                </div>
              )}
              <div>
                <label className="label">Full Name *</label>
                <input className={`input ${errors.fullName ? 'border-red-400' : ''}`}
                  placeholder="Your full name"
                  {...register('fullName', { required: 'Required' })} />
              </div>
              <div>
                <label className="label">Email *</label>
                <input type="email" className={`input ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="your@email.com"
                  {...register('email', { required: 'Required' })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" placeholder="+94 77 000 0000" {...register('phone')} />
              </div>
              <div>
                <label className="label">Cover Letter</label>
                <textarea className="input resize-none" rows={4}
                  placeholder="Why are you the right fit for this role?"
                  {...register('coverLetter')} />
              </div>
              <div>
                <label className="label">CV / Portfolio URL</label>
                <input className="input" placeholder="https://drive.google.com/..."
                  {...register('cvUrl')} />
              </div>
              <button type="submit" disabled={isSubmitting}
                className="btn-primary w-full justify-center">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
