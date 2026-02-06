import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { X, Send, ChevronDown, Calendar, Tag, User, Flag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Id, Doc } from '../../../convex/_generated/dataModel'

interface TaskDetailProps {
  taskId: Id<'tasks'>
  task: Doc<'tasks'>
  onClose: () => void
  agents: Doc<'agents'>[]
}

const statusOptions = [
  { value: 'inbox', label: 'Inbox', dot: 'bg-slate-400' },
  { value: 'assigned', label: 'Assigned', dot: 'bg-amber-500' },
  { value: 'in_progress', label: 'In Progress', dot: 'bg-teal-500' },
  { value: 'blocked', label: 'Blocked', dot: 'bg-rose-500' },
  { value: 'waiting', label: 'Waiting', dot: 'bg-orange-500' },
  { value: 'review', label: 'Review', dot: 'bg-sky-500' },
  { value: 'done', label: 'Done', dot: 'bg-emerald-500' },
]

const priorityConfig: Record<string, { label: string; class: string }> = {
  urgent: { label: 'Urgent', class: 'bg-rose-100 text-rose-700' },
  high: { label: 'High', class: 'bg-orange-100 text-orange-700' },
  medium: { label: 'Medium', class: 'bg-sky-100 text-sky-700' },
  low: { label: 'Low', class: 'bg-slate-100 text-slate-600' },
}

export function TaskDetail({ taskId, task, onClose, agents }: TaskDetailProps) {
  const [newComment, setNewComment] = useState('')
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  const messages = useQuery(api.messages.getMessagesByTask, { taskId })
  const createMessage = useMutation(api.messages.createMessage)
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus)

  const handleSendComment = async () => {
    if (!newComment.trim()) return
    await createMessage({
      taskId,
      fromAgentId: 'dashboard',
      content: newComment,
    })
    setNewComment('')
  }

  const handleStatusChange = async (status: string) => {
    await updateTaskStatus({
      taskId,
      status: status as any,
      agentId: 'dashboard',
    })
    setShowStatusMenu(false)
  }

  const getAgentDisplay = (agentId: string) => {
    const agent = agents.find(a => a.agentId === agentId)
    return agent ? { emoji: agent.emoji, name: agent.name } : { emoji: '', name: agentId }
  }

  const currentStatus = statusOptions.find(s => s.value === task.status)
  const priority = priorityConfig[task.priority]

  return (
    <div className="w-[440px] border-l border-slate-200 bg-white flex flex-col h-full animate-slide-in flex-shrink-0">
      <div className="px-5 py-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold uppercase ${
              task.type === 'bug' ? 'text-rose-600' :
              task.type === 'feature' ? 'text-teal-600' :
              task.type === 'research' ? 'text-amber-600' :
              'text-slate-500'
            }`}>{task.type}</span>
          </div>
          <button
            onClick={onClose}
            data-testid="close-task-detail-btn"
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        <h2 className="text-base font-semibold text-slate-900 leading-snug">{task.title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {task.description && (
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-[13px] text-slate-600 whitespace-pre-wrap leading-relaxed">{task.description}</p>
          </div>
        )}

        <div className="px-5 py-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Flag size={14} />
              <span className="text-xs font-medium">Status</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full ${currentStatus?.dot}`} />
                {currentStatus?.label}
                <ChevronDown size={12} />
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1.5 min-w-36">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors flex items-center gap-2 ${
                        task.status === option.value ? 'text-teal-600 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${option.dot}`} />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Tag size={14} />
              <span className="text-xs font-medium">Priority</span>
            </div>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase ${priority?.class}`}>
              {priority?.label}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <User size={14} />
              <span className="text-xs font-medium">Assigned To</span>
            </div>
            {task.assignedTo ? (
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{getAgentDisplay(task.assignedTo).emoji}</span>
                <span className="text-xs text-slate-700 font-medium">{getAgentDisplay(task.assignedTo).name}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">Unassigned</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar size={14} />
              <span className="text-xs font-medium">Created</span>
            </div>
            <span className="text-xs text-slate-500">
              {formatDistanceToNow(task.createdAt, { addSuffix: true })}
            </span>
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="pt-1">
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
            Discussion ({messages?.length || 0})
          </h3>
          <div className="space-y-3">
            {messages?.map(message => {
              const sender = getAgentDisplay(message.fromAgentId)
              return (
                <div key={message._id} className="animate-fade-in">
                  <div className="flex items-center gap-2 mb-1.5">
                    {sender.emoji && (
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs border border-slate-200">
                        {sender.emoji}
                      </div>
                    )}
                    <span className="text-[12px] font-semibold text-slate-800">{sender.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="ml-8 bg-slate-50 rounded-lg px-3.5 py-2.5 border border-slate-100">
                    <p className="text-[12px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              )
            })}
            {(!messages || messages.length === 0) && (
              <div className="text-center py-8 text-slate-300 text-xs">
                No comments yet. Start the discussion below.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 border-t border-slate-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            placeholder="Add a comment..."
            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 transition-all"
          />
          <button
            onClick={handleSendComment}
            disabled={!newComment.trim()}
            className="p-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
