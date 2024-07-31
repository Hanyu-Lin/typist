import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { generateWords, parseConvexError } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { User } from '@/stores/userStore';
import { useTypingStore } from '@/stores/typingStore';

interface useTimerProps {
  roomId: string;
  user: User | null;
  isOwner: boolean;
}

export default function useTimer({ roomId, user, isOwner }: useTimerProps) {
  const convex = useConvex();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [initialCountDown, setInitialCountDown] = useState(5);
  const [isInitialCountDownRunning, setIsInitialCountDownRunning] =
    useState(false);
  const timerStartedRef = useRef(false);
  const { setWordListLength, resetTypingState } = useTypingStore();

  const startInitialCountDown = useCallback(async () => {
    if (!user) return;
    try {
      await convex.mutation(api.room.startInitialCountDown, {
        roomId,
        userId: user.userId,
      });
      setWordListLength(30);
      await convex.mutation(api.room.setWordList, {
        roomId,
        wordList: generateWords(30),
      });
    } catch (error) {
      toast.error(`Failed to start countdown: ${parseConvexError(error)}`);
    }
  }, [convex, roomId, user, setWordListLength]);

  const startMainTimer = useCallback(async () => {
    if (!user || !isOwner || timerStartedRef.current) return;
    timerStartedRef.current = true;
    try {
      await convex.mutation(api.room.startTimer, {
        roomId,
        userId: user.userId,
      });
    } catch (error) {
      toast.error(`Failed to start timer: ${parseConvexError(error)}`);
    }
  }, [roomId, user, isOwner, convex]);

  const resetRace = useCallback(async () => {
    try {
      await convex.mutation(api.room.resetTimer, { roomId });
      await convex.mutation(api.room.resetRoom, { roomId });
      setTimeLeft(0);
      setInitialCountDown(5);
      setIsInitialCountDownRunning(false);
      timerStartedRef.current = false;
      resetTypingState(false);
    } catch (error) {
      toast.error(`Failed to reset timer: ${parseConvexError(error)}`);
    }
  }, [roomId, convex, resetTypingState]);

  return {
    timeLeft,
    initialCountDown,
    isInitialCountDownRunning,
    setInitialCountDown,
    setIsInitialCountDownRunning,
    setTimeLeft,
    startInitialCountDown,
    startMainTimer,
    resetRace,
  };
}
