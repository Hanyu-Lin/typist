'use client';
import MobileNotSupported from '@/components/mobileNotSupported';
import TimerToolbar from '@/components/toolbar';
import useDetectDevice from '@/hooks/useDetectDevice';
import dynamic from 'next/dynamic';
const TypingTest = dynamic(
  () => import('@/components/userTyping').then((t) => t.default),
  {
    ssr: false,
  },
);

export default function Home() {
  const { isMobile } = useDetectDevice();

  return (
    <main className="flex min-h-full flex-col items-center justify-start p-24 w-screen mx-auto gap-5 animate-fade-in">
      {isMobile ? (
        <MobileNotSupported />
      ) : (
        <>
          <TimerToolbar />
          <TypingTest />
        </>
      )}
    </main>
  );
}
