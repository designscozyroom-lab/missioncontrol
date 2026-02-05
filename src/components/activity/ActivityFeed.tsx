import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, FileText, CheckCircle, UserPlus, AlertCircle } from 'lucide-react'

interface Activity {
  _id: string
  agentId: string
  action: string
  targetType: 'task' | 'message' | 'document' | 'agent'
  targetId: string
  message: string
  createdAt: number
}

interface ActivityFeedProps {
  activities: Activity[]
}

const actionIcons = {
  created: CheckCircle,
  commented: MessageSquare,
  assigned: UserPlus,
  status_changed: AlertCircle,
  standup: FileText,
}

const actionColors = {
  created: 'text-green-500 bg-green-50',
  commented: 'text-blue-500 bg-blue-50',
  assigned: 'text-purple-500 bg-purple-50',
  status_changed: 'text-orange-500 bg-orange-50',
  standup: 'text-gray-500 bg-gray-50',
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="font-serif-display text-xl font-bold text-ink-900 mb-6">
        Activity Feed
      </h2>

      <div className="space-y-4 max-w-2xl">
        {activities.map((activity) => {
          const Icon = actionIcons[activity.action as keyof typeof actionIcons] || AlertCircle
          const colorClass = actionColors[activity.action as keyof typeof actionColors] || 'text-gray-500 bg-gray-50'

          return (
            <div
              key={activity._id}
              className="flex items-start gap-3 bg-white p-4 rounded-lg border border-ink-100"
            >
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink-700">
                  <span className="font-medium">@{activity.agentId}</span>
                  {' '}
                  {activity.message}
                </p>
                <p className="text-xs text-ink-400 mt-1">
                  {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}

        {activities.length === 0 && (
          <div className="text-center py-12 text-ink-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>No activity yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
