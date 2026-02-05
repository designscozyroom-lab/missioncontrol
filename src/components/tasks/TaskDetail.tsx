import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { X, Send, Tag, Clock, User, ChevronDown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Id } from '../../../convex/_generated/dataModel'

interface TaskDetailProps {
  taskId: Id<'tasks'>
  onClose: () => void
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

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
}

export function TaskDetail({ taskId, onClose }: TaskDetailProps) {
  const [newComment, setNewComment] = useState('')
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  const task = useQuery(api.tasks.getTask, { taskId })
  const messages = useQuery(api.messages.getMessagesByTask, { taskId })
  const agents = useQuery(api.agents.getAllAgents) ?? []

  const createMessage = useMutation(api.messages.createMessage)
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus)

  if (!task) {
    return (
      <div className="h-full flex items-center justify-center text-ink-500">
        Loading...
      </div>
    )
  }

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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-ink-100 flex items-start justify-between">
        <div className="flex-1 pr-4">
          <h2 className="font-medium text-ink-900 text-lg leading-tight">
            {task.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-cream-100 rounded transition-colors"
        >
          <X size={20} className="text-ink-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
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
                        task.status === option.value ? 'text-brick-600 font-medium' : 'text-ink-700'
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
            <span className={`text-xs px-2 py-1 rounded font-medium ${priorityColors[task.priority]}`}>
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

          {/* Created By */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-500">Created By</span>
            <span className="text-sm text-ink-700">{getAgentName(task.createdBy)}</span>
          </div>

          {/* Created At */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-500">Created</span>
            <span className="text-sm text-ink-700">
              {formatDistanceToNow(task.createdAt, { addSuffix: true })}
            </span>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-500">Tags</span>
              <div className="flex items-center gap-1 flex-wrap justify-end">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-cream-100 text-ink-500 px-1.5 py-0.5 rounded flex items-center gap-1"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="p-4 border-b border-ink-100">
          <h3 className="text-sm font-medium text-ink-700 mb-2">Description</h3>
          <p className="text-sm text-ink-600 whitespace-pre-wrap">
            {task.description || 'No description provided.'}
          </p>
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
            className="flex-1 px-3 py-2 border border-ink-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brick-500 focus:border-transparent"
          />
          <button
            onClick={handleSendComment}
            disabled={!newComment.trim()}
            className="p-2 bg-brick-600 text-white rounded-lg hover:bg-brick-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
