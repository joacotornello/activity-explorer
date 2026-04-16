import type { NoteColor, StickyNote, TimeRangePreset } from '@entities/note/model/types';
import {
  DEFAULT_NOTES_PAGE_SIZE,
  DEFAULT_TIME_RANGE_PRESET,
} from '@entities/note/model/types';

export type NoteTimeBounds = {
  min: string;
  max: string;
};

export type AuthorFilterOption = {
  id: string;
  name: string;
};

export type ColorFilterOption = {
  id: NoteColor;
  label: string;
};

export type NotesMetaResponse = {
  total: number;
  authors: AuthorFilterOption[];
  colors: ColorFilterOption[];
  timeBounds: NoteTimeBounds;
  timeRangePresets: TimeRangePreset[];
};

export type NotesRequestQuery = {
  limit?: string;
  cursor?: string;
  authors?: string;
  colors?: string;
  timeRange?: TimeRangePreset;
};

export type NotesQueryInput = {
  limit: number;
  cursor?: string;
  authors: string[];
  colors: NoteColor[];
  timeRange: TimeRangePreset;
};

export type NotesResponse = {
  items: StickyNote[];
  total: number;
  nextCursor: string | null;
  hasMore: boolean;
};

export const defaultNotesQuery: NotesQueryInput = {
  limit: DEFAULT_NOTES_PAGE_SIZE,
  authors: [],
  colors: [],
  timeRange: DEFAULT_TIME_RANGE_PRESET,
};
