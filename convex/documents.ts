import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update document (with deduplication)
export const createDocument = mutation({
  args: {
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
    sourcePath: v.optional(v.string()),
    contentHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check for existing document by sourcePath (file-based deduplication)
    if (args.sourcePath) {
      const existing = await ctx.db
        .query("documents")
        .withIndex("by_sourcePath", (q) => q.eq("sourcePath", args.sourcePath))
        .first();

      if (existing) {
        // Update existing document
        await ctx.db.patch(existing._id, {
          title: args.title,
          content: args.content,
          type: args.type,
          updatedAt: now,
          contentHash: args.contentHash,
        });

        // Log activity
        await ctx.db.insert("activities", {
          agentId: args.agentId,
          action: "updated",
          targetType: "document",
          targetId: existing._id,
          message: `Updated document: ${args.title}`,
          createdAt: now,
        });

        return existing._id;
      }
    }

    // Check for existing document by contentHash (content-based deduplication)
    if (args.contentHash) {
      const existing = await ctx.db
        .query("documents")
        .withIndex("by_contentHash", (q) => q.eq("contentHash", args.contentHash))
        .first();

      if (existing) {
        // Same content already exists, skip
        return existing._id;
      }
    }

    // Create new document
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
