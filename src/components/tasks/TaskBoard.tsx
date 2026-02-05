import { useState } from 'react'
import { TaskCard } from './TaskCard'
import type { Id } from '../../../convex/_generated/dataModel'

interface Task {
  _id: Id<'tasks'>
  title: string
  description: string
  status: 'inbox' | 'assigned' | 'in_progress' | 'blocked' | 'waiting' | 'review' | 'done'
  assignedTo?: string
  createdBy: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  type: 'task' | 'bug' | 'feature' | 'research'
  tags: string[]
  createdAt: number
  updatedAt: number
}

interface TaskCounts {
  inbox: number
  assigned: number
  in_progress: number
  review: number
  done: number
}

interface TaskBoardProps {
  tasks: Task[]
  taskCounts: TaskCounts
  onTaskSelect: (taskId: Id<'tasks'>) => void
  selectedTaskId: Id<'tasks'> | null
}

type StatusFilter = 'all' | 'inbox' | 'assigned' | 'in_progress' | 'review' | 'done'

const statusColumns = [
  { key: 'inbox' as const, label: 'Inbox', color: 'border-gray-300' },
  { key: 'assigned' as const, label: 'Assigned', color: 'border-blue-400' },
  { key: 'in_progress' as const, label: 'In Progress', color: 'border-yellow-400' },
  { key: 'review' as const, label: 'Review', color: 'border-purple-400' },
  { key: 'done' as const, label: 'Done', color: 'border-green-400' },
]

export function TaskBoard({ tasks, taskCounts, onTaskSelect, selectedTaskId }: TaskBoardProps) {
  const [filter, setFilter] = useState<StatusFilter>('all')

  const filters: { key: StatusFilter; label: string; count?: number }[] = [
    { key: 'all', label: 'All' },
    { key: 'inbox', label: 'Inbox', count: taskCounts.inbox },
    { key: 'assigned', label: 'Assigned', count: taskCounts.assigned },
    { key: 'in_progress', label: 'Active', count: taskCounts.in_progress },
    { key: 'review', label: 'Review', count: taskCounts.review },
  ]

  const getTasksForColumn = (status: string) => {
    return tasks.filter((t) => t.status === status)
  }

  const visibleColumns = filter === 'all'
    ? statusColumns.filter(c => c.key !== 'done')
    : statusColumns.filter(c => c.key === filter)

  return (
    <div className="h-full flex flex-col">
      {/* Filters */}
      <div className="p-4 border-b border-ink-100 bg-white">
        <div className="flex items-center gap-2">
          <h2 className="font-serif-display text-lg font-bold text-ink-900 mr-4">
            MISSION QUEUE
          </h2>
          <div className="flex items-center gap-1 bg-cream-100 rounded-lg p-1">
            {filters.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  filter === key
                    ? 'bg-white text-ink-900 shadow-sm'
                    : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                {label}
                {count !== undefined && count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    filter === key ? 'bg-brick-100 text-brick-600' : 'bg-ink-100 text-ink-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full min-w-max">
          {visibleColumns.map((column) => (
            <div
              key={column.key}
              className={`w-72 flex flex-col bg-white rounded-lg border-t-4 ${column.color} shadow-sm`}
            >
              <div className="p-3 border-b border-ink-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-ink-900 uppercase text-sm tracking-wide">
                    {column.label}
                  </h3>
                  <span className="text-xs bg-cream-100 text-ink-500 px-2 py-1 rounded-full">
                    {getTasksForColumn(column.key).length}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {getTasksForColumn(column.key).map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    isSelected={selectedTaskId === task._id}
                    onClick={() => onTaskSelect(task._id)}
                  />
                ))}
                {getTasksForColumn(column.key).length === 0 && (
                  <div className="text-center py-8 text-ink-300 text-sm">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
