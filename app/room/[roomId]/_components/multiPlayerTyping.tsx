'use client';
import Word from '@/components/word';
import {
  calculateCompletionPercentage,
  cn,
  generateWords,
  parseConvexError,
  validCharacters,
} from '@/lib/utils';
import { useTypingStore } from '@/stores/typingStore';
import { useRef, useEffect, useState, useCallback, use } from 'react';
import { useConvex, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'sonner';
import CountdownSeparator from '@/app/room/[roomId]/_components/countDownSeperator';
import confetti from 'canvas-confetti';

interface MultiTypingTestProps {
  roomId: string;
}

export default function MultiTypingTest({ roomId }: MultiTypingTestProps) {
  const {
    currWordIndex,
    typedWord,
    moveToNextWord,
    wordList,
    setWordListLength,
    setStrictMode,
    setWordList,
    setTypedWord,
    handleDelete,
    resetTypingState,
  } = useTypingStore();

  const convexWordList = useQuery(api.room.getWordList, { roomId });

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [initialCountDown, setInitialCountDown] = useState(5);
  const [isInitialCountDownRunning, setIsInitialCountDownRunning] =
    useState(false);
  const convex = useConvex();
  const user = useUserStore((state) => state.user);
  const ownerId = useQuery(api.room.getOwner, { roomId });
  const isOwner = ownerId === user?.userId;
  const roomTimer = useQuery(api.room.getTimer, { roomId });
  const winner = useQuery(api.room.getWinner, { roomId });
  const resetNotification = useQuery(api.room.getResetNotification, { roomId });

  const timerStartedRef = useRef(false);

  const inputRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const sendResetNotification = useCallback(async () => {
    try {
      await convex.mutation(api.room.sendResetNotification, { roomId });
    } catch (error) {
      toast.error(
        `Failed to send reset notification: ${parseConvexError(error)}`,
      );
    }
  }, [convex, roomId]);

  const resetRace = useCallback(async () => {
    try {
      await convex.mutation(api.room.resetTimer, {
        roomId,
      });
      await convex.mutation(api.room.resetRoom, {
        roomId,
      });
      setTimeLeft(0);
      setInitialCountDown(5);
      setIsInitialCountDownRunning(false);
      resetTypingState(false);
      timerStartedRef.current = false;
    } catch (error) {
      toast.error(`Failed to reset timer: ${parseConvexError(error)}`);
    }
  }, [roomId, convex, resetTypingState]);

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

  const calculateWinner = useCallback(async () => {
    try {
      await convex.mutation(api.room.calcWinnerWhenTimerEnds, { roomId });
    } catch (error) {
      toast.error(`Failed to calculate winner: ${parseConvexError(error)}`);
    }
  }, [convex, roomId]);

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

  useEffect(() => {
    if (initialCountDown === 0 && isInitialCountDownRunning) {
      setStrictMode(true);
      setWordList(convexWordList ?? []);
    }
  }, [
    initialCountDown,
    isInitialCountDownRunning,
    convexWordList,
    setWordList,
    setStrictMode,
  ]);

  useEffect(() => {
    if (roomTimer?.initialCountDownEndTime) {
      const initialTimeLeft = Math.floor(
        (roomTimer.initialCountDownEndTime - Date.now()) / 1000,
      );
      setInitialCountDown(Math.max(initialTimeLeft, 0));
      setIsInitialCountDownRunning(roomTimer.initialCountDownRunning ?? false);

      if (roomTimer.initialCountDownRunning) {
        const initialTimerId = setInterval(() => {
          setInitialCountDown((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(initialTimerId);
              startMainTimer();
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
        return () => clearInterval(initialTimerId);
      }
    } else {
      setInitialCountDown(5);
      setIsInitialCountDownRunning(false);
    }
  }, [roomTimer, startMainTimer]);

  useEffect(() => {
    if (roomTimer?.endTime) {
      const mainTimeLeft = Math.floor((roomTimer.endTime - Date.now()) / 1000);
      setTimeLeft(Math.max(mainTimeLeft, 0));

      if (roomTimer.timerRunning) {
        focusInput();
        const mainTimerId = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(mainTimerId);
              calculateWinner();
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
        return () => clearInterval(mainTimerId);
      }
    } else {
      setTimeLeft(0);
    }
  }, [roomTimer, calculateWinner]);

  useEffect(() => {
    if (!winner) return;

    const isCurrentUser = winner.id === user?.userId;
    displayWinner(winner.name, isCurrentUser);

    resetRace();
  }, [winner, user, resetRace, isOwner, displayWinner]);

  useEffect(() => {
    if (resetNotification) {
      toast.info('The room has been reset');
      resetRace();
    }
  }, [resetNotification, resetRace]);

  useEffect(() => {
    if (activeWordRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currWordIndex]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const { key, metaKey } = e;
      e.preventDefault();
      e.stopPropagation();
      if (!timeLeft) {
        if (key === 'Tab') {
          resetTypingState(false);
        }
        return;
      }

      if (key === 'Backspace') {
        handleDelete(!!metaKey);
      } else if (key === ' ') {
        if (typedWord === '') return;
        moveToNextWord();
        const updatedTypedHistory = useTypingStore.getState().typedHistory;
        const completionPercentage = calculateCompletionPercentage(
          updatedTypedHistory,
          wordList,
        );
        if (!user?.userId) return;
        convex.mutation(api.room.updateMemberProgress, {
          userId: user.userId,
          roomId,
          progress: completionPercentage,
        });
      } else if (key === 'Tab') {
        restartButtonRef.current?.focus();
      } else if (key.length === 1 && validCharacters.test(key)) {
        setTypedWord(typedWord + key);
      }
    },
    [
      timeLeft,
      resetTypingState,
      handleDelete,
      typedWord,
      moveToNextWord,
      wordList,
      user,
      convex,
      roomId,
      setTypedWord,
    ],
  );

  const focusInput = useCallback(() => {
    setIsFocused(true);
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center w-3/4 gap-3">
        <CountdownSeparator
          isInitialCountDownRunning={isInitialCountDownRunning}
          initialCountDown={initialCountDown}
          timeLeft={timeLeft}
          timerStartedRef={timerStartedRef}
          startInitialCountDown={startInitialCountDown}
          resetRace={sendResetNotification}
          isOwner={isOwner}
        />
        <div className="relative rounded-lg font-mono text-2xl w-full">
          <div
            ref={inputRef}
            tabIndex={0}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'p-4 focus:outline-none cursor-text',
              isFocused ? 'blur-none' : 'cursor-pointer blur-md',
            )}
          >
            <div className="flex justify-start flex-wrap h-32 overflow-hidden items-center select-none px-3">
              {convexWordList?.map((word, index) => (
                <Word
                  key={`${word}-${index}`}
                  index={index}
                  word={word}
                  isActive={index === currWordIndex}
                  isTyped={index < currWordIndex}
                  typedWord={typedWord}
                  ref={index === currWordIndex ? activeWordRef : null}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
