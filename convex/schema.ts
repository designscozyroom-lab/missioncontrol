import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Agent registry - tracks all agents and their status
  agents: defineTable({
    agentId: v.string(),
    name: v.string(),
    emoji: v.string(),
    role: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("blocked"),
      v.literal("offline")
    ),
    level: v.union(
      v.literal("LEAD"),
      v.literal("SPC"),
      v.literal("INT"),
      v.literal("WORKING")
    ),
    sessionKey: v.optional(v.string()),
    lastHeartbeat: v.number(),
    currentTaskId: v.optional(v.id("tasks")),
  })
    .index("by_agentId", ["agentId"])
    .index("by_status", ["status"]),

  // Tasks - work items for agents
  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("blocked"),
      v.literal("waiting"),
      v.literal("review"),
      v.literal("done")
    ),
    assignedTo: v.optional(v.string()),
    createdBy: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    type: v.union(
      v.literal("task"),
      v.literal("bug"),
      v.literal("feature"),
      v.literal("research")
    ),
    tags: v.array(v.string()),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_assignedTo", ["assignedTo"])
    .index("by_createdBy", ["createdBy"])
    .index("by_priority", ["priority"]),

  // Messages - comments on tasks
  messages: defineTable({
    taskId: v.id("tasks"),
    fromAgentId: v.string(),
    content: v.string(),
    mentions: v.array(v.string()),
    attachments: v.array(
      v.object({
        name: v.string(),
        url: v.string(),
        type: v.string(),
      })
    ),
    createdAt: v.number(),
  })
    .index("by_taskId", ["taskId"])
    .index("by_fromAgentId", ["fromAgentId"]),

  // Documents - deliverables and artifacts
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("report"),
      v.literal("code"),
      v.literal("design"),
      v.literal("notes"),
      v.literal("other"),
      v.literal("deliverable")
    ),
    taskId: v.optional(v.id("tasks")),
    agentId: v.string(),
    // For deduplication - stores file path or content hash
    sourcePath: v.optional(v.string()),
    contentHash: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_taskId", ["taskId"])
    .index("by_agentId", ["agentId"])
    .index("by_sourcePath", ["sourcePath"])
    .index("by_contentHash", ["contentHash"]),

  // Activities - activity feed
  activities: defineTable({
    agentId: v.string(),
    action: v.string(),
    targetType: v.union(
      v.literal("task"),
      v.literal("message"),
      v.literal("document"),
      v.literal("agent")
    ),
    targetId: v.string(),
    message: v.string(),
    createdAt: v.number(),
  })
    .index("by_agentId", ["agentId"])
    .index("by_createdAt", ["createdAt"]),

  // Notifications - @mentions and alerts
  notifications: defineTable({
    mentionedAgentId: v.string(),
    content: v.string(),
    sourceAgentId: v.string(),
    taskId: v.optional(v.id("tasks")),
    messageId: v.optional(v.id("messages")),
    delivered: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_mentionedAgentId", ["mentionedAgentId"])
    .index("by_delivered", ["delivered"])
    .index("by_mentionedAgentId_delivered", ["mentionedAgentId", "delivered"]),

  // Subscriptions - thread follows
  subscriptions: defineTable({
    agentId: v.string(),
    taskId: v.id("tasks"),
    createdAt: v.number(),
  })
    .index("by_agentId", ["agentId"])
    .index("by_taskId", ["taskId"])
    .index("by_agentId_taskId", ["agentId", "taskId"]),

  // Standups - daily reports
  standups: defineTable({
    date: v.string(),
    agentId: v.string(),
    completed: v.array(v.string()),
    planned: v.array(v.string()),
    blockers: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_agentId", ["agentId"])
    .index("by_date_agentId", ["date", "agentId"]),
});
