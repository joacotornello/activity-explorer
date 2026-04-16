import type { StickyNote } from '@entities/note/model/types';

interface NoteListItemProps {
  note: StickyNote;
  selected: boolean;
  onSelect: (noteId: string) => void;
}

export type { NoteListItemProps };
