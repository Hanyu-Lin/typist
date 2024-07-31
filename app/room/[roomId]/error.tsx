'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const Error = () => {
  return (
    <div className="h-full grid gap-4 place-items-center space-y-4">
      <Image
        src="/error.png"
        height="300"
        width="300"
        alt="Error"
        className="dark:hidden"
      />
      <Image
        src="/error-dark.png"
        height="300"
        width="300"
        alt="Error"
        className="hidden dark:block"
      />
      <h2 className="text-3xl lg:text-5xl font-black text-orange-400">
        404: Room not found
      </h2>

      <p className="text-center w-72 font-bold tracking-tight">
        Uh-oh! The room you are looking for does not exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/">Go back</Link>
      </Button>
    </div>
  );
};

export default Error;
