import { cn } from '@/lib/utils';
import React from 'react';

interface CaretProps {
  offset: number;
  isBlinking: boolean;
}

const Caret: React.FC<CaretProps> = ({ offset, isBlinking }) => {
  const style = {
    left: `calc(${offset * 0.9}rem)`,
  };

  return (
    <span
      className={cn(
        'h-full absolute ml-[-0.45rem]',
        isBlinking ? 'animate-blink' : '',
      )}
      style={style}
    >
      |
    </span>
  );
};

export default Caret;
