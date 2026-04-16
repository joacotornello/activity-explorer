import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getNotes,
  getNotesQueryKey,
} from '../../../features/activity-feed/api/getNotes';
import {
  getMeta,
  metaQueryKey,
} from '../../../features/filter-rail/api/getMeta';
import { t } from '@shared/i18n';
import { focusFirstInteractiveElement, restoreFocus } from '@shared/lib/a11y';
import { Button } from '@shared/ui/atomic/Button';
import { Sidebar } from '@shared/ui/atomic/Sidebar';
import { Surface } from '@shared/ui/atomic/Surface';
import { VisuallyHidden } from '@shared/ui/atomic/VisuallyHidden';
import { EmptyState } from '@shared/ui/composite/EmptyState';
import { ExplorerHeader } from '../ExplorerHeader';
import { FeedLoadingState } from '../FeedLoadingState';
import { FiltersSidebar } from '../FiltersSidebar';
import { FiltersSidebarLoading } from '../FiltersSidebarLoading';
import { NoteDetailsPanel } from '../NoteDetailsPanel';
import {
  changeTimeRangeFilter,
  clearFilters,
  getIsDesktopActivityExplorerLayout,
  getActiveFilterCount,
  getActivityExplorerAnnouncement,
  getFiltersState,
  getInitialActivityExplorerQueryState,
  activityExplorerDesktopMediaQuery,
  getNextSelectedNoteId,
  syncActivityExplorerDocumentMetadata,
  syncActivityExplorerSearchParams,
  toggleAuthorFilter,
  toggleColorFilter,
} from './ActivityExplorerPage.handlers';
import './ActivityExplorerPage.scss';
import { VirtualizedNoteList } from '../VirtualizedNoteList';

/**
 * Main component for the Activity Explorer page, responsible for rendering the filters sidebar, activity feed, and note details panel, as well as managing the state and interactions between these components.
 */
