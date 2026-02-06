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
      className={`task-card w-full text-left px-3 py-2 rounded-md border transition-all flex items-center gap-2 ${
        isSelected
          ? 'border-coral-400 bg-coral-100/50 ring-1 ring-coral-400'
          : 'border-transparent bg-white hover:border-ink-200'
      }`}
    >
      <div className="flex-1 min-w-0">
        <span className="text-[12px] text-ink-700 truncate block leading-snug">
          {task.title}
        </span>
      </div>
      <ChevronRight size={14} className="text-ink-300 flex-shrink-0" />
    </button>
  )
}
