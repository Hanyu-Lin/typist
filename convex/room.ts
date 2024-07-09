import { ConvexError, v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { nanoid } from 'nanoid';
import type { User } from '../stores/userStore';

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

    const member = room.members.find((member) => member.userId === args.userId);

    if (!member) {
      throw new ConvexError('User not in room');
    }

    member.progress = args.progress;

    await ctx.db.patch(room._id, { members: room.members });

    return room;
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
