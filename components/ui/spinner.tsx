import { Loader } from 'lucide-react';

import { cn } from '@/lib/utils';

import { cva, type VariantProps } from 'class-variance-authority';

const spinnerVariants = cva('text-muted-foreground animate-spin', {
  variants: {
    size: {
      sm: 'h-2 w-2',
      md: 'h-4 w-4',
      lg: 'h-6 w-6',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {}

export const Spinner = ({ size }: SpinnerProps) => {
  return <Loader className={cn(spinnerVariants({ size }))} />;
};
