import { ChevronRight } from 'lucide-react'
import type { Doc } from '../../../convex/_generated/dataModel'

interface TaskCardProps {
  task: Doc<'tasks'>
  isSelected: boolean
  onClick: () => void
}

export function TaskCard({ task, isSelected, onClick }: TaskCardProps) {
  return (
    <button
      onClick={onClick}
      data-testid={`task-card-${task._id}`}
      className={`task-card w-full text-left p-3 rounded-lg border transition-all flex items-center gap-2 ${
        isSelected
          ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500'
          : 'border-ink-100 bg-white hover:border-ink-200 hover:shadow-sm'
      }`}
    >
      {/* Bracket icon */}
      <div className="flex-shrink-0 text-amber-600 font-mono text-sm">
        {'('}
      </div>
      
      {/* Task title */}
      <div className="flex-1 min-w-0">
        <span className="text-sm text-ink-700 truncate block">
          {task.title}
        </span>
      </div>
      
      {/* Arrow */}
      <ChevronRight size={16} className="text-ink-300 flex-shrink-0" />
    </button>
  )
}
