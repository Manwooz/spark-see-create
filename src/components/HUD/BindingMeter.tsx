import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

export const BindingMeter = () => {
  const bindingScore = useGameStore((state) => state.bindingScore);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animate on threshold crossings
    if (bindingScore === 30 || bindingScore === 60 || bindingScore === 90) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [bindingScore]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (bindingScore / 100) * circumference;

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="relative">
        <svg width="120" height="120" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            stroke="hsl(var(--binding-glow))"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-500 ${isAnimating ? 'animate-pulse' : ''}`}
            style={{
              filter: `drop-shadow(0 0 8px hsl(var(--binding-glow)))`,
            }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{bindingScore}</div>
            <div className="text-xs text-muted-foreground">BOUND</div>
          </div>
        </div>
      </div>
      
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-primary rounded-full animate-ping opacity-75" />
        </div>
      )}
    </div>
  );
};
