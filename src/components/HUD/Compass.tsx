import { useGameStore } from '@/stores/gameStore';

export const Compass = () => {
  const currentRoom = useGameStore((state) => state.currentRoom);

  const roomNames: Record<string, string> = {
    corridor_of_comfort: 'Corridor of Comfort',
    mirror_hall: 'Mirror Hall',
    waiting_room: 'Waiting Room',
    gallery_of_masks: 'Gallery of Masks',
    crossroads: 'Crossroads',
    room_of_unlived_lives: 'Room of Unlived Lives',
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-full px-6 py-3">
        <div className="text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Location
          </div>
          <div className="text-sm font-semibold text-foreground">
            {roomNames[currentRoom] || 'Unknown'}
          </div>
        </div>
      </div>
    </div>
  );
};
