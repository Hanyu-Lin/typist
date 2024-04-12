"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export function Loading() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <Progress value={progress} className="w-[60%]" />
    </div>
  );
}
