import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { faker } from "@faker-js/faker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateWords = (n: number): string[] => {
  return faker.word.words(n).split(" ");
};

export interface TypingSpeedMetrics {
  wpm: number;
  raw: number;
  charactersStats: {
    correct: number;
    incorrect: number;
    extra: number;
    missed: number;
  };
  accuracy: number;
}

/**
 * Calculates typing speed metrics including Words Per Minute (WPM), raw speed,
 * accuracy, and character statistics.
 *
 * @param {string[]} typedHistory - Array of words that the user has typed.
 * @param {string[]} wordList - Target list of words for the typing test.
 * @param {number} testDurationSeconds - Duration of the typing test in seconds.
 * @param {boolean} [withDecimalPoints=false] - Whether to include decimal points in the output.
 * @returns {TypingSpeedMetrics} Typing speed metrics including WPM, raw speed, accuracy, and character statistics.
 */
export function calculateTypingMetrics(
  typedHistory: string[],
  wordList: string[],
  testDurationSeconds: number,
  withDecimalPoints: boolean = false
): TypingSpeedMetrics {
  let correctChars = 0;
  let incorrectChars = 0;
  let extraChars = 0;
  let missedChars = 0;

  // Calculate correct, incorrect, extra, and missed characters
  typedHistory.forEach((typedWord, index) => {
    const targetWord = wordList[index] || "";
    for (let i = 0; i < Math.max(targetWord.length, typedWord.length); i++) {
      if (i < typedWord.length) {
        const charIsCorrect =
          i < targetWord.length && typedWord[i] === targetWord[i];
        correctChars += charIsCorrect ? 1 : 0;
        incorrectChars += !charIsCorrect ? 1 : 0;
      } else {
        missedChars++;
      }
    }
    extraChars += Math.max(0, typedWord.length - targetWord.length);
  });

  const totalCharsAttempted = correctChars + incorrectChars + extraChars;
  const wpm = calculateWpm(
    correctChars,
    testDurationSeconds,
    withDecimalPoints
  );
  const raw = calculateWpm(
    totalCharsAttempted,
    testDurationSeconds,
    withDecimalPoints
  );
  const accuracyPercentage = calculateAccuracy(
    correctChars,
    totalCharsAttempted,
    withDecimalPoints
  );

  return {
    wpm,
    raw,
    charactersStats: {
      correct: correctChars,
      incorrect: incorrectChars,
      extra: extraChars,
      missed: missedChars,
    },
    accuracy: accuracyPercentage,
  };
}

function calculateWpm(
  chars: number,
  seconds: number,
  withDecimalPoints: boolean
): number {
  const wpm = (chars / 5) * (60 / seconds);
  return withDecimalPoints ? wpm : Math.round(wpm);
}

function calculateAccuracy(
  correctChars: number,
  totalCharsAttempted: number,
  withDecimalPoints: boolean
): number {
  const accuracy = (correctChars / totalCharsAttempted) * 100 || 0;
  return withDecimalPoints ? accuracy : Math.round(accuracy);
}

// Regex to match valid characters for typing test
// Only alphanumeric characters, hyphen, period, comma, single quote, and space are allowed
export const validCharacters = /^[a-zA-Z0-9\-.,' ]$/;

export interface chartTestScore {
  creationTime: number;
  wpm: number;
  raw: number;
}

export function formatChartData(
  testScores: chartTestScore[]
): { Month: string; WPM: number; RAW: number }[] {
  return testScores.map((score) => ({
    Month: new Date(score.creationTime).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    WPM: score.wpm,
    RAW: score.raw,
  }));
}
