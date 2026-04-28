import { LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingButtonProps {
  onClick: () => void;
  className?: string;
}

export const FloatingButton = ({ onClick, className }: FloatingButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute bottom-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-700 active:scale-95',
        className
      )}
      aria-label="Center map on my location"
    >
      <LocateFixed className="h-5 w-5" />
    </button>
  );
};
