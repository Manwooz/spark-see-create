import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

export const ClarityMeter = () => {
  const clarity = useGameStore((state) => state.clarity);
  const [showPercentage, setShowPercentage] = useState(false);

  return (
    <div
      className="fixed top-4 left-4 z-40"
      onMouseEnter={() => setShowPercentage(true)}
      onMouseLeave={() => setShowPercentage(false)}
    >
      <div className="w-64">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Clarity</div>
          {showPercentage && (
            <div className="text-xs text-foreground font-bold">{clarity}%</div>
          )}
        </div>
        
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-clarity-blue to-secondary transition-all duration-300"
            style={{
              width: `${clarity}%`,
              filter: clarity < 40 ? 'blur(2px)' : 'none',
            }}
          />
        </div>
        
        {clarity < 40 && (
          <div className="text-xs text-destructive mt-1">Vision obscured</div>
        )}
      </div>
    </div>
  );
};
