import { GameCanvas } from '@/components/Game/GameCanvas';
import { BindingMeter } from '@/components/HUD/BindingMeter';
import { ClarityMeter } from '@/components/HUD/ClarityMeter';
import { Journal } from '@/components/HUD/Journal';
import { Compass } from '@/components/HUD/Compass';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useEffect } from 'react';

const Index = () => {
  useAutoSave();

  useEffect(() => {
    // Lock cursor instruction
    const showInstruction = () => {
      console.log('Click to start - WASD to move, Mouse to look, TAB for journal');
    };
    showInstruction();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Game Canvas */}
      <GameCanvas />
      
      {/* HUD Overlays */}
      <BindingMeter />
      <ClarityMeter />
      <Compass />
      <Journal />
      
      {/* Initial Instructions */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <div className="text-center space-y-2 animate-fade-in">
          <p className="text-muted-foreground text-sm">Click anywhere to begin</p>
          <p className="text-muted-foreground text-xs">WASD to move • Mouse to look • TAB for journal</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
