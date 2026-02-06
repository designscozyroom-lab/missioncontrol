import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, FileText, CheckCircle, UserPlus, AlertCircle } from 'lucide-react'
import type { Doc } from '../../../convex/_generated/dataModel'

interface ActivityFeedProps {
  activities: Doc<'activities'>[]
}

const actionIcons = {
  created: CheckCircle,
  commented: MessageSquare,
  assigned: UserPlus,
  status_changed: AlertCircle,
  standup: FileText,
}

const actionColors = {
  created: 'text-emerald-500 bg-emerald-50',
  commented: 'text-sky-500 bg-sky-50',
  assigned: 'text-coral-500 bg-coral-100',
  status_changed: 'text-amber-500 bg-amber-50',
  standup: 'text-ink-400 bg-ink-100/50',
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-ink-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-coral-500 text-xs">&#9733;</span>
          <h2 className="text-[11px] font-semibold text-ink-700 uppercase tracking-wider">
            Activity Feed
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2 max-w-2xl">
          {activities.map((activity) => {
            const Icon = actionIcons[activity.action as keyof typeof actionIcons] || AlertCircle
            const colorClass = actionColors[activity.action as keyof typeof actionColors] || 'text-ink-400 bg-ink-100/50'

            return (
              <div
                key={activity._id}
                className="flex items-start gap-3 bg-white p-3 rounded-lg border border-ink-100 hover:border-ink-200 transition-colors"
              >
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${colorClass}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-ink-700 leading-relaxed">
                    <span className="font-medium">@{activity.agentId}</span>
                    {' '}
                    {activity.message}
                  </p>
                  <p className="text-[10px] text-ink-400 mt-1">
                    {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })}

          {activities.length === 0 && (
            <div className="text-center py-16 text-ink-300">
              <MessageSquare size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-[13px]">No activity yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
