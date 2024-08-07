import { ConvexError, v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { nanoid } from 'nanoid';

const MAXIUUM_MEMBERS = 4;

export const create = mutation({
  args: {
    roomId: v.string(),
    owner: v.object({
      userId: v.string(),
      username: v.string(),
      progress: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const newRoom = await ctx.db.insert('room', {
      roomId: args.roomId,
      ownerId: args.owner.userId,
      members: [args.owner],
      wordList: [],
      resetNotification: false,
    });

    return newRoom;
  },
});

export const join = mutation({
  args: {
    roomId: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const newMember = {
      userId: nanoid(),
      username: args.username,
      progress: 0,
    };

    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    if (room.members.length >= MAXIUUM_MEMBERS) {
      throw new ConvexError('Room is full');
    }

    room.members.push(newMember);

    await ctx.db.patch(room._id, { members: room.members });

    return newMember;
  },
});

export const leaveRoom = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    room.members = room.members.filter(
      (member) => member.userId !== args.userId,
    );

    await ctx.db.patch(room._id, { members: room.members });

    return room;
  },
});

export const updateMemberProgress = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    if (args.progress < 0 || args.progress > 100) {
      throw new ConvexError('Invalid progress value');
    }

    const member = room.members.find((member) => member.userId === args.userId);

    if (!member) {
      throw new ConvexError('User not in room');
    }

    member.progress = args.progress;

    await ctx.db.patch(room._id, { members: room.members });

    if (args.progress == 100) {
      await ctx.db.patch(room._id, {
        winner: { id: args.userId, name: member.username },
      });
    }
    return room;
  },
});
export const getOwner = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    return room.ownerId;
  },
});

export const getMembers = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    return room.members;
  },
});
export const startInitialCountDown = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    if (room.ownerId !== args.userId) {
      throw new ConvexError('Only the owner can start the initial countdown');
    }

    if (room.initialCountDownRunning) {
      throw new ConvexError('Initial countdown already running');
    }

    const initialCountDownEndTime = Date.now() + 5 * 1000; // 5 seconds from now

    await ctx.db.patch(room._id, {
      initialCountDownEndTime,
      initialCountDownRunning: true,
    });

    return { initialCountDownEndTime, initialCountDownRunning: true };
  },
});

export const startTimer = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    if (room.ownerId !== args.userId) {
      throw new ConvexError('Only the owner can start the timer');
    }

    if (room.timerRunning) {
      throw new ConvexError('Timer already running');
    }

    const endTime = Date.now() + 60 * 1000; // 1 minutes from now
    await ctx.db.patch(room._id, {
      endTime,
      timerRunning: true,
      initialCountDownEndTime: undefined,
      initialCountDownRunning: false,
    });

    return { endTime, timerRunning: true };
  },
});
// set the highest member progress as the winner when the timer ends
export const calcWinnerWhenTimerEnds = mutation({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    // Remove this check, as we want to calculate the winner when the timer ends
    // if (room.timerRunning) {
    //   throw new ConvexError('Timer is still running');
    // }

    const calcWinner = room.members.reduce((winner, member) =>
      member.progress > winner.progress ? member : winner,
    );

    await ctx.db.patch(room._id, {
      winner: { id: calcWinner.userId, name: calcWinner.username },
      timerRunning: false, // Set timerRunning to false when calculating the winner
    });

    return calcWinner.userId;
  },
});

export const getWinner = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    return room.winner;
  },
});

export const resetRoom = mutation({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    // Reset members progress
    room.members = room.members.map((member) => ({
      ...member,
      progress: 0,
    }));

    await ctx.db.patch(room._id, {
      wordList: [],
      members: room.members,
      winner: undefined,
      resetNotification: false,
    });

    return room;
  },
});

export const resetTimer = mutation({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    await ctx.db.patch(room._id, {
      endTime: undefined,
      timerRunning: false,
      initialCountDownEndTime: undefined,
      initialCountDownRunning: false,
    });

    return { endTime: null };
  },
});

export const getTimer = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    return {
      endTime: room.endTime,
      timerRunning: room.timerRunning,
      initialCountDownEndTime: room.initialCountDownEndTime,
      initialCountDownRunning: room.initialCountDownRunning,
    };
  },
});
export const setWordList = mutation({
  args: {
    roomId: v.string(),
    wordList: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    await ctx.db.patch(room._id, { wordList: args.wordList });

    return room;
  },
});

export const getWordList = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    return room.wordList;
  },
});

export const sendResetNotification = mutation({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    await ctx.db.patch(room._id, { resetNotification: true });

    return room;
  },
});

export const getResetNotification = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('room')
      .withIndex('by_roomId', (q) => q.eq('roomId', args.roomId))
      .unique();

    if (!room) {
      throw new ConvexError('Room not found');
    }

    return room.resetNotification;
  },
});
