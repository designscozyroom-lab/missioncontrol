import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { MainLayout } from './components/layout/MainLayout'
import { TaskBoard } from './components/tasks/TaskBoard'
import { TaskDetail } from './components/tasks/TaskDetail'
import { ActivityFeed } from './components/activity/ActivityFeed'
import { DocumentList } from './components/documents/DocumentList'
import type { Id } from '../convex/_generated/dataModel'

type ViewMode = 'active' | 'chat' | 'broadcast' | 'docs'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('active')
  const [selectedTaskId, setSelectedTaskId] = useState<Id<'tasks'> | null>(null)
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string | null>(null)

  const agents = useQuery(api.agents.getAllAgents) ?? []
  const tasks = useQuery(api.tasks.getAllTasks) ?? []
  const activities = useQuery(api.activities.getRecentActivities, { limit: 50 }) ?? []
  const documents = useQuery(api.documents.getAllDocuments) ?? []

  const activeAgents = agents.filter(a => a.status === 'active').length

  const taskCounts = {
    inbox: tasks.filter(t => t.status === 'inbox').length,
    assigned: tasks.filter(t => t.status === 'assigned').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    done: tasks.filter(t => t.status === 'done').length,
    waiting: tasks.filter(t => t.status === 'waiting').length,
  }

  const filteredTasks = selectedAgentFilter
    ? tasks.filter(t => t.assignedTo === selectedAgentFilter)
    : tasks

  const selectedTask = selectedTaskId ? tasks.find(t => t._id === selectedTaskId) : null

  return (
    <MainLayout
      agents={agents}
      activeAgents={activeAgents}
      taskCount={tasks.length}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      selectedAgentFilter={selectedAgentFilter}
      onAgentFilterChange={setSelectedAgentFilter}
    >
      {viewMode === 'active' && (
        <div className="flex h-full">
          <div className="flex-1 overflow-auto min-w-0">
            <TaskBoard
              tasks={filteredTasks}
              taskCounts={taskCounts}
              onTaskSelect={setSelectedTaskId}
              selectedTaskId={selectedTaskId}
            />
          </div>
          {selectedTask && (
            <TaskDetail
              taskId={selectedTaskId!}
              task={selectedTask}
              onClose={() => setSelectedTaskId(null)}
              agents={agents}
            />
          )}
        </div>
      )}

      {viewMode === 'chat' && (
        <ActivityFeed activities={activities} />
      )}

      {viewMode === 'docs' && (
        <DocumentList documents={documents} />
      )}

      {viewMode === 'broadcast' && (
        <div className="h-full flex flex-col">
          <div className="px-4 py-3 border-b border-ink-100 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-coral-500 text-xs">&#9733;</span>
              <h2 className="text-[11px] font-semibold text-ink-700 uppercase tracking-wider">
                Broadcast Message
              </h2>
            </div>
          </div>
          <div className="flex-1 p-4">
            <p className="text-[13px] text-ink-500 mb-3">Send a message to all agents simultaneously.</p>
            <textarea
              className="w-full max-w-xl p-3 border border-ink-100 rounded-lg resize-none h-28 text-[13px] focus:outline-none focus:ring-1 focus:ring-coral-400 focus:border-coral-400 transition-colors"
              placeholder="Type your broadcast message..."
            />
            <button className="mt-3 px-5 py-1.5 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors text-[13px] font-medium">
              Send Broadcast
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default App
