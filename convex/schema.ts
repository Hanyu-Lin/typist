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
  room: defineTable({
    roomId: v.string(),
    ownerId: v.string(),
    members: v.array(
      v.object({
        userId: v.string(),
        username: v.string(),
        progress: v.number(),
      }),
    ),
    initialCountDownEndTime: v.optional(v.number()), // timestamp when the initial count down ends
    initialCountDownRunning: v.optional(v.boolean()),
    endTime: v.optional(v.number()), // timestamp when the timer ends
    timerRunning: v.optional(v.boolean()),
  }).index('by_roomId', ['roomId']),
});
