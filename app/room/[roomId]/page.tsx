'use client';
import JoinRoomButton from '@/components/joinRoomButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUserStore } from '@/stores/userStore';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface RoomPageProps {
  params: {
    roomId: Id<'room'>;
  };
}
export default function RoomPage({ params }: RoomPageProps) {
  const [loading, setLoading] = useState(true);
  const roomMembers = useQuery(api.room.getMembers, {
    roomId: params.roomId,
  });
  const currentUser = useUserStore((state) => state.user);
  const isMember = roomMembers?.some(
    (member) => member.userId === currentUser?.userId,
  );
  const previousMembersRef = useRef(roomMembers);

  if (loading && roomMembers) {
    setLoading(false);
  }

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

  if (loading) {
    return <Loader2 />;
  }

  return (
    <>
      {isMember ? (
        <div>
          <ul>
            {roomMembers?.map((member) => (
              <li key={member.userId}>{member.username}</li>
            ))}
          </ul>
        </div>
      ) : (
        <Card className="w-[90vw] max-w-[400px]">
          <CardHeader>
            <CardTitle>Sorry, wrong room</CardTitle>
            <CardDescription>
              It seems like you are not a member of this room. Wanna join a
              room? Enter the room ID below.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col space-y-4">
            <JoinRoomButton />
          </CardContent>
        </Card>
      )}
    </>
  );
}
