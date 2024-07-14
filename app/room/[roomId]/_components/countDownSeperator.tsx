import Countdown from '@/components/countdown';
import { Button } from '@/components/ui/button';
import React from 'react';

interface CountdownSeparatorProps {
  isInitialCountDownRunning: boolean;
  initialCountDown: number;
  timeLeft: number;
  timerStartedRef: React.MutableRefObject<boolean>;
  startInitialCountDown: () => void;
  resetTimer: () => void;
  isOwner: boolean;
}

const CountdownSeparator: React.FC<CountdownSeparatorProps> = ({
  isInitialCountDownRunning,
  initialCountDown,
  timeLeft,
  timerStartedRef,
  startInitialCountDown,
  resetTimer,
  isOwner = false,
}) => {
  const renderCountdown = () => {
    const timer = isInitialCountDownRunning ? initialCountDown : timeLeft;
    return <Countdown timer={timer} />;
  };

  const renderButtons = () => {
    if (!isOwner) return null;

    return isInitialCountDownRunning || timerStartedRef.current ? (
      <Button variant="outline" onClick={resetTimer}>
        Reset Race
      </Button>
    ) : (
      <Button variant="outline" onClick={startInitialCountDown}>
        Start Race
      </Button>
    );
  };

  return (
    <div className="flex justify-center items-center place-content-stretch">
      {renderCountdown()}
      {renderButtons()}
    </div>
  );
};

export default CountdownSeparator;
