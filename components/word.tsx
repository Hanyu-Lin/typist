"use client";
import React, { forwardRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import Character from "./character";
import { useTypingStore } from "@/store/typing-store";
import Caret from "@/components/caret";

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

    // Helper functions
    const computeRegisteredWord = () => (isTyped ? typedHistory[index] : "");
    const computeIsMistyped = (registeredWord: string) =>
      isTyped && registeredWord !== word;
    const computeHasExtraChars = (registeredWord: string) =>
      isTyped && registeredWord.length > word.length;

    const registeredWord = useMemo(computeRegisteredWord, [
      typedHistory,
      index,
      isTyped,
    ]);
    const isMistyped = useMemo(
      () => computeIsMistyped(registeredWord),
      [registeredWord, isTyped, word]
    );
    const hasExtraChars = useMemo(
      () => computeHasExtraChars(registeredWord),
      [registeredWord, isTyped, word]
    );

    const renderExtraCharacters = (baseWord: string, extraChars: string) => {
      return extraChars
        .slice(baseWord.length)
        .split("")
        .map((char, i) => (
          <span key={`extra-${i}`} className="text-red-500 opacity-75">
            {char}
          </span>
        ));
    };

    // Conditional styling
    const wordClassName = useMemo(
      () =>
        cn("relative mr-2", isMistyped ? "underline decoration-red-500" : ""),
      [isMistyped]
    );

    return (
      <span ref={ref} className={wordClassName}>
        {isActive ? <Caret offset={typedWord.length} /> : null}
        {word.split("").map((char, charIndex) => (
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
  }
);

export default Word;
