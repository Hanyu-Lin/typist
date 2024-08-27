import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative isolate space-y-5 overflow-hidden rounded-2xl bg-white/5  h-full w-full shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-primary/10 before:bg-gradient-to-r before:from-transparent before:via-primary/10 before:to-transparent',
        className,
      )}
      {...props}
    />
  );
};
