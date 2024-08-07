'use client';
import MemberProgress from '@/app/room/[roomId]/_components/memberProgress';
import JoinRoomButton from '@/components/joinRoomButton';
import MultiTypingTest from '@/app/room/[roomId]/_components/multiPlayerTyping';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
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
  const membersCount = roomMembers?.length ?? 0;
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
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  return (
    <>
      {isMember ? (
        <>
          <div
            className={cn(
              'grid gap-4 ',
              membersCount > 2 ? 'grid-cols-2' : 'grid-cols-1 ',
            )}
          >
            {roomMembers?.map((member) => (
              <MemberProgress key={member.userId} member={member} />
            ))}
          </div>
          <MultiTypingTest roomId={params.roomId} />
        </>
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
