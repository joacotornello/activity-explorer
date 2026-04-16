import {
  DEFAULT_TIME_RANGE_PRESET,
  NOTE_COLORS,
  isNoteColor,
  isTimeRangePreset,
  type NoteColor,
  type TimeRangePreset,
} from '@entities/note/model/types';
import type {
  ActivityFeedUrlState,
  ActivityFeedUrlStateInput,
} from './searchParams.types';

const defaultActivityFeedUrlState: ActivityFeedUrlState = Object.freeze({
  authors: [],
  colors: [],
  timeRange: DEFAULT_TIME_RANGE_PRESET,
});

const parseInput = (input: string | URLSearchParams): URLSearchParams => {
  if (input instanceof URLSearchParams) {
    return new URLSearchParams(input);
  }

  const normalizedInput = input.startsWith('?') ? input.slice(1) : input;

  return new URLSearchParams(normalizedInput);
};

const parseCsv = (searchParams: URLSearchParams, key: string): string[] => {
  const value = searchParams.get(key);

  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeAuthors = (authors: readonly string[]): string[] =>
  Array.from(
    new Set(authors.map((author) => author.trim()).filter(Boolean)),
  ).sort((left, right) => left.localeCompare(right));

const normalizeColors = (colors: readonly string[]): NoteColor[] => {
  const colorSet = new Set(colors.filter(isNoteColor));

  return NOTE_COLORS.filter((color) => colorSet.has(color));
};

const normalizeActivityFeedUrlState = (
  input: ActivityFeedUrlStateInput,
): ActivityFeedUrlState => {
  const normalizedTimeRange: TimeRangePreset =
    input.timeRange && isTimeRangePreset(input.timeRange)
      ? input.timeRange
      : defaultActivityFeedUrlState.timeRange;

  return {
    authors: normalizeAuthors(input.authors ?? []),
    colors: normalizeColors(input.colors ?? []),
    timeRange: normalizedTimeRange,
  };
};

const parseActivityFeedSearchParams = (
  input: string | URLSearchParams,
): ActivityFeedUrlState => {
  const searchParams = parseInput(input);
  const timeRange = searchParams.get('timeRange');

  return normalizeActivityFeedUrlState({
    authors: parseCsv(searchParams, 'authors'),
    colors: parseCsv(searchParams, 'colors').filter(
      (color): color is NoteColor => isNoteColor(color),
    ),
    ...(timeRange ? { timeRange } : {}),
  });
};

const createActivityFeedSearchParams = (
  input: ActivityFeedUrlStateInput,
): URLSearchParams => {
  const searchParams = new URLSearchParams();
  const normalizedState = normalizeActivityFeedUrlState(input);

  if (normalizedState.authors.length > 0) {
    searchParams.set('authors', normalizedState.authors.join(','));
  }

  if (normalizedState.colors.length > 0) {
    searchParams.set('colors', normalizedState.colors.join(','));
  }

  if (normalizedState.timeRange !== defaultActivityFeedUrlState.timeRange) {
    searchParams.set('timeRange', normalizedState.timeRange);
  }

  return searchParams;
};

const stringifyActivityFeedSearchParams = (
  input: ActivityFeedUrlStateInput,
): string => {
  const searchParams = createActivityFeedSearchParams(input);
  const serializedSearchParams = searchParams.toString();

  return serializedSearchParams === '' ? '' : `?${serializedSearchParams}`;
};

export {
  defaultActivityFeedUrlState,
  createActivityFeedSearchParams,
  normalizeActivityFeedUrlState,
  parseActivityFeedSearchParams,
  stringifyActivityFeedSearchParams,
};
