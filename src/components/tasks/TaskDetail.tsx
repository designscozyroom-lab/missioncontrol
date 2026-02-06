import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { X, ArrowLeft, Send, ChevronDown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Id, Doc } from '../../../convex/_generated/dataModel'

interface TaskDetailProps {
  taskId: Id<'tasks'>
  task: Doc<'tasks'>
  onClose: () => void
  agents: Doc<'agents'>[]
}

const statusOptions = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
]

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

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.agentId === agentId)
    return agent ? `${agent.emoji} ${agent.name}` : agentId
  }

  return (
    <div className="w-[420px] border-l border-ink-100 bg-white flex flex-col h-full animate-slide-in flex-shrink-0">
      <div className="px-4 py-3 border-b border-ink-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-coral-500 text-xs">&#9679;</span>
            <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">Task Detail</span>
          </div>
          <button
            onClick={onClose}
            data-testid="close-task-detail-btn"
            className="p-1 hover:bg-cream-100 rounded transition-colors"
          >
            <X size={16} className="text-ink-400" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-[12px] text-ink-500 hover:text-ink-700 transition-colors"
          >
            <ArrowLeft size={12} />
            Back to Task
          </button>
          <span className="px-2.5 py-1 border border-ink-200 rounded text-[10px] font-medium text-ink-500 uppercase tracking-wider">
            Deliverable
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 border-b border-ink-100">
          <h2 className="text-base font-semibold text-ink-900 leading-snug">
            {task.title}
          </h2>
        </div>

        {task.description && (
          <div className="px-4 py-3 border-b border-ink-100">
            <h3 className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-[13px] text-ink-700 whitespace-pre-wrap leading-relaxed">
              {task.description}
            </p>
          </div>
        )}

        <div className="px-4 py-3 border-b border-ink-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-ink-400">Status</span>
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-1 px-2 py-0.5 bg-cream-100 rounded text-[12px] font-medium text-ink-700 hover:bg-cream-200 transition-colors"
              >
                {statusOptions.find(s => s.value === task.status)?.label}
                <ChevronDown size={12} />
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-ink-100 rounded-lg shadow-lg z-10 py-1 min-w-28">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={`w-full text-left px-3 py-1.5 text-[12px] hover:bg-cream-50 transition-colors ${
                        task.status === option.value ? 'text-coral-600 font-medium' : 'text-ink-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[12px] text-ink-400">Priority</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide ${
              task.priority === 'urgent' ? 'bg-red-100 text-red-600' :
              task.priority === 'high' ? 'bg-orange-100 text-orange-600' :
              task.priority === 'medium' ? 'bg-sky-100 text-sky-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {task.priority}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[12px] text-ink-400">Assigned To</span>
            <span className="text-[12px] text-ink-700 font-medium">
              {task.assignedTo ? getAgentName(task.assignedTo) : 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[12px] text-ink-400">Created</span>
            <span className="text-[12px] text-ink-500">
              {formatDistanceToNow(task.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="px-4 py-3">
          <h3 className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-3">
            Comments ({messages?.length || 0})
          </h3>
          <div className="space-y-2">
            {messages?.map((message) => (
              <div key={message._id} className="bg-cream-50 rounded-lg p-3 animate-fade-in">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-medium text-ink-700">
                    {getAgentName(message.fromAgentId)}
                  </span>
                  <span className="text-[10px] text-ink-400">
                    {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-[12px] text-ink-600 whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              </div>
            ))}
            {(!messages || messages.length === 0) && (
              <p className="text-[12px] text-ink-400 text-center py-4">
                No comments yet
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-ink-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-1.5 border border-ink-100 rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-coral-400 focus:border-coral-400 transition-colors"
          />
          <button
            onClick={handleSendComment}
            disabled={!newComment.trim()}
            className="p-1.5 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
