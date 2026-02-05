import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a message (comment on task)
export const createMessage = mutation({
  args: {
    taskId: v.id("tasks"),
    fromAgentId: v.string(),
    content: v.string(),
    attachments: v.optional(
      v.array(
        v.object({
          name: v.string(),
          url: v.string(),
          type: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Parse @mentions from content
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(args.content)) !== null) {
      mentions.push(match[1]);
    }

    const messageId = await ctx.db.insert("messages", {
      taskId: args.taskId,
      fromAgentId: args.fromAgentId,
      content: args.content,
      mentions,
      attachments: args.attachments || [],
      createdAt: now,
    });

    // Get task for context
    const task = await ctx.db.get(args.taskId);

    // Create notifications for @mentions
    for (const mentionedAgentId of mentions) {
      if (mentionedAgentId !== args.fromAgentId) {
        await ctx.db.insert("notifications", {
          mentionedAgentId,
          content: `@${args.fromAgentId} mentioned you in "${task?.title || "a task"}": ${args.content.substring(0, 100)}`,
          sourceAgentId: args.fromAgentId,
          taskId: args.taskId,
          messageId,
          delivered: false,
          createdAt: now,
        });
      }
    }

    // Notify all subscribers (except sender and already-mentioned)
    const subscribers = await ctx.db
      .query("subscriptions")
      .withIndex("by_taskId", (q) => q.eq("taskId", args.taskId))
      .collect();

    for (const sub of subscribers) {
      if (sub.agentId !== args.fromAgentId && !mentions.includes(sub.agentId)) {
        await ctx.db.insert("notifications", {
          mentionedAgentId: sub.agentId,
          content: `New comment from @${args.fromAgentId} in "${task?.title || "a task"}"`,
          sourceAgentId: args.fromAgentId,
          taskId: args.taskId,
          messageId,
          delivered: false,
          createdAt: now,
        });
      }
    }

    // Log activity
    await ctx.db.insert("activities", {
      agentId: args.fromAgentId,
      action: "commented",
      targetType: "message",
      targetId: messageId,
      message: `Commented on: ${task?.title || "a task"}`,
      createdAt: now,
    });

    return messageId;
  },
});

// Get messages by task
export const getMessagesByTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_taskId", (q) => q.eq("taskId", args.taskId))
      .order("asc")
      .collect();
  },
});

// Get messages by agent
export const getMessagesByAgent = query({
  args: { agentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_fromAgentId", (q) => q.eq("fromAgentId", args.agentId))
      .order("desc")
      .collect();
  },
});
