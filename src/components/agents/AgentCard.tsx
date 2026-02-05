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

interface AgentCardProps {
  agent: Agent
  isSelected: boolean
  onClick: () => void
}

const levelColors = {
  LEAD: 'bg-gold-400 text-gold-900',
  SPC: 'bg-purple-100 text-purple-700',
  INT: 'bg-blue-100 text-blue-700',
  WORKING: 'bg-green-100 text-green-700',
}

const statusColors = {
  active: 'bg-green-500',
  idle: 'bg-yellow-500',
  blocked: 'bg-red-500',
  offline: 'bg-gray-400',
}

export function AgentCard({ agent, isSelected, onClick }: AgentCardProps) {
  const timeSinceHeartbeat = Date.now() - agent.lastHeartbeat
  const isRecent = timeSinceHeartbeat < 5 * 60 * 1000 // 5 minutes

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg mb-1 transition-all ${
        isSelected
          ? 'bg-cream-200 border border-ink-200'
          : 'hover:bg-cream-50 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-xl">
            {agent.emoji}
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
              statusColors[agent.status]
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink-900 truncate">{agent.name}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-medium ${levelColors[agent.level]}`}
            >
              {agent.level}
            </span>
          </div>
          <div className="text-xs text-ink-500 truncate">{agent.role}</div>
        </div>
      </div>
    </button>
  )
}
