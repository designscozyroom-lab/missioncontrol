import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create standup
export const createStandup = mutation({
  args: {
    agentId: v.string(),
    completed: v.array(v.string()),
    planned: v.array(v.string()),
    blockers: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const date = new Date(now).toISOString().split("T")[0];

    // Check if standup already exists for today
    const existing = await ctx.db
      .query("standups")
      .withIndex("by_date_agentId", (q) =>
        q.eq("date", date).eq("agentId", args.agentId)
      )
      .first();

    if (existing) {
      // Update existing standup
      await ctx.db.patch(existing._id, {
        completed: args.completed,
        planned: args.planned,
        blockers: args.blockers,
      });
      return existing._id;
    }

    // Create new standup
    const standupId = await ctx.db.insert("standups", {
      date,
      agentId: args.agentId,
      completed: args.completed,
      planned: args.planned,
      blockers: args.blockers,
      createdAt: now,
    });

    // Log activity
    await ctx.db.insert("activities", {
      agentId: args.agentId,
      action: "standup",
      targetType: "agent",
      targetId: args.agentId,
      message: `Posted daily standup`,
      createdAt: now,
    });

    return standupId;
  },
});

// Get standups by date
export const getStandupsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("standups")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

// Get standups by agent
export const getStandupsByAgent = query({
  args: { agentId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("standups")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }
    return await query.collect();
  },
});

// Get today's standups
export const getTodayStandups = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    return await ctx.db
      .query("standups")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();
  },
});
