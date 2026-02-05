import { ReactNode, useState, useEffect } from 'react'
import { Clock, Radio, Users, ListTodo } from 'lucide-react'
import { AgentCard } from '../agents/AgentCard'

type ViewMode = 'active' | 'chat' | 'broadcast' | 'docs'

interface Agent {
  _id: string
  agentId: string
  name: string
  emoji: string
  role: string
  status: 'active' | 'idle' | 'blocked' | 'offline'
  level: 'LEAD' | 'SPC' | 'INT' | 'WORKING'
  lastHeartbeat: number
}

interface MainLayoutProps {
  children: ReactNode
  agents: Agent[]
  taskCount: number
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  selectedAgentFilter: string | null
  onAgentFilterChange: (agentId: string | null) => void
}

export function MainLayout({
  children,
  agents,
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

  const modeButtons: { mode: ViewMode; label: string }[] = [
    { mode: 'active', label: 'Active' },
    { mode: 'chat', label: 'Chat' },
    { mode: 'broadcast', label: 'Broadcast' },
    { mode: 'docs', label: 'Docs' },
  ]

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-ink-100 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-serif-display text-2xl font-bold text-ink-900 tracking-tight">
              MISSION CONTROL
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-ink-500">
                <Users size={16} />
                <span className="font-medium">{agents.length} Agents</span>
              </div>
              <div className="flex items-center gap-1.5 text-ink-500">
                <ListTodo size={16} />
                <span className="font-medium">{taskCount} Tasks in Queue</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 bg-cream-100 rounded-lg p-1">
              {modeButtons.map(({ mode, label }) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === mode
                      ? 'bg-white text-ink-900 shadow-sm'
                      : 'text-ink-500 hover:text-ink-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-ink-700 font-mono text-lg">
                <Clock size={18} />
                {formatTime(currentTime)}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 status-pulse" />
                <span className="text-sm font-medium text-green-600">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-ink-100 flex flex-col">
          <div className="p-4 border-b border-ink-100">
            <h2 className="font-serif-display text-sm font-bold text-ink-700 uppercase tracking-wider">
              Agents
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <button
              onClick={() => onAgentFilterChange(null)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
                selectedAgentFilter === null
                  ? 'bg-cream-100 text-ink-900 font-medium'
                  : 'text-ink-500 hover:bg-cream-50'
              }`}
            >
              All Agents
            </button>
            {agents.map((agent) => (
              <AgentCard
                key={agent._id}
                agent={agent}
                isSelected={selectedAgentFilter === agent.agentId}
                onClick={() => onAgentFilterChange(
                  selectedAgentFilter === agent.agentId ? null : agent.agentId
                )}
              />
            ))}
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
