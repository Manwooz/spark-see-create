import templates from '@/data/procedural_text_templates.json';

type BindingLevel = 'low_binding' | 'mid_binding' | 'high_binding';

export const generateThought = (
  bindingScore: number,
  contextTag?: string
): string => {
  let level: BindingLevel;

  if (bindingScore <= 30) {
    level = 'low_binding';
  } else if (bindingScore <= 65) {
    level = 'mid_binding';
  } else {
    level = 'high_binding';
  }

  const thoughts = templates.intrusive_thoughts[level];
  return thoughts[Math.floor(Math.random() * thoughts.length)];
};

export const generateJournalPrompt = (): string => {
  const prompts = templates.journal_prompts.seed_questions;
  return prompts[Math.floor(Math.random() * prompts.length)];
};

export const generateAutoEntry = (): string => {
  const entries = templates.journal_prompts.auto_entries;
  return entries[Math.floor(Math.random() * entries.length)];
};