const ActivityExplorerPage = () => {
  const [queryState, setQueryState] = useState(
    getInitialActivityExplorerQueryState,
  );
  const [preferredSelectedNoteId, setPreferredSelectedNoteId] = useState<
    string | null | undefined
  >(undefined);
  const [isDesktopLayout, setIsDesktopLayout] = useState(
    getIsDesktopActivityExplorerLayout,
  );
  const detailsRef = useRef<HTMLDivElement | null>(null);

  const filters = getFiltersState(queryState);
  const activeFilterCount = getActiveFilterCount(filters);

  const metaQuery = useQuery({
    queryKey: metaQueryKey,
    queryFn: ({ signal }) => getMeta(signal),
  });
  const notesQuery = useInfiniteQuery({
    queryKey: getNotesQueryKey(queryState),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      getNotes({
        ...queryState,
        ...(pageParam ? { cursor: pageParam } : {}),
        signal,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });
  const authorFacets = metaQuery.data?.authors ?? [];
  const colorFacets =
    metaQuery.data?.colors.map((facet) => ({
      color: facet.id,
      label: facet.label,
    })) ?? [];

  const notes = notesQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const selectedNoteId = getNextSelectedNoteId(notes, preferredSelectedNoteId);
  const selectedNote = selectedNoteId
    ? (notes.find((note) => note.id === selectedNoteId) ?? null)
    : null;
  const totalVisibleNotes = notesQuery.data?.pages[0]?.total ?? 0;
  const hasFeedError = notesQuery.isError && notesQuery.data === undefined;
  const isFeedLoading = notesQuery.isPending && notesQuery.data === undefined;
  const isFeedEmpty = !hasFeedError && !isFeedLoading && notes.length === 0;
  const activityExplorerAnnouncement = getActivityExplorerAnnouncement({
    activeFilterCount,
    hasFeedError,
    isFeedEmpty,
    isFeedLoading,
    totalVisibleNotes,
  });

  useEffect(() => {
    syncActivityExplorerSearchParams(queryState);
    syncActivityExplorerDocumentMetadata(queryState);
  }, [queryState]);

  useEffect(() => {
    const handlePopState = () => {
      setQueryState(getInitialActivityExplorerQueryState());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!selectedNoteId || !isDesktopLayout || !detailsRef.current) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      focusFirstInteractiveElement(detailsRef.current);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isDesktopLayout, selectedNoteId]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(activityExplorerDesktopMediaQuery);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktopLayout(event.matches);
    };

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', handleChange);

      return () => {
        mediaQueryList.removeEventListener('change', handleChange);
      };
    }

    mediaQueryList.addListener(handleChange);

    return () => {
      mediaQueryList.removeListener(handleChange);
    };
  }, []);

  const handleRetry = () => {
    void metaQuery.refetch();
    void notesQuery.refetch();
  };
  const handleLoadMoreNotes = () => {
    if (!notesQuery.hasNextPage || notesQuery.isFetchingNextPage) {
      return;
    }

    void notesQuery.fetchNextPage();
  };

  const handleClearFilters = () => {
    setQueryState((currentQueryState) => clearFilters(currentQueryState));
  };

  const isBusy = metaQuery.isFetching || notesQuery.isFetching;
  const hasSidebarError = metaQuery.isError && metaQuery.data === undefined;
  const hasSelectedNote = selectedNote !== null;
  const handleCloseNoteDetails = () => {
    const noteIdToRestore = selectedNoteId;

    setPreferredSelectedNoteId(null);

    if (!noteIdToRestore || !isDesktopLayout) {
      return;
    }

    window.requestAnimationFrame(() => {
      restoreFocus(
        document.querySelector<HTMLElement>(
          `[data-note-id="${noteIdToRestore}"] button`,
        ),
      );
    });
  };

  return (
    <div className="app-activity-explorer-page">
      <div
        className={`app-activity-explorer-page__layout${
          hasSelectedNote && isDesktopLayout ? ' has-details' : ''
        }`}
      >
        <div className="app-activity-explorer-page__sidebar">
          {metaQuery.isPending && metaQuery.data === undefined ? (
            <Surface
              as="aside"
              className="app-activity-explorer-page__state app-activity-explorer-page__state--loading"
              padding="lg"
            >
              <FiltersSidebarLoading />
            </Surface>
          ) : hasSidebarError ? (
            <Surface
              as="aside"
              className="app-activity-explorer-page__state"
              padding="lg"
            >
              <EmptyState
                action={
                  <Button size="sm" variant="secondary" onClick={handleRetry}>
                    {t('common.actions.retry')}
                  </Button>
                }
                description={t('states.error.description')}
                title={t('states.error.title')}
              />
            </Surface>
          ) : metaQuery.data ? (
            <FiltersSidebar
              authors={authorFacets}
              colors={colorFacets}
              filters={filters}
              onChangeTimeRange={(timeRange) => {
                setQueryState((currentQueryState) =>
                  changeTimeRangeFilter(currentQueryState, timeRange),
                );
              }}
              onClear={handleClearFilters}
              onToggleAuthor={(authorId) => {
                setQueryState((currentQueryState) =>
                  toggleAuthorFilter(currentQueryState, authorId),
                );
              }}
              onToggleColor={(color) => {
                setQueryState((currentQueryState) =>
                  toggleColorFilter(currentQueryState, color),
                );
              }}
            />
          ) : null}
        </div>

        <main
          aria-busy={isBusy || undefined}
          className="app-activity-explorer-page__main"
          id="activity-feed"
        >
          <VisuallyHidden>
            <div aria-atomic="true" aria-live="polite">
              {activityExplorerAnnouncement}
            </div>
          </VisuallyHidden>

          <ExplorerHeader
            activeFilterCount={activeFilterCount}
            title={t('app.title')}
            totalVisible={totalVisibleNotes}
          />

          {isFeedLoading ? (
            <Surface
              as="section"
              className="app-activity-explorer-page__state app-activity-explorer-page__state--loading"
              padding="lg"
            >
              <FeedLoadingState />
            </Surface>
          ) : hasFeedError ? (
            <Surface
              as="section"
              className="app-activity-explorer-page__state"
              padding="lg"
            >
              <EmptyState
                action={
                  <Button size="sm" variant="secondary" onClick={handleRetry}>
                    {t('states.error.retry')}
                  </Button>
                }
                description={t('states.error.description')}
                title={t('states.error.title')}
              />
            </Surface>
          ) : isFeedEmpty ? (
            <Surface
              as="section"
              className="app-activity-explorer-page__state"
              padding="lg"
            >
              <EmptyState
                action={
                  activeFilterCount > 0 ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleClearFilters}
                    >
                      {t('filters.clear')}
                    </Button>
                  ) : null
                }
                description={t('feed.state.emptyDescription')}
                title={t('feed.state.emptyTitle')}
              />
            </Surface>
          ) : (
            <section
              aria-labelledby="activity-feed-title"
              className="app-feed-view"
            >
              <VirtualizedNoteList
                ariaLabel={t('feed.aria.list')}
                hasMore={notesQuery.hasNextPage ?? false}
                hasLoadMoreError={notesQuery.isFetchNextPageError}
                isLoadingMore={notesQuery.isFetchingNextPage}
                notes={notes}
                onLoadMore={handleLoadMoreNotes}
                onRetryLoadMore={() => {
                  void notesQuery.fetchNextPage();
                }}
                selectedNoteId={selectedNoteId}
                onSelectNote={setPreferredSelectedNoteId}
              />
            </section>
          )}
        </main>

        {hasSelectedNote && isDesktopLayout ? (
          <div className="app-activity-explorer-page__details" ref={detailsRef}>
            <NoteDetailsPanel
              note={selectedNote}
              onClose={handleCloseNoteDetails}
            />
          </div>
        ) : null}
      </div>

      <Sidebar
        closeLabel={t('noteDetails.actions.close')}
        labelledBy="note-details-title"
        onClose={handleCloseNoteDetails}
        open={hasSelectedNote && !isDesktopLayout}
      >
        {selectedNote ? (
          <NoteDetailsPanel
            note={selectedNote}
            onClose={handleCloseNoteDetails}
          />
        ) : null}
      </Sidebar>
    </div>
  );
};

export { ActivityExplorerPage };
