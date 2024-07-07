'use client';

import React, { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Hint } from '@/components/hint';
import { RotateCw } from 'lucide-react';
import { useTimerStore } from '@/stores/timerStore';
import { useTypingStore } from '@/stores/typing-store';
interface RestartButtonProps {
  focusInput: () => void;
}
const RestartButton = forwardRef<HTMLButtonElement, RestartButtonProps>(
  ({ focusInput }, ref) => {
    const { resetTimeState } = useTimerStore();
    const { resetTypingState } = useTypingStore();

    const handleRestart = () => {
      resetTypingState();
      resetTimeState();
      focusInput();
    };
    return (
      <Hint label="Restart Test" side="bottom" sideOffset={10}>
        <Button
          ref={ref}
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleRestart}
        >
          <RotateCw />
        </Button>
      </Hint>
    );
  },
);

RestartButton.displayName = 'RestartButton';
export default RestartButton;
