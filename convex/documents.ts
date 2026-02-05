import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create document
export const createDocument = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("report"),
      v.literal("code"),
      v.literal("design"),
      v.literal("notes"),
      v.literal("other")
    ),
    taskId: v.optional(v.id("tasks")),
    agentId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const docId = await ctx.db.insert("documents", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    // Log activity
    await ctx.db.insert("activities", {
      agentId: args.agentId,
      action: "created",
      targetType: "document",
      targetId: docId,
      message: `Created document: ${args.title}`,
      createdAt: now,
    });

    return docId;
  },
});

// Get documents by task
export const getDocumentsByTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_taskId", (q) => q.eq("taskId", args.taskId))
      .collect();
  },
});

// Get all documents
export const getAllDocuments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").order("desc").collect();
  },
});

// Get documents by agent
export const getDocumentsByAgent = query({
  args: { agentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .collect();
  },
});

// Update document
export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { documentId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(documentId, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
