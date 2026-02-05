// Mock data for Mission Control UI - bypasses Convex backend

export interface Agent {
  _id: string
  agentId: string
  name: string
  emoji: string
  role: string
  status: 'active' | 'idle' | 'blocked' | 'offline'
  level: 'LEAD' | 'SPC' | 'INT' | 'WORKING'
  lastHeartbeat: number
}

export interface Task {
  _id: string
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
  content?: string
}

export interface Activity {
  _id: string
  agentId: string
  action: string
  targetType: 'task' | 'message' | 'document' | 'agent'
  targetId: string
  message: string
  createdAt: number
}

export interface Document {
  _id: string
  agentId: string
  title: string
  type: 'report' | 'code' | 'design' | 'notes' | 'other'
  content: string
  createdAt: number
}

export const mockAgents: Agent[] = [
  { _id: '1', agentId: 'bhanu', name: 'Bhanu', emoji: '👤', role: 'Founder', status: 'active', level: 'LEAD', lastHeartbeat: Date.now() },
  { _id: '2', agentId: 'friday', name: 'Friday', emoji: '🤖', role: 'Developer Agent', status: 'active', level: 'INT', lastHeartbeat: Date.now() },
  { _id: '3', agentId: 'fury', name: 'Fury', emoji: '😎', role: 'Customer Rese...', status: 'active', level: 'SPC', lastHeartbeat: Date.now() },
  { _id: '4', agentId: 'groot', name: 'Groot', emoji: '🌳', role: 'Retention Spec...', status: 'active', level: 'SPC', lastHeartbeat: Date.now() },
  { _id: '5', agentId: 'hawkeye', name: 'Hawkeye', emoji: '🎯', role: 'Outbound Scout', status: 'active', level: 'SPC', lastHeartbeat: Date.now() },
  { _id: '6', agentId: 'jarvis', name: 'Jarvis', emoji: '🧠', role: 'Squad Lead', status: 'active', level: 'LEAD', lastHeartbeat: Date.now() },
  { _id: '7', agentId: 'loki', name: 'Loki', emoji: '🦊', role: 'Content Writer', status: 'active', level: 'SPC', lastHeartbeat: Date.now() },
  { _id: '8', agentId: 'pepper', name: 'Pepper', emoji: '🌶️', role: 'Email Marketin...', status: 'active', level: 'INT', lastHeartbeat: Date.now() },
  { _id: '9', agentId: 'quill', name: 'Quill', emoji: '🖊️', role: 'Social Media', status: 'active', level: 'INT', lastHeartbeat: Date.now() },
  { _id: '10', agentId: 'rob', name: 'Rob', emoji: '👨‍💼', role: 'Strategic Advis...', status: 'active', level: 'WORKING', lastHeartbeat: Date.now() },
  { _id: '11', agentId: 'stark', name: 'Stark', emoji: '⚡', role: 'Tech Lead', status: 'active', level: 'LEAD', lastHeartbeat: Date.now() },
  { _id: '12', agentId: 'thor', name: 'Thor', emoji: '⚡', role: 'Partnership', status: 'active', level: 'SPC', lastHeartbeat: Date.now() },
  { _id: '13', agentId: 'vision', name: 'Vision', emoji: '👁️', role: 'Analytics', status: 'active', level: 'INT', lastHeartbeat: Date.now() },
  { _id: '14', agentId: 'wanda', name: 'Wanda', emoji: '✨', role: 'Design Lead', status: 'active', level: 'LEAD', lastHeartbeat: Date.now() },
  { _id: '15', agentId: 'banner', name: 'Banner', emoji: '🔬', role: 'Research', status: 'idle', level: 'SPC', lastHeartbeat: Date.now() - 600000 },
  { _id: '16', agentId: 'natasha', name: 'Natasha', emoji: '🕷️', role: 'Ops Manager', status: 'offline', level: 'LEAD', lastHeartbeat: Date.now() - 3600000 },
]

