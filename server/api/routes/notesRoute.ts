import { Router, type Request } from 'express';

import type { NotesQueryInput, NotesRequestQuery } from '../contracts/notes';
import {
  DEFAULT_NOTES_PAGE_SIZE,
  DEFAULT_TIME_RANGE_PRESET,
  isNoteColor,
  isTimeRangePreset,
  type StickyNote,
} from '../../../src/entities/note/model/types';
import { queryNotes } from '../../domain/notes/queryNotes';

const MAX_PAGE_SIZE = 50;

const parseCsv = (value: unknown): string[] => {
  if (typeof value !== 'string') {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
};

const parseLimit = (value: unknown): number => {
  if (typeof value !== 'string' || value.trim() === '') {
    return DEFAULT_NOTES_PAGE_SIZE;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new Error('Invalid limit.');
  }

  return Math.min(parsedValue, MAX_PAGE_SIZE);
};

const parseNotesQuery = (request: Request): NotesQueryInput => {
  const query = request.query as NotesRequestQuery;
  const colors = parseCsv(query.colors);
  const authors = parseCsv(query.authors);

  if (colors.some((color) => !isNoteColor(color))) {
    throw new Error('Invalid colors filter.');
  }

  if (query.timeRange && !isTimeRangePreset(query.timeRange)) {
    throw new Error('Invalid time range.');
  }

  return {
    limit: parseLimit(query.limit),
    authors,
    colors: colors.filter(isNoteColor),
    timeRange: query.timeRange ?? DEFAULT_TIME_RANGE_PRESET,
    ...(typeof query.cursor === 'string' ? { cursor: query.cursor } : {}),
  };
};

export const createNotesRoute = (notes: StickyNote[]): Router => {
  const router = Router();

  router.get('/', (request, response) => {
    try {
      response.status(200).json(queryNotes(notes, parseNotesQuery(request)));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load notes.';

      response.status(400).json({ message });
    }
  });

  return router;
};
