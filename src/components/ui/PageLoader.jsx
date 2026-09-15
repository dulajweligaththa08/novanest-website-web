import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Thin gold progress bar at the top of the page that appears on every
 * route change — gives immediate visual feedback that navigation happened.
 */
export default function PageLoader() {
  const { pathname } = useLocation()
  const [visible, setVisible]   = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setVisible(true)
    setProgress(20)

    const t1 = setTimeout(() => setProgress(60),  100)
    const t2 = setTimeout(() => setProgress(85),  400)
    const t3 = setTimeout(() => setProgress(100), 700)
    const t4 = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 950)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [pathname])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-0.5 transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        backgroundColor: '#C9A233',
        boxShadow: '0 0 8px rgba(201, 162, 51, 0.7)',
      }}
    />
  )
}
