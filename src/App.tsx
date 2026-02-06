import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { MainLayout, type ViewMode } from './components/layout/MainLayout'
import { DashboardView } from './components/dashboard/DashboardView'
import { TaskBoard } from './components/tasks/TaskBoard'
import { TaskDetail } from './components/tasks/TaskDetail'
import { ActivityFeed } from './components/activity/ActivityFeed'
import { DocumentList } from './components/documents/DocumentList'
import type { Id } from '../convex/_generated/dataModel'
import { Radio, Send } from 'lucide-react'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [selectedTaskId, setSelectedTaskId] = useState<Id<'tasks'> | null>(null)
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string | null>(null)

  const agents = useQuery(api.agents.getAllAgents) ?? []
  const tasks = useQuery(api.tasks.getAllTasks) ?? []
  const activities = useQuery(api.activities.getRecentActivities, { limit: 50 }) ?? []
  const documents = useQuery(api.documents.getAllDocuments) ?? []

  const activeAgents = agents.filter(a => a.status === 'active').length

  const taskCounts: Record<string, number> = {
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

  const handleNavigate = (mode: ViewMode) => {
    setViewMode(mode)
  }

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
      {viewMode === 'dashboard' && (
        <DashboardView
          tasks={tasks}
          agents={agents}
          activities={activities}
          onNavigate={handleNavigate}
          onTaskSelect={(id) => {
            setSelectedTaskId(id)
            setViewMode('tasks')
          }}
        />
      )}

      {viewMode === 'tasks' && (
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

      {viewMode === 'activity' && (
        <ActivityFeed activities={activities} />
      )}

      {viewMode === 'docs' && (
        <DocumentList documents={documents} />
      )}

      {viewMode === 'broadcast' && (
        <div className="h-full flex items-center justify-center p-6">
          <div className="max-w-xl w-full">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-4">
                <Radio size={24} className="text-teal-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Broadcast Message</h2>
              <p className="text-sm text-slate-500">Send a message to all agents simultaneously</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <textarea
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none h-32 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 transition-all"
                placeholder="Type your broadcast message..."
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-slate-400">{agents.length} agents will receive this</span>
                <button className="flex items-center gap-2 px-5 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors text-sm font-medium">
                  <Send size={14} />
                  Send Broadcast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default App
