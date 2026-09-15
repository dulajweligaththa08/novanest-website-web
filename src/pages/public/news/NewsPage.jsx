import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, ArrowRight, Newspaper } from 'lucide-react'
import api from '../../../lib/api'
import PageHero from '../../../components/ui/PageHero'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import { formatDate } from '../../../lib/utils'

const CATEGORIES = [
  'All', 'Real Estate', 'Investment', 'Architecture', 'Lifestyle', 'Company', 'Construction',
]

export default function NewsPage() {
  const [category, setCategory] = useState('All')
  const [page, setPage]         = useState(1)

  const params = {
    limit: 9,
    page,
    ...(category !== 'All' && { category }),
  }

  const { data, isLoading } = useQuery({
    queryKey: ['articles-public', params],
    queryFn: () => api.get('/news', { params }).then(r => r.data),
    keepPreviousData: true,
  })

  const articles   = data?.data       || []
  const pagination = data?.pagination

  return (
    <div>
      <PageHero
        title="News & Insights"
        subtitle="Stay informed with the latest news, trends and insights from NovaNest Properties."
        backgroundImage="/images/hero-news.jpg"
        breadcrumb="Home › News & Insights"
      />

      <div className="container-site py-12">
        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {CATEGORIES.map(c => (
            <button key={c}
              onClick={() => { setCategory(c); setPage(1) }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${category === c
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {c}
            </button>
          ))}
        </div>

        {isLoading ? <LoadingSpinner /> : articles.length ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="btn-secondary py-2 px-4 disabled:opacity-40 text-gray-700 border-gray-200">
                  ← Prev
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                      ${n === page ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {n}
                  </button>
                ))}
                <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
                  className="btn-secondary py-2 px-4 disabled:opacity-40 text-gray-700 border-gray-200">
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ArticleCard({ article }) {
  return (
    <Link to={`/news/${article.slug}`}
      className="card-hover group overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-navy-100">
        {article.thumbnail ? (
          <img src={article.thumbnail} alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-800 to-navy-900 flex items-center justify-center">
            <Newspaper className="w-10 h-10 text-white/20" />
          </div>
        )}
        <span className="absolute top-3 left-3 bg-gold-500 text-white text-xs font-semibold
                         px-2.5 py-1 rounded-full">
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(article.publishedAt)}
          </span>
          {article.author && (
            <span className="flex items-center gap-1">
              · {article.author}
            </span>
          )}
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2
                        group-hover:text-gold-600 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
            {article.excerpt}
          </p>
        )}

        <span className="inline-flex items-center gap-1 text-sm text-gold-600 font-medium
                          group-hover:gap-2 transition-all mt-auto">
          Read More <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  )
}
