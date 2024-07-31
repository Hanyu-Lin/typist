import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card';
import React from 'react';
import { CircleCheck, CircleX, Keyboard } from 'lucide-react';
import { Hint } from '@/components/hint';
import { TypingSpeedMetrics } from '@/lib/utils';

const Results: React.FC<TypingSpeedMetrics> = ({
  wpm,
  raw,
  accuracy,
  charactersStats,
}) => {
  return (
    <Card className="flex flex-col w-1/2 max-w-lg items-center justify-center animate-slow-fade-in">
      <CardHeader className="pb-0 items-center">
        <CardTitle>Results</CardTitle>
        <CardDescription>See your performance</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 grid gap-4">
        {!isNaN(wpm) ? (
          <>
            <div className="flex items-center gap-10">
              <div className="text-sm font-medium w-12">WPM</div>
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                <span className="font-semibold">{wpm}</span>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-sm font-medium w-12">Raw</div>
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                <span className="font-semibold">{raw}</span>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-sm font-medium w-12">Characters</div>
              <div className="flex items-center gap-2">
                <CircleX className="w-5 h-5" />
                <Hint label="correct, incorrect, extra and missed">
                  <span className="font-semibold">
                    {`
                    ${charactersStats.correct}/ 
                    ${charactersStats.incorrect}/ 
                    ${charactersStats.extra}/ 
                    ${charactersStats.missed}
                    `}
                  </span>
                </Hint>
              </div>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-sm font-medium w-12">Accuracy</div>
              <div className="flex items-center gap-2">
                <CircleCheck className="w-5 h-5" />
                <span className="font-semibold">{accuracy} %</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-lg font-bold">AFK detected</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Results;
