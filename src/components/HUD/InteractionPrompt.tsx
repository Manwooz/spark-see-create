interface InteractionPromptProps {
  text: string;
  visible: boolean;
}

export const InteractionPrompt = ({ text, visible }: InteractionPromptProps) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
      <div className="bg-primary/90 backdrop-blur-sm border border-primary-foreground/20 rounded-lg px-6 py-3 animate-fade-in">
        <div className="flex items-center gap-3">
          <kbd className="px-3 py-1 bg-background/50 border border-border rounded text-sm font-mono">
            E
          </kbd>
          <span className="text-sm text-primary-foreground">{text}</span>
        </div>
      </div>
    </div>
  );
};
