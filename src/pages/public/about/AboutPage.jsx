import { Link } from 'react-router-dom'
import { ShieldCheck, Lightbulb, Heart, Leaf, ArrowRight,
         Award, Building2, Users, MapPinned } from 'lucide-react'
import PageHero from '../../../components/ui/PageHero'

const VALUES = [
  { icon: ShieldCheck, title: 'Excellence',    color: 'bg-gold-500/15 text-gold-500',
    desc: 'Every development we undertake is held to the highest standards of quality and craftsmanship. We believe your home should be nothing short of perfect.' },
  { icon: Heart,       title: 'Integrity',     color: 'bg-blue-500/15 text-blue-500',
    desc: 'We build relationships on trust. Our dealings with customers, partners, and communities are guided by honesty and transparency in every interaction.' },
  { icon: Lightbulb,   title: 'Innovation',    color: 'bg-purple-500/15 text-purple-500',
    desc: 'From architectural design to smart home technology, we constantly push boundaries to deliver living spaces that are ahead of their time.' },
  { icon: Leaf,        title: 'Sustainability', color: 'bg-emerald-500/15 text-emerald-500',
    desc: 'Building responsibly for future generations. We integrate sustainable practices into every project — from materials to energy-efficient design.' },
]

const STATS = [
  { value: '12+',    label: 'Years of Excellence', icon: Award },
  { value: '8',      label: 'Completed Projects',  icon: Building2 },
  { value: '3,500+', label: 'Happy Residents',      icon: Users },
  { value: '5',      label: 'Prime Locations',      icon: MapPinned },
]

const TEAM = [
  { name: 'Rajith Fernando',  role: 'Founder & CEO' },
  { name: 'Amara Perera',     role: 'Chief Architect' },
  { name: 'Dinesh Bandara',   role: 'Head of Sales' },
  { name: 'Sachini Wickrama', role: 'Customer Relations' },
]

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title="About Us"
        subtitle="Building a better tomorrow."
        backgroundImage="/images/hero-about.jpg"
        breadcrumb="Home › About Us"
      />

      {/* ── Our Story ── */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-gold-600 uppercase mb-3">
                <span className="w-6 h-px bg-gold-500" /> Our Story
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-5">
                NovaNest Properties was founded with a vision to redefine premium living in Sri Lanka.
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  What began as a small team with big dreams has grown into one of Sri Lanka's most
                  respected residential property developers. Over the past 12 years, we have delivered
                  8 landmark developments that house over 3,500 families across 5 prime locations.
                </p>
                <p>
                  Our philosophy is simple: every family deserves a home that inspires. A place where
                  design, comfort, and community come together to create something truly extraordinary.
                  That's the NovaNest promise.
                </p>
                <p>
                  From the sweeping skyline views of Colombo to the serene coastal settings of Galle,
                  every NovaNest development is carefully crafted to blend seamlessly with its environment
                  while delivering the very best in modern living.
                </p>
              </div>
              <Link to="/projects" className="btn-outline-gold mt-8 inline-flex">
                View Our Projects <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-5">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label}
                  className="card p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-gold-600" />
                  </div>
                  <p className="text-4xl font-bold text-navy-900 mb-1">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="section bg-gray-50">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-gold-600 uppercase mb-3">
              <span className="w-6 h-px bg-gold-500" /> What We Stand For
              <span className="w-6 h-px bg-gold-500" />
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-900">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section bg-navy-900">
        <div className="container-site text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Be Part of the NovaNest Family?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Find your dream apartment and join thousands of happy residents living the NovaNest lifestyle.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/properties" className="btn-primary-lg">
              Browse Properties <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
