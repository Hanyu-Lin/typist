"use client";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface CharacterProps {
  char: string;
  typedChar: string | undefined;
  isActive: boolean;
  registeredChar: string;
}

const Character: React.FC<CharacterProps> = ({
  char,
  typedChar,
  registeredChar,
  isActive,
}) => {
  const isCorrect = useMemo(
    () => (isActive ? typedChar === char : registeredChar === char),
    [isActive, typedChar, registeredChar, char]
  );
  const isTyped = useMemo(
    () => (isActive ? typedChar !== undefined : registeredChar !== undefined),
    [isActive, typedChar, registeredChar]
  );

  // Conditional styling
  const characterClassName = useMemo(
    () => cn(isTyped ? (isCorrect ? "text-green-500" : "text-red-500") : ""),
    [isTyped, isCorrect]
  );

  return <span className={characterClassName}>{char}</span>;
};

export default Character;
