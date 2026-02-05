import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create activity
export const createActivity = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get recent activities
export const getRecentActivities = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const query = ctx.db.query("activities").order("desc");
    if (args.limit) {
      return await query.take(args.limit);
    }
    return await query.take(50);
  },
});

// Get activities by agent
export const getActivitiesByAgent = query({
  args: { agentId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("activities")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }
    return await query.collect();
  },
});
