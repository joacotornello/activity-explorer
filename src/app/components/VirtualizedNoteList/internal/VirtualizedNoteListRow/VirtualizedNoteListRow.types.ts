import type { Note } from '../../../model';

type VirtualizedNoteListRowProps = {
  hasMore: boolean;
  notes: Note[];
  onMeasureRow: (noteId: string, element: HTMLDivElement | null) => void;
  onSelectNote: (noteId: string) => void;
  selectedNoteId: string | null;
};

export type { VirtualizedNoteListRowProps };
