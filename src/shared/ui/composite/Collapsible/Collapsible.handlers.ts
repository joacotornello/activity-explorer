const getSafeMaxVisibleItems = (maxVisibleItems: number): number =>
  Math.max(0, maxVisibleItems);

const getVisibleItemsCount = (
  maxVisibleItems: number,
  itemsCount: number,
  isExpanded: boolean,
): number => {
  if (isExpanded) {
    return itemsCount;
  }

  return Math.min(getSafeMaxVisibleItems(maxVisibleItems), itemsCount);
};

const hasHiddenItems = (maxVisibleItems: number, itemsCount: number): boolean =>
  getSafeMaxVisibleItems(maxVisibleItems) < itemsCount;

export { getSafeMaxVisibleItems, getVisibleItemsCount, hasHiddenItems };
