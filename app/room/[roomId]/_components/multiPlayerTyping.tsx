'use client';
import Word from '@/components/word';
import {
  calculateCompletionPercentage,
  cn,
  validCharacters,
} from '@/lib/utils';
import { useTypingStore } from '@/stores/typingStore';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useConvex, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserStore } from '@/stores/userStore';
import CountdownSeparator from '@/app/room/[roomId]/_components/countDownSeperator';
import useTimer from '@/hooks/useTimer';
import useWinner from '@/hooks/useWinner';
import useResetNotification from '@/hooks/useResetNotification';

interface MultiTypingTestProps {
  roomId: string;
}

export default function MultiTypingTest({ roomId }: MultiTypingTestProps) {
  const {
    currWordIndex,
    typedWord,
    moveToNextWord,
    wordList,
    setStrictMode,
    setWordList,
    setTypedWord,
    handleDelete,
    resetTypingState,
  } = useTypingStore();

  const convexWordList = useQuery(api.room.getWordList, { roomId });
  const convex = useConvex();
  const user = useUserStore((state) => state.user);
  const ownerId = useQuery(api.room.getOwner, { roomId });
  const isOwner = ownerId === user?.userId;
  const roomTimer = useQuery(api.room.getTimer, { roomId });
  const winner = useQuery(api.room.getWinner, { roomId });

  const {
    timeLeft,
    initialCountDown,
    isInitialCountDownRunning,
    setInitialCountDown,
    setIsInitialCountDownRunning,
    setTimeLeft,
    startInitialCountDown,
    startMainTimer,
    resetRace,
  } = useTimer({
    roomId,
    user,
    isOwner,
  });

  const { sendResetNotification } = useResetNotification({
    roomId,
    resetRace,
  });

  const inputRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const { calculateWinner, displayWinner } = useWinner({ roomId });

  const focusInput = useCallback(() => {
    setIsFocused(true);
    inputRef.current?.focus();
  }, []);

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
      resetTypingState(false);
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
  }, [
    roomTimer,
    startMainTimer,
    setInitialCountDown,
    setIsInitialCountDownRunning,
    resetTypingState,
  ]);

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
  }, [roomTimer, calculateWinner, focusInput, setTimeLeft]);

  useEffect(() => {
    if (!winner) return;

    const isCurrentUser = winner.id === user?.userId;
    displayWinner(winner.name, isCurrentUser);

    resetRace();
  }, [winner, user, resetRace, isOwner, displayWinner]);

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

  return (
    <>
      <div className="flex flex-col items-center w-3/4 gap-3">
        <CountdownSeparator
          isInitialCountDownRunning={isInitialCountDownRunning}
          initialCountDown={initialCountDown}
          timeLeft={timeLeft}
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
