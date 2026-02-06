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
  { key: 'inbox' as const, label: 'INBOX', color: 'bg-gray-400' },
  { key: 'assigned' as const, label: 'ASSIGNED', color: 'bg-amber-500' },
  { key: 'in_progress' as const, label: 'IN PROGRESS', color: 'bg-blue-500' },
  { key: 'review' as const, label: 'REVIEW', color: 'bg-purple-500' },
  { key: 'done' as const, label: 'DONE', color: 'bg-emerald-500' },
  { key: 'waiting' as const, label: 'WAITING', color: 'bg-orange-400' },
  { key: 'blocked' as const, label: 'BLOCKED', color: 'bg-red-500' },
]

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
      {/* Header with filters */}
      <div className="p-4 border-b border-ink-100 bg-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">★</span>
            <h2 className="text-sm font-medium text-ink-700 uppercase tracking-wider">
              MISSION QUEUE
            </h2>
          </div>
          
          <div className="flex items-center gap-1 bg-cream-100 rounded-lg p-1">
            {filters.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                data-testid={`filter-${key}-btn`}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  filter === key
                    ? 'bg-white text-ink-900 shadow-sm'
                    : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                {key === 'inbox' && <span className="text-emerald-500">★</span>}
                {key === 'assigned' && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                {key === 'in_progress' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                {key === 'review' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                {key === 'done' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                {key === 'waiting' && <span className="w-2 h-2 rounded-full bg-orange-400"></span>}
                {label}
                {count !== undefined && count > 0 && (
                  <span className="text-xs text-ink-400">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full">
          {visibleColumns.map((column) => {
            const columnTasks = getTasksForColumn(column.key)
            return (
              <div
                key={column.key}
                className="w-80 flex flex-col bg-cream-100/50 rounded-lg min-h-0"
              >
                {/* Column header */}
                <div className="p-3 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                  <h3 className="font-medium text-ink-700 uppercase text-xs tracking-wide">
                    {column.label}
                  </h3>
                  <span className="text-xs text-ink-400 ml-auto">
                    {columnTasks.length}
                  </span>
                </div>
                
                {/* Tasks list */}
                <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      isSelected={selectedTaskId === task._id}
                      onClick={() => onTaskSelect(task._id)}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-ink-300 text-sm">
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
