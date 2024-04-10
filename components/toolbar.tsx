"use client";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTypingStore } from "@/store/typing-store";
import { useTimerStore } from "@/store/timer-store";
import { cn } from "@/lib/utils";
import { setLocalStorage } from "@/lib/storage-helper";

const TimerToolbar = () => {
  const { inputRef, resetTypingState } = useTypingStore();
  const { time, timerId, setTimer } = useTimerStore();

  const timerValues = [15, 30, 60, 120];

  const handleSelectTime = (value: number) => {
    if (inputRef?.current) inputRef.current.focus();
    setTimer(value);
    resetTypingState();
    setLocalStorage("timer", value);
  };

  const toolbarVariants = {
    hidden: { opacity: 0, y: -20, transition: { duration: 0.5 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      {!timerId ? (
        <motion.div
          initial="visible"
          variants={toolbarVariants}
          animate="visible"
          exit="hidden"
          className="flex bg-muted h-14 items-center p-3 rounded-lg animate-fade-in"
        >
          <div className="flex items-center justify-center gap-4 h-5 text-sm">
            <Clock className="w-6 h-6" />
            <Separator orientation="vertical" />
            <div className="flex items-center gap-1">
              {timerValues.map((value) => (
                <motion.button
                  key={value}
                  onClick={() => handleSelectTime(value)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "px-4 py-2 rounded-lg font-semibold",
                    time === value ? "bg-primary text-white" : ""
                  )}
                >
                  {value}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="h-14"></div>
      )}
    </>
  );
};

export default TimerToolbar;
