import type { StickyNote } from '@entities/note/model/types';

import {
  activityExplorerDesktopMediaQuery,
  changeTimeRangeFilter,
  clearFilters,
  getActiveFilterCount,
  getActivityExplorerCanonicalUrl,
  getIsDesktopActivityExplorerLayout,
  getNextSelectedNoteId,
  syncActivityExplorerSearchParams,
  syncActivityExplorerDocumentMetadata,
  toggleAuthorFilter,
  toggleColorFilter,
} from './ActivityExplorerPage.handlers';

const buildNote = (overrides: Partial<StickyNote>): StickyNote => ({
  author: {
    id: 'author-1',
    name: 'Ava Stone',
  },
  color: 'yellow',
  createdAt: '2026-04-15T12:00:00.000Z',
  id: 'note-1',
  text: 'Seed note',
  ...overrides,
});

describe('ActivityExplorerPage handlers', () => {
  it('counts active filters across authors, colors, and time range', () => {
    expect(
      getActiveFilterCount({
        authors: ['author-2', 'author-1'],
        colors: ['yellow'],
        timeRange: 'week',
      }),
    ).toBe(4);
  });

  it('normalizes toggled query filters and clears them predictably', () => {
    const authorToggledState = toggleAuthorFilter(
      {
        authors: [],
        colors: [],
        timeRange: 'all',
      },
      'author-2',
    );
    const colorToggledState = toggleColorFilter(authorToggledState, 'blue');
    const timeRangeChangedState = changeTimeRangeFilter(colorToggledState, 'month');
    const clearedState = clearFilters(timeRangeChangedState);

    expect(timeRangeChangedState).toEqual({
      authors: ['author-2'],
      colors: ['blue'],
      timeRange: 'month',
    });
    expect(clearedState).toEqual({
      authors: [],
      colors: [],
      timeRange: 'all',
    });
  });

  it('keeps current selected note only when still visible', () => {
    const notes = [buildNote({ id: 'note-1' }), buildNote({ id: 'note-2' })];

    expect(getNextSelectedNoteId(notes, 'note-2')).toBe('note-2');
    expect(getNextSelectedNoteId(notes, null)).toBeNull();
    expect(getNextSelectedNoteId(notes, undefined)).toBeNull();
    expect(getNextSelectedNoteId(notes, 'missing-note')).toBeNull();
    expect(getNextSelectedNoteId([], 'note-2')).toBeNull();
  });

  it('reads desktop layout breakpoint from matchMedia when available', () => {
    const originalMatchMedia = window.matchMedia;

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jest.fn((query: string) => ({
        matches: query === activityExplorerDesktopMediaQuery,
      })),
    });

    expect(getIsDesktopActivityExplorerLayout()).toBe(true);

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('builds canonical url from normalized filter state', () => {
    window.history.replaceState({}, '', '/?unused=value');

    expect(
      getActivityExplorerCanonicalUrl({
        authors: ['author-2'],
        colors: [],
        timeRange: 'all',
      }),
    ).toBe('http://localhost/?authors=author-2');
  });

  it('syncs document title and canonical link metadata', () => {
    document.title = '';
    document.head.innerHTML = '';
    window.history.replaceState({}, '', '/');

    syncActivityExplorerDocumentMetadata({
      authors: ['author-2'],
      colors: [],
      timeRange: 'all',
    });

    expect(document.title).toBe(
      'Activity Explorer | Explore note activity by author, color, and time',
    );
    expect(
      document.head.querySelector('link[data-seo-key="canonical"]'),
    ).toHaveAttribute('href', 'http://localhost/?authors=author-2');
  });

  it('pushes browser history entries when url-backed filters change', () => {
    window.history.replaceState({}, '', '/');
    const pushStateSpy = jest.spyOn(window.history, 'pushState');

    syncActivityExplorerSearchParams({
      authors: ['author-2'],
      colors: [],
      timeRange: 'all',
    });

    expect(pushStateSpy).toHaveBeenCalledWith(
      window.history.state,
      '',
      '/?authors=author-2',
    );
    expect(window.location.search).toBe('?authors=author-2');
  });
});
