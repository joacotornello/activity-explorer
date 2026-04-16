import {
  getNeedsNextPage,
  getViewportHeight,
  VIRTUAL_NOTE_LIST_END_ROW_HEIGHT,
  VIRTUAL_NOTE_LIST_ESTIMATED_ROW_HEIGHT,
  VIRTUAL_NOTE_LIST_OVERSCAN_COUNT,
  VIRTUAL_NOTE_LIST_ROW_GAP,
} from './VirtualizedNoteList.handlers';

describe('VirtualizedNoteList handlers', () => {
  it('exposes stable defaults for row sizing and overscan', () => {
    expect(VIRTUAL_NOTE_LIST_ESTIMATED_ROW_HEIGHT).toBe(156);
    expect(VIRTUAL_NOTE_LIST_END_ROW_HEIGHT).toBe(56);
    expect(VIRTUAL_NOTE_LIST_ROW_GAP).toBe(14);
    expect(VIRTUAL_NOTE_LIST_OVERSCAN_COUNT).toBe(3);
  });

  it('detects when rendered rows are close enough to load next page', () => {
    expect(
      getNeedsNextPage({
        hasMore: true,
        isLoadingMore: false,
        rowCount: 40,
        stopIndex: 33,
      }),
    ).toBe(true);

    expect(
      getNeedsNextPage({
        hasMore: true,
        isLoadingMore: false,
        rowCount: 40,
        stopIndex: 20,
      }),
    ).toBe(false);

    expect(
      getNeedsNextPage({
        hasMore: true,
        isLoadingMore: true,
        rowCount: 40,
        stopIndex: 33,
      }),
    ).toBe(false);
  });

  it('falls back to default viewport height', () => {
    expect(getViewportHeight(0)).toBe(720);
    expect(getViewportHeight(420)).toBe(420);
  });
});
