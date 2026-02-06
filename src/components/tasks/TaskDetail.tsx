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
    <div className="w-[450px] border-l border-ink-100 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-ink-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-500">●</span>
            <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">TASK DETAIL</span>
          </div>
          <button
            onClick={onClose}
            data-testid="close-task-detail-btn"
            className="p-1 hover:bg-cream-100 rounded transition-colors"
          >
            <X size={18} className="text-ink-400" />
          </button>
        </div>
        
        {/* Back button and Deliverable */}
        <div className="flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center gap-1 text-sm text-ink-500 hover:text-ink-700"
          >
            <ArrowLeft size={14} />
            Back to Task
          </button>
          <button className="px-3 py-1 border border-ink-200 rounded text-xs text-ink-500 hover:bg-cream-50">
            DELIVERABLE
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Task Title */}
        <div className="p-4 border-b border-ink-100">
          <div className="flex items-start gap-2 mb-4">
            <span className="text-amber-500 text-lg">📄</span>
            <h2 className="font-serif text-xl text-ink-900 leading-tight">
              {task.title}
            </h2>
          </div>
        </div>

        {/* Task Description */}
        {task.description && (
          <div className="p-4 border-b border-ink-100">
            <h3 className="font-serif text-sm font-semibold text-ink-500 uppercase tracking-wider mb-3">
              Description
            </h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-ink-700 whitespace-pre-wrap leading-relaxed">
                {task.description}
              </p>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="p-4 border-b border-ink-100 space-y-3">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-500">Status</span>
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-1 px-2 py-1 bg-cream-100 rounded text-sm font-medium text-ink-700 hover:bg-cream-200 transition-colors"
              >
                {statusOptions.find(s => s.value === task.status)?.label}
                <ChevronDown size={14} />
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-ink-100 rounded-lg shadow-lg z-10 py-1 min-w-32">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-cream-50 ${
                        task.status === option.value ? 'text-amber-600 font-medium' : 'text-ink-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-500">Priority</span>
            <span className={`text-xs px-2 py-1 rounded font-medium ${
              task.priority === 'urgent' ? 'bg-red-100 text-red-600' :
              task.priority === 'high' ? 'bg-orange-100 text-orange-600' :
              task.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {task.priority}
            </span>
          </div>

          {/* Assigned To */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-500">Assigned To</span>
            <span className="text-sm text-ink-700">
              {task.assignedTo ? getAgentName(task.assignedTo) : 'Unassigned'}
            </span>
          </div>

          {/* Created */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-500">Created</span>
            <span className="text-sm text-ink-700">
              {formatDistanceToNow(task.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Comments */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-ink-700 mb-3">
            Comments ({messages?.length || 0})
          </h3>
          <div className="space-y-3">
            {messages?.map((message) => (
              <div key={message._id} className="bg-cream-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-ink-700">
                    {getAgentName(message.fromAgentId)}
                  </span>
                  <span className="text-xs text-ink-400">
                    {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-ink-600 whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            ))}
            {(!messages || messages.length === 0) && (
              <p className="text-sm text-ink-400 text-center py-4">
                No comments yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t border-ink-100 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-ink-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <button
            onClick={handleSendComment}
            disabled={!newComment.trim()}
            className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
