import type { Note } from '../model';

type VirtualizedNoteListProps = {
  ariaLabel: string;
  hasMore: boolean;
  hasLoadMoreError: boolean;
  isLoadingMore: boolean;
  notes: Note[];
  onLoadMore: () => void;
  onRetryLoadMore: () => void;
  onSelectNote: (noteId: string) => void;
  selectedNoteId: string | null;
};

type VirtualizedNoteListRowProps = {
  hasMore: boolean;
  notes: Note[];
  onMeasureRow: (noteId: string, element: HTMLDivElement | null) => void;
  onSelectNote: (noteId: string) => void;
  selectedNoteId: string | null;
};

export type { VirtualizedNoteListProps, VirtualizedNoteListRowProps };
