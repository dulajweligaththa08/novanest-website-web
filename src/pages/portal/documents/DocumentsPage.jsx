import { useQuery } from '@tanstack/react-query'
import { FileText, Download, ExternalLink } from 'lucide-react'
import api from '../../../lib/api'
import { docTypeLabel, formatDate } from '../../../lib/utils'

const TYPE_COLORS = {
  BOOKING_AGREEMENT:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  PAYMENT_SCHEDULE:   'bg-blue-50 text-blue-700 border-blue-200',
  LEGAL_DOCUMENT:     'bg-purple-50 text-purple-700 border-purple-200',
  APARTMENT_DOCUMENT: 'bg-amber-50 text-amber-700 border-amber-200',
  OTHER:              'bg-gray-50 text-gray-600 border-gray-200',
}

const TYPE_ICON_COLORS = {
  BOOKING_AGREEMENT:  'text-emerald-500 bg-emerald-50',
  PAYMENT_SCHEDULE:   'text-blue-500 bg-blue-50',
  LEGAL_DOCUMENT:     'text-purple-500 bg-purple-50',
  APARTMENT_DOCUMENT: 'text-amber-500 bg-amber-50',
  OTHER:              'text-gray-400 bg-gray-100',
}

export default function DocumentsPage() {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['my-documents'],
    queryFn: () => api.get('/customer/documents').then((r) => r.data.data),
  })

  if (isLoading) return <DocsSkeleton />

  if (!documents?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">No documents yet</h3>
        <p className="text-sm text-gray-500">Documents shared by NovaNest will appear here.</p>
      </div>
    )
  }

  // Group by document type
  const grouped = documents.reduce((acc, doc) => {
    const key = doc.documentType || 'OTHER'
    if (!acc[key]) acc[key] = []
    acc[key].push(doc)
    return acc
  }, {})

  return (
    <div className="max-w-2xl space-y-6">
      {Object.entries(grouped).map(([type, docs]) => (
        <div key={type} className="card overflow-hidden">
          {/* Group header */}
          <div className={`flex items-center gap-2 px-5 py-3 border-b text-sm font-semibold ${TYPE_COLORS[type] || TYPE_COLORS.OTHER}`}>
            <FileText className="w-4 h-4" />
            {docTypeLabel(type)}
            <span className="ml-auto text-xs font-normal opacity-70">{docs.length} file{docs.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Documents list */}
          <div className="divide-y divide-gray-50">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 px-5 py-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_ICON_COLORS[doc.documentType] || TYPE_ICON_COLORS.OTHER}`}>
                  <FileText className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                  {doc.description && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">{doc.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Shared {formatDate(doc.uploadedAt)}
                    {!doc.isRead && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full bg-gold-100 text-gold-700 text-xs font-medium">
                        New
                      </span>
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Open"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={doc.fileUrl}
                    download
                    className="p-2 rounded-xl hover:bg-gold-50 text-gray-500 hover:text-gold-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function DocsSkeleton() {
  return (
    <div className="max-w-2xl space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="h-10 bg-gray-100" />
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
