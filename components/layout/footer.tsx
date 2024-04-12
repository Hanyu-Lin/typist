"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Github from "@/components/ui/icons/Github";
import { useTimerStore } from "@/store/timer-store";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  const { timerId } = useTimerStore();

  const footerVariants = {
    hidden: { opacity: 0, y: 20, transition: { duration: 0.5 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      {!timerId ? (
        <motion.footer
          initial="visible"
          variants={footerVariants}
          animate="visible"
          exit="hidden"
          className="mb-3 mt-auto z-50 bg-background items-center p-8 w-2/3 mx-auto animate-fade-in"
        >
          <div className=" flex gap-3 items-center justify-between ">
            <div className="flex items-center justify-center gap-2">
              <ModeToggle />
              <Button size="icon" variant="outline">
                <a href="https://github.com/Hanyu-Lin/typist" target="_blank">
                  <Github />
                </a>
              </Button>
            </div>

            <p className="text-primary text-center md:text-start ">
              A project by{" "}
              <a
                className="font-semibold text-orange-400 underline-offset-4 transition-colors hover:underline"
                href="https://github.com/Hanyu-Lin"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hanyu Lin
              </a>
            </p>
          </div>
        </motion.footer>
      ) : (
        <footer className="h-12"></footer>
      )}
    </>
  );
};

export default Footer;
