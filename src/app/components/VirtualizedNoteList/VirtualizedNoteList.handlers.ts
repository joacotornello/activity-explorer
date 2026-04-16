const VIRTUAL_NOTE_LIST_ESTIMATED_ROW_HEIGHT = 156;
const VIRTUAL_NOTE_LIST_FALLBACK_VIEWPORT_HEIGHT = 720;
const VIRTUAL_NOTE_LIST_END_ROW_HEIGHT = 56;
const VIRTUAL_NOTE_LIST_LOAD_MORE_THRESHOLD = 6;
const VIRTUAL_NOTE_LIST_OVERSCAN_COUNT = 3;
const VIRTUAL_NOTE_LIST_ROW_GAP = 14;

const getNeedsNextPage = ({
  hasMore,
  isLoadingMore,
  rowCount,
  stopIndex,
}: {
  hasMore: boolean;
  isLoadingMore: boolean;
  rowCount: number;
  stopIndex: number;
}): boolean => {
  if (!hasMore || isLoadingMore) {
    return false;
  }

  return stopIndex >= rowCount - 1 - VIRTUAL_NOTE_LIST_LOAD_MORE_THRESHOLD;
};

const getViewportHeight = (clientHeight: number): number =>
  clientHeight > 0
    ? clientHeight
    : VIRTUAL_NOTE_LIST_FALLBACK_VIEWPORT_HEIGHT;

export {
  getNeedsNextPage,
  VIRTUAL_NOTE_LIST_END_ROW_HEIGHT,
  getViewportHeight,
  VIRTUAL_NOTE_LIST_ESTIMATED_ROW_HEIGHT,
  VIRTUAL_NOTE_LIST_OVERSCAN_COUNT,
  VIRTUAL_NOTE_LIST_ROW_GAP,
};
