import { useEffect, useRef } from 'react';
import { Vector3, Euler } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '@/stores/gameStore';

interface ControlsConfig {
  moveSpeed?: number;
  mouseSensitivity?: number;
}

export const useFirstPersonControls = (config: ControlsConfig = {}) => {
  const { moveSpeed = 5, mouseSensitivity = 0.002 } = config;
  
  const { camera } = useThree();
  const keys = useRef<Set<string>>(new Set());
  const rotation = useRef({ x: 0, y: 0 });
  const velocity = useRef(new Vector3());
  
  const bindingScore = useGameStore((state) => state.bindingScore);
  const awakeningLevel = useGameStore((state) => state.awakeningLevel);
  const updatePlayerPosition = useGameStore((state) => state.updatePlayerPosition);
  const updatePlayerRotation = useGameStore((state) => state.updatePlayerRotation);
  const isPaused = useGameStore((state) => state.isPaused);
  const isJournalOpen = useGameStore((state) => state.isJournalOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase());
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement && !isPaused && !isJournalOpen) {
        rotation.current.y -= e.movementX * mouseSensitivity;
        rotation.current.x -= e.movementY * mouseSensitivity;
        
        // Clamp vertical rotation
        rotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current.x));
        
        updatePlayerRotation(rotation.current.x, rotation.current.y);
      }
    };

    const handleClick = () => {
      if (!isPaused && !isJournalOpen) {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, [mouseSensitivity, isPaused, isJournalOpen, updatePlayerRotation]);

  useFrame((state, delta) => {
    if (isPaused || isJournalOpen) return;

    // Apply camera rotation
    camera.rotation.set(rotation.current.x, rotation.current.y, 0, 'YXZ');

    // Calculate movement speed with awakening level penalty
    let currentSpeed = moveSpeed;
    if (awakeningLevel >= 2) {
      currentSpeed *= 0.7; // 30% slower at awakening level 2+
    }

    // Movement
    const forward = new Vector3(0, 0, -1).applyEuler(new Euler(0, rotation.current.y, 0));
    const right = new Vector3(1, 0, 0).applyEuler(new Euler(0, rotation.current.y, 0));

    velocity.current.set(0, 0, 0);

    if (keys.current.has('w')) velocity.current.add(forward);
    if (keys.current.has('s')) velocity.current.sub(forward);
    if (keys.current.has('d')) velocity.current.add(right);
    if (keys.current.has('a')) velocity.current.sub(right);

    if (velocity.current.length() > 0) {
      velocity.current.normalize().multiplyScalar(currentSpeed * delta);
      camera.position.add(velocity.current);
    }

    // Simple bounds (adjust as needed for your rooms)
    camera.position.x = Math.max(-50, Math.min(50, camera.position.x));
    camera.position.z = Math.max(-50, Math.min(50, camera.position.z));
    camera.position.y = 1.6; // Fixed eye height

    // Update game store with position
    updatePlayerPosition(camera.position.x, camera.position.y, camera.position.z);
  });

  return { rotation: rotation.current };
};
