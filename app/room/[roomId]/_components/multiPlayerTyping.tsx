'use client';
import Word from '@/components/word';
import {
  cn,
  generateWords,
  parseConvexError,
  validCharacters,
} from '@/lib/utils';
import { useTypingStore } from '@/stores/typingStore';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useConvex, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'sonner';
import CountdownSeparator from '@/app/room/[roomId]/_components/countDownSeperator';

interface MultiTypingTestProps {
  roomId: string;
}

export default function MultiTypingTest({ roomId }: MultiTypingTestProps) {
  const {
    currWordIndex,
    typedWord,
    moveToNextWord,
    wordList,
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

  const timerStartedRef = useRef(false);

  const resetTimer = async () => {
    try {
      await convex.mutation(api.room.resetTimer, {
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
  };

  const startInitialCountDown = async () => {
    if (!user) return;
    try {
      await convex.mutation(api.room.startInitialCountDown, {
        roomId,
        userId: user.userId,
      });
      await convex.mutation(api.room.setWordList, {
        roomId,
        wordList: generateWords(250),
      });
    } catch (error) {
      toast.error(parseConvexError(error));
    }
  };

  const startMainTimer = useCallback(async () => {
    if (!user || !isOwner || timerStartedRef.current) return;
    timerStartedRef.current = true;
    try {
      await convex.mutation(api.room.startTimer, {
        roomId,
        userId: user.userId,
      });
    } catch (error) {
      toast.error(parseConvexError(error));
    }
  }, [roomId, user, isOwner, convex]);

  useEffect(() => {
    if (initialCountDown === 0 && isInitialCountDownRunning) {
      setWordList(convexWordList ?? []);
    }
  }, [
    initialCountDown,
    isInitialCountDownRunning,
    convexWordList,
    setWordList,
    wordList,
  ]);

  useEffect(() => {
    if (roomTimer?.initialCountDownEndTime) {
      const initialTimeLeft = Math.floor(
        (roomTimer.initialCountDownEndTime - Date.now()) / 1000,
      );
      setInitialCountDown(initialTimeLeft);
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
      }
    } else {
      setInitialCountDown(5);
      setIsInitialCountDownRunning(false);
    }

    if (roomTimer?.endTime) {
      const mainTimeLeft = Math.floor((roomTimer.endTime - Date.now()) / 1000);
      setTimeLeft(mainTimeLeft);

      if (roomTimer.timerRunning) {
        focusInput();
        const mainTimerId = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(mainTimerId);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
    } else {
      setTimeLeft(0);
    }
  }, [roomTimer, startMainTimer]);

  const inputRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (activeWordRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currWordIndex]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key, metaKey } = e;
    e.preventDefault();
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
    } else if (key == 'Tab') {
      restartButtonRef.current?.focus();
    } else if (e.key.length === 1 && validCharacters.test(e.key)) {
      setTypedWord(typedWord + e.key);
    } else {
      return;
    }
  };

  const focusInput = () => {
    setIsFocused(true);
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="flex flex-col items-center w-3/4 gap-3">
        <CountdownSeparator
          isInitialCountDownRunning={isInitialCountDownRunning}
          initialCountDown={initialCountDown}
          timeLeft={timeLeft}
          timerStartedRef={timerStartedRef}
          startInitialCountDown={startInitialCountDown}
          resetTimer={resetTimer}
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
