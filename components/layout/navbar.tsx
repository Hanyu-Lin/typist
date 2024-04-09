"use client";
import { Logo } from "@/components/logo";
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
          className="z-50 bg-background items-center p-8 w-2/3 mx-auto animate-fade-in"
        >
          <Logo />
          {/* TODO: Theme dropdown meny */}
        </motion.nav>
      ) : (
        <nav className="h-12"></nav>
      )}
    </>
  );
};

export default Navbar;
