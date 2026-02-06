import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Code, PenTool, StickyNote, File, X, Package } from 'lucide-react'
import type { Doc } from '../../../convex/_generated/dataModel'

interface DocumentListProps {
  documents: Doc<'documents'>[]
}

const typeIcons: Record<string, typeof FileText> = {
  report: FileText,
  code: Code,
  design: PenTool,
  notes: StickyNote,
  deliverable: Package,
  other: File,
}

const typeColors: Record<string, string> = {
  report: 'text-blue-500 bg-blue-50',
  code: 'text-green-500 bg-green-50',
  design: 'text-purple-500 bg-purple-50',
  notes: 'text-yellow-500 bg-yellow-50',
  deliverable: 'text-emerald-500 bg-emerald-50',
  other: 'text-gray-500 bg-gray-50',
}

export function DocumentList({ documents }: DocumentListProps) {
  const [selectedDoc, setSelectedDoc] = useState<Doc<'documents'> | null>(null)

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
              onClick={() => setSelectedDoc(doc)}
              className="bg-white p-4 rounded-lg border border-ink-100 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
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
                  {doc.content.substring(0, 150)}...
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

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-ink-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${typeColors[selectedDoc.type] || 'text-gray-500 bg-gray-50'}`}>
                  {(() => {
                    const Icon = typeIcons[selectedDoc.type] || File
                    return <Icon size={20} />
                  })()}
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-ink-900">
                    {selectedDoc.title}
                  </h2>
                  <p className="text-sm text-ink-500">
                    by @{selectedDoc.agentId} • {formatDistanceToNow(selectedDoc.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-ink-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-ink-700 leading-relaxed bg-cream-50 p-4 rounded-lg border border-ink-100">
                  {selectedDoc.content}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-ink-100 flex justify-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[selectedDoc.type] || 'text-gray-500 bg-gray-50'}`}>
                {selectedDoc.type}
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-ink-100 text-ink-700 rounded-lg hover:bg-ink-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
