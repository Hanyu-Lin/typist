'use client';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useConvex, useQuery } from 'convex/react';
import { useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface RoomPageProps {
  params: {
    roomId: Id<'room'>;
  };
}
export default function RoomPage({ params }: RoomPageProps) {
  const roomMembers = useQuery(api.room.getMembers, {
    roomId: params.roomId,
  });

  const previousMembersRef = useRef(roomMembers);

  useEffect(() => {
    if (previousMembersRef.current && roomMembers) {
      const previousMembers = previousMembersRef.current;
      const newMembers = roomMembers.filter(
        (member) =>
          !previousMembers.some(
            (prevMember) => prevMember.userId === member.userId,
          ),
      );
      newMembers.forEach((newMember) => {
        toast.success(`${newMember.username} has joined the room! 🎉`);
      });
    }
    previousMembersRef.current = roomMembers;
  }, [roomMembers]);

  return (
    <div>
      <ul>
        {roomMembers?.map((member) => (
          <li key={member.userId}>{member.username}</li>
        ))}
      </ul>
    </div>
  );
}
