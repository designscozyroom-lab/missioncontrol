import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Code, PenTool, StickyNote, File, X, Package, Search } from 'lucide-react'
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

const typeColors: Record<string, { icon: string; bg: string; border: string }> = {
  report: { icon: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
  code: { icon: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  design: { icon: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  notes: { icon: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  deliverable: { icon: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
  other: { icon: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' },
}

const defaultTypeColor = { icon: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' }

export function DocumentList({ documents }: DocumentListProps) {
  const [selectedDoc, setSelectedDoc] = useState<Doc<'documents'> | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  const types = ['all', ...new Set(documents.map(d => d.type))]

  const filtered = documents.filter(doc => {
    const matchSearch = !search || doc.title.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || doc.type === filterType
    return matchSearch && matchType
  })

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  filterType === type
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative ml-auto">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="pl-8 pr-3 py-1.5 bg-slate-100 border border-transparent rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-1 focus:ring-teal-500/20 transition-all w-52"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {filtered.map(doc => {
            const Icon = typeIcons[doc.type] || File
            const colors = typeColors[doc.type] || defaultTypeColor

            return (
              <button
                key={doc._id}
                onClick={() => setSelectedDoc(doc)}
                className="text-left bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={colors.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[13px] text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      by @{doc.agentId}
                    </p>
                  </div>
                </div>
                {doc.content && (
                  <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                    {doc.content.substring(0, 150)}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase ${colors.bg} ${colors.icon} border ${colors.border}`}>
                    {doc.type}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDistanceToNow(doc.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </button>
            )
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-slate-300" />
              </div>
              <p className="text-sm text-slate-500 font-medium">No documents found</p>
              <p className="text-xs text-slate-400 mt-1">Documents created by agents will appear here</p>
            </div>
          )}
        </div>
      </div>

      {selectedDoc && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={(e) => e.target === e.currentTarget && setSelectedDoc(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = typeIcons[selectedDoc.type] || File
                  const colors = typeColors[selectedDoc.type] || defaultTypeColor
                  return (
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                      <Icon size={18} className={colors.icon} />
                    </div>
                  )
                })()}
                <div>
                  <h2 className="font-semibold text-[15px] text-slate-900">{selectedDoc.title}</h2>
                  <p className="text-[11px] text-slate-400">
                    by @{selectedDoc.agentId} -- {formatDistanceToNow(selectedDoc.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <pre className="whitespace-pre-wrap font-sans text-[13px] text-slate-700 leading-relaxed">
                {selectedDoc.content}
              </pre>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                (typeColors[selectedDoc.type] || defaultTypeColor).bg
              } ${(typeColors[selectedDoc.type] || defaultTypeColor).icon}`}>
                {selectedDoc.type}
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-xs font-medium"
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
