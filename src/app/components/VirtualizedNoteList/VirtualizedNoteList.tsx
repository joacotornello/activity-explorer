import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { List } from 'react-window';

import { t } from '@shared/i18n';
import { Button } from '@shared/ui/atomic/Button';
import { Text } from '@shared/ui/atomic/Text';
import { FeedLoadingState } from '../FeedLoadingState';
import {
  getNeedsNextPage,
  getViewportHeight,
  VIRTUAL_NOTE_LIST_END_ROW_HEIGHT,
  VIRTUAL_NOTE_LIST_ESTIMATED_ROW_HEIGHT,
  VIRTUAL_NOTE_LIST_OVERSCAN_COUNT,
  VIRTUAL_NOTE_LIST_ROW_GAP,
} from './VirtualizedNoteList.handlers';
import { VirtualizedNoteListRow } from './internal/VirtualizedNoteListRow';
import type {
  VirtualizedNoteListProps,
} from './VirtualizedNoteList.types';

import './VirtualizedNoteList.scss';

const VirtualizedNoteList = ({
  ariaLabel,
  hasMore,
  hasLoadMoreError,
  isLoadingMore,
  notes,
  onLoadMore,
  onRetryLoadMore,
  onSelectNote,
  selectedNoteId,
}: VirtualizedNoteListProps) => {
  const loadMoreRequestedRef = useRef(false);
  const resizeObserversRef = useRef<Record<string, ResizeObserver>>({});
  const [measuredHeights, setMeasuredHeights] = useState<
    Record<string, number>
  >({});
  const rowCount = notes.length + (hasMore ? 0 : 1);

  useEffect(() => {
    if (!isLoadingMore) {
      loadMoreRequestedRef.current = false;
    }
  }, [isLoadingMore]);

  useEffect(
    () => () => {
      Object.values(resizeObserversRef.current).forEach((resizeObserver) => {
        resizeObserver.disconnect();
      });
      resizeObserversRef.current = {};
    },
    [],
  );

  const requestNextPage = useCallback(() => {
    if (
      !hasMore ||
      hasLoadMoreError ||
      isLoadingMore ||
      loadMoreRequestedRef.current
    ) {
      return;
    }

    loadMoreRequestedRef.current = true;
    onLoadMore();
  }, [hasLoadMoreError, hasMore, isLoadingMore, onLoadMore]);

  const handleMeasureRow = useCallback(
    (noteId: string, element: HTMLDivElement | null) => {
      resizeObserversRef.current[noteId]?.disconnect();
      delete resizeObserversRef.current[noteId];

      if (!element) {
        return;
      }

      const syncHeight = () => {
        const nextHeight = element.getBoundingClientRect().height;

        if (nextHeight <= 0) {
          return;
        }

        setMeasuredHeights((currentMeasuredHeights) => {
          if (currentMeasuredHeights[noteId] === nextHeight) {
            return currentMeasuredHeights;
          }

          return {
            ...currentMeasuredHeights,
            [noteId]: nextHeight,
          };
        });
      };

      syncHeight();

      if (typeof ResizeObserver !== 'function') {
        return;
      }

      const resizeObserver = new ResizeObserver(() => {
        syncHeight();
      });

      resizeObserver.observe(element);
      resizeObserversRef.current[noteId] = resizeObserver;
    },
    [],
  );

  const getRowHeight = useCallback(
    (index: number) => {
      const note = notes[index];

      if (!note) {
        return VIRTUAL_NOTE_LIST_END_ROW_HEIGHT;
      }

      return (
        measuredHeights[note.id] ??
        VIRTUAL_NOTE_LIST_ESTIMATED_ROW_HEIGHT + VIRTUAL_NOTE_LIST_ROW_GAP
      );
    },
    [measuredHeights, notes],
  );

  const handleRowsRendered = useCallback(
    (
      _visibleRows: {
        startIndex: number;
        stopIndex: number;
      },
      allRows: {
        startIndex: number;
        stopIndex: number;
      },
    ) => {
      if (
        !getNeedsNextPage({
          hasMore,
          isLoadingMore,
          rowCount: notes.length,
          stopIndex: allRows.stopIndex,
        })
      ) {
        return;
      }

      requestNextPage();
    },
    [hasMore, isLoadingMore, notes.length, requestNextPage],
  );

  const rowProps = useMemo(
    () => ({
      hasMore,
      notes,
      onMeasureRow: handleMeasureRow,
      onSelectNote,
      selectedNoteId,
    }),
    [handleMeasureRow, hasMore, notes, onSelectNote, selectedNoteId],
  );

  return (
    <div className="app-virtualized-note-list">
      <div className="app-virtualized-note-list__viewport">
        <List
          aria-label={ariaLabel}
          className="app-virtualized-note-list__list"
          defaultHeight={getViewportHeight(0)}
          onRowsRendered={handleRowsRendered}
          overscanCount={VIRTUAL_NOTE_LIST_OVERSCAN_COUNT}
          role="list"
          rowComponent={VirtualizedNoteListRow}
          rowCount={rowCount}
          rowHeight={getRowHeight}
          rowProps={rowProps}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </div>

      {hasLoadMoreError ? (
        <div
          aria-live="polite"
          className="app-virtualized-note-list__status app-virtualized-note-list__status--error"
        >
          <Text as="p" color="secondary">
            {t('feed.state.loadMoreError')}
          </Text>
          <Button size="sm" variant="secondary" onClick={onRetryLoadMore}>
            {t('common.actions.retry')}
          </Button>
        </div>
      ) : isLoadingMore ? (
        <div className="app-virtualized-note-list__status">
          <FeedLoadingState cardCount={2} label={t('common.status.loading')} />
        </div>
      ) : null}
    </div>
  );
};

export { VirtualizedNoteList };
