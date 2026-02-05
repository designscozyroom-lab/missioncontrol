import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create notification
export const createNotification = mutation({
  args: {
    mentionedAgentId: v.string(),
    content: v.string(),
    sourceAgentId: v.string(),
    taskId: v.optional(v.id("tasks")),
    messageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      delivered: false,
      createdAt: Date.now(),
    });
  },
});

// Get notifications for agent
export const getNotificationsForAgent = query({
  args: { agentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_mentionedAgentId_delivered", (q) =>
        q.eq("mentionedAgentId", args.agentId).eq("delivered", false)
      )
      .order("desc")
      .collect();
  },
});

// Get ALL undelivered notifications (for daemon)
export const getUndeliveredNotifications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_delivered", (q) => q.eq("delivered", false))
      .order("asc")
      .collect();
  },
});

// Mark notification as delivered
export const markNotificationDelivered = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { delivered: true });
    return { success: true };
  },
});

// Mark all notifications delivered for agent
export const markAllDeliveredForAgent = mutation({
  args: { agentId: v.string() },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_mentionedAgentId_delivered", (q) =>
        q.eq("mentionedAgentId", args.agentId).eq("delivered", false)
      )
      .collect();

    for (const notification of notifications) {
      await ctx.db.patch(notification._id, { delivered: true });
    }

    return { success: true, count: notifications.length };
  },
});

// Get all notifications for agent (including delivered)
export const getAllNotificationsForAgent = query({
  args: { agentId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("notifications")
      .withIndex("by_mentionedAgentId", (q) =>
        q.eq("mentionedAgentId", args.agentId)
      )
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }
    return await query.collect();
  },
});
