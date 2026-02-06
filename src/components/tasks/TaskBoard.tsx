import { useState } from 'react'
import { TaskCard } from './TaskCard'
import type { Id, Doc } from '../../../convex/_generated/dataModel'

interface TaskCounts {
  inbox: number
  assigned: number
  in_progress: number
  review: number
  done: number
  waiting: number
}

interface TaskBoardProps {
  tasks: Doc<'tasks'>[]
  taskCounts: TaskCounts
  onTaskSelect: (taskId: Id<'tasks'>) => void
  selectedTaskId: Id<'tasks'> | null
}

type StatusFilter = 'all' | 'inbox' | 'assigned' | 'in_progress' | 'review' | 'done' | 'waiting'

const statusColumns = [
  { key: 'assigned' as const, label: 'ASSIGNED', color: 'bg-amber-400' },
  { key: 'in_progress' as const, label: 'IN PROGRESS', color: 'bg-coral-500' },
  { key: 'review' as const, label: 'REVIEW', color: 'bg-sky-500' },
  { key: 'inbox' as const, label: 'INBOX', color: 'bg-ink-300' },
  { key: 'done' as const, label: 'DONE', color: 'bg-emerald-500' },
  { key: 'waiting' as const, label: 'WAITING', color: 'bg-orange-400' },
  { key: 'blocked' as const, label: 'BLOCKED', color: 'bg-red-500' },
]

const filterDotColors: Record<string, string> = {
  inbox: 'bg-ink-300',
  assigned: 'bg-amber-400',
  in_progress: 'bg-coral-500',
  review: 'bg-sky-500',
  done: 'bg-emerald-500',
  waiting: 'bg-orange-400',
}

export function TaskBoard({ tasks, taskCounts, onTaskSelect, selectedTaskId }: TaskBoardProps) {
  const [filter, setFilter] = useState<StatusFilter>('all')

  const filters: { key: StatusFilter; label: string; count?: number }[] = [
    { key: 'all', label: 'All' },
    { key: 'inbox', label: 'Inbox', count: taskCounts.inbox },
    { key: 'assigned', label: 'Assigned', count: taskCounts.assigned },
    { key: 'in_progress', label: 'Active', count: taskCounts.in_progress },
    { key: 'review', label: 'Review', count: taskCounts.review },
    { key: 'done', label: 'Done', count: taskCounts.done },
    { key: 'waiting', label: 'Waiting', count: taskCounts.waiting },
  ]

  const getTasksForColumn = (status: string) => {
    return tasks.filter((t) => t.status === status)
  }

  const visibleColumns = filter === 'all'
    ? statusColumns
    : statusColumns.filter(c => c.key === filter)

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-ink-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-coral-500 text-xs">&#9733;</span>
            <h2 className="text-[11px] font-semibold text-ink-700 uppercase tracking-wider">
              Mission Queue
            </h2>
          </div>

          <div className="flex items-center gap-0.5 bg-cream-100 rounded-lg p-0.5">
            {filters.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                data-testid={`filter-${key}-btn`}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                  filter === key
                    ? 'bg-white text-ink-900 shadow-sm'
                    : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                {key !== 'all' && (
                  <span className={`w-1.5 h-1.5 rounded-full ${filterDotColors[key] || 'bg-ink-300'}`} />
                )}
                {label}
                {count !== undefined && count > 0 && (
                  <span className="text-[10px] text-ink-400">{count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-3">
        <div className="flex gap-3 h-full min-w-0">
          {visibleColumns.map((column) => {
            const columnTasks = getTasksForColumn(column.key)
            return (
              <div
                key={column.key}
                className="w-72 flex-shrink-0 flex flex-col min-h-0 bg-cream-100/60 rounded-lg"
              >
                <div className="px-3 py-2.5 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-ink-500 uppercase text-[10px] tracking-wider">
                    {column.label}
                  </h3>
                  <span className="text-[10px] text-ink-400 ml-auto font-medium">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto px-1.5 pb-1.5 space-y-1">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      isSelected={selectedTaskId === task._id}
                      onClick={() => onTaskSelect(task._id)}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-6 text-ink-300 text-[11px]">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
