import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import {
  MapPin, Phone, Mail, Clock, CheckCircle,
  Facebook, Instagram, Linkedin, Twitter, ArrowRight,
} from 'lucide-react'
import api from '../../../lib/api'
import PageHero from '../../../components/ui/PageHero'

export default function ContactPage() {
  const [searchParams]  = useSearchParams()
  const apartmentId     = searchParams.get('apartmentId')

  const { data: projects } = useQuery({
    queryKey: ['projects-public'],
    queryFn: () => api.get('/projects', { params: { limit: 50 } }).then(r => r.data.data),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { apartmentId: apartmentId || '' },
  })

  const mutation = useMutation({
    mutationFn: (data) => api.post('/inquiries', data),
    onSuccess: () => reset(),
  })

  return (
    <div>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Get in touch with our team for any inquiries."
        backgroundImage="/images/hero-contact.jpg"
        breadcrumb="Home › Contact"
      />

      <div className="container-site py-14">
        <div className="grid lg:grid-cols-2 gap-14">

          {/* ── Office info ── */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-1">Our Office</h2>
              <p className="text-gray-500">Visit us or reach us through any of the channels below.</p>
            </div>

            <div className="space-y-5">
              {[
                { icon: MapPin, label: 'Address',
                  value: 'No. 125 Main Street\nColombo 03, Sri Lanka' },
                { icon: Phone, label: 'Phone',
                  value: '+94 11 234 5678\n+94 77 123 4567' },
                { icon: Mail, label: 'Email',
                  value: 'info@novanest.lk\ninquiries@novanest.lk' },
                { icon: Clock, label: 'Office Hours',
                  value: 'Mon–Fri: 9:00 AM – 6:00 PM\nSat: 9:00 AM – 1:00 PM' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook,  href: '#' },
                  { Icon: Instagram, href: '#' },
                  { Icon: Linkedin,  href: '#' },
                  { Icon: Twitter,   href: '#' },
                ].map(({ Icon, href }, i) => (
                  <a key={i} href={href} target="_blank" rel="noreferrer"
                    className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center
                               text-white/60 hover:text-white hover:bg-gold-500 transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a href="https://wa.me/94112345678" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-500 text-white
                         rounded-xl hover:bg-emerald-600 transition-colors font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* ── Contact form ── */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-1">Send Us a Message</h2>
            <p className="text-gray-500 text-sm mb-6">
              Fill in the form below and our team will respond within 24 hours.
            </p>

            {mutation.isSuccess ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">
                  Thank you for your inquiry. We'll get back to you shortly.
                </p>
                <button onClick={() => mutation.reset()}
                  className="btn-outline-gold mt-6">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
                {mutation.isError && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">
                    {mutation.error?.response?.data?.message || 'Something went wrong. Please try again.'}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="label">Full Name *</label>
                    <input className={`input ${errors.customerName ? 'border-red-400' : ''}`}
                      placeholder="Your full name"
                      {...register('customerName', { required: 'Required' })} />
                    {errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName.message}</p>}
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input type="email" className={`input ${errors.email ? 'border-red-400' : ''}`}
                      placeholder="your@email.com"
                      {...register('email', { required: 'Required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input className={`input ${errors.phone ? 'border-red-400' : ''}`}
                      placeholder="+94 77 000 0000"
                      {...register('phone', { required: 'Required' })} />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="label">Project of Interest</label>
                    <select className="input" {...register('projectId')}>
                      <option value="">— Select a project (optional) —</option>
                      {(projects || []).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="label">Message *</label>
                    <textarea className={`input resize-none ${errors.message ? 'border-red-400' : ''}`}
                      rows={4} placeholder="Tell us about your requirements..."
                      {...register('message', { required: 'Required' })} />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="btn-primary w-full justify-center py-3 text-base">
                  {isSubmitting
                    ? <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    : <>Send Message <ArrowRight className="w-4 h-4" /></>
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
