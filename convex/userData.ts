import { query } from './_generated/server';

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized - No user identity available');
    }

    const userId = identity.subject;
    const userData = await ctx.db
      .query('userData')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .unique();

    if (!userData) {
      throw new Error(`No user data found for user ID ${userId}`);
    }

    return userData;
  },
});
