import { useCallback } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { parseConvexError } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';

interface useWinnerProps {
  roomId: string;
}

export default function useWinner({ roomId }: useWinnerProps) {
  const convex = useConvex();

  const calculateWinner = useCallback(async () => {
    try {
      await convex.mutation(api.room.calcWinnerWhenTimerEnds, { roomId });
    } catch (error) {
      toast.error(`Failed to calculate winner: ${parseConvexError(error)}`);
    }
  }, [convex, roomId]);

  const showConfetti = useCallback(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  const displayWinner = useCallback(
    (winnerName: string, isCurrentUser: boolean) => {
      if (isCurrentUser) {
        toast.success(`You won! Congratulations, ${winnerName}!`);
        showConfetti();
      } else {
        toast.info(`${winnerName} won the game!`);
      }
    },
    [showConfetti],
  );

  return { calculateWinner, displayWinner };
}
