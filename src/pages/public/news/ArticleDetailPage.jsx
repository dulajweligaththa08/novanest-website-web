import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, ChevronLeft, User, Tag } from 'lucide-react'
import api from '../../../lib/api'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import { formatDate } from '../../../lib/utils'

export default function ArticleDetailPage() {
  const { slug } = useParams()

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => api.get(`/news/${slug}`).then(r => r.data.data),
  })

  if (isLoading) return <><div className="h-20 bg-navy-900" /><LoadingSpinner /></>
  if (error || !article) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h2>
        <Link to="/news" className="btn-outline-gold mt-4">← Back to News</Link>
      </div>
    </div>
  )

  return (
    <div>
      {/* Hero */}
      <div className="relative min-h-[40vh] bg-navy-900 overflow-hidden">
        {article.thumbnail && (
          <img src={article.thumbnail} alt={article.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/60 to-transparent" />
        <div className="relative container-site pt-32 pb-10">
          <Link to="/news"
            className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to News & Insights
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-gold-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {article.category}
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white max-w-3xl leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-white/60 text-sm">
            {article.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> {article.author}
              </span>
            )}
            {article.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {formatDate(article.publishedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-site py-12">
        <div className="max-w-3xl mx-auto">
          {article.excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-100 font-medium">
              {article.excerpt}
            </p>
          )}
          <div className="prose prose-gray prose-lg max-w-none
                          prose-headings:text-navy-900 prose-headings:font-bold
                          prose-a:text-gold-600 prose-strong:text-gray-900">
            {article.body.split('\n').map((para, i) =>
              para.trim()
                ? <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>
                : <br key={i} />
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link to="/news" className="btn-outline-gold">
              <ChevronLeft className="w-4 h-4" /> Back to News & Insights
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
