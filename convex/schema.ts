import { v } from 'convex/values';
import { defineSchema, defineTable } from 'convex/server';

export default defineSchema({
  testScore: defineTable({
    userId: v.string(),
    wpm: v.number(),
    raw: v.number(),
    accuracy: v.number(),
    testDurationSeconds: v.number(),
    wordsTyped: v.number(),
  }).index('by_userId', ['userId']),
  userData: defineTable({
    userId: v.string(),
    totalTestsTaken: v.number(),
    totalTimeSpent: v.number(),
    totalWordsTyped: v.number(),
    highestWpm: v.number(),
    highestRaw: v.number(),
    highestAccuracy: v.number(),
  }).index('by_userId', ['userId']),
});
