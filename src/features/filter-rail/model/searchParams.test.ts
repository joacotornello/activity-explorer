import {
  createActivityFeedSearchParams,
  defaultActivityFeedUrlState,
  normalizeActivityFeedUrlState,
  parseActivityFeedSearchParams,
  stringifyActivityFeedSearchParams,
} from './searchParams';
import type { ActivityFeedUrlState } from './searchParams.types';

describe('searchParams', () => {
  it('parses search params into normalized URL state', () => {
    expect(
      parseActivityFeedSearchParams(
        '?authors=user_2,user_1,user_2&colors=blue,purple,blue,invalid&timeRange=week',
      ),
    ).toEqual({
      authors: ['user_1', 'user_2'],
      colors: ['blue', 'purple'],
      timeRange: 'week',
    });
  });

  it('falls back to defaults for invalid or empty values', () => {
    expect(
      parseActivityFeedSearchParams(
        '?authors=,user_1,,&colors=invalid&timeRange=older',
      ),
    ).toEqual({
      ...defaultActivityFeedUrlState,
      authors: ['user_1'],
    });
  });

  it('round-trips predictably through stringify and parse', () => {
    const initialState: Partial<ActivityFeedUrlState> = {
      authors: ['user_3', 'user_1', 'user_1'],
      colors: ['purple', 'yellow', 'purple'],
      timeRange: 'month' as const,
    };

    const searchString = stringifyActivityFeedSearchParams(initialState);

    expect(searchString).toBe(
      '?authors=user_1%2Cuser_3&colors=yellow%2Cpurple&timeRange=month',
    );
    expect(parseActivityFeedSearchParams(searchString)).toEqual(
      normalizeActivityFeedUrlState(initialState),
    );
  });

  it('omits default values from serialized params', () => {
    expect(
      createActivityFeedSearchParams(defaultActivityFeedUrlState).toString(),
    ).toBe('');
    expect(stringifyActivityFeedSearchParams(defaultActivityFeedUrlState)).toBe(
      '',
    );
  });
});
