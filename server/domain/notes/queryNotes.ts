import type { NotesQueryInput, NotesResponse } from '../../api/contracts/notes';
import type { StickyNote, TimeRangePreset } from '../../../src/entities/note/model/types';

import { compareNotes, decodeCursor, encodeCursor } from './cursor';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const getReferenceTimestamp = (notes: StickyNote[]): number =>
  Math.max(...notes.map((note) => new Date(note.createdAt).getTime()));

const getTimeRangeStart = (
  timeRange: TimeRangePreset,
  referenceTimestamp: number,
): number | null => {
  if (timeRange === 'all') {
    return null;
  }

  if (timeRange === 'today') {
    const referenceDate = new Date(referenceTimestamp);

    return Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
    );
  }

  if (timeRange === 'week') {
    return referenceTimestamp - 7 * DAY_IN_MILLISECONDS;
  }

  return referenceTimestamp - 30 * DAY_IN_MILLISECONDS;
};

const filterByTimeRange = (
  notes: StickyNote[],
  timeRange: TimeRangePreset,
): StickyNote[] => {
  const startTimestamp = getTimeRangeStart(timeRange, getReferenceTimestamp(notes));

  if (startTimestamp === null) {
    return notes;
  }

  return notes.filter(
    (note) => new Date(note.createdAt).getTime() >= startTimestamp,
  );
};

export const queryNotes = (
  notes: StickyNote[],
  input: NotesQueryInput,
): NotesResponse => {
  const filteredNotes = filterByTimeRange(notes, input.timeRange)
    .filter(
      (note) =>
        input.authors.length === 0 || input.authors.includes(note.author.id),
    )
    .filter(
      (note) => input.colors.length === 0 || input.colors.includes(note.color),
    )
    .sort(compareNotes);

  const startIndex = (() => {
    if (!input.cursor) {
      return 0;
    }

    const decodedCursor = decodeCursor(input.cursor);
    const cursorIndex = filteredNotes.findIndex(
      (note) =>
        note.id === decodedCursor.id &&
        note.createdAt === decodedCursor.createdAt,
    );

    if (cursorIndex === -1) {
      throw new Error('Cursor not found for current query.');
    }

    return cursorIndex + 1;
  })();

  const items = filteredNotes.slice(startIndex, startIndex + input.limit);
  const hasMore = startIndex + items.length < filteredNotes.length;
  const lastItem = items[items.length - 1];

  return {
    items,
    total: filteredNotes.length,
    nextCursor: hasMore && lastItem ? encodeCursor(lastItem) : null,
    hasMore,
  };
};
