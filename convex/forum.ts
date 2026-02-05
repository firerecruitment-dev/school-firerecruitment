import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const listThreadsByCategory = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("forumThreads")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .take(50);
    }

    return await ctx.db.query("forumThreads").order("desc").take(50);
  },
});

export const createThread = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    authorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const threadId = await ctx.db.insert("forumThreads", {
      title: args.title,
      category: args.category,
      authorId: args.authorId,
      createdAt: now,
    });

    return threadId;
  },
});

export const listMessages = query({
  args: { threadId: v.id("forumThreads") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forumMessages")
      .withIndex("by_threadId", (q) => q.eq("threadId", args.threadId))
      .order("asc")
      .take(200);
  },
});

export const createMessage = mutation({
  args: {
    threadId: v.id("forumThreads"),
    authorId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const messageId = await ctx.db.insert("forumMessages", {
      threadId: args.threadId,
      authorId: args.authorId,
      content: args.content,
      createdAt: now,
    });

    return messageId;
  },
});
