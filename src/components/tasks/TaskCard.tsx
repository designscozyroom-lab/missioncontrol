import { formatDistanceToNow } from 'date-fns'
import type { Doc } from '../../../convex/_generated/dataModel'

interface TaskCardProps {
  task: Doc<'tasks'>
  isSelected: boolean
  onClick: () => void
}

const priorityConfig: Record<string, { label: string; class: string }> = {
  urgent: { label: 'Urgent', class: 'bg-rose-100 text-rose-700 border-rose-200' },
  high: { label: 'High', class: 'bg-orange-100 text-orange-700 border-orange-200' },
  medium: { label: 'Med', class: 'bg-sky-50 text-sky-700 border-sky-200' },
  low: { label: 'Low', class: 'bg-slate-50 text-slate-500 border-slate-200' },
}

const typeConfig: Record<string, { label: string; class: string }> = {
  bug: { label: 'Bug', class: 'text-rose-600' },
  feature: { label: 'Feature', class: 'text-teal-600' },
  research: { label: 'Research', class: 'text-amber-600' },
  task: { label: 'Task', class: 'text-slate-500' },
}

export function TaskCard({ task, isSelected, onClick }: TaskCardProps) {
  const priority = priorityConfig[task.priority]
  const type = typeConfig[task.type] || typeConfig.task

  return (
    <button
      onClick={onClick}
      data-testid={`task-card-${task._id}`}
      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
        isSelected
          ? 'border-teal-400 bg-teal-50/50 ring-1 ring-teal-400/30 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-[10px] font-semibold uppercase ${type.class}`}>{type.label}</span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold uppercase ${priority.class}`}>
          {priority.label}
        </span>
      </div>

      <h4 className="text-[13px] font-medium text-slate-800 leading-snug mb-2 line-clamp-2">
        {task.title}
      </h4>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[9px] text-slate-400 font-medium">+{task.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5">
          {task.assignedTo ? (
            <span className="text-[10px] text-slate-500 font-medium">@{task.assignedTo}</span>
          ) : (
            <span className="text-[10px] text-slate-300 italic">Unassigned</span>
          )}
        </div>
        <span className="text-[10px] text-slate-400">
          {formatDistanceToNow(task.updatedAt, { addSuffix: true })}
        </span>
      </div>
    </button>
  )
}
