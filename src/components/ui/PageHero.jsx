/**
 * Reusable dark-navy hero banner used on interior pages
 * (Properties, About, Careers, News, Contact)
 */
export default function PageHero({ title, subtitle, backgroundImage, breadcrumb, children }) {
  return (
    <div className="relative min-h-[280px] lg:min-h-[340px] flex items-end bg-navy-900 overflow-hidden">
      {/* Background image */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-900/60" />

      {/* Gold accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-transparent" />

      <div className="relative container-site pb-10 pt-32 lg:pt-36">
        {/* Breadcrumb */}
        {breadcrumb && (
          <p className="text-white/50 text-xs mb-2 tracking-wide">{breadcrumb}</p>
        )}
        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-white/70 mt-3 text-base max-w-xl">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  )
}
