import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SiteNavbar from '../ui/SiteNavbar'
import Footer from '../ui/Footer'

// ─── Page transition variants ─────────────────────────────────────────────────
// Elegant fade + subtle upward drift — refined enough for a luxury brand,
// fast enough to not feel sluggish between navigations.
const pageVariants = {
  initial: {
    opacity: 0,
    y: 18,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],  // custom spring-like ease
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(2px)',
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 1, 1],
    },
  },
}

export default function PublicLayout() {
  const location = useLocation()
  const isHome   = location.pathname === '/'

  return (
    <div className="flex flex-col min-h-screen">

      {/* Fixed navbar — hidden on home because HomePage renders its own */}
      {!isHome && (
        <header className="fixed top-0 left-0 right-0 z-50">
          <SiteNavbar />
        </header>
      )}

      {/* Spacer — only on non-home pages */}
      {!isHome && <div className="h-[74px] flex-shrink-0" />}

      {/* Animated page wrapper — keyed to pathname so each route transition
          triggers exit of the old page and entrance of the new one */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className="flex-1"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  )
}
