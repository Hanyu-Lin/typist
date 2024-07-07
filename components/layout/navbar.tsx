'use client';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTimerStore } from '@/stores/timerStore';
import { SignInButton, UserButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const { timerId } = useTimerStore();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';
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
          className="flex z-50 bg-background items-center justify-between p-2 pt-8 w-3/4 mx-auto animate-fade-in md:p-8"
        >
          <Logo />

          <div className="flex items-center justify-center gap-2">
            <Button variant={'ghost'} size={'sm'} asChild>
              <Link href="/room">Mutiplayer</Link>
            </Button>
            {isLoading && <Spinner />}
            {!isLoading && !isAuthenticated && (
              <SignInButton mode="modal">
                <Button variant={'ghost'} size={'sm'}>
                  Log in
                </Button>
              </SignInButton>
            )}
            {!isLoading && isAuthenticated && (
              <>
                <Button variant={'ghost'} size={'sm'} asChild>
                  {isDashboard ? (
                    <Link href="/">Home</Link>
                  ) : (
                    <Link href="/dashboard">Dashboard</Link>
                  )}
                </Button>
                <UserButton afterSignOutUrl="/" />
              </>
            )}
          </div>
        </motion.nav>
      ) : (
        <nav className="h-12"></nav>
      )}
    </>
  );
};

export default Navbar;
