'use client';
import Word from '@/components/word';
import Countdown from '@/components/countdown';
import { cn, generateWords, validCharacters } from '@/lib/utils';
import { useTimerStore } from '@/stores/timerStore';
import { useTypingStore } from '@/stores/typingStore';
import { MousePointer2 } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import Results from '@/components/results';
import RestartButton from '@/components/restartButton';
import { setLocalStorage, getLocalStorage } from '@/lib/storage-helper';
import { calculateTypingMetrics } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';

export default function TypingTest() {
  const {
    currWordIndex,
    typedWord,
    wordList,
    setWordList,
    typedHistory,
    setInputRef,
    moveToNextWord,
    setTypedWord,
    handleDelete,
    resetTypingState,
  } = useTypingStore();
  const { time, timer, timerId, setTimer, startTimer } = useTimerStore();
  const mutate = useMutation(api.testScore.create);
  const { userId } = useAuth();

  const inputRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const storageTime = getLocalStorage('timer', 60);
    setTimer(storageTime);
    setLocalStorage('timer', storageTime);
    setWordList(generateWords(250));

    inputRef.current?.focus();
    setInputRef(inputRef);
  }, [setInputRef, setTimer, setWordList]);

  // Submit test results to the database when the test is completed
  useEffect(() => {
    if (userId && !timer) {
      const { wpm, raw, accuracy } = calculateTypingMetrics(
        typedHistory,
        wordList,
        time,
      );

      mutate({
        userId,
        wpm,
        raw,
        accuracy,
        testDurationSeconds: time,
        wordsTyped: typedHistory.length,
      });
    }
  }, [mutate, typedHistory, userId, wordList, time, timer]);

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
    if (!timer) {
      if (key === 'Tab') {
        resetTypingState(true);
      }
      return;
    }
    //Only start timer if it's not already running and the key is not Tab and the key is a letter
    if (
      !timerId &&
      key !== 'Tab' &&
      e.key.length === 1 &&
      /^[a-zA-Z]$/.test(e.key)
    )
      startTimer();

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
    <div className="flex flex-col items-center w-3/4 gap-3">
      {timer ? (
        <div className="relative rounded-lg font-mono text-2xl w-full">
          {!isFocused && (
            <div
              className="absolute top-0 left-0 z-10 w-full h-full flex justify-center items-center bg-opacity-50 rounded-lg cursor-pointer gap-2 text-white "
              onClick={focusInput}
            >
              <MousePointer2 className="h-6 w-6" size={100} />
              <span>Click to focus</span>
            </div>
          )}
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
            <Countdown timer={timer} />
            <div className="flex justify-start flex-wrap h-32 overflow-hidden items-center select-none px-3  ">
              {wordList.map((word, index) => (
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
      ) : (
        <Results {...calculateTypingMetrics(typedHistory, wordList, time)} />
      )}
      <RestartButton ref={restartButtonRef} focusInput={focusInput} />
    </div>
  );
}