export const mockTasks: Task[] = [
  // ASSIGNED tasks
  { _id: 't1', title: 'Email Sequence Bento Implementation', description: 'Implement email sequence using Bento', status: 'assigned', assignedTo: 'bhanu', createdBy: 'jarvis', priority: 'high', type: 'task', tags: ['email'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't2', title: 'Execute Real Estate Page Distribution', description: '', status: 'assigned', assignedTo: 'bhanu', createdBy: 'jarvis', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't3', title: 'Outbound Distribution - Week 2 Exp...', description: '', status: 'assigned', assignedTo: 'friday', createdBy: 'jarvis', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't4', title: 'Social Content: Use Case Launch Th...', description: '', status: 'assigned', assignedTo: 'friday', createdBy: 'pepper', priority: 'high', type: 'feature', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't5', title: 'Programmatic SEO - Integration Pag...', description: '', status: 'assigned', assignedTo: 'friday', createdBy: 'groot', priority: 'medium', type: 'task', tags: ['seo'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't6', title: 'Twitter Thread - Reduce Support Tic...', description: '', status: 'assigned', assignedTo: 'fury', createdBy: 'quill', priority: 'low', type: 'task', tags: ['social'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't7', title: 'Schema Markup Implementation - Pr...', description: '', status: 'assigned', assignedTo: 'fury', createdBy: 'friday', priority: 'medium', type: 'task', tags: ['seo'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't8', title: 'Programmatic SEO: Industry Landin...', description: '', status: 'assigned', assignedTo: 'groot', createdBy: 'friday', priority: 'high', type: 'feature', tags: ['seo'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't9', title: 'Competitor Widget Screenshot Gall...', description: '', status: 'assigned', assignedTo: 'groot', createdBy: 'vision', priority: 'low', type: 'research', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't10', title: 'AI Directory Submission Campaign -...', description: '', status: 'assigned', assignedTo: 'hawkeye', createdBy: 'jarvis', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't11', title: 'Trial Activation Playbook - Increase F...', description: '', status: 'assigned', assignedTo: 'hawkeye', createdBy: 'groot', priority: 'high', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't12', title: 'Email Nurture Sequence: Product-Fir...', description: '', status: 'assigned', assignedTo: 'jarvis', createdBy: 'pepper', priority: 'high', type: 'task', tags: ['email'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't13', title: 'Healthcare Use Case Email Nurture...', description: '', status: 'assigned', assignedTo: 'jarvis', createdBy: 'pepper', priority: 'medium', type: 'task', tags: ['email'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  
  // IN PROGRESS tasks
  { _id: 't14', title: 'Listicle Outreach Campaign - 5 Targ...', description: '', status: 'in_progress', assignedTo: 'bhanu', createdBy: 'hawkeye', priority: 'high', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't15', title: 'List SiteGPT on Zendesk Marketplace', description: '', status: 'in_progress', assignedTo: 'bhanu', createdBy: 'jarvis', priority: 'urgent', type: 'task', tags: ['integration'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't16', title: 'Zendesk Marketplace Listing - Subm...', description: '', status: 'in_progress', assignedTo: 'friday', createdBy: 'jarvis', priority: 'high', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't17', title: 'AI Directory Mass Submission - 100+...', description: '', status: 'in_progress', assignedTo: 'friday', createdBy: 'hawkeye', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't18', title: 'AI Directory Submission Blitz - Futur...', description: '', status: 'in_progress', assignedTo: 'friday', createdBy: 'hawkeye', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't19', title: 'Listicle Outreach: bolddesk.com - R...', description: '', status: 'in_progress', assignedTo: 'fury', createdBy: 'hawkeye', priority: 'high', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't20', title: 'Listicle Outreach: lindy.ai - Request...', description: '', status: 'in_progress', assignedTo: 'fury', createdBy: 'hawkeye', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't21', title: 'Healthcare Vertical Outbound - Blue...', description: '', status: 'in_progress', assignedTo: 'groot', createdBy: 'hawkeye', priority: 'high', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't22', title: 'Use Case Implementation Guides - D...', description: '', status: 'in_progress', assignedTo: 'groot', createdBy: 'friday', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't23', title: 'Email Nurture Sequences for Use Ca...', description: '', status: 'in_progress', assignedTo: 'hawkeye', createdBy: 'pepper', priority: 'high', type: 'task', tags: ['email'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't24', title: 'Industry Implementation Guides - H...', description: '', status: 'in_progress', assignedTo: 'hawkeye', createdBy: 'friday', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't25', title: 'Vertical Setup Guides - Healthcare,...', description: '', status: 'in_progress', assignedTo: 'jarvis', createdBy: 'friday', priority: 'high', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't26', title: 'Zendesk Integration Page - Full Copy', description: '', status: 'in_progress', assignedTo: 'jarvis', createdBy: 'friday', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't27', title: 'SaaS Use Case Page - Visual Graphic...', description: '', status: 'in_progress', assignedTo: 'loki', createdBy: 'wanda', priority: 'high', type: 'task', tags: ['design'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't28', title: 'Churn Risk Scoring System - Operati...', description: '', status: 'in_progress', assignedTo: 'loki', createdBy: 'groot', priority: 'urgent', type: 'feature', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't29', title: 'SiteGPT UX Improvement Recommen...', description: '', status: 'in_progress', assignedTo: 'pepper', createdBy: 'wanda', priority: 'high', type: 'research', tags: ['ux'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't30', title: 'Use Case Page Graphics - E-commer...', description: '', status: 'in_progress', assignedTo: 'pepper', createdBy: 'wanda', priority: 'medium', type: 'task', tags: ['design'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't31', title: 'Twitter Thread - First 30 Days Activat...', description: '', status: 'in_progress', assignedTo: 'quill', createdBy: 'groot', priority: 'high', type: 'task', tags: ['social'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  
  // REVIEW tasks
  { _id: 't32', title: 'SiteGPT Hero Video - Higgsfield Prod...', description: '', status: 'review', assignedTo: 'bhanu', createdBy: 'wanda', priority: 'urgent', type: 'task', tags: ['video'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't33', title: 'Conduct Pricing Audit Using Rob Wa...', description: '', status: 'review', assignedTo: 'bhanu', createdBy: 'jarvis', priority: 'high', type: 'research', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't34', title: 'Competitor Pricing Research', description: '', status: 'review', assignedTo: 'friday', createdBy: 'jarvis', priority: 'medium', type: 'research', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't35', title: 'Indie Hackers Ideas Database - Add...', description: '', status: 'review', assignedTo: 'friday', createdBy: 'hawkeye', priority: 'low', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't36', title: 'SEO Guide: How to Reduce Support...', description: '', status: 'review', assignedTo: 'friday', createdBy: 'fury', priority: 'medium', type: 'task', tags: ['seo'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't37', title: 'Keyword Research: Product-First Co...', description: '', status: 'review', assignedTo: 'fury', createdBy: 'friday', priority: 'high', type: 'research', tags: ['seo'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't38', title: 'Use Case Keyword Research & Cont...', description: '', status: 'review', assignedTo: 'fury', createdBy: 'friday', priority: 'medium', type: 'research', tags: ['seo'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't39', title: 'Implement Schema Markup on SiteG...', description: '', status: 'review', assignedTo: 'groot', createdBy: 'friday', priority: 'high', type: 'task', tags: ['seo'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't40', title: 'Webflow Integration Guide - Full Doc...', description: '', status: 'review', assignedTo: 'groot', createdBy: 'friday', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't41', title: 'Use Case Pages: E-commerce + Real...', description: '', status: 'review', assignedTo: 'hawkeye', createdBy: 'friday', priority: 'high', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't42', title: 'Real Estate Social Carousel - Linked...', description: '', status: 'review', assignedTo: 'hawkeye', createdBy: 'quill', priority: 'medium', type: 'task', tags: ['social'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't43', title: 'Product-First SEO Keyword Map - Us...', description: '', status: 'review', assignedTo: 'jarvis', createdBy: 'friday', priority: 'high', type: 'research', tags: ['seo'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't44', title: 'How to Add a Chatbot to Your Webs...', description: '', status: 'review', assignedTo: 'jarvis', createdBy: 'friday', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't45', title: 'Use Case Landing Page Copy - 3 Cor...', description: '', status: 'review', assignedTo: 'loki', createdBy: 'friday', priority: 'high', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't46', title: 'Create Intercom Data Source Docu...', description: '', status: 'review', assignedTo: 'loki', createdBy: 'friday', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't47', title: 'Retention Email Sequence - Save At-...', description: '', status: 'review', assignedTo: 'pepper', createdBy: 'groot', priority: 'urgent', type: 'task', tags: ['email'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't48', title: 'Functions Feature Page - Chatbot A...', description: '', status: 'review', assignedTo: 'pepper', createdBy: 'friday', priority: 'high', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't49', title: 'Email Nurture Sequence for ROI Calc...', description: '', status: 'review', assignedTo: 'quill', createdBy: 'pepper', priority: 'high', type: 'task', tags: ['email'], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't50', title: 'ROI Calculator - User Documentatio...', description: '', status: 'review', assignedTo: 'rob', createdBy: 'friday', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't51', title: 'Documentation Sync - New Feature...', description: '', status: 'review', assignedTo: 'rob', createdBy: 'friday', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't52', title: 'Use Case Documentation Guides - D...', description: '', status: 'review', assignedTo: 'rob', createdBy: 'friday', priority: 'low', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  
  // Waiting/Done for count purposes  
  { _id: 't53', title: 'API Documentation Update', description: '', status: 'waiting', assignedTo: 'friday', createdBy: 'jarvis', priority: 'medium', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't54', title: 'Customer Onboarding Flow Review', description: '', status: 'waiting', assignedTo: 'groot', createdBy: 'jarvis', priority: 'high', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  { _id: 't55', title: 'Integration Testing Complete', description: '', status: 'done', assignedTo: 'friday', createdBy: 'jarvis', priority: 'high', type: 'task', tags: [], createdAt: Date.now() - 86400000, updatedAt: Date.now() },
  
  // Special task - SiteGPT First 30 Days Success Playbook
  {
    _id: 'playbook',
    title: 'SiteGPT First 30 Days Success Playbook',
    description: `Purpose: Define what ACTIVATED customers should accomplish in their first 30 days to become sticky, long-term users. Churn is an activation problem—customers who don't properly activate become "customers" by billing but leave quickly.`,
    status: 'review',
    assignedTo: 'bhanu',
    createdBy: 'jarvis',
    priority: 'urgent',
    type: 'task',
    tags: ['customer-success', 'playbook'],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
    content: `# SiteGPT First 30 Days Success Playbook

## Purpose
Define what ACTIVATED customers should accomplish in their first 30 days to become sticky, long-term users. Churn is an activation problem—customers who don't properly activate become "customers" by billing but leave quickly.

## Days 1-7: Foundation Phase

### Goal: Functional Chatbot That Answers Real Questions

The first week is critical. Customers who don't create and test a working chatbot within 7 days have **3x higher churn rates**.

### Key Milestones

| DAY | MILESTONE | SUCCESS CRITERIA |
|-----|-----------|------------------|
| 1 | Account setup complete | Email verified, profile filled |
| 1-2 | First chatbot created | At least 1 chatbot exists |
| 2-3 | Training data added | Minimum 5 pages/documents trained |
| 3-5 | Chatbot tested | 10+ test conversations in playground |
| 5-7 | First satisfactory response | User marks at least 1 response as helpful |

### What They Should Accomplish

1. **Create their first chatbot** with a clear name and purpose
2. **Train on their content:**
   - Website URL crawl (minimum 5 pages)
   - Upload key documents (FAQ, knowledge base)
   - Add manual Q&A pairs for critical questions
3. **Test extensively in playground:**
   - Try 10+ different questions
   - Identify gaps in responses
   - Mark helpful/unhelpful responses
4. **Customize basic appearance:**
   - Brand colors
   - Welcome message
   - Avatar/logo

## Days 8-14: Integration Phase

### Goal: Live Chatbot on Their Website

### Key Milestones

| DAY | MILESTONE | SUCCESS CRITERIA |
|-----|-----------|------------------|
| 8-9 | Widget code copied | Code snippet accessed |
| 9-10 | Widget installed | First external ping received |
| 10-12 | First visitor conversation | Non-test conversation logged |
| 12-14 | Basic customization done | Widget matches brand |

## Days 15-30: Optimization Phase

### Goal: Measurable Business Impact

### Key Milestones

| DAY | MILESTONE | SUCCESS CRITERIA |
|-----|-----------|------------------|
| 15-20 | Response improvements | Training gaps addressed |
| 20-25 | Team access setup | At least 1 team member added |
| 25-30 | Impact measured | Can articulate value/ROI |`
  }
]

export const mockActivities: Activity[] = [
  { _id: 'a1', agentId: 'bhanu', action: 'status_changed', targetType: 'task', targetId: 't1', message: 'moved "Email Sequence" to review', createdAt: Date.now() - 3600000 },
  { _id: 'a2', agentId: 'friday', action: 'created', targetType: 'task', targetId: 't5', message: 'created new task "Programmatic SEO"', createdAt: Date.now() - 7200000 },
  { _id: 'a3', agentId: 'jarvis', action: 'assigned', targetType: 'task', targetId: 't12', message: 'assigned "Email Nurture Sequence" to jarvis', createdAt: Date.now() - 10800000 },
  { _id: 'a4', agentId: 'pepper', action: 'commented', targetType: 'task', targetId: 't29', message: 'commented on "SiteGPT UX Improvement"', createdAt: Date.now() - 14400000 },
  { _id: 'a5', agentId: 'groot', action: 'standup', targetType: 'agent', targetId: 'groot', message: 'posted daily standup update', createdAt: Date.now() - 18000000 },
]

export const mockDocuments: Document[] = [
  { _id: 'd1', agentId: 'friday', title: 'API Integration Guide', type: 'code', content: 'Step-by-step guide for integrating SiteGPT API...', createdAt: Date.now() - 86400000 },
  { _id: 'd2', agentId: 'loki', title: 'Content Strategy Q1', type: 'report', content: 'Our Q1 content strategy focuses on...', createdAt: Date.now() - 172800000 },
  { _id: 'd3', agentId: 'wanda', title: 'Brand Guidelines', type: 'design', content: 'Official brand colors, fonts, and usage guidelines...', createdAt: Date.now() - 259200000 },
  { _id: 'd4', agentId: 'jarvis', title: 'Meeting Notes - Jan 30', type: 'notes', content: 'Discussion points from team sync...', createdAt: Date.now() - 345600000 },
]
