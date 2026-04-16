import { DEFAULT_NOTES_PAGE_SIZE } from '@entities/note/model/types';

import {
  buildNotesRequestSearchParams,
  getNotes,
  getNotesQueryKey,
} from './getNotes';

describe('getNotes', () => {
  it('creates deterministic query keys from typed filter input', () => {
    expect(
      getNotesQueryKey({
        authors: ['user_2', 'user_1'],
        colors: ['purple', 'yellow'],
        timeRange: 'week',
      }),
    ).toEqual(
      getNotesQueryKey({
        authors: ['user_1', 'user_2', 'user_1'],
        colors: ['yellow', 'purple', 'purple'],
        timeRange: 'week',
      }),
    );
  });

  it('serializes request params with stable filter ordering', () => {
    expect(
      buildNotesRequestSearchParams({
        authors: ['user_4', 'user_2', 'user_2'],
        colors: ['purple', 'yellow', 'purple'],
        timeRange: 'month',
      }),
    ).toEqual({
      limit: DEFAULT_NOTES_PAGE_SIZE,
      authors: 'user_2,user_4',
      colors: 'yellow,purple',
      timeRange: 'month',
    });
  });

  it('requests notes through shared API client', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          items: [],
          total: 0,
          nextCursor: null,
          hasMore: false,
        }),
    });

    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: fetchMock,
    });

    await getNotes({
      authors: ['user_3', 'user_1'],
      colors: ['blue', 'yellow'],
      timeRange: 'week',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/notes?limit=30&authors=user_1%2Cuser_3&colors=yellow%2Cblue&timeRange=week',
      expect.objectContaining({
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }),
    );
  });
});
