import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layouts
import PublicLayout  from './components/layout/PublicLayout'
import PortalLayout  from './components/layout/PortalLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Public pages
import HomePage           from './pages/public/home/HomePage'
import PropertiesPage     from './pages/public/properties/PropertiesPage'
import ProjectsPage       from './pages/public/projects/ProjectsPage'
import ProjectDetailPage  from './pages/public/projects/ProjectDetailPage'
import ApartmentDetailPage from './pages/public/apartments/ApartmentDetailPage'
import AboutPage          from './pages/public/about/AboutPage'
import CareersPage        from './pages/public/careers/CareersPage'
import NewsPage           from './pages/public/news/NewsPage'
import ArticleDetailPage  from './pages/public/news/ArticleDetailPage'
import ContactPage        from './pages/public/contact/ContactPage'

// Portal pages
import LoginPage          from './pages/auth/LoginPage'
import DashboardPage      from './pages/portal/dashboard/DashboardPage'
import ApartmentPage      from './pages/portal/apartment/ApartmentPage'
import UpdatesPage        from './pages/portal/updates/UpdatesPage'
import DocumentsPage      from './pages/portal/documents/DocumentsPage'
import NotificationsPage  from './pages/portal/notifications/NotificationsPage'
import ProfilePage        from './pages/portal/profile/ProfilePage'

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>

      {/* ── Public website ─────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/"              element={<HomePage />} />
        <Route path="/properties"    element={<PropertiesPage />} />
        <Route path="/projects"      element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/apartments/:id" element={<ApartmentDetailPage />} />
        <Route path="/about"         element={<AboutPage />} />
        <Route path="/careers"       element={<CareersPage />} />
        <Route path="/news"          element={<NewsPage />} />
        <Route path="/news/:slug"    element={<ArticleDetailPage />} />
        <Route path="/contact"       element={<ContactPage />} />
        {/* Stub pages */}
        <Route path="/privacy"       element={<StubPage title="Privacy Policy" />} />
        <Route path="/terms"         element={<StubPage title="Terms & Conditions" />} />
      </Route>

      {/* ── Customer portal ────────────────────────────────────── */}
      <Route
        path="/portal/login"
        element={isAuthenticated ? <Navigate to="/portal" replace /> : <LoginPage />}
      />
      <Route
        path="/portal"
        element={
          <ProtectedRoute>
            <PortalLayout />
          </ProtectedRoute>
        }
      >
        <Route index                 element={<DashboardPage />} />
        <Route path="apartment"      element={<ApartmentPage />} />
        <Route path="updates"        element={<UpdatesPage />} />
        <Route path="documents"      element={<DocumentsPage />} />
        <Route path="notifications"  element={<NotificationsPage />} />
        <Route path="profile"        element={<ProfilePage />} />
      </Route>

      {/* ── Catch-all ──────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

function StubPage({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">{title}</h1>
        <p className="text-gray-500">This page is coming soon.</p>
      </div>
    </div>
  )
}
