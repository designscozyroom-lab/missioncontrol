# Mission Control PRD

## Original Problem Statement
Fix the Mission Control UI to match the reference design image provided by the user. The UI was previously broken/messed up and needed to be restructured to display properly.

## Architecture
- **Frontend**: Vite + React + TypeScript + Tailwind CSS v4
- **Backend**: Convex (serverless database at https://formal-labrador-839.convex.cloud)
- **Key Components**:
  - MainLayout - Header + Sidebar + Content area
  - TaskBoard - Kanban board with filter tabs
  - TaskDetail - Right panel for task details
  - AgentCard - Agent display in sidebar
  - ActivityFeed - Chat/activity view
  - DocumentList - Docs view

## User Personas
- Team leads managing multiple agents
- Agents working on assigned tasks
- Project managers overseeing task queues

## Core Requirements
1. Header with MISSION CONTROL logo, SiteGPT badge, agent/task counts
2. Navigation tabs: Active, Chat, Broadcast, Docs
3. Time display with ONLINE status indicator
4. Left sidebar with Agents section and progress ring
5. Individual agent cards with emoji, name, level tags, status, role
6. Mission Queue with filter tabs (All, Inbox, Assigned, Active, Review, Done, Waiting)
7. Three-column Kanban board (ASSIGNED, IN PROGRESS, REVIEW)
8. Task detail panel with full task information

## What's Been Implemented (Feb 5, 2026)
- ✅ Fixed MainLayout component to match reference design
- ✅ Updated header with proper structure and styling
- ✅ Added All Agents progress ring visualization
- ✅ Fixed agent cards with level tags and status indicators
- ✅ Updated TaskBoard with proper filter tabs and column layout
- ✅ Fixed TaskCard component with bracket icon and chevron
- ✅ Updated TaskDetail panel with playbook content structure
- ✅ Connected to Convex backend (formal-labrador-839)
- ✅ Fixed Tailwind CSS v4 theme configuration

## Prioritized Backlog
### P0 (Critical)
- All critical UI features implemented ✅

### P1 (High Priority)
- Add sample tasks to demonstrate full functionality
- Implement task creation from dashboard
- Add drag-and-drop for task status changes

### P2 (Medium Priority)  
- Implement real-time notifications
- Add search functionality
- Implement broadcast messaging

## Next Tasks
1. Seed sample tasks in Convex database to show full Kanban functionality
2. Add task creation modal
3. Implement agent assignment dropdown in task detail
4. Add more agent data matching the reference (Bhanu, Friday, Fury, Groot, etc.)
