import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, ArrowRight, Building2 } from 'lucide-react'
import api from '../../../lib/api'
import PageHero from '../../../components/ui/PageHero'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'

export default function ProjectsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects-public'],
    queryFn: () => api.get('/projects', { params: { limit: 20 } }).then(r => r.data.data),
  })

  return (
    <div>
      <PageHero
        title="Our Projects"
        subtitle="Explore our portfolio of iconic residential developments across Sri Lanka."
        backgroundImage="/images/hero-projects.jpg"
        breadcrumb="Home › Projects"
      />
      <div className="container-site py-14">
        {isLoading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data || []).map(p => (
              <Link key={p.id} to={`/projects/${p.slug}`}
                className="card-hover group overflow-hidden block">
                <div className="relative h-56 overflow-hidden">
                  {p.mainImage ? (
                    <img src={p.mainImage} alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-navy-900 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full
                    ${p.status === 'COMPLETED' ? 'bg-blue-500 text-white'
                    : p.status === 'ONGOING' ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white'}`}>
                    {p.status}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-gold-600 transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5" /> {p.location}
                  </div>
                  {p.startingPrice && (
                    <p className="text-gold-600 font-bold text-sm mb-3">
                      From LKR {Number(p.startingPrice).toLocaleString()}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 text-navy-700 text-sm font-medium
                                   group-hover:text-gold-600 transition-colors">
                    View Project <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
            {!data?.length && !isLoading && (
              <p className="col-span-3 text-center text-gray-400 py-20">No projects available yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
