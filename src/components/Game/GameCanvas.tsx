import { Canvas } from '@react-three/fiber';
import { EffectComposer, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { Corridor } from './Environments/Corridor';
import { useFirstPersonControls } from '@/hooks/useFirstPersonControls';
import { useGameStore } from '@/stores/gameStore';
import { IntrusiveThought } from './IntrusiveThought';
import { DefaultPath } from './Entities/DefaultPath';

const Scene = () => {
  useFirstPersonControls();
  const bindingScore = useGameStore((state) => state.bindingScore);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[0, 2, 0]} intensity={0.3} color="#2b0f3a" />
      
      {/* Fog */}
      <fog attach="fog" args={['#2b2b2b', 5, 30]} />
      
      {/* Environment */}
      <Corridor />
      
      {/* Entities */}
      <DefaultPath />
      
      {/* Intrusive Thoughts */}
      <IntrusiveThought />
    </>
  );
};

const PostProcessing = () => {
  const bindingScore = useGameStore((state) => state.bindingScore);
  
  // Intensify effects with binding score
  const vignetteIntensity = 0.3 + (bindingScore / 100) * 0.5;
  const chromaticIntensity = (bindingScore / 100) * 0.05;
  
  return (
    <EffectComposer>
      <Vignette
        offset={0.5}
        darkness={vignetteIntensity}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(chromaticIntensity, chromaticIntensity)}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
};

export const GameCanvas = () => {
  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 75 }}
        gl={{ antialias: true }}
      >
        <Scene />
        <PostProcessing />
      </Canvas>
    </div>
  );
};
