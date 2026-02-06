import { type ReactNode, useState, useEffect } from 'react'
import { MessageSquare, Radio, FileText, Layers } from 'lucide-react'
import type { Doc } from '../../../convex/_generated/dataModel'

type ViewMode = 'active' | 'chat' | 'broadcast' | 'docs'

interface MainLayoutProps {
  children: ReactNode
  agents: Doc<'agents'>[]
  activeAgents: number
  taskCount: number
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  selectedAgentFilter: string | null
  onAgentFilterChange: (agentId: string | null) => void
}

const levelColors: Record<string, string> = {
  LEAD: 'bg-amber-100 text-amber-700',
  SPC: 'bg-coral-100 text-coral-600',
  INT: 'bg-sky-100 text-sky-700',
  WORKING: 'bg-emerald-100 text-emerald-700',
}

export function MainLayout({
  children,
  agents,
  activeAgents,
  taskCount,
  viewMode,
  onViewModeChange,
  selectedAgentFilter,
  onAgentFilterChange,
}: MainLayoutProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
  }

  const modeButtons: { mode: ViewMode; label: string; icon: ReactNode }[] = [
    { mode: 'active', label: 'Active', icon: <Layers size={13} /> },
    { mode: 'chat', label: 'Chat', icon: <MessageSquare size={13} /> },
    { mode: 'broadcast', label: 'Broadcast', icon: <Radio size={13} /> },
    { mode: 'docs', label: 'Docs', icon: <FileText size={13} /> },
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="bg-white border-b border-ink-100 px-5 py-2.5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-ink-700">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-semibold text-sm tracking-wide text-ink-700 uppercase">
                Mission Control
              </span>
            </div>

            <span className="px-2.5 py-1 bg-cream-200 rounded text-[11px] font-medium text-ink-500 tracking-wide uppercase">
              SiteGPT
            </span>

            <div className="flex items-center gap-10 pl-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-ink-900 leading-none">{activeAgents}</div>
                <div className="text-[10px] text-ink-400 uppercase tracking-widest mt-0.5">Agents Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ink-900 leading-none">{taskCount}</div>
                <div className="text-[10px] text-ink-400 uppercase tracking-widest mt-0.5">Tasks in Queue</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 bg-cream-100 rounded-full p-0.5">
              {modeButtons.map(({ mode, label, icon }) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  data-testid={`nav-${mode}-btn`}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-coral-500 text-white shadow-sm'
                      : 'text-ink-500 hover:text-ink-700 hover:bg-cream-200'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            <div className="w-px h-8 bg-ink-100" />

            <div className="text-right">
              <div className="text-sm font-mono font-medium text-ink-700 leading-none">{formatTime(currentTime)}</div>
              <div className="text-[10px] text-ink-400 mt-0.5">{formatDate(currentTime)}</div>
            </div>

            <div className="flex items-center gap-1.5 pl-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 bg-white border-r border-ink-100 flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-coral-500 text-xs">&#9733;</span>
              <h2 className="text-[11px] font-semibold text-ink-700 uppercase tracking-wider">Agents</h2>
            </div>
            <span className="text-[11px] text-ink-400 font-medium">{agents.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2">
            <button
              onClick={() => onAgentFilterChange(null)}
              data-testid="all-agents-btn"
              className={`w-full text-left p-2.5 rounded-lg mb-2 transition-colors ${
                selectedAgentFilter === null ? 'bg-cream-100' : 'hover:bg-cream-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#E8E8E8" strokeWidth="3" />
                    <circle
                      cx="20" cy="20" r="16" fill="none"
                      stroke="#10B981" strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${agents.length > 0 ? (activeAgents / agents.length) * 100.5 : 0} 100.5`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-cream-200 flex items-center justify-center">
                      <svg viewBox="0 0 16 16" className="w-3 h-3 text-ink-500">
                        <path fill="currentColor" d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 2c-3.3 0-6 1.3-6 3v1h12v-1c0-1.7-2.7-3-6-3z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-sm text-ink-900">All Agents</div>
                  <div className="text-[10px] font-semibold text-emerald-600 tracking-wide">{activeAgents} ACTIVE</div>
                  <div className="text-[10px] text-ink-400">{agents.length} total</div>
                </div>
              </div>
            </button>

            <div className="space-y-0.5">
              {agents.map((agent) => (
                <button
                  key={agent._id}
                  onClick={() => onAgentFilterChange(
                    selectedAgentFilter === agent.agentId ? null : agent.agentId
                  )}
                  data-testid={`agent-${agent.agentId}-btn`}
                  className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center gap-2.5 ${
                    selectedAgentFilter === agent.agentId ? 'bg-cream-100' : 'hover:bg-cream-50'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center text-base border border-ink-100/60">
                      {agent.emoji}
                    </div>
                    {agent.status === 'active' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-[1.5px] border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-ink-900 text-[13px] truncate">{agent.name}</span>
                      <span className={`text-[9px] px-1.5 py-px rounded font-semibold leading-relaxed ${levelColors[agent.level]}`}>
                        {agent.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] font-semibold ${agent.status === 'active' ? 'text-emerald-600' : 'text-ink-400'}`}>
                        {agent.status === 'active' ? 'WORKING' : agent.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[10px] text-ink-400 truncate leading-tight">{agent.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden bg-cream-50">
          {children}
        </main>
      </div>
    </div>
  )
}
