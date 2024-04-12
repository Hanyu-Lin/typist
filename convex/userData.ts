import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserData = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized - No user identity available");
    }

    const userId = identity.subject;
    const userData = await ctx.db
      .query("userData")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!userData) {
      throw new Error(`No user data found for user ID ${userId}`);
    }

    return userData;
  },
});

export const fetchRecentTestScores = query({
  args: {
    userId: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || identity.subject !== args.userId) {
      throw new Error("Unauthorized or invalid user");
    }

    const testScores = await ctx.db
      .query("testScore")
      .filter((q) => q.eq("userId", args.userId))
      .order("desc") // Order by creation time descending by default
      .take(args.limit);
    return testScores;
  },
});
