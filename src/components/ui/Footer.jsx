import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

const footerLinks = {
  Properties: [
    { label: 'All Properties', to: '/properties' },
    { label: 'Projects',       to: '/projects' },
    { label: 'Floor Plans',    to: '/properties' },
    { label: 'Availability',   to: '/properties' },
  ],
  Company: [
    { label: 'About Us',  to: '/about' },
    { label: 'Careers',   to: '/careers' },
    { label: 'News',      to: '/news' },
    { label: 'Contact',   to: '/contact' },
  ],
  'Customer': [
    { label: 'My Portal',    to: '/portal' },
    { label: 'Login',        to: '/portal/login' },
    { label: 'My Apartment', to: '/portal/apartment' },
    { label: 'Documents',    to: '/portal/documents' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src="/images/1logo.png" alt="NovaNest" className="h-9 w-auto" />
              <span className="text-white font-bold text-lg">NovaNest</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Discover premium living spaces designed for a brighter tomorrow.
              Modern homes, world-class amenities, and unmatched lifestyle.
            </p>
            <p className="mt-4 text-gold-500 font-semibold text-sm italic">
              Live Smart. Live Better. Live NovaNest.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { Icon: Facebook,  href: '#' },
                { Icon: Twitter,   href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Linkedin,  href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center
                             text-white/60 hover:bg-gold-500 hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">{title}</h4>
              <ul className="space-y-2.5">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to}
                      className="text-white/55 hover:text-gold-400 text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} NovaNest Properties. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-white/40 hover:text-white/70 text-xs transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="text-white/40 hover:text-white/70 text-xs transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
