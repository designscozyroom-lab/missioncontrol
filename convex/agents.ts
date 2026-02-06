import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ClawQuests agent definitions - actual agent names
const CLAWQUESTS_AGENTS = [
  {
    agentId: "marketing_lead",
    name: "Naman",
    emoji: "🧭",
    role: "Marketing Lead",
    status: "active" as const,
    level: "LEAD" as const,
  },
  {
    agentId: "site_researcher",
    name: "Sai",
    emoji: "🔎",
    role: "Site Researcher",
    status: "active" as const,
    level: "SPC" as const,
  },
  {
    agentId: "content_seo",
    name: "Vivaan",
    emoji: "✍️",
    role: "Content & SEO",
    status: "active" as const,
    level: "SPC" as const,
  },
  {
    agentId: "agentic_outreach",
    name: "Nysa",
    emoji: "📣",
    role: "Outreach Specialist",
    status: "active" as const,
    level: "INT" as const,
  },
  {
    agentId: "partner_scout",
    name: "Shayra",
    emoji: "🤝",
    role: "Partner Scout",
    status: "active" as const,
    level: "INT" as const,
  },
  {
    agentId: "ops_autopost",
    name: "Vaishu",
    emoji: "⚙️",
    role: "Ops & Autopost",
    status: "active" as const,
    level: "SPC" as const,
  },
];

// Initialize all 6 agents
export const initializeAllAgents = mutation({
  args: {},
  handler: async (ctx) => {
    for (const agent of CLAWQUESTS_AGENTS) {
      // Check if agent already exists
      const existing = await ctx.db
        .query("agents")
        .withIndex("by_agentId", (q) => q.eq("agentId", agent.agentId))
        .first();

      if (!existing) {
        await ctx.db.insert("agents", {
          ...agent,
          lastHeartbeat: Date.now(),
        });
      }
    }

    return { initialized: CLAWQUESTS_AGENTS.length };
  },
});

// Reset and reinitialize all agents (updates existing agents with correct names)
export const resetAllAgents = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all existing agents
    const existingAgents = await ctx.db.query("agents").collect();
    for (const agent of existingAgents) {
      await ctx.db.delete(agent._id);
    }

    // Insert fresh agent data
    for (const agent of CLAWQUESTS_AGENTS) {
      await ctx.db.insert("agents", {
        ...agent,
        lastHeartbeat: Date.now(),
      });
    }

    return { reset: true, count: CLAWQUESTS_AGENTS.length };
  },
});

// Get all agents
export const getAllAgents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

// Get agent by ID
export const getAgent = query({
  args: { agentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agents")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .first();
  },
});

// Update agent heartbeat
export const updateAgentHeartbeat = mutation({
  args: { agentId: v.string() },
  handler: async (ctx, args) => {
    const agent = await ctx.db
      .query("agents")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .first();

    if (agent) {
      await ctx.db.patch(agent._id, {
        lastHeartbeat: Date.now(),
        status: "active",
      });
      return { success: true };
    }
    return { success: false, error: "Agent not found" };
  },
});

// Update agent status
export const updateAgentStatus = mutation({
  args: {
    agentId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("blocked"),
      v.literal("offline")
    ),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db
      .query("agents")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .first();

    if (agent) {
      await ctx.db.patch(agent._id, { status: args.status });
      return { success: true };
    }
    return { success: false, error: "Agent not found" };
  },
});

// Set agent's current task
export const setAgentCurrentTask = mutation({
  args: {
    agentId: v.string(),
    taskId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db
      .query("agents")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .first();

    if (agent) {
      await ctx.db.patch(agent._id, {
        currentTaskId: args.taskId,
        status: args.taskId ? "active" : "idle",
      });
      return { success: true };
    }
    return { success: false, error: "Agent not found" };
  },
});
