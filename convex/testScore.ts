import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const create = mutation({
  args: {
    userId: v.string(),
    wpm: v.number(),
    raw: v.number(),
    accuracy: v.number(),
    testDurationSeconds: v.number(),
    wordsTyped: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || identity.subject !== args.userId) {
      throw new Error('Unauthorized or invalid user');
    }

    // Insert new test score
    const newTestScore = await ctx.db.insert('testScore', {
      userId: args.userId,
      wpm: args.wpm,
      raw: args.raw,
      accuracy: args.accuracy,
      testDurationSeconds: args.testDurationSeconds,
      wordsTyped: args.wordsTyped,
    });

    // Update user data with new test metrics
    const userData = await ctx.db
      .query('userData')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();

    if (userData) {
      const updatedMetrics = {
        totalTestsTaken: userData.totalTestsTaken + 1,
        totalTimeSpent: userData.totalTimeSpent + args.testDurationSeconds,
        totalWordsTyped: userData.totalWordsTyped + args.wordsTyped,
        highestWpm: Math.max(userData.highestWpm, args.wpm),
        highestRaw: Math.max(userData.highestRaw, args.raw),
        highestAccuracy: Math.max(userData.highestAccuracy, args.accuracy),
      };
      await ctx.db.patch(userData._id, updatedMetrics);
    } else {
      // If no userData exists, consider creating a new record
      await ctx.db.insert('userData', {
        userId: args.userId,
        totalTestsTaken: 1,
        totalTimeSpent: args.testDurationSeconds,
        totalWordsTyped: args.wordsTyped,
        highestWpm: args.wpm,
        highestRaw: args.raw,
        highestAccuracy: args.accuracy,
      });
    }

    return newTestScore;
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
      throw new Error('Unauthorized or invalid user');
    }

    const testScores = await ctx.db
      .query('testScore')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .order('asc') // Order by creation time by default
      .take(args.limit);
    return testScores;
  },
});
