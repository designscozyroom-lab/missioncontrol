import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new task
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    createdBy: v.string(),
    assignedTo: v.optional(v.string()),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    type: v.optional(
      v.union(
        v.literal("task"),
        v.literal("bug"),
        v.literal("feature"),
        v.literal("research")
      )
    ),
    tags: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const status = args.assignedTo ? "assigned" : "inbox";

    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status,
      assignedTo: args.assignedTo,
      createdBy: args.createdBy,
      priority: args.priority || "medium",
      type: args.type || "task",
      tags: args.tags || [],
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
    });

    // Auto-subscribe creator
    await ctx.db.insert("subscriptions", {
      agentId: args.createdBy,
      taskId,
      createdAt: now,
    });

    // Auto-subscribe assignee and create notification
    if (args.assignedTo && args.assignedTo !== args.createdBy) {
      await ctx.db.insert("subscriptions", {
        agentId: args.assignedTo,
        taskId,
        createdAt: now,
      });

      await ctx.db.insert("notifications", {
        mentionedAgentId: args.assignedTo,
        content: `You've been assigned task: ${args.title}`,
        sourceAgentId: args.createdBy,
        taskId,
        delivered: false,
        createdAt: now,
      });
    }

    // Log activity
    await ctx.db.insert("activities", {
      agentId: args.createdBy,
      action: "created",
      targetType: "task",
      targetId: taskId,
      message: `Created task: ${args.title}`,
      createdAt: now,
    });

    return taskId;
  },
});

// Update task status
export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("blocked"),
      v.literal("waiting"),
      v.literal("review"),
      v.literal("done")
    ),
    agentId: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) return { success: false, error: "Task not found" };

    const now = Date.now();
    await ctx.db.patch(args.taskId, {
      status: args.status,
      updatedAt: now,
    });

    // Log activity
    await ctx.db.insert("activities", {
      agentId: args.agentId,
      action: "status_changed",
      targetType: "task",
      targetId: args.taskId,
      message: `Changed status to ${args.status}: ${task.title}`,
      createdAt: now,
    });

    return { success: true };
  },
});

// Assign task to agent
export const assignTask = mutation({
  args: {
    taskId: v.id("tasks"),
    assignedTo: v.string(),
    assignedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) return { success: false, error: "Task not found" };

    const now = Date.now();
    await ctx.db.patch(args.taskId, {
      assignedTo: args.assignedTo,
      status: "assigned",
      updatedAt: now,
    });

    // Subscribe assignee
    const existingSub = await ctx.db
      .query("subscriptions")
      .withIndex("by_agentId_taskId", (q) =>
        q.eq("agentId", args.assignedTo).eq("taskId", args.taskId)
      )
      .first();

    if (!existingSub) {
      await ctx.db.insert("subscriptions", {
        agentId: args.assignedTo,
        taskId: args.taskId,
        createdAt: now,
      });
    }

    // Notify assignee
    await ctx.db.insert("notifications", {
      mentionedAgentId: args.assignedTo,
      content: `You've been assigned task: ${task.title}`,
      sourceAgentId: args.assignedBy,
      taskId: args.taskId,
      delivered: false,
      createdAt: now,
    });

    // Log activity
    await ctx.db.insert("activities", {
      agentId: args.assignedBy,
      action: "assigned",
      targetType: "task",
      targetId: args.taskId,
      message: `Assigned ${task.title} to @${args.assignedTo}`,
      createdAt: now,
    });

    return { success: true };
  },
});

// Get all tasks
export const getAllTasks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

// Get tasks by status
export const getTasksByStatus = query({
  args: {
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("blocked"),
      v.literal("waiting"),
      v.literal("review"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Get tasks by agent
export const getTasksByAgent = query({
  args: { agentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_assignedTo", (q) => q.eq("assignedTo", args.agentId))
      .collect();
  },
});

// Get single task
export const getTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.taskId);
  },
});

// Update task details
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    tags: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { taskId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(taskId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
