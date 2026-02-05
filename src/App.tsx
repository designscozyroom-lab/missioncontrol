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
          <div className="flex-1 overflow-auto">
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
        <div className="p-6">
          <h2 className="font-serif-display text-xl text-ink-900 mb-4">Broadcast Message</h2>
          <p className="text-ink-500">Send a message to all agents simultaneously.</p>
          <textarea
            className="w-full mt-4 p-3 border border-ink-100 rounded-lg resize-none h-32 focus:outline-none focus:ring-2 focus:ring-brick-500"
            placeholder="Type your broadcast message..."
          />
          <button className="mt-4 px-6 py-2 bg-brick-600 text-white rounded-lg hover:bg-brick-500 transition-colors">
            Send Broadcast
          </button>
        </div>
      )}
    </MainLayout>
  )
}

export default App
