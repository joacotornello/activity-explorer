import {
  defaultActivityFeedUrlState,
  normalizeActivityFeedUrlState,
  parseActivityFeedSearchParams,
  stringifyActivityFeedSearchParams,
} from '../../../features/filter-rail/model/searchParams';
import { t } from '@shared/i18n';
import { getResultSummaryText } from '@shared/ui/composite/ResultSummary/ResultSummary.handlers';
import type {
  ActivityFeedUrlState,
  FiltersState,
  Note,
  NoteColor,
  TimeRange,
} from '../model';

const getInitialActivityExplorerQueryState = (): ActivityFeedUrlState => {
  return parseActivityFeedSearchParams(window.location.search);
};

const getFiltersState = (queryState: ActivityFeedUrlState): FiltersState => ({
  authors: queryState.authors,
  colors: queryState.colors,
  timeRange: queryState.timeRange,
});

const toggleListValue = <TValue extends string>(
  values: readonly TValue[],
  nextValue: TValue,
): TValue[] =>
  values.includes(nextValue)
    ? values.filter((value) => value !== nextValue)
    : [...values, nextValue];

const toggleAuthorFilter = (
  queryState: ActivityFeedUrlState,
  authorId: string,
): ActivityFeedUrlState =>
  normalizeActivityFeedUrlState({
    ...queryState,
    authors: toggleListValue(queryState.authors, authorId),
  });

const toggleColorFilter = (
  queryState: ActivityFeedUrlState,
  color: NoteColor,
): ActivityFeedUrlState =>
  normalizeActivityFeedUrlState({
    ...queryState,
    colors: toggleListValue(queryState.colors, color),
  });

const changeTimeRangeFilter = (
  queryState: ActivityFeedUrlState,
  timeRange: TimeRange,
): ActivityFeedUrlState =>
  normalizeActivityFeedUrlState({
    ...queryState,
    timeRange,
  });

const clearFilters = (
  queryState: ActivityFeedUrlState,
): ActivityFeedUrlState => ({
  ...queryState,
  authors: [],
  colors: [],
  timeRange: defaultActivityFeedUrlState.timeRange,
});

const getActiveFilterCount = (filters: FiltersState): number =>
  filters.authors.length +
  filters.colors.length +
  (filters.timeRange === defaultActivityFeedUrlState.timeRange ? 0 : 1);

const syncActivityExplorerSearchParams = (
  queryState: ActivityFeedUrlState,
): void => {
  const nextSearch = stringifyActivityFeedSearchParams(queryState);

  if (window.location.search === nextSearch) {
    return;
  }

  const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;

  window.history.pushState(window.history.state, '', nextUrl);
};

const getActivityExplorerCanonicalUrl = (
  queryState: ActivityFeedUrlState,
): string | null => {
  const nextSearch = stringifyActivityFeedSearchParams(queryState);

  return new URL(
    `${window.location.pathname}${nextSearch}`,
    window.location.origin,
  ).toString();
};

const syncActivityExplorerDocumentMetadata = (
  queryState: ActivityFeedUrlState,
): void => {
  document.title = t('app.meta.title');

  const canonicalUrl = getActivityExplorerCanonicalUrl(queryState);

  if (canonicalUrl === null) {
    return;
  }

  let canonicalLink = document.head.querySelector<HTMLLinkElement>(
    'link[data-seo-key="canonical"]',
  );

  if (canonicalLink === null) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('data-seo-key', 'canonical');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }

  canonicalLink.href = canonicalUrl;
};

const getNextSelectedNoteId = (
  notes: readonly Note[],
  selectedNoteId?: string | null,
): string | null => {
  if (selectedNoteId && notes.some((note) => note.id === selectedNoteId)) {
    return selectedNoteId;
  }

  return null;
};

const activityExplorerDesktopMediaQuery = '(min-width: 1181px)';

const getIsDesktopActivityExplorerLayout = (): boolean => {
  return window.matchMedia(activityExplorerDesktopMediaQuery).matches;
};

const getActivityExplorerAnnouncement = ({
  activeFilterCount,
  hasFeedError,
  isFeedEmpty,
  isFeedLoading,
  totalVisibleNotes,
}: {
  activeFilterCount: number;
  hasFeedError: boolean;
  isFeedEmpty: boolean;
  isFeedLoading: boolean;
  totalVisibleNotes: number;
}): string => {
  if (isFeedLoading) {
    return t('feed.state.loading');
  }

  if (hasFeedError) {
    return `${t('states.error.title')}. ${t('states.error.description')}`;
  }

  if (isFeedEmpty) {
    return `${t('feed.state.emptyTitle')}. ${t('feed.state.emptyDescription')}`;
  }

  return getResultSummaryText(totalVisibleNotes, activeFilterCount);
};

export {
  activityExplorerDesktopMediaQuery,
  changeTimeRangeFilter,
  clearFilters,
  getActivityExplorerAnnouncement,
  getActiveFilterCount,
  getActivityExplorerCanonicalUrl,
  getIsDesktopActivityExplorerLayout,
  getFiltersState,
  getInitialActivityExplorerQueryState,
  getNextSelectedNoteId,
  syncActivityExplorerDocumentMetadata,
  syncActivityExplorerSearchParams,
  toggleAuthorFilter,
  toggleColorFilter,
};
