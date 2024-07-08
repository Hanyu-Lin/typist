'use client'; // Error components must be Client Components
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center gap-6 h-[50vh]">
      <h2 className="font-bold text-3xl text-red-500">404: Room not found </h2>
      <p className="text-wrap">
        The room you are looking for does not exist or has been removed.
      </p>
      <Button className="mt-8">
        <Link href="/">Go back to the homepage</Link>
      </Button>
    </div>
  );
}
