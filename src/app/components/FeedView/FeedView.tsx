import { t } from '@shared/i18n';
import { VirtualizedNoteList } from '../VirtualizedNoteList';
import type { FeedViewProps } from './FeedView.types';

import './FeedView.scss';

const FeedView = ({
  hasMore,
  hasLoadMoreError,
  isLoadingMore,
  notes,
  onLoadMore,
  onRetryLoadMore,
  onSelectNote,
  selectedNoteId,
}: FeedViewProps) => (
  <section aria-labelledby="activity-feed-title" className="app-feed-view">
    <VirtualizedNoteList
      ariaLabel={t('feed.aria.list')}
      hasMore={hasMore}
      hasLoadMoreError={hasLoadMoreError}
      isLoadingMore={isLoadingMore}
      notes={notes}
      onLoadMore={onLoadMore}
      onRetryLoadMore={onRetryLoadMore}
      onSelectNote={onSelectNote}
      selectedNoteId={selectedNoteId}
    />
  </section>
);

export { FeedView };
