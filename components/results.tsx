import { calculateTypingMetrics } from "@/lib/utils";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import React from "react";
import { CircleCheck, CircleX, Keyboard } from "lucide-react";
interface ResultsProps {
  typedHistory: string[];
  wordList: string[];
  testDurationSeconds: number;
}

const Results: React.FC<ResultsProps> = ({
  typedHistory,
  wordList,
  testDurationSeconds,
}) => {
  const { wpm, raw, accuracy, errors } = calculateTypingMetrics(
    typedHistory,
    wordList,
    testDurationSeconds
  );

  return (
    <Card className="flex flex-col w-1/2 max-w-lg items-center justify-center animate-slow-fade-in">
      <CardHeader className="pb-0 items-center">
        <CardTitle>Results</CardTitle>
        <CardDescription>See your performance</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 grid gap-4">
        {!isNaN(wpm) ? (
          <>
            <div className="flex items-center gap-6">
              <div className="text-sm font-medium w-12">WPM</div>
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                <span className="font-semibold">{wpm}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-sm font-medium w-12">Raw</div>
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                <span className="font-semibold">{raw}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-sm font-medium w-12">Errors</div>
              <div className="flex items-center gap-2">
                <CircleX className="w-5 h-5" />
                <span className="font-semibold">{errors}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
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
