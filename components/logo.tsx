import { Keyboard } from 'lucide-react';
import Link from 'next/link';

export const Logo = () => {
  return (
    <div className="flex items-center gap-x-2">
      <Keyboard className="w-12 h-12" />
      <Link href="/" className="font-extrabold text-4xl">
        Typist
      </Link>
    </div>
  );
};
