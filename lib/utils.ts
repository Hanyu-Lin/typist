import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { faker } from "@faker-js/faker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateWords = (n: number): string[] => {
  return faker.word.words(n).split(" ");
};

interface TypingSpeedMetrics {
  wpm: number;
  raw: number;
  errors: number;
  accuracy: number;
}

export function calculateTypingMetrics(
  typedHistory: string[],
  wordList: string[],
  testDurationSeconds: number,
  withDecimalPoints?: true
): TypingSpeedMetrics {
  const totalWordsTyped = typedHistory.length;
  const correctWords = typedHistory.filter(
    (word, index) => word === wordList[index]
  ).length;

  const averageWordLength = 6;
  const correctChars = correctWords * averageWordLength;
  const totalCharsTyped = totalWordsTyped * averageWordLength;

  const wpm = (correctChars / averageWordLength) * (60 / testDurationSeconds);
  const raw =
    (totalCharsTyped / averageWordLength) * (60 / testDurationSeconds);

  const errors = totalWordsTyped - correctWords;
  const accuracyPercentage = (correctWords / totalWordsTyped) * 100 || 0;

  return {
    wpm: withDecimalPoints ? wpm : Math.round(wpm),
    raw: withDecimalPoints ? raw : Math.round(raw),
    errors: errors,
    accuracy: withDecimalPoints
      ? accuracyPercentage
      : Math.round(accuracyPercentage),
  };
}

// Regex to match valid characters for typing test
// Only alphanumeric characters, hyphen, period, comma, single quote, and space are allowed
export const validCharacters = /^[a-zA-Z0-9\-.,' ]$/;


