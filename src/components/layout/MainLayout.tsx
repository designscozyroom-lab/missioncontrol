import { ReactNode, useState, useEffect } from 'react'
import { MessageSquare, Radio, FileText, ChevronRight } from 'lucide-react'
import type { Agent } from '../../mockData'

type ViewMode = 'active' | 'chat' | 'broadcast' | 'docs'

interface MainLayoutProps {
  children: ReactNode
  agents: Agent[]
  activeAgents: number
  taskCount: number
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  selectedAgentFilter: string | null
  onAgentFilterChange: (agentId: string | null) => void
}

const levelColors: Record<string, string> = {
  LEAD: 'bg-amber-100 text-amber-700',
  SPC: 'bg-rose-100 text-rose-700',
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
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
  }

  const modeButtons: { mode: ViewMode; label: string; icon?: ReactNode }[] = [
    { mode: 'active', label: 'Active' },
    { mode: 'chat', label: 'Chat', icon: <MessageSquare size={14} /> },
    { mode: 'broadcast', label: 'Broadcast', icon: <Radio size={14} /> },
    { mode: 'docs', label: 'Docs', icon: <FileText size={14} /> },
  ]

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-ink-100 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-ink-700">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="font-medium text-lg text-ink-700 tracking-tight">
                MISSION CONTROL
              </h1>
            </div>
            
            <div className="px-3 py-1 bg-cream-100 rounded text-sm text-ink-500 font-medium">
              SiteGPT
            </div>

            {/* Stats */}
            <div className="flex items-center gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-ink-900">{activeAgents}</div>
                <div className="text-xs text-ink-400 uppercase tracking-wider">AGENTS ACTIVE</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-ink-900">{taskCount}</div>
                <div className="text-xs text-ink-400 uppercase tracking-wider">TASKS IN QUEUE</div>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* View mode buttons */}
            <div className="flex items-center gap-1">
              {modeButtons.map(({ mode, label, icon }) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  data-testid={`nav-${mode}-btn`}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-emerald-500 text-white'
                      : 'bg-cream-100 text-ink-500 hover:bg-cream-200'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            {/* Time and status */}
            <div className="flex items-center gap-4 pl-4 border-l border-ink-100">
              <div className="text-right">
                <div className="text-lg font-mono text-ink-700">{formatTime(currentTime)}</div>
                <div className="text-xs text-ink-400">{formatDate(currentTime)}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-emerald-600">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Agents */}
        <aside className="w-52 bg-white border-r border-ink-100 flex flex-col">
          <div className="p-4 border-b border-ink-100">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">★</span>
              <h2 className="text-sm font-medium text-ink-700 uppercase tracking-wider">
                AGENTS
              </h2>
              <span className="text-xs text-ink-400 ml-auto">{agents.length}</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            {/* All Agents summary */}
            <button
              onClick={() => onAgentFilterChange(null)}
              data-testid="all-agents-btn"
              className={`w-full text-left p-3 rounded-lg mb-3 transition-all ${
                selectedAgentFilter === null
                  ? 'bg-cream-100'
                  : 'hover:bg-cream-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* Progress ring */}
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="#E5E5E5"
                      strokeWidth="4"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="4"
                      strokeDasharray={`${(activeAgents / agents.length) * 126} 126`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-ink-900">All Agents</div>
                  <div className="text-xs text-emerald-600 font-medium">{activeAgents} ACTIVE</div>
                  <div className="text-xs text-ink-400">{agents.length} total</div>
                </div>
              </div>
            </button>

            {/* Individual agents */}
            <div className="space-y-1">
              {agents.map((agent) => (
                <button
                  key={agent._id}
                  onClick={() => onAgentFilterChange(
                    selectedAgentFilter === agent.agentId ? null : agent.agentId
                  )}
                  data-testid={`agent-${agent.agentId}-btn`}
                  className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center gap-3 ${
                    selectedAgentFilter === agent.agentId
                      ? 'bg-cream-100'
                      : 'hover:bg-cream-50'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center text-lg border border-ink-100">
                      {agent.emoji}
                    </div>
                    {agent.status === 'active' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-ink-900 text-sm truncate">{agent.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${levelColors[agent.level]}`}>
                        {agent.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] text-emerald-600 font-medium">WORKING</span>
                    </div>
                    <div className="text-[11px] text-ink-400 truncate">{agent.role}</div>
                  </div>
                  <ChevronRight size={14} className="text-ink-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden bg-cream-50">
          {children}
        </main>
      </div>
    </div>
  )
}
