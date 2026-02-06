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
  report: 'text-sky-500 bg-sky-50',
  code: 'text-emerald-500 bg-emerald-50',
  design: 'text-coral-500 bg-coral-100',
  notes: 'text-amber-500 bg-amber-50',
  deliverable: 'text-teal-500 bg-teal-50',
  other: 'text-ink-400 bg-ink-100/50',
}

export function DocumentList({ documents }: DocumentListProps) {
  const [selectedDoc, setSelectedDoc] = useState<Doc<'documents'> | null>(null)

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-ink-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-coral-500 text-xs">&#9733;</span>
          <h2 className="text-[11px] font-semibold text-ink-700 uppercase tracking-wider">
            Documents
          </h2>
          <span className="text-[11px] text-ink-400 font-medium ml-1">{documents.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-6xl">
          {documents.map((doc) => {
            const Icon = typeIcons[doc.type] || File
            const colorClass = typeColors[doc.type] || 'text-ink-400 bg-ink-100/50'

            return (
              <button
                key={doc._id}
                onClick={() => setSelectedDoc(doc)}
                className="text-left bg-white p-3.5 rounded-lg border border-ink-100 hover:border-coral-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colorClass} transition-colors`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[13px] text-ink-900 truncate group-hover:text-coral-600 transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-[10px] text-ink-400 mt-0.5">
                      by @{doc.agentId}
                    </p>
                    <p className="text-[10px] text-ink-300 mt-0.5">
                      {formatDistanceToNow(doc.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {doc.content && (
                  <p className="text-[11px] text-ink-500 mt-2.5 line-clamp-2 leading-relaxed">
                    {doc.content.substring(0, 150)}...
                  </p>
                )}
              </button>
            )
          })}

          {documents.length === 0 && (
            <div className="col-span-full text-center py-16 text-ink-300">
              <FileText size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-[13px]">No documents yet</p>
            </div>
          )}
        </div>
      </div>

      {selectedDoc && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6"
          onClick={(e) => e.target === e.currentTarget && setSelectedDoc(null)}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-ink-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${typeColors[selectedDoc.type] || 'text-ink-400 bg-ink-100/50'}`}>
                  {(() => {
                    const Icon = typeIcons[selectedDoc.type] || File
                    return <Icon size={18} />
                  })()}
                </div>
                <div>
                  <h2 className="font-semibold text-[15px] text-ink-900">
                    {selectedDoc.title}
                  </h2>
                  <p className="text-[11px] text-ink-400">
                    by @{selectedDoc.agentId} &middot; {formatDistanceToNow(selectedDoc.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 hover:bg-cream-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-ink-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <pre className="whitespace-pre-wrap font-sans text-[13px] text-ink-700 leading-relaxed">
                {selectedDoc.content}
              </pre>
            </div>

            <div className="px-5 py-3 border-t border-ink-100 flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${typeColors[selectedDoc.type] || 'text-ink-400 bg-ink-100/50'}`}>
                {selectedDoc.type}
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 bg-cream-100 text-ink-700 rounded-lg hover:bg-cream-200 transition-colors text-[12px] font-medium"
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
