'use client';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Character from './character';
import { useTypingStore } from '@/stores/typing-store';
import Caret from '@/components/caret';
import { useTimerStore } from '@/stores/timerStore';

interface WordProps {
  word: string;
  index: number;
  isActive: boolean;
  isTyped: boolean;
  typedWord: string;
}

const Word = forwardRef<HTMLSpanElement, WordProps>(
  ({ word, isActive, index, isTyped, typedWord }, ref) => {
    const { typedHistory } = useTypingStore();
    const { timerId } = useTimerStore();

    // Helper functions
    const computeRegisteredWord = () => (isTyped ? typedHistory[index] : '');
    const computeIsMistyped = useCallback(
      (registeredWord: string) => isTyped && registeredWord !== word,
      [isTyped, word],
    );
    const computeHasExtraChars = useCallback(
      (registeredWord: string) =>
        isTyped && registeredWord.length > word.length,
      [isTyped, word],
    );

    const registeredWord = useMemo(computeRegisteredWord, [
      typedHistory,
      index,
      isTyped,
    ]);
    const isMistyped = useMemo(
      () => computeIsMistyped(registeredWord),
      [registeredWord, computeIsMistyped],
    );
    const hasExtraChars = useMemo(
      () => computeHasExtraChars(registeredWord),
      [computeHasExtraChars, registeredWord],
    );

    const renderExtraCharacters = (baseWord: string, extraChars: string) => {
      return extraChars
        .slice(baseWord.length)
        .split('')
        .map((char, i) => (
          <span key={`extra-${i}`} className="text-red-500 opacity-75">
            {char}
          </span>
        ));
    };

    // Conditional styling
    const wordClassName = useMemo(
      () =>
        cn('relative mr-2', isMistyped ? 'underline decoration-red-500' : ''),
      [isMistyped],
    );

    return (
      <span ref={ref} className={wordClassName}>
        {isActive ? (
          <Caret offset={typedWord.length} isBlinking={!timerId} />
        ) : null}
        {word.split('').map((char, charIndex) => (
          <Character
            key={charIndex}
            char={char}
            typedChar={typedWord[charIndex]}
            registeredChar={registeredWord[charIndex]}
            isActive={isActive}
          />
        ))}
        {isActive && renderExtraCharacters(word, typedWord)}
        {hasExtraChars && renderExtraCharacters(word, registeredWord)}
      </span>
    );
  },
);

Word.displayName = 'Word';
export default Word;
