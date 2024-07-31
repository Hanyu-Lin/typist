import { useConvex, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { parseConvexError } from '@/lib/utils';

interface useResetNotificationProps {
  roomId: string;
  resetRace: () => void;
}

export default function useResetNotification({
  roomId,
  resetRace,
}: useResetNotificationProps) {
  const convex = useConvex();
  const resetNotification = useQuery(api.room.getResetNotification, { roomId });

  const sendResetNotification = useCallback(async () => {
    try {
      await convex.mutation(api.room.sendResetNotification, { roomId });
    } catch (error) {
      toast.error(
        `Failed to send reset notification: ${parseConvexError(error)}`,
      );
    }
  }, [convex, roomId]);

  useEffect(() => {
    if (resetNotification) {
      toast.info('The room has been reset');
      resetRace();
    }
  }, [resetNotification, resetRace]);

  return { sendResetNotification, resetNotification };
}
