import { type ReactNode, useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Kanban,
  Activity,
  FileText,
  Radio,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { Doc } from '../../../convex/_generated/dataModel'

export type ViewMode = 'dashboard' | 'tasks' | 'activity' | 'docs' | 'broadcast'

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

const navItems: { mode: ViewMode; label: string; icon: typeof LayoutDashboard }[] = [
  { mode: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { mode: 'tasks', label: 'Tasks', icon: Kanban },
  { mode: 'activity', label: 'Activity', icon: Activity },
  { mode: 'docs', label: 'Documents', icon: FileText },
  { mode: 'broadcast', label: 'Broadcast', icon: Radio },
]

const statusDot: Record<string, string> = {
  active: 'bg-emerald-400',
  idle: 'bg-amber-400',
  blocked: 'bg-rose-400',
  offline: 'bg-slate-500',
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
  const [collapsed, setCollapsed] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      <aside
        className={`${collapsed ? 'w-[68px]' : 'w-60'} bg-slate-900 flex flex-col flex-shrink-0 transition-all duration-200 ease-in-out`}
      >
        <div className={`h-14 flex items-center ${collapsed ? 'justify-center px-2' : 'px-5'} border-b border-slate-800`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
                <svg viewBox="0 0 16 16" className="w-4 h-4 text-white">
                  <path fill="currentColor" d="M8 1l7 4-7 4-7-4 7-4zm0 9l5.5-3.14L15 8l-7 4-7-4 1.5-.86L8 10zm0 3l5.5-3.14L15 11l-7 4-7-4 1.5-.86L8 13z"/>
                </svg>
              </div>
              <span className="font-semibold text-sm text-white tracking-wide">Mission Control</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <svg viewBox="0 0 16 16" className="w-4 h-4 text-white">
                <path fill="currentColor" d="M8 1l7 4-7 4-7-4 7-4zm0 9l5.5-3.14L15 8l-7 4-7-4 1.5-.86L8 10zm0 3l5.5-3.14L15 11l-7 4-7-4 1.5-.86L8 13z"/>
              </svg>
            </div>
          )}
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map(({ mode, label, icon: Icon }) => {
            const isActive = viewMode === mode
            return (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                data-testid={`nav-${mode}-btn`}
                className={`w-full flex items-center gap-3 ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </button>
            )
          })}
        </nav>

        <div className={`mx-3 my-2 border-t border-slate-800`} />

        {!collapsed && (
          <div className="px-3 mb-2">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Agents</span>
              <span className="text-[10px] text-slate-500 font-medium">{activeAgents}/{agents.length}</span>
            </div>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto dark-scroll ${collapsed ? 'px-2' : 'px-3'} pb-3`}>
          {!collapsed && (
            <button
              onClick={() => onAgentFilterChange(null)}
              data-testid="all-agents-btn"
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-1 transition-colors ${
                selectedAgentFilter === null
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-teal-400">
                {activeAgents}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[13px] font-medium">All Agents</div>
              </div>
            </button>
          )}

          {agents.map((agent) => (
            <button
              key={agent._id}
              onClick={() => onAgentFilterChange(selectedAgentFilter === agent.agentId ? null : agent.agentId)}
              data-testid={`agent-${agent.agentId}-btn`}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-1' : 'gap-2.5 px-3'} py-1.5 rounded-lg transition-colors ${
                selectedAgentFilter === agent.agentId
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className={`${collapsed ? 'w-8 h-8' : 'w-7 h-7'} rounded-full bg-slate-700 flex items-center justify-center text-sm border border-slate-600`}>
                  {agent.emoji}
                </div>
                <div className={`absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${statusDot[agent.status]}`} />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[12px] font-medium truncate">{agent.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{agent.role}</div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className={`border-t border-slate-800 ${collapsed ? 'px-2' : 'px-3'} py-3`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-[15px] font-semibold text-slate-900">
              {navItems.find(n => n.mode === viewMode)?.label}
            </h1>
            {selectedAgentFilter && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 rounded-full">
                <span className="text-xs text-teal-700 font-medium">
                  Filtered: {agents.find(a => a.agentId === selectedAgentFilter)?.name}
                </span>
                <button
                  onClick={() => onAgentFilterChange(null)}
                  className="text-teal-500 hover:text-teal-700"
                >
                  <svg viewBox="0 0 12 12" className="w-3 h-3"><path fill="currentColor" d="M9.4 3.4L8.6 2.6 6 5.2 3.4 2.6 2.6 3.4 5.2 6 2.6 8.6 3.4 9.4 6 6.8 8.6 9.4 9.4 8.6 6.8 6z"/></svg>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                <span className="text-slate-500 text-xs font-medium">{activeAgents} active</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 text-xs font-medium">{taskCount} tasks</span>
            </div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <div className="text-sm font-mono font-medium text-slate-700 leading-none">{formatTime(currentTime)}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{formatDate(currentTime)}</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
