import type { Note } from '../model';

interface FeedViewProps {
  hasMore: boolean;
  hasLoadMoreError: boolean;
  isLoadingMore: boolean;
  notes: Note[];
  onLoadMore: () => void;
  onRetryLoadMore: () => void;
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
}

export type { FeedViewProps };
