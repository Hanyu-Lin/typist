"use client";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useTimerStore } from "@/store/timer-store";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const { timerId } = useTimerStore();

  const navbarVariants = {
    hidden: { opacity: 0, y: -20, transition: { duration: 0.5 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  return (
    <>
      {!timerId ? (
        <motion.nav
          initial="visible"
          variants={navbarVariants}
          animate="visible"
          exit="hidden"
          className="flex z-50 bg-background items-center justify-between p-2 md:p-8 w-2/3 mx-auto animate-fade-in"
        >
          <Logo />

          <ModeToggle />
        </motion.nav>
      ) : (
        <nav className="h-12"></nav>
      )}
    </>
  );
};

export default Navbar;
