import { useState } from 'react'
import { Search } from 'lucide-react'
import { TaskCard } from './TaskCard'
import type { Id, Doc } from '../../../convex/_generated/dataModel'

interface TaskBoardProps {
  tasks: Doc<'tasks'>[]
  taskCounts: Record<string, number>
  onTaskSelect: (taskId: Id<'tasks'>) => void
  selectedTaskId: Id<'tasks'> | null
}

type StatusFilter = 'all' | 'inbox' | 'assigned' | 'in_progress' | 'review' | 'done' | 'waiting'

const columns = [
  { key: 'inbox', label: 'Inbox', dot: 'bg-slate-400' },
  { key: 'assigned', label: 'Assigned', dot: 'bg-amber-500' },
  { key: 'in_progress', label: 'In Progress', dot: 'bg-teal-500' },
  { key: 'review', label: 'Review', dot: 'bg-sky-500' },
  { key: 'done', label: 'Done', dot: 'bg-emerald-500' },
  { key: 'waiting', label: 'Waiting', dot: 'bg-orange-500' },
  { key: 'blocked', label: 'Blocked', dot: 'bg-rose-500' },
]

const filterOptions: { key: StatusFilter; label: string; dot?: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'inbox', label: 'Inbox', dot: 'bg-slate-400' },
  { key: 'assigned', label: 'Assigned', dot: 'bg-amber-500' },
  { key: 'in_progress', label: 'Active', dot: 'bg-teal-500' },
  { key: 'review', label: 'Review', dot: 'bg-sky-500' },
  { key: 'done', label: 'Done', dot: 'bg-emerald-500' },
  { key: 'waiting', label: 'Waiting', dot: 'bg-orange-500' },
]

export function TaskBoard({ tasks, taskCounts, onTaskSelect, selectedTaskId }: TaskBoardProps) {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')

  const filteredColumns = filter === 'all'
    ? columns
    : columns.filter(c => c.key === filter)

  const getColumnTasks = (status: string) => {
    let result = tasks.filter(t => t.status === status)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      )
    }
    return result
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            {filterOptions.map(({ key, label, dot }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                data-testid={`filter-${key}-btn`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filter === key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
                {label}
                {key !== 'all' && taskCounts[key] > 0 && (
                  <span className="text-[10px] text-slate-400 ml-0.5">{taskCounts[key]}</span>
                )}
              </button>
            ))}
          </div>

          <div className="relative ml-auto">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-8 pr-3 py-1.5 bg-slate-100 border border-transparent rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-1 focus:ring-teal-500/20 transition-all w-52"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full min-w-0">
          {filteredColumns.map(column => {
            const colTasks = getColumnTasks(column.key)
            return (
              <div key={column.key} className="w-72 flex-shrink-0 flex flex-col min-h-0">
                <div className="flex items-center gap-2 px-1 py-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${column.dot}`} />
                  <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{column.label}</h3>
                  <span className="text-[11px] text-slate-400 ml-auto font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pb-2">
                  {colTasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      isSelected={selectedTaskId === task._id}
                      onClick={() => onTaskSelect(task._id)}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="text-center py-10 text-slate-300 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
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
