import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Code, PenTool, StickyNote, File } from 'lucide-react'

const typeIcons = {
  report: FileText,
  code: Code,
  design: PenTool,
  notes: StickyNote,
  other: File,
}

const typeColors = {
  report: 'text-blue-500 bg-blue-50',
  code: 'text-green-500 bg-green-50',
  design: 'text-purple-500 bg-purple-50',
  notes: 'text-yellow-500 bg-yellow-50',
  other: 'text-gray-500 bg-gray-50',
}

export function DocumentList() {
  const documents = useQuery(api.documents.getAllDocuments) ?? []

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="font-serif-display text-xl font-bold text-ink-900 mb-6">
        Documents
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        {documents.map((doc) => {
          const Icon = typeIcons[doc.type] || File
          const colorClass = typeColors[doc.type] || 'text-gray-500 bg-gray-50'

          return (
            <div
              key={doc._id}
              className="bg-white p-4 rounded-lg border border-ink-100 hover:border-ink-200 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-ink-900 truncate">{doc.title}</h3>
                  <p className="text-xs text-ink-500 mt-1">
                    by @{doc.agentId}
                  </p>
                  <p className="text-xs text-ink-400 mt-1">
                    {formatDistanceToNow(doc.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
              {doc.content && (
                <p className="text-sm text-ink-600 mt-3 line-clamp-2">
                  {doc.content}
                </p>
              )}
            </div>
          )
        })}

        {documents.length === 0 && (
          <div className="col-span-full text-center py-12 text-ink-400">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No documents yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
