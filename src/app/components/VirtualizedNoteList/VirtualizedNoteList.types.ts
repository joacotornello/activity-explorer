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

export type { VirtualizedNoteListProps };
