export const NOTE_COLORS = [
  'red',
  'yellow',
  'blue',
  'green',
  'purple',
] as const;

export const TIME_RANGE_PRESETS = ['all', 'today', 'week', 'month'] as const;

export type NoteColor = (typeof NOTE_COLORS)[number];
export type TimeRangePreset = (typeof TIME_RANGE_PRESETS)[number];

export type NoteAuthor = {
  id: string;
  name: string;
};

export type StickyNote = {
  id: string;
  text: string;
  color: NoteColor;
  author: NoteAuthor;
  createdAt: string;
};

export const DEFAULT_NOTES_PAGE_SIZE = 30;
export const DEFAULT_TIME_RANGE_PRESET: TimeRangePreset = 'all';

export const isNoteColor = (value: string): value is NoteColor =>
  NOTE_COLORS.includes(value as NoteColor);

export const isTimeRangePreset = (value: string): value is TimeRangePreset =>
  TIME_RANGE_PRESETS.includes(value as TimeRangePreset);
