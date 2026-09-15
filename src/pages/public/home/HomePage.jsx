import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  MapPin, Bed, Bath, Maximize2, ArrowRight,
  Award, Building2, Users, MapPinned,
  ShieldCheck, Leaf, Lightbulb, Heart,
} from 'lucide-react'
import api from '../../../lib/api'
import PropertyCard from '../../../components/ui/PropertyCard'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'

/* ─── Stats bar ─────────────────────────────────────────────────────────── */
const STATS = [
  { value: '12+',    label: 'Years of Excellence', icon: Award },
  { value: '8',      label: 'Completed Projects',  icon: Building2 },
  { value: '3,500+', label: 'Happy Residents',      icon: Users },
  { value: '5',      label: 'Prime Locations',      icon: MapPinned },
]

/* ─── Values ─────────────────────────────────────────────────────────────── */
const VALUES = [
  { icon: ShieldCheck, title: 'Excellence',   desc: 'Uncompromising quality in every detail of our developments.' },
  { icon: Heart,       title: 'Integrity',    desc: 'Honest, transparent dealings with every customer and partner.' },
  { icon: Lightbulb,   title: 'Innovation',   desc: 'Forward-thinking design that sets the standard for modern living.' },
  { icon: Leaf,        title: 'Sustainability',desc: 'Building a greener future through responsible development.' },
]

export default function HomePage() {
  /* Featured projects */
  const { data: projectsData } = useQuery({
    queryKey: ['projects-public'],
    queryFn: () => api.get('/projects', { params: { limit: 6 } }).then(r => r.data),
  })

  /* Featured apartments */
  const { data: aptData } = useQuery({
    queryKey: ['apartments-featured'],
    queryFn: () => api.get('/apartments', { params: { limit: 6, status: 'AVAILABLE' } }).then(r => r.data),
  })

  const projects   = projectsData?.data  || []
  const apartments = aptData?.data || []
  const featured   = projects[0]

  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
        {/* Background image */}
      {/* Background image — always uses hero-home.jpg */}
        <img
          src="/images/hero-home.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
          onError={e => e.target.style.display = 'none'}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/75 to-transparent" />

        {/* Gold radial glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96
                        rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

        <div className="relative container-site pt-28 pb-16 lg:pt-36 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — copy */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest
                               text-gold-400 uppercase mb-4">
                <span className="w-8 h-px bg-gold-500" />
                Premium Living in Sri Lanka
              </span>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6">
                Live Smart.<br />
                Live Better.<br />
                <span className="text-gold-500">Live NovaNest.</span>
              </h1>

              <p className="text-white/70 text-lg leading-relaxed max-w-lg mb-8">
                Discover premium living spaces designed for a brighter tomorrow.
                Modern homes, world-class amenities, and unmatched lifestyle.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/properties" className="btn-primary-lg">
                  Explore Properties <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/contact" className="btn-secondary">
                  Send Inquiry
                </Link>
              </div>
            </div>

            {/* Right — featured project card */}
            {featured && (
              <div className="hidden lg:flex justify-end pr-8 translate-x-16">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-1 shadow-2xl w-72">
                  {featured.mainImage && (
                    <img src={featured.mainImage} alt={featured.name}
                      className="w-full h-36 object-cover rounded-xl mb-3" />
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-semibold">
                        {featured.status}
                      </span>
                      <span className="text-white/60 text-xs">Featured Project</span>
                    </div>
                    <h3 className="text-white font-bold text-base">{featured.name}</h3>
                    <div className="flex items-center gap-1 text-white/60 text-xs mt-1">
                      <MapPin className="w-3 h-3" /> {featured.location}
                    </div>
                    {featured.startingPrice && (
                      <p className="text-gold-400 font-bold text-sm mt-1.5">
                        From LKR {Number(featured.startingPrice).toLocaleString()}
                      </p>
                    )}
                    <Link to={`/projects/${featured.slug}`}
                      className="btn-primary w-full justify-center mt-3 text-sm py-2">
                      Explore Project
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-0 bg-white/10
                          backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="stat-item text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-gold-400" />
                  <span className="text-2xl font-bold text-white">{value}</span>
                </div>
                <p className="text-white/60 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ─────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section className="section bg-gray-50">
          <div className="container-site">
            <SectionHeader
              label="Our Projects"
              title="Iconic Developments Across Sri Lanka"
              subtitle="Explore our portfolio of premium residential projects crafted for exceptional living."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/projects" className="btn-outline-gold">
                View All Projects <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── AVAILABLE APARTMENTS ──────────────────────────────────────────── */}
      {apartments.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <SectionHeader
              label="Available Units"
              title="Find Your Perfect Home"
              subtitle="Browse our available apartments and find the space that fits your lifestyle."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map((apt) => (
                <PropertyCard key={apt.id} apartment={apt} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/properties" className="btn-outline-gold">
                Browse All Properties <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────── */}
      <section className="section bg-navy-900">
        <div className="container-site">
          <SectionHeader
            label="Why NovaNest"
            title="Built on Trust. Designed for Life."
            subtitle="We believe every family deserves a home that inspires. That belief drives everything we do."
            light
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10
                           hover:border-gold-500/40 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center mb-4
                                group-hover:bg-gold-500 transition-colors">
                  <Icon className="w-5 h-5 text-gold-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="section-sm bg-gold-500">
        <div className="container-site text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Our team is ready to help you find the perfect apartment.
            Schedule a viewing or send us an inquiry today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/properties" className="btn-white">
              Browse Properties
            </Link>
            <Link to="/contact"
              className="btn-secondary border-white/60 hover:bg-white/20">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

/* ── Helper components ───────────────────────────────────────────────────── */

function SectionHeader({ label, title, subtitle, light = false }) {
  return (
    <div className="text-center mb-10">
      <span className={`inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3
        ${light ? 'text-gold-400' : 'text-gold-600'}`}>
        <span className={`w-6 h-px ${light ? 'bg-gold-500' : 'bg-gold-500'}`} />
        {label}
        <span className={`w-6 h-px ${light ? 'bg-gold-500' : 'bg-gold-500'}`} />
      </span>
      <h2 className={`text-3xl lg:text-4xl font-bold mb-3 ${light ? 'text-white' : 'text-navy-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`max-w-2xl mx-auto text-base ${light ? 'text-white/60' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="card-hover group overflow-hidden block">
      <div className="relative h-52 overflow-hidden">
        {project.mainImage ? (
          <img src={project.mainImage} alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
            ${project.status === 'COMPLETED' ? 'bg-blue-500 text-white'
            : project.status === 'ONGOING' ? 'bg-emerald-500 text-white'
            : 'bg-amber-500 text-white'}`}>
            {project.status}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-gold-600 transition-colors">
          {project.name}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" /> {project.location}
        </div>
        {project.startingPrice && (
          <p className="text-gold-600 font-bold text-sm">
            From LKR {Number(project.startingPrice).toLocaleString()}
          </p>
        )}
      </div>
    </Link>
  )
}
