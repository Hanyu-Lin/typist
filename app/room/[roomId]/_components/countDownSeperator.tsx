import Countdown from '@/components/countdown';
import { Button } from '@/components/ui/button';
import React from 'react';

interface CountdownSeparatorProps {
  isInitialCountDownRunning: boolean;
  initialCountDown: number;
  timeLeft: number;
  startInitialCountDown: () => void;
  resetRace: () => void;
  isOwner: boolean;
}

const CountdownSeparator: React.FC<CountdownSeparatorProps> = ({
  isInitialCountDownRunning,
  initialCountDown,
  timeLeft,
  startInitialCountDown,
  resetRace,
  isOwner = false,
}) => {
  const renderCountdown = () => {
    const timer = isInitialCountDownRunning ? initialCountDown : timeLeft;
    return <Countdown timer={timer} />;
  };

  const renderButtons = () => {
    if (!isOwner) return null;

    return isInitialCountDownRunning || timeLeft ? (
      <Button variant="outline" onClick={resetRace}>
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
