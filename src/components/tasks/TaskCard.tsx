import { Tag, AlertCircle, Sparkles, Search, Wrench } from 'lucide-react'
import type { Id } from '../../../convex/_generated/dataModel'

interface Task {
  _id: Id<'tasks'>
  title: string
  description: string
  status: string
  assignedTo?: string
  createdBy: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  type: 'task' | 'bug' | 'feature' | 'research'
  tags: string[]
  createdAt: number
}

interface TaskCardProps {
  task: Task
  isSelected: boolean
  onClick: () => void
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
}

const typeIcons = {
  task: Wrench,
  bug: AlertCircle,
  feature: Sparkles,
  research: Search,
}

export function TaskCard({ task, isSelected, onClick }: TaskCardProps) {
  const TypeIcon = typeIcons[task.type]

  return (
    <button
      onClick={onClick}
      className={`task-card w-full text-left p-3 rounded-lg border transition-all ${
        isSelected
          ? 'border-brick-500 bg-brick-50 ring-1 ring-brick-500'
          : 'border-ink-100 bg-white hover:border-ink-200'
      }`}
    >
      <div className="flex items-start gap-2 mb-2">
        <TypeIcon size={16} className="text-ink-400 mt-0.5 flex-shrink-0" />
        <h4 className="font-medium text-ink-900 text-sm leading-tight line-clamp-2">
          {task.title}
        </h4>
      </div>

      {task.description && (
        <p className="text-xs text-ink-500 mb-2 line-clamp-2 pl-6">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap pl-6">
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>

        {task.assignedTo && (
          <span className="text-xs text-ink-500">
            @{task.assignedTo}
          </span>
        )}

        {task.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-cream-100 text-ink-500 px-1.5 py-0.5 rounded flex items-center gap-1"
          >
            <Tag size={10} />
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
