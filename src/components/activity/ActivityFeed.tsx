import { formatDistanceToNow } from 'date-fns'
import {
  MessageSquare,
  FileText,
  CheckCircle2,
  UserPlus,
  AlertCircle,
  Zap,
} from 'lucide-react'
import type { Doc } from '../../../convex/_generated/dataModel'

interface ActivityFeedProps {
  activities: Doc<'activities'>[]
}

const actionIcons: Record<string, typeof Zap> = {
  created: CheckCircle2,
  commented: MessageSquare,
  assigned: UserPlus,
  status_changed: AlertCircle,
  standup: FileText,
}

const actionColors: Record<string, { icon: string; bg: string; border: string }> = {
  created: { icon: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  commented: { icon: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
  assigned: { icon: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  status_changed: { icon: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
  standup: { icon: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' },
}

const defaultColor = { icon: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' }

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {activities.length > 0 ? (
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />

              <div className="space-y-1">
                {activities.map((activity) => {
                  const Icon = actionIcons[activity.action] || Zap
                  const colors = actionColors[activity.action] || defaultColor

                  return (
                    <div key={activity._id} className="relative flex items-start gap-4 py-3 animate-fade-in">
                      <div className={`relative z-10 w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={16} className={colors.icon} />
                      </div>

                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-[13px] text-slate-700 leading-relaxed">
                          <span className="font-semibold text-slate-900">@{activity.agentId}</span>
                          {' '}
                          {activity.message}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={28} className="text-slate-300" />
              </div>
              <p className="text-sm text-slate-500 font-medium">No activity yet</p>
              <p className="text-xs text-slate-400 mt-1">Agent actions will appear here in real time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
