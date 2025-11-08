import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

export const Journal = () => {
  const isOpen = useGameStore((state) => state.isJournalOpen);
  const journals = useGameStore((state) => state.journals);
  const updateJournalEntry = useGameStore((state) => state.updateJournalEntry);
  const toggleJournal = useGameStore((state) => state.toggleJournal);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        toggleJournal();
      }
      if (e.key === 'Escape' && isOpen) {
        toggleJournal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, toggleJournal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-8 pointer-events-auto">
      <div className="max-w-4xl w-full bg-journal-bg border-2 border-border rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-primary/20 p-4 flex items-center justify-between border-b border-border">
          <h2 className="text-2xl font-serif text-foreground">Journal</h2>
          <button
            onClick={toggleJournal}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <ScrollArea className="h-[600px] p-6">
          <div className="space-y-6">
            {journals.map((entry) => (
              <div
                key={entry.id}
                className="bg-card/50 border border-border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {entry.title || 'Untitled'}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <Textarea
                  value={entry.text}
                  onChange={(e) => updateJournalEntry(entry.id, e.target.value)}
                  className="min-h-[100px] bg-background/50 border-border font-serif resize-none"
                  placeholder="Write your thoughts..."
                />
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="bg-primary/10 p-4 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Press <kbd className="px-2 py-1 bg-muted rounded">TAB</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};
