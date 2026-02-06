import { formatDistanceToNow } from 'date-fns'
import {
  Inbox,
  UserCheck,
  Play,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react'
import type { Doc, Id } from '../../../convex/_generated/dataModel'
import type { ViewMode } from '../layout/MainLayout'

interface DashboardViewProps {
  tasks: Doc<'tasks'>[]
  agents: Doc<'agents'>[]
  activities: Doc<'activities'>[]
  onNavigate: (mode: ViewMode) => void
  onTaskSelect: (taskId: Id<'tasks'>) => void
}

const statusConfig = [
  { key: 'inbox', label: 'Inbox', icon: Inbox, color: 'bg-slate-100 text-slate-600', ring: 'ring-slate-200' },
  { key: 'assigned', label: 'Assigned', icon: UserCheck, color: 'bg-amber-50 text-amber-600', ring: 'ring-amber-200' },
  { key: 'in_progress', label: 'In Progress', icon: Play, color: 'bg-teal-50 text-teal-600', ring: 'ring-teal-200' },
  { key: 'review', label: 'Review', icon: Eye, color: 'bg-sky-50 text-sky-600', ring: 'ring-sky-200' },
  { key: 'done', label: 'Done', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-200' },
  { key: 'waiting', label: 'Waiting', icon: Clock, color: 'bg-orange-100 text-orange-600', ring: 'ring-orange-200' },
]

const priorityBadge: Record<string, string> = {
  urgent: 'bg-rose-100 text-rose-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-sky-100 text-sky-700',
  low: 'bg-slate-100 text-slate-600',
}

export function DashboardView({ tasks, agents, activities, onNavigate, onTaskSelect }: DashboardViewProps) {
  const activeAgents = agents.filter(a => a.status === 'active')
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done')
  const recentTasks = [...tasks]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 8)

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statusConfig.map(({ key, label, icon: Icon, color }) => {
            const count = tasks.filter(t => t.status === key).length
            return (
              <button
                key={key}
                onClick={() => onNavigate('tasks')}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left group"
              >
                <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
                  <Icon size={18} />
                </div>
                <div className="text-2xl font-bold text-slate-900 leading-none">{count}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{label}</div>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Recent Tasks</h2>
              <button
                onClick={() => onNavigate('tasks')}
                className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                View all <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentTasks.map((task) => (
                <button
                  key={task._id}
                  onClick={() => {
                    onNavigate('tasks')
                    onTaskSelect(task._id)
                  }}
                  className="w-full flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.status === 'in_progress' ? 'bg-teal-500' :
                    task.status === 'review' ? 'bg-sky-500' :
                    task.status === 'done' ? 'bg-emerald-500' :
                    task.status === 'blocked' ? 'bg-rose-500' :
                    'bg-slate-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-slate-800 truncate">{task.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {task.assignedTo ? `@${task.assignedTo}` : 'Unassigned'} -- {formatDistanceToNow(task.updatedAt, { addSuffix: true })}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${priorityBadge[task.priority]}`}>
                    {task.priority}
                  </span>
                </button>
              ))}
              {recentTasks.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">No tasks yet</div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {urgentTasks.length > 0 && (
              <div className="bg-rose-50 rounded-xl border border-rose-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <h3 className="text-sm font-semibold text-rose-900">Urgent</h3>
                </div>
                <div className="space-y-2">
                  {urgentTasks.slice(0, 4).map(task => (
                    <button
                      key={task._id}
                      onClick={() => {
                        onNavigate('tasks')
                        onTaskSelect(task._id)
                      }}
                      className="w-full text-left text-[12px] text-rose-800 bg-white/70 rounded-lg px-3 py-2 hover:bg-white transition-colors"
                    >
                      {task.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Active Agents</h3>
                <span className="text-xs text-slate-400">{activeAgents.length} online</span>
              </div>
              <div className="p-4 space-y-2">
                {activeAgents.map(agent => (
                  <div key={agent._id} className="flex items-center gap-3 px-2 py-1.5">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm border border-slate-200">
                        {agent.emoji}
                      </div>
                      <div className="absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-slate-800 truncate">{agent.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{agent.role}</div>
                    </div>
                  </div>
                ))}
                {activeAgents.length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-xs">No agents active</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
                <button
                  onClick={() => onNavigate('activity')}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
                >
                  View all
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {activities.slice(0, 5).map(activity => (
                  <div key={activity._id} className="px-5 py-3">
                    <p className="text-[12px] text-slate-700 leading-relaxed">
                      <span className="font-medium text-slate-900">@{activity.agentId}</span>{' '}
                      {activity.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-xs">No activity yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
