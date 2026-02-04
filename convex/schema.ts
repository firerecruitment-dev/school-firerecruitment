import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    subscription: v.union(v.literal("free"), v.literal("pro")),
    lastAttemptAt: v.optional(v.number()),
  }).index("by_clerkId", ["clerkId"]),

  questions: defineTable({
    category: v.string(),
    question: v.string(),
    imageUrl: v.optional(v.string()),
    imagePrompt: v.optional(v.string()),
    options: v.array(v.string()),
    correctAnswerIndex: v.number(),
    explanation: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
  }).index("by_category", ["category"]),

  tests: defineTable({
    title: v.string(),
    description: v.string(),
    questionIds: v.array(v.id("questions")),
    isPro: v.boolean(),
    timeLimitSeconds: v.number(),
  }),

  attempts: defineTable({
    userId: v.id("users"),
    testId: v.id("tests"),
    score: v.number(),
    answers: v.array(v.object({
      questionId: v.id("questions"),
      selectedOptionIndex: v.number(),
      isCorrect: v.boolean(),
    })),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  forumThreads: defineTable({
    title: v.string(),
    authorId: v.id("users"),
    category: v.string(),
    createdAt: v.number(),
  }).index("by_category", ["category"]),

  forumMessages: defineTable({
    threadId: v.id("forumThreads"),
    authorId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_threadId", ["threadId"]),
});
