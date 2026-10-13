/**
 * NovaNest — Framer Motion animation variants
 * Import what you need: { fadeUp, staggerContainer, ... }
 */

// ─── Fade & slide variants ─────────────────────────────────────────────────

export const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeDown = {
  hidden:  { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeLeft = {
  hidden:  { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeRight = {
  hidden:  { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Stagger container ────────────────────────────────────────────────────

export const staggerContainer = (stagger = 0.1, delayChildren = 0) => ({
  hidden:  {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

// ─── Card item (used inside stagger container) ────────────────────────────

export const cardItem = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Page transition (wrap each page's root element) ─────────────────────

export const pageTransition = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.25, ease: 'easeIn' } },
}

// ─── Hero specific ────────────────────────────────────────────────────────

export const heroLabel = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
}

export const heroTitle = {
  hidden:  { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

export const heroSubtitle = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.55, ease: 'easeOut' } },
}

export const heroButtons = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.75, ease: 'easeOut' } },
}

export const heroCard = {
  hidden:  { opacity: 0, x: 60, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const statsBar = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.9, ease: 'easeOut' } },
}

// ─── Gold underline sweep ─────────────────────────────────────────────────

export const goldLine = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Hover variants (for whileHover / whileTap) ───────────────────────────

export const cardHover = {
  rest:  { y: 0,  boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  hover: { y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', transition: { duration: 0.3, ease: 'easeOut' } },
}

export const buttonTap = { scale: 0.97 }

// ─── Scroll-triggered viewport defaults ──────────────────────────────────

export const viewportOnce = { once: true, margin: '-60px' }
