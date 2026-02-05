import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Subscribe to task
export const subscribe = mutation({
  args: {
    agentId: v.string(),
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    // Check if already subscribed
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_agentId_taskId", (q) =>
        q.eq("agentId", args.agentId).eq("taskId", args.taskId)
      )
      .first();

    if (existing) {
      return { success: true, alreadySubscribed: true };
    }

    await ctx.db.insert("subscriptions", {
      agentId: args.agentId,
      taskId: args.taskId,
      createdAt: Date.now(),
    });

    return { success: true, alreadySubscribed: false };
  },
});

// Unsubscribe from task
export const unsubscribe = mutation({
  args: {
    agentId: v.string(),
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_agentId_taskId", (q) =>
        q.eq("agentId", args.agentId).eq("taskId", args.taskId)
      )
      .first();

    if (subscription) {
      await ctx.db.delete(subscription._id);
      return { success: true };
    }

    return { success: false, error: "Not subscribed" };
  },
});

// Get subscribers for a task
export const getSubscribers = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_taskId", (q) => q.eq("taskId", args.taskId))
      .collect();
  },
});

// Get subscriptions for an agent
export const getSubscriptionsForAgent = query({
  args: { agentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .collect();
  },
});

// Check if agent is subscribed to task
export const isSubscribed = query({
  args: {
    agentId: v.string(),
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_agentId_taskId", (q) =>
        q.eq("agentId", args.agentId).eq("taskId", args.taskId)
      )
      .first();

    return !!subscription;
  },
});
